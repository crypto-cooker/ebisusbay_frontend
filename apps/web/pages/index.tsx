import React, { useMemo } from 'react';
import Head from 'next/head';
import RyoshiDynasties from '@src/components-v2/feature/ryoshi-dynasties/game';
import { ApiService } from '@src/core/services/api-service';
import { RyoshiConfig } from '@src/components-v2/feature/ryoshi-dynasties/game/types';
import fallbackConfig from '@src/core/configs/fallbacks/rd-config';
import { useSearchParams } from 'next/navigation';


const Home = ({rdConfig}: {rdConfig: RyoshiConfig}) => {
  const searchParams = useSearchParams();
  const initialScene = useMemo(() => searchParams.get('scene') ?? searchParams.get('area') ?? undefined, [searchParams]) ;

  return (
    <>
      <Head>
        <title>Ebisu's Bay Marketplace</title>
      </Head>
      <RyoshiDynasties initialRdConfig={rdConfig} initialScene={initialScene} />
    </>
  );
};
export default Home;

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