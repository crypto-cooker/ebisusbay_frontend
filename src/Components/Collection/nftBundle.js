import React, {useState, useEffect} from 'react';

import { ImageContainer, ImageSubMenu, Tabs } from "@src/Components/Bundle";
import { Flex, Text } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { useHasHydrated } from '@src/hooks/useHasHydrated';
import { getBundle } from '@src/core/api/endpoints/collectioninfo';
import PriceActionBar from '@src/Components/NftDetails/PriceActionBar';
import { OFFER_TYPE } from '@src/Components/Offer/MadeOffers/MadeOffersRow';
import { getFilteredOffers } from '@src/core/subgraph';
import { useSelector, useDispatch } from 'react-redux';
import { caseInsensitiveCompare } from '@src/utils';
import { getNftDetails } from '@src/GlobalState/nftSlice';

const Bundle = ({ bundle }) => {
  const [offerType, setOfferType] = useState(OFFER_TYPE.none);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNftDetails(bundle.address, bundle.id));
  }, [dispatch, bundle.address, bundle.id]);

  useEffect(() => {
    async function func() {
      const filteredOffers = await getFilteredOffers(bundle.address, bundle.id.toString(), user.address);
      const data = filteredOffers ? filteredOffers.data.filter((o) => o.state === offerState.ACTIVE.toString()) : [];
      if (data && data.length > 0) {
        setOfferType(OFFER_TYPE.update);
        setOfferData(data[0]);
      } else {
        setOfferType(OFFER_TYPE.make);
      }
    }
    if (!offerType && user.address && bundle && bundle.address && bundle.id) {
      func();
    }

    // eslint-disable-next-line
  }, [bundle, user.address]);

  return (
    <>
      <section className="gl-legacy container">
        <Flex flexWrap='wrap'>
          <Flex width={['100%', '100%', '40%']} height='min' flexDir='column' alignItems='center'>
            <ImageContainer nft={bundle} />
            {useHasHydrated() && <ImageSubMenu />}
          </Flex>
          <Flex className='item_info' width={['100%', '100%', '60%']} flexDir='column' padding='0px 20px' gap='20px'>
            <Heading as="h2" size="xl" >
              {bundle.name}
            </Heading>
            <Text textAlign='justify'>
              {bundle.description}
            </Text>

            {true && (

              <PriceActionBar
                offerType={offerType}
                collectionName={bundle.name}
                isVerified={true}
                onOfferSelected={() => handleMakeOffer()}
                isOwner={caseInsensitiveCompare(user.address, bundle.owner)}
                />
            )}

            <Tabs nft={bundle} />
          </Flex>
        </Flex>
      </section>
    </>
  )

}

export const getServerSideProps = async ({ params }) => {
  const slug = params?.slug;
  try {
    const res = await getBundle(slug);

    if (!res) {
      return {
        notFound: true
      }
    }

    const bundle = {
      address: res.data.bundle.bundle.address,
      description: res.data.bundle.bundle.token.metadata.description,
      id: res.data.bundle.bundle.id,
      name: res.data.bundle.bundle.token.metadata.name,
      nfts: res.data.bundle.bundle.token.metadata.nfts,
      listings: res.data.bundle.bundle.listings,
      owner: res.data.bundle.owner
    }
    return {
      props: {
        bundle
      },
    };
  } catch (e) {
    return {
      notFound: true
    }
  }
};

export default Bundle;