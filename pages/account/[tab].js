import { useRouter } from 'next/router';
import TopTabs from '../../src/Components/Account/Settings/TopTabs';
import EditProfile from '../../src/Components/Account/Settings/Profile';
import Notification from '../../src/Components/Account/Settings/Notification';
import Offer from '../../src/Components/Account/Settings/Offer';
import Admin from '../../src/Components/Account/Settings/Admin';

export default function Account() {
  const router = useRouter();
  const { tab } = router.query;

  return (
    <div>
      <section className="container">
        <TopTabs />
        {tab === 'profile' && (
          <>
            <EditProfile />
          </>
        )}

        {tab === 'notification' && (
          <>
            <Notification />
          </>
        )}

        {tab === 'offer' && (
          <>
            <Offer />
          </>
        )}

        {tab === 'admin' && (
          <>
            <Admin />
          </>
        )}
      </section>
    </div>
  );
}
