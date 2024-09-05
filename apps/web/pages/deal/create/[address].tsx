import {CreateDeal} from "@src/components-v2/feature/deal/create";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import useBarterDeal from "@src/components-v2/feature/deal/use-barter-deal";
import {useUser} from "@src/components-v2/useUser";
import {GetServerSidePropsContext} from "next";
import {getProfile} from "@src/core/cms/endpoints/profile";
import {ciEquals, shortAddress} from "@market/helpers/utils";
import {isAddress} from "ethers/lib/utils";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {DefaultContainer} from "@src/components-v2/shared/containers";
import {Alert, AlertDescription, AlertIcon, Icon, Link} from "@chakra-ui/react";
import NextLink from "next/link";
import {ApiService} from "@src/core/services/api-service";
import {OrderState} from "@src/core/services/api-service/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import {Deal} from "@src/core/services/api-service/mapi/types";
import ImageService from "@src/core/services/image";
import {hostedImage} from "@src/helpers/image";

interface PageProps {
  address: string;
  profile: any;
  parentDeal?: Deal;
}

const CreateDealPage = ({ address, profile, parentDeal }: PageProps) => {
  const user = useUser();
  const router = useRouter();
  const { setTakerAddress, setMakerAddress, setParentId } = useBarterDeal();

  const resetParentId = () => {
    setParentId(undefined);
    router.replace(`/deal/create/${address}`);
  }

  const profilePicture = () => {
    if (profile?.banner) {
      return ImageService.translate(profile.banner).convert();
    } else if (profile?.profilePicture) {
      return ImageService.translate(profile.profilePicture).custom({width: 200, height: 200});
    } else {
      return hostedImage('/img/profile-avatar.webp');
    }
  }

  useEffect(() => {
    setTakerAddress(address);
  }, [router.query.address]);

  useEffect(() => {
    if (user.address) {
      setMakerAddress(user.address);
      if (parentDeal && !ciEquals(parentDeal.taker, user.address)) {
        resetParentId();
      }
    }
  }, [user.address]);

  useEffect(() => {
    // set parent deal if exists, otherwise reset it
    if (parentDeal) {
      setParentId(parentDeal.id);
    } else {
      resetParentId();
    }
  }, [parentDeal]);

  return (
    <>
      <PageHead
        title={`Make a deal with ${profile?.username ?? shortAddress(address)}`}
        image={profilePicture()}
        description='Reveal unique value opportunities by swapping NFTs and tokens directly'
      />
      <PageHeader
        title={'Create a Deal'}
        subtitle='Reveal unique value opportunities by swapping NFTs and tokens directly'
      />
      <Alert
        status='info'
        variant='subtle'
        flexDirection='row'
        px={0}
      >
        <DefaultContainer fontSize='sm' fontStyle='italic'>
          <Icon as={FontAwesomeIcon} icon={faHandshake} me={2} />
          <AlertDescription >
            Dealing with: <Link as={NextLink} href={`/account/${address}`} color='auto' fontWeight='bold' className='color'>{profile?.username ?? address}</Link>
          </AlertDescription>
        </DefaultContainer>
      </Alert>

      <CreateDeal address={address} />
    </>
  )
}

export default CreateDealPage;

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
  const userAddress = user?.data?.walletAddress ?? addressOrUsername;

  const parentId = query.parent as string;
  let parentDeal = null;
  if (parentId) {
    const _parentDeal = await ApiService.withoutKey().getDeal(parentId);
    if (
      _parentDeal &&
      _parentDeal.state === OrderState.ACTIVE &&
      ciEquals(_parentDeal.maker, userAddress)
    ) {
      parentDeal = _parentDeal;
    }
  }

  return {
    props: {
      address: userAddress,
      profile: user?.data ?? {},
      parentDeal: parentDeal ?? null
    }
  };
};