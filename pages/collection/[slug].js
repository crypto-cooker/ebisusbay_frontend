import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Collection1155 from '../../src/Components/Collection/collection1155';
import Collection721 from '../../src/Components/Collection/collection721';
import {caseInsensitiveCompare, isAddress, isCollection} from '@src/utils';
import {appConfig} from "@src/Config";
import PageHead from "../../src/Components/Head/PageHead";
import {hostedImage} from "@src/helpers/image";

const collectionTypes = {
  UNSET: -1,
  ERC721: 0,
  ERC1155: 1,
};
const config = appConfig();

const Collection = ({ ssrCollection, query, redirect, activeDrop }) => {
  const router = useRouter();
  const { slug } = router.query;

  const [type, setType] = useState(collectionTypes.ERC721);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (redirect && typeof window !== 'undefined') {
      router.push(`/collection/${ssrCollection.slug}`, undefined, { shallow: true });
    }

    setType(ssrCollection.multiToken ? collectionTypes.ERC1155 : collectionTypes.ERC721);

    setInitialized(true);
  }, [slug]);

  return (
    <>
      <PageHead
        title={ssrCollection.name}
        description={ssrCollection.metadata.description}
        url={`/collection/${ssrCollection.slug}`}
        image={hostedImage(ssrCollection.metadata.card)}
      />
      {initialized && ssrCollection && (
        <>
          {type === collectionTypes.ERC1155 ? (
            <>
              {ssrCollection.split ? (
                <Collection1155 collection={ssrCollection} tokenId={ssrCollection.id} query={query} activeDrop={activeDrop} />
              ) : (
                <Collection1155 collection={ssrCollection} query={query} activeDrop={activeDrop} />
              )}
            </>
          ) : (
            <Collection721 collection={ssrCollection} query={query} activeDrop={activeDrop} />
          )}
        </>
      )}
    </>
  );
};

export const getServerSideProps = async ({ params, query }) => {
  const slug = params?.slug;
  const queryKey = isAddress(slug) ? 'address' : 'slug';
  const res = await fetch(`${config.urls.api}collectioninfo?${queryKey}=${slug}`);

  let collection;
  if (res.ok) {
    const json = await res.json();
    collection = json.collections[0];
  }

  // might only be needed for vip collection
  if (!collection) {
    console.log('collection not found for slug', slug);
    collection = appConfig('collections')
      .find((c) => caseInsensitiveCompare(c.slug, slug) || caseInsensitiveCompare(c.address, slug));
  }

  if (!collection) {
    return {
      notFound: true
    }
  }

  // if (!caseInsensitiveCompare(collection.slug, slug)) {
  //   return {
  //     redirect: {
  //       destination: `/collection/${collection.slug}`,
  //       permanent: false,
  //     },
  //     props: {
  //       slug: collection.slug,
  //     },
  //   };
  // }

  if (collection.slug === 'founding-member') collection.id = 1;
  if (collection.slug === 'vip-founding-member') collection.id = 2;
  if (collection.slug === 'weird-apes-club') collection.mergedAddresses = ['0x7D5f8F9560103E1ad958A6Ca43d49F954055340a'];
  if (collection.slug === 'weird-apes-club-v1') collection.mergedWith = ['0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44'];

  const activeDrop = appConfig('drops')
    .find((drop) => !!collection.address && caseInsensitiveCompare(collection.address, drop.address) && !drop.complete);

  return {
    props: {
      slug: collection?.slug,
      ssrCollection: collection,
      activeDrop: activeDrop ?? null,
      query: query,
      redirect: !caseInsensitiveCompare(collection.slug, slug),
    },
  };
};

export default Collection;
