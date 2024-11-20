import PageHead from "@src/components-v2/shared/layout/page-head";
import React, {useState} from "react";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import SwapPage from "@dex/swap/components";
import {useRouter} from "next/navigation";
import Subnavigation from "@dex/components/subnavigation";

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
      <Subnavigation primaryTabKey='Swap' />
      <SwapPage />
    </>
  )
}
