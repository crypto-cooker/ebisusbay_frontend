import { useRouter } from 'next/router';
import TopTabs from '../../../src/Components/Account/Settings/TopTabs';
import EditProfile from '../../../src/Components/Account/Settings/Profile';
import Footer from "@src/Components/components/Footer";
import Notification from "@src/Components/Account/Settings/Notification";
import useFeatureFlag from "@src/hooks/useFeatureFlag";
import Constants from "@src/constants";
import {Heading} from "@chakra-ui/react";

export default function Account() {
  const router = useRouter();
  const { tab } = router.query;
  const { Features } = Constants;
  const isNotificationsEnabled = useFeatureFlag(Features.CMS_NOTIFICATIONS);

  return (
    <div>
      <section className="gl-legacy container mt-0">
        <Heading as="h2" size="xl" className="mb-4">Account Settings</Heading>
        <TopTabs />
        {tab === 'profile' && (
          <>
            <EditProfile />
          </>
        )}

        {tab === 'notification' && (
          <>
            {isNotificationsEnabled ? <Notification /> : <>Coming Soon...</>}
          </>
        )}

        {tab === 'offer' && (
          <>
            {/*<Offer />*/}
            Coming Soon...
          </>
        )}

        {tab === 'admin' && (
          <>
            {/*<Admin />*/}
            Coming Soon...
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
