import Profile from '@src/Components/Account/Profile';
import Footer from '@src/Components/components/Footer';
import {caseInsensitiveCompare} from "@src/utils";
import {getProfile} from "@src/core/cms/endpoints/profile";

export default function Account({ address, profile, query }) {
  return (
    <>
      <Profile address={address} profile={profile} tab={query?.tab} />
      <Footer />
    </>
  );
}

export const getServerSideProps = async ({ params, query }) => {
  const addressOrUsername = params?.address;

  let user;
  try {
    user = await getProfile(addressOrUsername) ?? null;
  } catch (error) {
    // user not found or server error
  }

  if (user?.data &&
    caseInsensitiveCompare(addressOrUsername, user.data.walletAddress) &&
    !caseInsensitiveCompare(addressOrUsername, user.data.username)) {
    return {
      redirect: {
        destination: `/account/${user.data.username}${query?.tab? `?tab=${query?.tab}` : ''}`,
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