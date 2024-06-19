import PageHead from "@src/components-v2/shared/layout/page-head";
import React, {useEffect, useMemo, useState} from "react";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import SwapPage from "@dex/swap/components";
import {asSupportedChain} from "@dex/imported/constants/chains";
import {useAccount} from "wagmi";
import {ChainId} from "@uniswap/sdk-core";
import {queryParametersToCurrencyState} from "@dex/imported/state/swap/hooks";
// import useParsedQueryString from "@dex/hooks/useParsedQueryString";
import {BlockNumberProvider} from "@dex/imported/lib/hooks/useBlockNumber";

export default function Page() {
  const { chain } = useAccount()
  const supportedChainId = asSupportedChain(chain?.id)
  const chainId = supportedChainId || ChainId.MAINNET
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
      <BlockNumberProvider>
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
          syncTabToUrl={true}

        />
      </BlockNumberProvider>
    </>
  )
}
