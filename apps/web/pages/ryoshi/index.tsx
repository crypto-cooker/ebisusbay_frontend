import PageHead from "@src/components-v2/shared/layout/page-head";
import React, { useMemo } from 'react';
import RyoshiDynasties from "@src/components-v2/feature/ryoshi-dynasties/game";
import {ApiService} from "@src/core/services/api-service";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import ImageService from "@src/core/services/image";
import fallbackConfig from "@src/core/configs/fallbacks/rd-config";
import { useSearchParams } from 'next/navigation';

const Ryoshi = ({rdConfig}: {rdConfig: RyoshiConfig}) => {
  const searchParams = useSearchParams();
  const initialScene = useMemo(() => searchParams.get('scene') ?? searchParams.get('area') ?? undefined, [searchParams]) ;

  return (
    <>
      <PageHead
        title="Ryoshi Dynasties"
        description="Ryoshi Dynasties - A captivating gamified DAO experience, combining NFT marketplace, battles, and strategic gameplay. Build your dynasty, collect rare NFTs, and earn rewards."
        url={`/ryoshi`}
        image={ImageService.translate('/img/ryoshi-dynasties/banner.webp').convert()}
      />
      <RyoshiDynasties initialRdConfig={rdConfig} initialScene={initialScene} />
    </>
  )
}


export default Ryoshi;

export const getStaticProps = async () => {

  try {
    const rdConfig = await ApiService
      .withKey(process.env.EB_API_KEY as string)
      .ryoshiDynasties
      .getGlobalContext();
    
    return {
      props: {
        rdConfig: rdConfig
      },
    };
  } catch (e) {
    return {
      props: {
        rdConfig: fallbackConfig
      },
    }
  }

}