import {useState} from 'react';
import {updateNotifications} from "@src/core/cms/endpoints/profile";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

const useUpdateNotifications = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const {requestSignature} = useEnforceSignature();

  const requestUpdateNotifications = async (address, notificationMethods, notificationTypes) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      const signature = await requestSignature();
      const fetchResponse = await updateNotifications(notificationMethods, notificationTypes, signature, address);

      setResponse({
        ...response,
        loading: false,
        error: null,
      });

      return fetchResponse.data;
    } catch (error) {
      setResponse({
        ...response,
        loading: false,
        error: error,
      });
    }
  };

  return [requestUpdateNotifications, response];
};

export default useUpdateNotifications;
