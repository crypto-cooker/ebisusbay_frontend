import {Field, SwapTab} from "src/modules/dex/swap/constants";
import {ReactNode} from "react";
import {atom} from "jotai/index";
import {ChainId, Currency, CurrencyAmount, Percent} from "@pancakeswap/sdk";
import {TradeState} from "@eb-pancakeswap-web/state/swap/types";

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

export interface SwapFormState {
  readonly independentField: Field
  readonly typedValue: string
}

// type SwapFormContext = {
//   swapFormState: SwapFormState
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
    trade?: any
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
  chainId: ChainId.CRONOS,
  currentTab: SwapTab.Swap,
}

export const swapPageStateAtom = atom<SwapPageState>(initialSwapPageState);

const initialSwapFormState: SwapFormState = {
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
export const swapFormStateAtom = atom<SwapFormState>(initialSwapFormState);
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