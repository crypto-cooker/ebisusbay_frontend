import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Collection1155 from '@src/components-v2/feature/collection/collection-1155';
import Collection721 from '@src/components-v2/feature/collection/collection-721';
import {appUrl, cacheBustingKey, ciEquals, isCollectionListable} from '@market/helpers/utils';
import {appConfig} from "@src/config";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {CollectionPageContext} from "@src/components-v2/feature/collection/context";
import {GetServerSidePropsContext} from "next";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";
import {getChainById, getChainBySlug} from "@src/helpers";
import {ApiService} from "@src/core/services/api-service";
import {QueryClient} from "@tanstack/react-query";
import { ChainId } from '@pancakeswap/chains';

const collectionTypes = {
  UNSET: -1,
  ERC721: 0,
  ERC1155: 1,
};

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
      if (!ssrCollection?.slug || !query?.chain) {
        // console.error('Redirection aborted due to missing slug or chain:', { slug: ssrCollection?.slug, chain: query?.chain });
        return; // Abort redirection if slug or chain is undefined
      }

      let hackedQuery = {} as any;
      if (tab) hackedQuery.tab = tab;
      if (remainingQuery) hackedQuery = { ...hackedQuery, ...remainingQuery };

      const queryString = new URLSearchParams(hackedQuery).toString();
      const url = `/collection/${query.chain}/${ssrCollection.slug}${queryString ? `?${queryString}` : ''}`;
      router.push(url, undefined, { shallow: true });
    }

    const { chain, ...sanitizedQuery} = remainingQuery as any;
    setType(ssrCollection?.is1155 ? collectionTypes.ERC1155 : collectionTypes.ERC721);
    setQueryParams(sanitizedQuery);
    setInitialized(true);
  }, [slug]);

  return (
    <>
      {ssrCollection && (
        <PageHead
          title={ssrCollection.name}
          description={ssrCollection.metadata.description}
          url={`/collection/${ssrCollection.slug}`}
          image={appUrl(`api/collection/${ssrCollection.slug}/og?${cacheBustingKey()}`).toString()}
        />
      )}
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
  const chainSlugOrId = params?.chain as string;
  const collectionSlug = params?.slug as string;

  if (!collectionSlug || !chainSlugOrId || Array.isArray(chainSlugOrId)) {
    return {
      notFound: true
    }
  }

  const [isLegacy, legacyCollection] = isLegacyNftRoute(chainSlugOrId);
  if (isLegacy) {
    return {
      redirect: {
        permanent: false,
        destination: `/collection/cronos/${legacyCollection.slug}/${collectionSlug}`
      }
    }
  }

  let chain;
  if (!isNaN(Number(chainSlugOrId))) {
    chain = getChainById(chainSlugOrId);
    if (chain) {
      return {
        redirect: {
          permanent: false,
          destination: `/collection/${chain.slug}/${collectionSlug}`
        }
      }
    }
  } else {
    chain = getChainBySlug(chainSlugOrId);
  }

  if (!chain) {
    return {
      notFound: true
    }
  }

  // let collection = appConfig('legacyCollections')
  //   .find((c: any) => ciEquals(c.slug, collectionSlug) || ciEquals(c.address, collectionSlug));

  // if (!collection) {
  const queryClient = new QueryClient();
  const collection = await queryClient.fetchQuery({
    queryKey: ['CollectionInfo', collectionSlug],
    queryFn: () => fetchCollection(collectionSlug, chain.chain.id),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (!collection) {
    return {
      notFound: true
    }
  }
  // }

  const isDegen = !isCollectionListable(collection);

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
      slug: collection?.slug ??  null,
      ssrCollection: collection,
      activeDrop: activeDrop ?? null,
      query: query,
      redirect: !isDegen && !ciEquals(collection.slug, collectionSlug),
    },
  };
};

export default Collection;

export const fetchCollection = async (address: string, chainId: number) => {
  const primaryField = address.startsWith('0x') ? 'address' : 'slug';
  const response = await ApiService.withKey(process.env.EB_API_KEY as string).getCollections({
    [primaryField]: [address],
    chain: chainId
  });
  return response.data[0] ?? null;
};

// Legacy route is /collection/[slug|address]/[id]
// To be redirected to /collection/cronos/[slug|address]/[id] as they are all cronos
// Don't need to check nft id as it can still be detected by chain/collection mismatch
function isLegacyNftRoute(chainOrCollection: string) {
  const legacyCollections = appConfig('legacyCollections');
  const legacyCollection = legacyCollections.find((collection: any) => {
    const matchesSlug = ciEquals(chainOrCollection, collection.slug);
    const matchesAddress = ciEquals(chainOrCollection, collection.address);
    const isLegacy = [collection.chain, collection.chainId].some(val => !val || val === ChainId.CRONOS);
    return (matchesSlug || matchesAddress) && isLegacy;
  });

  return [!!legacyCollection, legacyCollection];
}