import React from "react";
import {Currency} from "@uniswap/sdk-core";
import SwapHeader from "@dex/components/swap/header";
import {useSwapPageState} from "@dex/swap/state/swap/hooks";
import {SwapPageContext} from "@dex/swap/state/swap/contexts/swap-page";
import {SwapFormContext} from "@dex/swap/state/swap/contexts/swap-form";
import SwapForm from "@dex/components/swap/tabs/swap";

interface SwapPageProps {
  initialInputCurrency?: Currency;
  initialOutputCurrency?: Currency;
  syncTabToUrl: boolean;
}

export default function SwapPage({ initialInputCurrency, initialOutputCurrency, syncTabToUrl }: SwapPageProps) {
  const [swapPageState, setSwapPageState] = useSwapPageState();

  console.log('===debug: SwapPage', swapPageState)
  return (
    <SwapPageContext
      initialInputCurrency={initialInputCurrency}
      initialOutputCurrency={initialOutputCurrency}
    >
      <SwapFormContext>
        <SwapHeader compact={false} syncTabToUrl={syncTabToUrl} />
        <>herp {swapPageState.currentTab}</>
        <br />
        <SwapForm />
      </SwapFormContext>
      {/*<SwapAndLimitContext.Consumer>*/}
      {/*  {({ currentTab }) => (*/}
          {/* <SwapContextProvider>*/}
          {/*   <SwapHeader compact={false} syncTabToUrl={syncTabToUrl} />*/}
          {/*   {currentTab === SwapTab.Swap && (*/}
          {/*     <SwapForm />*/}
          {/*   )}*/}
          {/*   /!*{currentTab === SwapTab.Limit && <LimitFormWrapper onCurrencyChange={onCurrencyChange} />}*!/*/}
          {/*   /!*{currentTab === SwapTab.Send && (*!/*/}
          {/*   /!*  <SendForm disableTokenInputs={disableTokenInputs} onCurrencyChange={onCurrencyChange} />*!/*/}
          {/*   /!*)}*!/*/}
          {/* </SwapContextProvider>*/}
        {/*)}*/}
      {/*</SwapAndLimitContext.Consumer>*/}
    </SwapPageContext>
  )
}