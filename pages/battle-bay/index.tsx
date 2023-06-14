import PageHead from "@src/components-v2/shared/layout/page-head";
import React from "react";
import RyoshiDynasties from "@src/components-v2/feature/ryoshi-dynasties/game";
import {ApiService} from "@src/core/services/api-service";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";


const BattleBay = ({rdConfig}: {rdConfig: RyoshiConfig | null}) => {
  return (
    <>
      <PageHead
        title="Ryoshi Dynasties"
        description="some description.."
        url={`/battle-bay`}
      />
      <RyoshiDynasties initialRdConfig={rdConfig}/>
    </>
  )
}


export default BattleBay;

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
        rdConfig: null
      },
    }
  }

}