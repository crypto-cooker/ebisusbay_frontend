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
import NftBundle from "@src/Components/Collection/nftBundle";
import PageHead from "@src/Components/Head/PageHead";
import Nft721 from "@src/Components/Collection/nft721";

const Bundle = ({ bundle }) => {
  return (
    <>
      <PageHead
        title={bundle.name}
        url={`/collection/${bundle.address}/${bundle.id}`}
      />
      {useHasHydrated() && (
        <Nft721 address={bundle.address} id={bundle.id} isBundle={true} />
      )}
    </>
  );
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