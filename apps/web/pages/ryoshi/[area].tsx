import PageHead from '@src/components-v2/shared/layout/page-head';
import React from 'react';
import RyoshiDynasties from '@src/components-v2/feature/ryoshi-dynasties/game';
import { ApiService } from '@src/core/services/api-service';
import { RyoshiConfig } from '@src/components-v2/feature/ryoshi-dynasties/game/types';
import ImageService from '@src/core/services/image';
import fallbackConfig from '@src/core/configs/fallbacks/rd-config';
import { GetStaticPaths, GetStaticProps } from 'next';

const VALID_AREAS = ['bank', 'barracks', 'battle-map', 'alliance-center', 'townHall'] as const;
type ValidArea = (typeof VALID_AREAS)[number];

const AREA_METADATA: Record<ValidArea, { title: string; description: string; image: string }> = {
  bank: {
    title: "Bank - Ryoshi Dynasties",
    description: "Manage in-game assets like NFTs, use staking vaults, and collect rewards.",
    image: "/img/ryoshi-dynasties/areas/bank/preview.webp",
  },
  barracks: {
    title: "Barracks - Ryoshi Dynasties",
    description: "Suit up NFTs for battle in Ryoshi Dynasties.",
    image: "/img/ryoshi-dynasties/areas/barracks/preview.webp",
  },
  'battle-map': {
    title: "Ryoshi Dynasties",
    description: "Conquer your opponents and get rewarded.",
    image: "/img/ryoshi-dynasties/areas/battle-map/preview.webp",
  },
  'alliance-center': {
    title: "Alliance Center - Ryoshi Dynasties",
    description: "Manage your faction, diplomacy with other factions, and delegate troops.",
    image: "/img/ryoshi-dynasties/areas/alliance-center/preview.webp",
  },
  'townHall': {
    title: "Town Hall - Ryoshi Dynasties",
    description: "Conquer your opponents and get rewarded.",
    image: "/img/ryoshi-dynasties/areas/town-hall/preview.webp",
  },
};

const Ryoshi = ({ rdConfig, area }: { rdConfig: RyoshiConfig; area: ValidArea }) => {
  const metadata = AREA_METADATA[area];

  return (
    <>
      <PageHead
        title={metadata.title}
        description={metadata.description}
        url={`/ryoshi/${area}`}
        image={ImageService.translate(metadata.image).convert()}
      />
      <RyoshiDynasties initialRdConfig={rdConfig} initialScene={area} />
    </>
  )
}


export default Ryoshi;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const area = params?.area as ValidArea | undefined;

  if (!area || !VALID_AREAS.includes(area)) {
    return { notFound: true };
  }

  try {
    const rdConfig = await ApiService
      .withKey(process.env.EB_API_KEY as string)
      .ryoshiDynasties
      .getGlobalContext();

    return {
      props: {
        rdConfig: rdConfig,
        area
      },
    };
  } catch (e) {
    return {
      props: {
        rdConfig: fallbackConfig,
        area
      },
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: VALID_AREAS.map((area) => ({ params: { area } })),
    fallback: false, // Only allow predefined areas, unknown areas return 404
  };
};
