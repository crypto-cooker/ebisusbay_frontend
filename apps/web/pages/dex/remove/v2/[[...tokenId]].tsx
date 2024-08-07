import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import {StandardContainer} from "@src/components-v2/shared/containers";
import RemoveLiquidity from "@dex/liquidity/remove";
import React from "react";

export default function Page() {
  return (
    <>
      <PageHead
        title='Ryoshi Swap'
        description='Trade tokens instantly with low fees'
      />
      <PageHeader
        title='Ryoshi Swap'
        subtitle='Trade tokens instantly with low fees'
      />
      <StandardContainer mt={4} maxW='container.sm'>
        <RemoveLiquidity />
      </StandardContainer>
    </>
  )
}