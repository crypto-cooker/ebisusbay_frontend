import {useEffect, useState} from 'react';
import Button from '../../../components/Button';
import NotificationItem from './Item';
import NotificationMethod from "@src/Components/Account/Settings/Notification/Method";
import useUpdateNotifications from "@src/Components/Account/Settings/hooks/useUpdateNotifications";
import {useSelector} from "react-redux";
import useGetSettings from "@src/Components/Account/Settings/hooks/useGetSettings";
import {toast} from "react-toastify";
import {Heading} from "@chakra-ui/react";
import {useUser} from "@src/components-v2/useUser";

const NotificationItems = [
  { key: 'FAVORITE_LISTED', title: 'Favorited Item Listed', description: 'When an item from your favorites gets listed' },
  { key: 'SOLD', title: 'Item Sold', description: 'When someone purchases one of your items' },
  { key: 'OFFER_MADE', title: 'Offer Received', description: 'When someone makes an offer on one of your items' },
  { key: 'OFFER_ACCEPTED', title: 'Offer Accepted', description: 'When one of your offers gets accepted' },
  { key: 'XP_GAINED', title: 'XP Gains', description: 'When you perform an action that gains you XP' },
];

export default function Notification() {
  const user = useUser();
  const [isOnSave, setIsOnSave] = useState(false);
  const [requestUpdateNotifications, { loading: updateLoading }] = useUpdateNotifications();
  const [notificationMethods, setNotificationMethods] = useState([]);
  const [notificationTypes, setNotificationTypes] = useState([]);
  const [{ response: settings }] = useGetSettings(user?.address);

  const handleSaveProfile = async () => {
    try  {
      setIsOnSave(true);
      await requestUpdateNotifications(user.address, notificationMethods, notificationTypes);
      toast.success('Your profile was saved successfully');
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong!');
    } finally {
      setIsOnSave(false);
    }
  };

  const handleNotificationMethodsChange = (key, enabled) => {
    if (notificationMethods.includes(key) && !enabled) {
      setNotificationMethods(notificationMethods.filter(function(value){
        return value !== key;
      }));
    }
    else if (!notificationMethods.includes(key) && enabled) setNotificationMethods(oldArray => [...oldArray, key]);
  };

  const handleNotificationTypesChange = (key, enabled) => {
    if (notificationTypes.includes(key) && !enabled) {
      setNotificationTypes(notificationTypes.filter(function(value){
        return value !== key;
      }));
    }
    else if (!notificationTypes.includes(key) && enabled) setNotificationTypes(oldArray => [...oldArray, key]);
  };

  useEffect(() => {
    if (settings?.data) {
      setNotificationMethods(settings.data.notificationMethods);
      setNotificationTypes(settings.data.activeNotifications);
    }
  }, [settings]);

  if (!user.profile.id) return <p>Create your profile in the Edit Profile tab first to update notification settings</p>

  return (
    <div className="row mt-5">
      <div className="col-12 col-md-8">

        <div className="row mb-4">
          <div className="col">
            <Heading as="h2" size="xl">Notification Methods</Heading>
            <p className="mb-4">Choose how you wish to be notified of sales events in real time.</p>
            <NotificationMethod
              title="In App"
              description="A blue badge will appear on the notifications menu icon"
              isChecked={notificationMethods.includes('IN_APP')}
              onChange={(enabled) => handleNotificationMethodsChange('IN_APP', enabled)}
            />
            <NotificationMethod
              title="Email"
              description="Receive email notifications to the address set in Edit Profile"
              isChecked={notificationMethods.includes('EMAIL')}
              onChange={(enabled) => handleNotificationMethodsChange('EMAIL', enabled)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Heading as="h2" size="xl">Notification Events</Heading>
            {NotificationItems.map((item) => (
              <NotificationItem
                key={item.key}
                title={item.title}
                description={item.description}
                isChecked={notificationTypes.includes(item.key)}
                onChange={(enabled) => handleNotificationTypesChange(item.key, enabled)}
              />
            ))}
          </div>
        </div>

        <div className="col d-flex justify-content-end">
          <Button type="legacy" className="mt-5" onClick={() => handleSaveProfile()} isLoading={isOnSave}>
            Update Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
