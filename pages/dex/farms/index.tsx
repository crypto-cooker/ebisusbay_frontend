import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import SwapPage from "@dex/components/swap";
import React from "react";
import FarmsPage from "@dex/farms/components";

export default function Page() {
  return (
    <>
      <PageHead
        title='Ryoshi Farms'
        description='Some text'
      />
      <PageHeader
        title='Ryoshi Farms'
        subtitle='Stake LP tokens to earn FRTN'
      />
      <FarmsPage />
    </>
  )
}