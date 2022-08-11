import { useRouter } from 'next/router';
import TopTabs from '../../../src/Components/Account/Settings/TopTabs';
import EditProfile from '../../../src/Components/Account/Settings/Profile';

export default function Account() {
  const router = useRouter();
  const { tab } = router.query;

  return (
    <div>
      <section className="container mt-0">
        <h2 className="mb-4">Account Settings</h2>
        <TopTabs />
        {tab === 'profile' && (
          <>
            <EditProfile />
          </>
        )}

        {tab === 'notification' && (
          <>
            {/*<Notification />*/}
            Coming Soon...
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
    </div>
  );
}
