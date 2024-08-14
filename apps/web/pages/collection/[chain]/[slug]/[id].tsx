import React, {memo, useEffect, useState} from 'react';
import {
  appUrl,
  cacheBustingKey,
  ciEquals,
  humanizeAdvanced,
  isAddress,
  isBundle,
  isHeroesCollection,
  relativePrecision
} from '@market/helpers/utils';
import Nft1155 from '@src/components-v2/feature/nft/nft1155';
import Nft721 from '@src/components-v2/feature/nft/nft721';
import {appConfig} from "@src/config";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {getNft} from "@src/core/api/endpoints/nft";
import {GetServerSidePropsContext} from "next";
import {getChainById, getChainBySlug} from "@src/helpers";
import {AppChainConfig} from "@src/config/chains";

interface NftProps {
  slug: string;
  id: string;
  chain: number;
  nft: any;
  collection: any;
}

const Nft = ({ slug, id, nft, collection, chain }: NftProps) => {
  const [type, setType] = useState('721');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setType(collection.multiToken ? '1155' : '721');
    setInitialized(true);
  }, [slug, id]);

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
      <PageHead
        title={nft.name}
        description={getTraits(nft)}
        url={`/collection/${collection?.slug}/${nft.id}`}
        image={nft.image}
      />
      {initialized && collection && (
        <>
          {isBundle(collection.address) ? (
            <Nft721 address={collection.address} slug={collection.slug} id={id} nft={nft} isBundle={true} chain={chain} />
          ) : type === '1155' ? (
            <Nft1155 address={collection.address} id={id} collection={collection} chain={chain} />
          ) : (
            <Nft721 address={collection.address} slug={collection.slug} id={id} nft={nft} chain={chain} />
          )}
        </>
      )}
    </>
  );
};

export const getServerSideProps = async ({ params }: GetServerSidePropsContext) => {
  const slug = params?.slug as string;
  const chainSlugOrId = params?.chain as string | undefined;
  const tokenId = params?.id as string;
  if (!slug || !chainSlugOrId || Array.isArray(chainSlugOrId) || !tokenId) {
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

  // default to cronos chain if collection has no chain
  const chainMatchCondition = (chainId: number) => !chainId || chainId === chainConfig?.chain.id;

  let collection;

  // @todo fix in autolistings
  if (isAddress(slug)) {
    collection = appConfig('collections').find((c: any) => ciEquals(c.address, slug) && chainMatchCondition(c.chainId));

    // const res = await fetch(`${config.urls.api}collectioninfo?address=${slug}`);
    // const json = await res.json();
    // collection = json.collections[0]
  } else {
    collection = appConfig('collections').find((c: any) => ciEquals(c.slug, slug) && chainMatchCondition(c.chainId));

    // const res = await fetch(`${config.urls.api}collectioninfo?slug=${slug}`);
    // const json = await res.json();
    // collection = json.collections[0]
  }

  let nft;
  if (collection?.address) {
    const resp = await getNft(collection.address, tokenId, chainConfig.chain.id);
    nft = { ...resp.nft, address: collection.address, id: tokenId };
  }

  if (!collection || !nft) {
    return {
      notFound: true
    }
  }

  const seoImage = isHeroesCollection(collection.address) ?
    appUrl(`api/heroes/${tokenId}/og?${cacheBustingKey()}`).toString() :
    nft.image;

  if (isAddress(slug) || requiresChainRedirect) {
    return {
      redirect: {
        destination: `/collection/${chainConfig.slug}/${collection.slug}/${tokenId}`,
        permanent: false,
      },
      props: {
        slug: collection?.slug,
        id: tokenId,
        chain: chainConfig.chain.id,
        collection,
        nft,
        seoImage
      },
    };
  }

  return {
    props: {
      slug: collection?.slug,
      id: tokenId,
      chain: chainConfig.chain.id,
      collection,
      nft,
    },
  };
};

export default memo(Nft);
