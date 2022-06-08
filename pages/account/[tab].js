import { useRouter } from 'next/router';
import { Banner, Bio, Form, Pfp, TopTabs } from '@src/Components/Account';

export default function Account() {
  const router = useRouter();
  const { tab } = router.query;
  console.log(tab);

  return (
    <div>
      <section className="container">
        <TopTabs />
        {tab === 'profile' && (
          <>
            <Pfp />
            <Banner />
            <Bio />
            <Form />
          </>
        )}
      </section>
    </div>
  );
}
