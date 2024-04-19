import PageHead from "@src/components-v2/shared/layout/page-head";
import React from "react";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import SwapPage from "@dex/components/swap";

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
      <SwapPage />
    </>
  )
}