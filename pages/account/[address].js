import { useRouter } from 'next/router';
import Profile from '@src/Components/Account/Profile';
import Footer from '@src/Components/components/Footer';
import {caseInsensitiveCompare, isAddress} from "@src/utils";
import {getProfile} from "@src/core/cms/endpoints/profile";

export default function Account({ address, profile, query }) {
  const router = useRouter();

  return (
    <>
      <Profile address={address} profile={profile} tab={query?.tab} />
      <Footer />
    </>
  );
}

export const getServerSideProps = async ({ params, query }) => {
  const addressOrUsername = params?.address;

  const user = await getProfile(addressOrUsername) ?? null;

  if (user?.data &&
    caseInsensitiveCompare(addressOrUsername, user.data.walletAddress) &&
    !caseInsensitiveCompare(addressOrUsername, user.data.username)) {
    return {
      redirect: {
        destination: `/account/${user.data.username}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      address: user?.data?.walletAddress ?? addressOrUsername,
      profile: user?.data ?? {},
      query: query,
    }
  };
};