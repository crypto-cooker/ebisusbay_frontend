import React from "react";
import PageHead from "@src/components-v2/shared/layout/page-head";
import ImageService from "@src/core/services/image";
import RyoshiWithKnifeView from "@src/components-v2/feature/drop/types/ryoshi-with-knife";


const RyoshiWithKnife = () => {
  return (
    <>
      <PageHead
        title='ryoshi with knife'
        url='/ryoshi-with-knife'
        description='sharpest meme on cronos'
        image={ImageService.translate('/img/ryoshi-with-knife/banner.webp').convert()}
      />
      <RyoshiWithKnifeView />
    </>
  )
}

export default RyoshiWithKnife;