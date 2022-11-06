import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Collection1155 from '../../src/Components/Collection/collection1155';
import Collection721 from '../../src/Components/Collection/collection721';
import {caseInsensitiveCompare, isAddress} from '@src/utils';
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
  let collection;

  const queryKey = isAddress(slug) ? 'address' : 'slug';
  const res = await fetch(`${config.urls.api}collectioninfo?${queryKey}=${slug}`);
  if (!res.ok) {
    return {
      notFound: true
    }
  }
  const json = await res.json();
  collection = json.collections[0];

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

  const activeDrop = appConfig('drops')
    .find((drop) => caseInsensitiveCompare(collection.address, drop.address) && !drop.complete);

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
