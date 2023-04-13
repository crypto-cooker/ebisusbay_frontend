import React from 'react';
import {useHasHydrated} from '@src/hooks/useHasHydrated';
import {getBundle} from '@src/core/api/endpoints/collectioninfo';
import PageHead from "@src/components-v2/shared/layout/page-head";
import Nft721 from '@src/components-v2/feature/nft/nft721';

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