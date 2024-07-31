import PageHead from "@src/components-v2/shared/layout/page-head";
import React, {useState} from "react";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import SwapPage from "@dex/swap/components";
import {usePollBlockNumber} from "@eb-pancakeswap-web/state/block/hooks";
import {useRouter} from "next/navigation";
import Subnavigation from "@dex/components/subnavigation";


function GlobalHooks() {
  usePollBlockNumber()
  return null
}

export default function Page() {  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = (index: number) => {
    if (index === 0) {
      // router.push('/dex/swap');
    } else if (index === 1) {
      router.push('/dex/liquidity');
    }
    setTabIndex(index);
  };

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
      <Subnavigation primaryTabKey='Swap' />
      <SwapPage />
    </>
  )
}
