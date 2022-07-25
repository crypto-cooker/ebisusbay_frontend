import { useRouter } from 'next/router';
import Profile from '@src/Components/Account/Profile';
import Footer from '@src/Components/components/Footer';
import {isAddress} from "@src/utils";
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
  if (!user?.data) {
    if (!isAddress(addressOrUsername)) {
      return {
        notFound: true
      }
    }
  }

  return {
    props: {
      address: addressOrUsername,
      profile: user.data ?? {},
      query: query,
    }
  };
};