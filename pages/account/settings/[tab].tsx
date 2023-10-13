import { useRouter } from 'next/router';
import TopTabs from "@src/components-v2/feature/account/settings/top-tabs";
import EditProfile from '../../../src/Components/Account/Settings/Profile';
import Notification from "@src/Components/Account/Settings/Notification";
import {Heading} from "@chakra-ui/react";

export default function Account() {
  const router = useRouter();
  const { tab } = router.query;

  return (
    <div>
      <section className="gl-legacy container mt-0">
        <Heading as="h2" size="xl" className="mb-4">Account Settings</Heading>
        <TopTabs />
        {tab === 'profile' && (
          <EditProfile />
        )}

        {tab === 'notification' && (
          <Notification />
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
    </div>
  );
}
