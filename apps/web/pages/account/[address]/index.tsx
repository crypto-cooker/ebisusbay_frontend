import Profile from '@src/components-v2/feature/account/profile';
import {ciEquals} from "@market/helpers/utils";
import {getProfile} from "@src/core/cms/endpoints/profile";
import {GetServerSidePropsContext, NextPage} from "next";
import {QueryClient, useQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";

interface PageProps {
  address: string;
  profile: any;
  query: any;
}

const Account: NextPage<PageProps> = ({ address: initialAddress, profile: initialProfile, query }: PageProps) => {
  const params = useParams()

  // Hack to fix hydration issues on subsequent page navigations
  const address = initialAddress || (params?.address as string);
  const { data } = useQuery({
    queryKey: ['UserProfile', address],
    queryFn: async () => await getProfile(address) ?? null,
    initialData: initialProfile ? { data: initialProfile } : undefined,
  });
  const profile = data?.data || initialProfile;

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
    const queryClient = new QueryClient();
    user = await queryClient.fetchQuery({
      queryKey: ['UserProfile', addressOrUsername],
      queryFn: async () => await getProfile(addressOrUsername) ?? null,
      staleTime: 1000 * 60 * 30, // 30 minutes
    });

    const userData = user?.data;

    if (userData &&
      ciEquals(addressOrUsername, userData.walletAddress) &&
      !ciEquals(addressOrUsername, userData.username)) {
      const tabQuery = query?.tab ? `?tab=${query.tab}` : '';
      return {
        redirect: {
          destination: `/account/${userData.username}${tabQuery}`,
          permanent: false,
        },
      }
    }

    return {
      props: {
        address: userData?.walletAddress ?? addressOrUsername,
        profile: userData ?? null,
        query: query,
      },
    };
  } catch (error) {
    // user not found or server error.
    return {
      props: {
        address: addressOrUsername,
        profile: null,
        query: query,
      },
    };
  }
};