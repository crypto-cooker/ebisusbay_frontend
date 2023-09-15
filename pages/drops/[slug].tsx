import React, {useState} from 'react';
import {useRouter} from 'next/router';

import MultiDrop from '@src/components-v2/feature/drop/multi-drop';
import SingleDrop from '@src/components-v2/feature/drop/single-drop';
import {appConfig} from "@src/Config";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {hostedImage} from "@src/helpers/image";
import RyoshiDrop from "@src/components-v2/feature/drop/ryoshi-drop";
import localDataService from "@src/core/services/local-data-service";
import {Drop} from "@src/core/models/drop";
import LandDrop from "@src/components-v2/feature/drop/land-drop";

export const drops = appConfig('drops');
const config = appConfig();

interface DropProps {
  ssrDrop: Drop;
  ssrCollection: any;
}

const Drop = ({ssrDrop, ssrCollection}: DropProps) => {
  const router = useRouter();
  const { slug } = router.query;

  const [isMultiDrop, setIsMultiDrop] = useState(false);

  return (
    <>
      <PageHead
        title={`${ssrDrop.title} - Drop`}
        description={ssrDrop.subtitle}
        url={`/drops/${ssrDrop.slug}`}
        image={hostedImage(ssrDrop.images.preview ?? ssrDrop.images.drop ?? ssrCollection?.metadata?.card)}
      />
      {ssrDrop && (
        <>
          {isMultiDrop ? (
            <MultiDrop />
          ) : ssrDrop.slug === 'ryoshi-tales-vip' ? (
            <RyoshiDrop drop={ssrDrop} />
          ) : ssrDrop.slug === 'izanamis-cradle-land-deeds' ? (
            <LandDrop drop={ssrDrop} />
          )  : (
            <SingleDrop drop={ssrDrop} />
          )}
        </>
      )}
    </>
  );
};

export const getServerSideProps = async ({ params }: {params: any}) => {
  const slug = params?.slug;

  let drop = null;
  if (slug === 'ryoshi-clubs') {
    drop = {
      "id": 182,
      "slug": "ryoshi-clubs",
      "collection": "ryoshi-playing-cards",
      "title": "Ryoshi Clubs",
      "subtitle": "Ryoshi Clubs: A new rewarded game-fi experience for the Crofam! \nTo celebrate the launch of the Playing Cards Collection #2 Ryoshi Clubs, the Ebisu’s Bay team introduces the “Crypto Hodl’em” contest, with over 500k $FRTN and exclusive NFT rewards, adding new layers of utilities and possibilities to the Ebisu’s Bay Ecosystem.",
      "description": "Ebisu’s Bay recognizes the importance of nurturing a vibrant and supportive community. As the contest unfolds, members of the Crofam will have the opportunity to engage with the captivating NFTs and partake in an event that not only celebrates creativity but also reinforces the symbiotic relationship between art and technology.\n\nThe upcoming Playing Cards Collection marks yet another pivotal moment in the history of the Bay, bringing together individuals who are not just collectors, but pioneers in the new era of Cronos.",
      "author": {
        "name": "Ebisu's Bay",
        "website": "https://app.ebisusbay.com/",
        "twitter": "https://twitter.com/EbisusBay",
        "discord": "https://discord.gg/ynrBrSkAFG",
        "medium": "https://blog.ebisusbay.com/",
        "instagram": "https://www.instagram.com/ebisusbayofficial",
        "telegram": "https://t.me/ebisusbay"
      },
      "address": "0xd87838a982a401510255ec27e603b0f5fea98d24",
      "maxMintPerTx": 25,
      "maxMintPerAddress": 100,
      "totalSupply": 4000,
      "erc20Cost": "250",
      "erc20MemberCost": "200",
      "erc20Token": "frtn",
      "erc20Only": true,
      "memberMitama": 1000,
      "foundersOnly": false,
      "start": 1694808000000,
      "end": null,
      "referral": false,
      "is1155": false,
      "published": true,
      "complete": false,
      "featured": true,
      "images": {
        "drop": "/img/drops/ryoshi-clubs/drop.webp",
        "avatar": "/img/drops/ryoshi-clubs/avatar.webp",
        "banner": "/img/drops/ryoshi-clubs/banner.webp",
        "preview": "/img/drops/ryoshi-clubs/preview.webp"
      },
      "verification": {
        "verified": true,
        "doxx": false,
        "kyc": true,
        "escrow": false
      }
    }
  } else {
    drop = localDataService.getDrop(slug);
  }

  if (!drop) {
    return {
      notFound: true
    }
  }

  // try {
  //   const res = await fetch(`${config.urls.api}collectioninfo?slug=${collectionSlug}`)
  //   const json = await res.json();
  //   if (json.collections.length > 0) {
  //     collection = json.collections[0];
  //   }
  // } catch (e) {
  //   return {
  //     notFound: true
  //   }
  // }


  return {
    props: {
      slug: drop.slug,
      ssrDrop: drop,
      ssrCollection: null
    },
  };
};

export default Drop;
