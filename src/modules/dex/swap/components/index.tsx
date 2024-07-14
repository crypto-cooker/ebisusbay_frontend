import React from "react";
import SwapHeader from "@dex/components/swap/header";
import {useSwapPageState} from "@dex/swap/state/swap/hooks";
import {SwapFormContext} from "@dex/swap/state/swap/contexts/swap-form";
import {SwapTab} from "@dex/swap/constants";
import SwapForm from "@dex/swap/components/tabs/swap";
import {Box} from "@chakra-ui/react";

export default function SwapPage(/*{ initialInputCurrency, initialOutputCurrency, syncTabToUrl }: SwapPageProps*/) {
  const [swapPageState, setSwapPageState] = useSwapPageState();

  console.log('===debug: SwapPage', swapPageState)
  return (
    <Box mt={4}>
      <SwapHeader compact={false} />
      {swapPageState.currentTab === SwapTab.Swap ? (
        <SwapForm />
      ) : swapPageState.currentTab === SwapTab.Limit ? (
        <>herp {swapPageState.currentTab}</>
      ) : swapPageState.currentTab === SwapTab.Send && (
        <>herp {swapPageState.currentTab}</>
      )}
    </Box>
  )
}