// import { TradeType } from '@pancakeswap/sdk'
// import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
// import { useUserSingleHopOnly } from '@pancakeswap/utils/user'
//
// import { useCurrency } from '@eb-pancakeswap-web/hooks/tokens'
// import { useDeferredValue, useMemo } from 'react'
// import {
//   useUserSplitRouteEnable,
//   useUserStableSwapEnable,
//   useUserV2SwapEnable,
//   useUserV3SwapEnable,
// } from 'state/user/smartRouter'
// import {Field} from "@eb-pancakeswap-web/state/swap/actions";
// import {useSwapState} from "@eb-pancakeswap-web/state/swap/hooks";
// import {useBestAMMTrade} from "@eb-pancakeswap-web/hooks/useBestAMMTrade";
//
// interface Options {
//   maxHops?: number
// }
//
// export function useSwapBestTrade({ maxHops }: Options = {}) {
//   const {
//     independentField,
//     typedValue,
//     [Field.INPUT]: { currencyId: inputCurrencyId },
//     [Field.OUTPUT]: { currencyId: outputCurrencyId },
//   } = useSwapState()
//   const inputCurrency = useCurrency(inputCurrencyId)
//   const outputCurrency = useCurrency(outputCurrencyId)
//   const isExactIn = independentField === Field.INPUT
//   const independentCurrency = isExactIn ? inputCurrency : outputCurrency
//   const dependentCurrency = isExactIn ? outputCurrency : inputCurrency
//   const tradeType = isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT
//   const amount = tryParseAmount(typedValue, independentCurrency ?? undefined)
//
//   const [singleHopOnly] = useUserSingleHopOnly()
//   const [split] = useUserSplitRouteEnable()
//   const [v2Swap] = useUserV2SwapEnable()
//   const [v3Swap] = useUserV3SwapEnable()
//   const [stableSwap] = useUserStableSwapEnable()
//   // stable swap only support exact in
//   const stableSwapEnable = useMemo(() => {
//     return stableSwap && isExactIn
//   }, [stableSwap, isExactIn])
//
//   const { isLoading, trade, refresh, syncing, isStale, error } = useBestAMMTrade({
//     amount,
//     currency: dependentCurrency,
//     baseCurrency: independentCurrency,
//     tradeType,
//     maxHops: singleHopOnly ? 1 : maxHops,
//     maxSplits: split ? undefined : 0,
//     v2Swap,
//     v3Swap,
//     stableSwap: stableSwapEnable,
//     type: 'auto',
//     trackPerf: true,
//   })
//
//   return {
//     refresh,
//     syncing,
//     isStale,
//     error,
//     isLoading: useDeferredValue(Boolean(isLoading || (typedValue && !trade && !error))),
//     trade: typedValue ? trade : undefined,
//   }
// }
