import {UserSwapView} from "@src/components-v2/feature/swap/user";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import useBarterSwap from "@src/components-v2/feature/swap/use-barter-swap";
import {useUser} from "@src/components-v2/useUser";
import {GetServerSidePropsContext} from "next";
import {getProfile} from "@src/core/cms/endpoints/profile";
import {caseInsensitiveCompare, shortAddress} from "@src/utils";
import {isAddress} from "ethers/lib/utils";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {DefaultContainer} from "@src/components-v2/shared/default-container";
import {Link} from "@chakra-ui/react";
import NextLink from "next/link";

interface PageProps {
  address: string;
  profile: any;
}

const SwapWithUser = ({ address, profile }: PageProps) => {
  const user = useUser();
  const router = useRouter();
  const { setTakerAddress, setMakerAddress } = useBarterSwap();

  useEffect(() => {
    setTakerAddress(address);
  }, [router.query.address]);

  useEffect(() => {
    if (user.address) {
      setMakerAddress(user.address);
    }
  }, [user.address]);

  return (
    <>
      <PageHead
        title={`Swap with ${profile?.username ?? shortAddress(address)}`}
        description='Reveal unique value opportunities by swapping NFTs and tokens directly'
      />
      <PageHeader
        title={'Create a Swap'}
        subtitle='Reveal unique value opportunities by swapping NFTs and tokens directly'
      />
      <DefaultContainer mt={2} fontSize='sm' fontStyle='italic'>
        Swapping with: <Link as={NextLink} href={`/account/${address}`} color='auto' fontWeight='bold' className='color'>{profile.username ?? address}</Link>
      </DefaultContainer>
      <UserSwapView address={address} />
    </>
  )
}

export default SwapWithUser;

export const getServerSideProps = async ({ params, query }: GetServerSidePropsContext) => {
  const addressOrUsername = params?.address as string;
  if (!addressOrUsername) {
    return {
      notFound: true
    }
  }

  let user;
  try {
    user = await getProfile(addressOrUsername) ?? null;
  } catch (error) {
    // user not found or server error
  }

  if (!isAddress(addressOrUsername) && !user) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      address: user?.data?.walletAddress ?? addressOrUsername,
      profile: user?.data ?? {}
    }
  };
};