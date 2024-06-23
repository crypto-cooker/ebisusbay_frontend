import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Collection1155 from '@src/components-v2/feature/collection/collection-1155';
// import Collection721 from '@src/components-v2/feature/collection/collection721';
import Collection721 from '@src/components-v2/feature/collection/collection-721';
import {appUrl, cacheBustingKey, ciEquals} from '@market/helpers/utils';
import {appConfig} from "@src/Config";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {CollectionPageContext} from "@src/components-v2/feature/collection/context";
import {GetServerSidePropsContext} from "next";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";

const collectionTypes = {
  UNSET: -1,
  ERC721: 0,
  ERC1155: 1,
};
const config = appConfig();

interface CollectionProps {
  ssrCollection: any;
  query: any;
  redirect: boolean;
  activeDrop: any;
}

const Collection = ({ ssrCollection, query, redirect, activeDrop }: CollectionProps) => {
  const router = useRouter();
  const { slug, tab, ...remainingQuery }: Partial<{ slug: string; tab: string }> & FullCollectionsQueryParams = router.query;
  const [queryParams, setQueryParams] = useState(remainingQuery);

  const [type, setType] = useState(collectionTypes.ERC721);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (redirect && typeof window !== 'undefined') {
      let hackedQuery = {} as any;
      if (tab) hackedQuery.tab = tab;
      if (remainingQuery) hackedQuery = { ...hackedQuery, ...remainingQuery };

      const queryString = new URLSearchParams(hackedQuery).toString();
      const url = `/collection/${ssrCollection.slug}${queryString ? `?${queryString}` : ''}`;
      router.push(url, undefined, { shallow: true });
    }

    setType(ssrCollection.multiToken ? collectionTypes.ERC1155 : collectionTypes.ERC721);
    setQueryParams(remainingQuery);
    setInitialized(true);
  }, [slug]);

  return (
    <>
      <PageHead
        title={ssrCollection.name}
        description={ssrCollection.metadata.description}
        url={`/collection/${ssrCollection.slug}`}
        image={appUrl(`api/collection/${ssrCollection.slug}/og?${cacheBustingKey()}`).toString()}
      />
      {initialized && ssrCollection && (
        <CollectionPageContext.Provider value={{ queryParams, setQueryParams}}>
          {type === collectionTypes.ERC1155 ? (
            <>
              {ssrCollection.split ? (
                <Collection1155 collection={ssrCollection} tokenId={ssrCollection.id} ssrQuery={query} activeDrop={activeDrop} />
              ) : (
                <Collection1155 collection={ssrCollection} ssrQuery={query} activeDrop={activeDrop} />
              )}
            </>
          ) : (
            <Collection721 collection={ssrCollection} ssrTab={tab} ssrQuery={remainingQuery} activeDrop={activeDrop} />
          )}
        </CollectionPageContext.Provider>
      )}
    </>
  );
};

export const getServerSideProps = async ({ params, query }: GetServerSidePropsContext) => {
  const slug = params?.slug as string;

  // @todo fix with autolistings
  // const queryKey = isAddress(slug) ? 'address' : 'slug';
  // const res = await fetch(`${config.urls.api}collectioninfo?${queryKey}=${slug}`);
  //
  // let collection;
  // if (res.ok) {
  //   const json = await res.json();
  //   collection = json.collections[0];
  // }
  //
  // // might only be needed for vip collection
  // if (!collection) {
  //   console.log('collection not found for slug', slug);
  //   collection = appConfig('collections')
  //     .find((c) => ciEquals(c.slug, slug) || ciEquals(c.address, slug));
  // }

  const collection = appConfig('collections')
    .find((c: any) => ciEquals(c.slug, slug) || ciEquals(c.address, slug));

  if (!collection) {
    return {
      notFound: true
    }
  }

  // if (!ciEquals(collection.slug, slug)) {
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

  if (collection.slug === 'weird-apes-club') collection.mergedAddresses = ['0x7D5f8F9560103E1ad958A6Ca43d49F954055340a'];
  if (collection.slug === 'weird-apes-club-v1') collection.mergedWith = ['0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44'];
  if (collection.slug === 'cronos-apes') collection.mergedAddresses = ['0x5Cb9a12d31CF751ACc58B12B47cc4E093A6AB580'];
  if (collection.slug === 'degen-ape-cronos-club') collection.mergedAddresses = ['0x47C4184a9c5Ad620D5243c850A33833a3Cd010f5'];
  if (collection.slug === 'gold-partner') collection.mergedAddresses = ['0xF4C80B77AA1F73E09348693a81d744Fcd1263A2D'];
  if (collection.slug === 'beta-mascots') collection.mergedAddresses = ['0x19317B3fc2F1Add6b7E17a0A03A5a269Ed5ce48b'];

  const activeDrop = appConfig('drops')
    .find((drop: any) => !!collection.address && ciEquals(collection.address, drop.address) && !drop.complete);

  return {
    props: {
      slug: collection?.slug,
      ssrCollection: collection,
      activeDrop: activeDrop ?? null,
      query: query,
      redirect: !ciEquals(collection.slug, slug),
    },
  };
};

export default Collection;
