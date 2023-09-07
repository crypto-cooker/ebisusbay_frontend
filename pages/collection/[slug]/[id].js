import React, {memo, useEffect, useState} from 'react';
import {caseInsensitiveCompare, humanize, isAddress, isBundle, relativePrecision} from '@src/utils';
import Nft1155 from '@src/components-v2/feature/nft/nft1155';
import Nft721 from '@src/components-v2/feature/nft/nft721';
import {appConfig} from "@src/Config";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {getNft} from "@src/core/api/endpoints/nft";

const config = appConfig();

const Nft = ({ slug, id, nft, collection }) => {
  const [type, setType] = useState('721');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setType(collection.multiToken ? '1155' : '721');
    setInitialized(true);
  }, [slug, id]);

  const getTraits = (anNFT) => {
    if (
      (anNFT?.attributes && Array.isArray(anNFT.attributes) && anNFT.attributes.length > 0) ||
      (anNFT?.properties && Array.isArray(anNFT.properties) && anNFT.properties.length > 0)
    ) {
      let traits = [];
      if (anNFT?.attributes && Array.isArray(anNFT.attributes)) {
        traits = anNFT.attributes.filter((a) => a.value !== 'None');

        traits.sort((a, b) => {
          if (a?.occurrence) {
            return a.occurrence - b.occurrence;
          } else if (a?.percent) {
            return a.percent - b.percent;
          }
        });
      }
      if (anNFT?.properties && Array.isArray(anNFT.properties)) {
        traits = anNFT.properties;
        traits.sort((a, b) => {
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
          traitsTop.value ? humanize(traitsTop.value) : 'N/A'
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
            <Nft721 address={collection.address} slug={collection.slug} id={id} nft={nft} isBundle={true} />
          ) : type === '1155' ? (
            <Nft1155 address={collection.address} slug={collection.slug} id={id} nft={nft} collection={collection} />
          ) : (
            <Nft721 address={collection.address} slug={collection.slug} id={id} nft={nft} />
          )}
        </>
      )}
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  const slug = params?.slug;
  const tokenId = params?.id;
  let collection;

  // @todo fix in autolistings
  if (isAddress(slug)) {
    collection = appConfig('collections').find((c) => caseInsensitiveCompare(c.address, slug));

    // const res = await fetch(`${config.urls.api}collectioninfo?address=${slug}`);
    // const json = await res.json();
    // collection = json.collections[0]
  } else {
    collection = appConfig('collections').find((c) => caseInsensitiveCompare(c.slug, slug));

    // const res = await fetch(`${config.urls.api}collectioninfo?slug=${slug}`);
    // const json = await res.json();
    // collection = json.collections[0]
  }

  let nft;
  if (collection?.address) {
    const resp = await getNft(collection.address, tokenId);
    nft = { ...resp.nft, address: collection.address, id: tokenId };
  }

  if (!collection || !nft) {
    return {
      notFound: true
    }
  }

  if (isAddress(slug)) {
    return {
      redirect: {
        destination: `/collection/${collection.slug}/${tokenId}`,
        permanent: false,
      },
      props: {
        slug: collection?.slug,
        id: tokenId,
        collection,
        nft,
      },
    };
  }

  return {
    props: {
      slug: collection?.slug,
      id: tokenId,
      collection,
      nft,
    },
  };
};

export default memo(Nft);
