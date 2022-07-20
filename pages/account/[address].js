import { useRouter } from 'next/router';
import Profile from '@src/Components/Account/Profile';
import Footer from '@src/Components/components/Footer';
import {isAddress} from "@src/utils";
import {getProfile} from "@src/core/cms/endpoints/profile";

export default function Account({ address, profile }) {
  const router = useRouter();

  return (
    <>
      <Profile address={address} profile={profile} />
      <Footer />
    </>
  );
}

export const getServerSideProps = async ({ params, query }) => {
  const addressOrUsername = params?.address;

  const user = await getProfile(addressOrUsername) ?? null;
  if (!user) {
    if (!isAddress(addressOrUsername)) {
      return {
        notFound: true
      }
    }
  }

  return {
    props: {
      address: addressOrUsername,
      profile: user?.response ?? {}
    }
  };
};