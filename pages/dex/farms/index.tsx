import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React from "react";
import FarmsPage from "@dex/farms/components";

export default function Page() {
  return (
    <>
      <PageHead
        title='Ryoshi Farms'
        description='Earn Rewards by providing liquidity for your favorite tokens.'
      />
      <PageHeader
        title='Ryoshi Farms'
        subtitle='Stake LP tokens to earn FRTN'
      />
      <FarmsPage />
    </>
  )
}