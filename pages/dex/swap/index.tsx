import PageHead from "@src/components-v2/shared/layout/page-head";
import React, {useEffect, useMemo, useState} from "react";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import SwapPage from "@dex/swap/components";
import {useAccount} from "wagmi";
import {usePollBlockNumber} from "@eb-pancakeswap-web/state/block/hooks";


function GlobalHooks() {
  usePollBlockNumber()
  return null
}

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
      <GlobalHooks />
      <SwapPage />
    </>
  )
}
