import PageHead from "@src/components-v2/shared/layout/page-head";
import React from "react";
import RyoshiDynasties from "@src/components-v2/feature/ryoshi-dynasties/game";


const BattleBay = () => {
  return (
    <>
      <PageHead
        title="Ryoshi Dynasties"
        description="some description.."
        url={`/battle-bay`}
      />
      <RyoshiDynasties />
    </>
  )
}


export default BattleBay;