import { useRouter } from 'next/router';
import TopTabs from '@src/Components/Account/Settings/TopTabs';
import EditProfile from '@src/Components/Account/Settings/Profile';

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
      </section>
    </div>
  );
}
