import PageHead from '@src/components-v2/shared/layout/page-head';
import React from 'react';
import RyoshiDynasties from '@src/components-v2/feature/ryoshi-dynasties/game';
import { ApiService } from '@src/core/services/api-service';
import { RyoshiConfig } from '@src/components-v2/feature/ryoshi-dynasties/game/types';
import ImageService from '@src/core/services/image';
import fallbackConfig from '@src/core/configs/fallbacks/rd-config';

const Ryoshi = ({rdConfig}: {rdConfig: RyoshiConfig}) => {
  return (
    <>
      <PageHead
        title="Bank - Ryoshi Dynasties"
        description="Manage in-game assets like NFTs, use staking vaults, and collect rewards."
        url='/ryoshi?area=bank'
        image={ImageService.translate('/img/ryoshi-dynasties/village/buildings/bank/preview.webp').convert()}
      />
      <RyoshiDynasties initialRdConfig={rdConfig} initialScene='bank' />
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