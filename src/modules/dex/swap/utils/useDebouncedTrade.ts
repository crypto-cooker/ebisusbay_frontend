import { Currency, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import {ClassicTrade, InterfaceTrade, QuoteMethod, RouterPreference, TradeState} from "@dex/imported/state/routing/types";
import useDebounce from "@src/core/hooks/useDebounce";
import {WRAPPED_NATIVE_CURRENCY} from "@dex/imported/constants/tokens";
import useAutoRouterSupported from "@dex/imported/hooks/useAutoRouterSupported";
import {useAccount} from "wagmi";
import {useRoutingAPITrade} from "@dex/imported/state/routing/useRoutingAPITrade";
import {usePreviewTrade} from "@dex/imported/state/routing/usePreviewTrade";
import {useRouterPreference} from "@dex/swap/state/user/hooks";

// Prevents excessive quote requests between keystrokes.
const DEBOUNCE_TIME = 350
const DEBOUNCE_TIME_QUICKROUTE = 50

export function useDebouncedTrade(
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
  routerPreferenceOverride?: RouterPreference.X,
  account?: string,
  inputTax?: Percent,
  outputTax?: Percent
): {
  state: TradeState
  trade?: InterfaceTrade
  swapQuoteLatency?: number
}

export function useDebouncedTrade(
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
  routerPreferenceOverride?: RouterPreference.API,
  account?: string,
  inputTax?: Percent,
  outputTax?: Percent
): {
  state: TradeState
  trade?: ClassicTrade
  swapQuoteLatency?: number
}
/**
 * Returns the debounced v2+v3 trade for a desired swap.
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 * @param routerPreferenceOverride force useRoutingAPITrade to use a specific RouterPreference
 * @param account the connected address
 *
 * @param inputTax
 * @param outputTax
 */
export function useDebouncedTrade(
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
  routerPreferenceOverride?: RouterPreference,
  account?: string,
  inputTax?: Percent,
  outputTax?: Percent
): {
  state: TradeState
  trade?: InterfaceTrade
  method?: QuoteMethod
  swapQuoteLatency?: number
} {
  const { chain } = useAccount()
  const autoRouterSupported = useAutoRouterSupported()
  const inputs = useMemo<[CurrencyAmount<Currency> | undefined, Currency | undefined]>(
    () => [amountSpecified, otherCurrency],
    [amountSpecified, otherCurrency]
  )
  const isDebouncing = useDebounce(inputs, DEBOUNCE_TIME) !== inputs

  const isPreviewTradeDebouncing = useDebounce(inputs, DEBOUNCE_TIME_QUICKROUTE) !== inputs

  const isWrap = useMemo(() => {
    if (!chain?.id || !amountSpecified || !otherCurrency) return false
    const weth = WRAPPED_NATIVE_CURRENCY[chain.id]
    return Boolean(
      (amountSpecified.currency.isNative && weth?.equals(otherCurrency)) ||
        (otherCurrency.isNative && weth?.equals(amountSpecified.currency))
    )
  }, [amountSpecified, chain?.id, otherCurrency])

  const [routerPreference] = useRouterPreference()

  const skipBothFetches = !autoRouterSupported || isWrap
  const skipRoutingFetch = skipBothFetches || isDebouncing

  const skipPreviewTradeFetch = skipBothFetches || isPreviewTradeDebouncing

  const previewTradeResult = usePreviewTrade(
    skipPreviewTradeFetch,
    tradeType,
    amountSpecified,
    otherCurrency,
    inputTax,
    outputTax
  )
  const routingApiTradeResult = useRoutingAPITrade(
    skipRoutingFetch,
    tradeType,
    amountSpecified,
    otherCurrency,
    routerPreferenceOverride ?? routerPreference,
    account,
    inputTax,
    outputTax
  )
console.log('===TRADEX', previewTradeResult)
  return previewTradeResult.currentTrade && !routingApiTradeResult.currentTrade
    ? previewTradeResult
    : routingApiTradeResult
}
