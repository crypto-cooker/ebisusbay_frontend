import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Collection1155 from '../../src/Components/Collection/collection1155';
import Collection721 from '../../src/Components/Collection/collection721';
import CollectionCronosverse from '@src/Components/Collection/Custom/Cronosverse';
import {caseInsensitiveCompare, isCronosVerseCollection, isAddress} from '@src/utils';
import {appConfig} from "@src/Config";
import PageHead from "../../src/Components/Head/PageHead";
import {hostedImage} from "@src/helpers/image";
import { getCollections } from "@src/core/api/next/collectioninfo";

const collectionTypes = {
  UNSET: -1,
  ERC721: 0,
  ERC1155: 1,
  CRONOSVERSE: 2,
};
const config = appConfig();

const Collection = ({ ssrCollection, query }) => {
  const router = useRouter();
  const { slug } = router.query;

  const [type, setType] = useState(collectionTypes.ERC721);
  const [collection, setCollection] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const onChangeSlug = async () => {
    setRedirect(null);

    const res = await getCollections({slug});
    let col = res.data?.collections?.[0]

    if (col) {
      if (!!col.mergedWith) {
        const res = await getCollections({address: col.mergedWith});
        const redirectToCollection = res.data?.collections?.[0]

        setRedirect(redirectToCollection.slug);
      }
      setCollection(col);
      if (isCronosVerseCollection(col.address)) setType(collectionTypes.ERC721);
      else setType(col.multiToken ? collectionTypes.ERC1155 : collectionTypes.ERC721);
    } else {
        const res = await getCollections({address: slug});
        col = res.data?.collections?.[0]
      if (col) {
        setCollection(col);
        setRedirect(col.slug);
        router.push(`/collection/${col.slug}`);
      }
    }
    setInitialized(true);
  }

  useEffect(() => {
    onChangeSlug();
  }, [slug]);

  if (redirect) {
    if (typeof window !== 'undefined') {
      router.push(`/collection/${redirect}`);
      return <></>;
    }
  }

  return (
    <>
      <PageHead
        title={ssrCollection.name}
        description={ssrCollection.metadata.description}
        url={`/collection/${ssrCollection.slug}`}
        image={hostedImage(ssrCollection.metadata.card)}
      />
      {initialized && collection && (
        <>
          {type === collectionTypes.CRONOSVERSE ? (
            <CollectionCronosverse collection={collection} slug={slug} cacheName={slug} />
          ) : type === collectionTypes.ERC1155 ? (
            <>
              {collection.split ? (
                <Collection1155 collection={collection} tokenId={collection.id} query={query} />
              ) : (
                <Collection1155 collection={collection} query={query} />
              )}
            </>
          ) : (
            <Collection721 collection={collection} query={query} />
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

  return {
    props: {
      slug: collection?.slug,
      ssrCollection: collection,
      query: query,
    },
  };
};

export default Collection;
