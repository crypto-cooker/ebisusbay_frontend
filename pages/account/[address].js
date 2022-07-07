import { useRouter } from 'next/router';
import Profile from '@src/Components/Account/Profile';
import Footer from '@src/Components/components/Footer';

export default function Account() {
  const router = useRouter();
  const { address } = router.query; // should be address or username

  return (
    <>
      <Profile slug={address} />
      <Footer />
    </>
  );
}
