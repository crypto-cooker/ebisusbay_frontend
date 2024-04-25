import PageHead from "@src/components-v2/shared/layout/page-head";
import React, {useEffect, useMemo, useState} from "react";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import SwapPage from "@dex/components/swap";
import {asSupportedChain} from "@dex/imported/constants/chains";
import {useNetwork} from "wagmi";
import {ChainId} from "@uniswap/sdk-core";
import {queryParametersToCurrencyState} from "@dex/imported/state/swap/hooks";
// import useParsedQueryString from "@dex/hooks/useParsedQueryString";
import {useCurrency} from "@dex/imported/hooks/tokens";
import {BlockNumberProvider} from "@dex/imported/lib/hooks/useBlockNumber";
import {MulticallUpdater} from "@dex/imported/lib/state/multicall";

export default function Page() {
  const { chain } = useNetwork()
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
        <MulticallUpdater />
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
