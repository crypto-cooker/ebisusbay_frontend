import PageHead from "@src/components-v2/shared/layout/page-head";
import React, {useEffect, useMemo, useState} from "react";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import SwapPage from "@dex/swap/components";
import {useAccount} from "wagmi";

export default function Page() {
  const { chain } = useAccount()
  const [parsedQs, setParsedQs] = useState({});

  // const parsedCurrencyState = useMemo(() => {
  //   return queryParametersToCurrencyState(parsedQs)
  // }, [parsedQs])

  // const initialInputCurrency = useCurrency(parsedCurrencyState.inputCurrencyId, chainId)
  // const initialOutputCurrency = useCurrency(parsedCurrencyState.outputCurrencyId, chainId)

  // useEffect(() => {
  //   setParsedQs(useParsedQueryString()); // Call the hook inside useEffect
  // }, []);

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
      <SwapPage
        // initialInputCurrency={''}
        // initialOutputCurrency={''}
        // syncTabToUrl={true}

      />
    </>
  )
}
