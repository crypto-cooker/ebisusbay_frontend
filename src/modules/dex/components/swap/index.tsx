import React from "react";
import {SwapAndLimitContextProvider, SwapContextProvider} from "@dex/imported/state/swap/SwapContext";
import {SwapAndLimitContext} from "@dex/imported/state/swap/types";
import SwapHeader from "@dex/components/swap/header";
import {Currency} from "@uniswap/sdk-core";
import {SwapTab} from "@dex/constants";
import SwapForm from "@dex/components/swap/tabs/swap";

interface SwapPageProps {
  initialInputCurrency?: Currency;
  initialOutputCurrency?: Currency;
  syncTabToUrl: boolean;
}

export default function SwapPage({ initialInputCurrency, initialOutputCurrency, syncTabToUrl }: SwapPageProps) {
  return (
    <SwapAndLimitContextProvider>
      <SwapAndLimitContext.Consumer>
        {({ currentTab }) => (
          <SwapContextProvider>
            <SwapHeader compact={false} syncTabToUrl={syncTabToUrl} />
            {currentTab === SwapTab.Swap && (
              <SwapForm />
            )}
            {/*{currentTab === SwapTab.Limit && <LimitFormWrapper onCurrencyChange={onCurrencyChange} />}*/}
            {/*{currentTab === SwapTab.Send && (*/}
            {/*  <SendForm disableTokenInputs={disableTokenInputs} onCurrencyChange={onCurrencyChange} />*/}
            {/*)}*/}
          </SwapContextProvider>
        )}
      </SwapAndLimitContext.Consumer>
    </SwapAndLimitContextProvider>
  )
}