import React, {memo} from 'react';
import {
  appUrl,
  cacheBustingKey,
  ciEquals,
  humanizeAdvanced,
  isAddress,
  isBundle,
  isCollectionListable,
  isHeroesCollection,
  relativePrecision
} from '@market/helpers/utils';
import Nft1155 from '@src/components-v2/feature/nft/nft1155';
import Nft721 from '@src/components-v2/feature/nft/nft721';
import {appConfig} from "@src/config";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {getNft} from "@src/core/api/endpoints/nft";
import {GetServerSidePropsContext} from "next";
import {getChainById, getChainByIdOrSlug, getChainBySlug} from "@src/helpers";
import {AppChainConfig} from "@src/config/chains";
import {QueryClient, useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {useParams} from "next/navigation";

const config = appConfig();

interface NftProps {
  initialSlug: string;
  initialId: string;
  initialChainId: number;
  initialNftData: any;
  initialCollection: any;
}

const Nft = ({ initialSlug, initialId, initialNftData, initialCollection, initialChainId }: NftProps) => {
  const params = useParams();
  const slug = initialSlug ?? params?.slug as string;
  const chainIdOrSlug = initialChainId ?? params?.chain as string;
  const id = initialId ?? Number(params?.id);
  const chainConfig = getChainByIdOrSlug(chainIdOrSlug);

  const chainMatchCondition = (_chainId: number) => !_chainId || _chainId === chainConfig?.chain.id;

  let collection = initialCollection ?? config.legacyCollections.find((c: any) => {
    return (isAddress(slug) && ciEquals(c.address, slug)) || ciEquals(c.slug, slug) && chainMatchCondition(c.chainId)
  });

  const {data: nftData} = useQuery({
    queryKey: ['CollectionNft', slug, id, chainIdOrSlug],
    queryFn: () => getNft(collection.address, id, chainConfig!.chain.id),
    initialData: initialNftData,
    enabled: !!collection && !!id && !!chainConfig
  });

  const type = collection?.is1155 ? '1155' : '721';

  const getTraits = (anNFT: any) => {
    if (
      (anNFT?.attributes && Array.isArray(anNFT.attributes) && anNFT.attributes.length > 0) ||
      (anNFT?.properties && Array.isArray(anNFT.properties) && anNFT.properties.length > 0)
    ) {
      let traits = [];
      if (anNFT?.attributes && Array.isArray(anNFT.attributes)) {
        traits = anNFT.attributes.filter((a: any) => a.value !== 'None');

        traits.sort((a: any, b: any) => {
          if (a?.occurrence) {
            return a.occurrence - b.occurrence;
          } else if (a?.percent) {
            return a.percent - b.percent;
          }
        });
      }
      if (anNFT?.properties && Array.isArray(anNFT.properties)) {
        traits = anNFT.properties;
        traits.sort((a: any, b: any) => {
          if (a?.occurrence) {
            return a.occurrence - b.occurrence;
          } else if (a?.percent) {
            return a.percent - b.percent;
          }
        });
      }

      if (traits.length > 0 && traits[0].occurrence) {
        const traitsTop = traits[0];
        const res = `${anNFT?.description ? anNFT.description.slice(0, 250) : ''} ... Top Trait: ${
          traitsTop.value ? humanizeAdvanced(traitsTop.value) : 'N/A'
        }, ${relativePrecision(traitsTop.occurrence)}%`;

        return res;
      }

      return anNFT?.description;
    }

    return anNFT?.description;
  };

  return (
    <>
      {!!nftData?.nft && (
        <PageHead
          title={nftData.nft.name}
          description={getTraits(nftData.nft)}
          url={`/collection/${collection?.slug}/${nftData.nft.id}`}
          image={nftData.nft.image}
        />
      )}
      {!!collection && !!nftData?.nft && (
        <>
          {isBundle(collection.address) ? (
            <Nft721 address={collection.address} slug={collection.slug} id={id} nft={nftData.nft} isBundle={true} chain={chainIdOrSlug} />
          ) : type === '1155' ? (
            <Nft1155 address={collection.address} id={id} collection={collection} chain={chainIdOrSlug} />
          ) : (
            <Nft721 address={collection.address} slug={collection.slug} id={id} nft={nftData.nft} chain={chainIdOrSlug} />
          )}
        </>
      )}
    </>
  );
};

export const getServerSideProps = async ({ params }: GetServerSidePropsContext) => {
  const collectionSlug = params?.slug as string;
  const chainSlugOrId = params?.chain as string | undefined;
  const tokenId = params?.id as string;
  if (!collectionSlug || !chainSlugOrId || Array.isArray(chainSlugOrId) || !tokenId) {
    return {
      notFound: true
    }
  }

  let chainConfig: AppChainConfig | undefined;
  let requiresChainRedirect = false;
  if (!isNaN(Number(chainSlugOrId))) {
    chainConfig = getChainById(chainSlugOrId);
    if (chainConfig) requiresChainRedirect = true;
  } else {
    chainConfig = getChainBySlug(chainSlugOrId);
  }

  if (!chainConfig) {
    return {
      notFound: true
    }
  }

  const queryClient = new QueryClient();
  const collection = await queryClient.fetchQuery({
    queryKey: ['CollectionInfo', collectionSlug],
    queryFn: () => fetchCollection(collectionSlug, chainConfig.chain.id),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
  
  const isDegen = !isCollectionListable(collection);

  let nftData;
  if (collection?.address) {
    nftData = await queryClient.fetchQuery({
      queryKey: ['CollectionNft', collection.address, tokenId, chainConfig.chain.id],
      queryFn: () => getNft(collection.address, tokenId, chainConfig.chain.id),
      staleTime: 1000 * 60 * 30, // 30 minutes
    });
  }

  if (!collection || !nftData) {
    return {
      notFound: true
    }
  }

  const seoImage = isHeroesCollection(collection.address) ?
    appUrl(`api/heroes/${tokenId}/og?${cacheBustingKey()}`).toString() :
    nftData.nft.image;

  const shouldSlugRedirect = !isDegen && isAddress(collectionSlug);
  if (shouldSlugRedirect || requiresChainRedirect) {
    const collectionSlug = shouldSlugRedirect ? collection.slug : collection.address;
    return {
      redirect: {
        destination: `/collection/${chainConfig.slug}/${collectionSlug}/${tokenId}`,
        permanent: false,
      },
      props: {
        initialSlug: collection?.slug,
        initialId: tokenId,
        initialChain: chainConfig.chain.id,
        initialCollection: collection,
        initialNftData: nftData,
        seoImage
      },
    };
  }

  return {
    props: {
      initialSlug: collection?.slug,
      initialId: tokenId,
      initialChain: chainConfig.chain.id,
      initialCollection: collection,
      initialNftData: nftData,
    },
  };
};

export default memo(Nft);


const fetchCollection = async (address: string, chainId: number) => {
  const primaryField = address.startsWith('0x') ? 'address' : 'slug';
  const response = await ApiService.withKey(process.env.EB_API_KEY as string).getCollections({
    [primaryField]: [address],
    chain: chainId
  });
  return response.data[0] ?? null;
};