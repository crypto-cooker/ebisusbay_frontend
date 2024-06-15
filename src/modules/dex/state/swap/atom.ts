import {Field, SwapTab} from "@dex/constants";
import {ChainId, Currency, CurrencyAmount, Percent} from "@uniswap/sdk-core";
import {ReactNode} from "react";
import {InterfaceTrade, TradeState} from "@dex/imported/state/routing/types";
import {atom} from "jotai/index";
import {useDerivedSwapInfo} from "@dex/state/swap/hooks";

export interface SwapPageState {
  currencyState: CurrencyState
  prefilledState: {
    inputCurrency?: Currency
    outputCurrency?: Currency
  }

  currentTab: SwapTab
  // The chainId of the page/context - can be different from the connected Chain ID if the
  // page is displaying content for a different chain
  chainId?: ChainId
}

export interface CurrencyState {
  inputCurrency?: Currency
  outputCurrency?: Currency
}

export interface SwapFocusedFieldState {
  readonly independentField: Field
  readonly typedValue: string
}

// type SwapFormState = {
//   focusedFieldState: SwapFocusedFieldState
//   derivedSwapInfo: DerivedSwapInfo
// }

export type DerivedSwapInfo = {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  inputTax: Percent
  outputTax: Percent
  outputFeeFiatValue?: number
  parsedAmount?: CurrencyAmount<Currency>
  inputError?: ReactNode
  trade: {
    trade?: InterfaceTrade
    state: TradeState
    uniswapXGasUseEstimateUSD?: number
    error?: any
    swapQuoteLatency?: number
  }
  allowedSlippage: Percent
  autoSlippage: Percent
}
const initialSwapPageState: SwapPageState = {
  currencyState: {
    inputCurrency: undefined,
    outputCurrency: undefined,
  },
  prefilledState: {
    inputCurrency: undefined,
    outputCurrency: undefined,
  },
  chainId: ChainId.MAINNET,
  currentTab: SwapTab.Swap,
}

export const swapPageStateAtom = atom<SwapPageState>(initialSwapPageState);

const initialFocusedFieldState: SwapFocusedFieldState = {
  independentField: Field.INPUT,
  typedValue: '',
}
const initialSwapDerivedData: DerivedSwapInfo = Object.freeze({
  currencies: {},
  currencyBalances: {},
  inputTax: new Percent(0),
  outputTax: new Percent(0),
  autoSlippage: new Percent(0),
  allowedSlippage: new Percent(0),
  trade: {
    state: TradeState.LOADING,
  },
})
export const swapFormStateAtom = atom<SwapFocusedFieldState>(initialFocusedFieldState);
export const swapFormDerivedStateAtom = atom<DerivedSwapInfo>(initialSwapDerivedData);

// export const updateSwapFormStateAtom = atom(
//   null,
//   (get, set) => {
//     const derivedInfo = get(swapFormDerivedStateAtom);
//     set(swapFormStateAtom, (prev) => ({
//       ...prev,
//       derivedSwapInfo: derivedInfo
//     }));
//   }
// );