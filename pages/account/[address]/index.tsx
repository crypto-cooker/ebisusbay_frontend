import Profile from '@src/components-v2/feature/account/profile';
import {ciEquals} from "@market/helpers/utils";
import {getProfile} from "@src/core/cms/endpoints/profile";
import {GetServerSidePropsContext, NextPage} from "next";

interface PageProps {
  address: string;
  profile: any;
  query: any;
}

const Account: NextPage<PageProps> = ({ address, profile, query }: PageProps) => {
  return (
    <>
      <Profile address={address} profile={profile} tab={query?.tab} />
    </>
  );
}

export default Account;

export const getServerSideProps = async ({ params, query }: GetServerSidePropsContext) => {
  const addressOrUsername = params?.address as string;

  let user;
  try {
    user = await getProfile(addressOrUsername) ?? null;
  } catch (error) {
    // user not found or server error
  }

  if (user?.data &&
    ciEquals(addressOrUsername, user.data.walletAddress) &&
    !ciEquals(addressOrUsername, user.data.username)) {
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