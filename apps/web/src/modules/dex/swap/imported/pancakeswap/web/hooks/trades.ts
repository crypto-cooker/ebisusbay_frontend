/* eslint-disable no-param-reassign */
import { Currency, CurrencyAmount, Token, TradeType } from '@pancakeswap/swap-sdk-core'
import {isTradeBetter, Pair, Trade} from '@pancakeswap/sdk'
import flatMap from 'lodash/flatMap'
import { useMemo } from 'react'
import {BETTER_TRADE_LESS_HOPS_THRESHOLD} from '@dex/swap/constants/exchange'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { PairState, useV2Pairs } from './usePairs'

// import { useUnsupportedTokens, useWarningTokens } from './tokens'
import { useActiveChainId } from './useActiveChainId'
import { useUserSingleHopOnly } from '@pancakeswap/utils/user'
import {ChainId} from "@pancakeswap/sdk";
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES
} from "@pancakeswap/smart-router";
// import {ChainId} from "@dex/swap/constants/chainId";
// import {Pair} from "@dex/swap/overrides/pancakeswap/pair";

// export function useAllCurrencyCombinations(currencyA?: Currency, currencyB?: Currency): [Token, Token][] {
//   const chainId = currencyA?.chainId
//
//   const [tokenA, tokenB] = chainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined]
//
//   const bases: Token[] = useMemo(() => {
//     if (!chainId || chainId !== tokenB?.chainId) return []
//
//     const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []
//     const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
//     const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []
//
//     return [...common, ...additionalA, ...additionalB]
//   }, [chainId, tokenA, tokenB])
//
//   const basePairs: [Token, Token][] = useMemo(
//     () =>
//       bases
//         .flatMap((base): [Token, Token][] => bases.map((otherBase) => [base, otherBase]))
//         // though redundant with the first filter below, that expression runs more often, so this is probably worthwhile
//         .filter(([t0, t1]) => !t0.equals(t1)),
//     [bases],
//   )
//
//   return useMemo(
//     () =>
//       tokenA && tokenB
//         ? [
//           // the direct pair
//           [tokenA, tokenB] as [Token, Token],
//           // token A against all bases
//           ...bases.map((base): [Token, Token] => [tokenA, base]),
//           // token B against all bases
//           ...bases.map((base): [Token, Token] => [tokenB, base]),
//           // each base against all bases
//           ...basePairs,
//         ]
//           // filter out invalid pairs comprised of the same asset (e.g. WETH<>WETH)
//           .filter(([t0, t1]) => !t0.equals(t1))
//           // filter out duplicate pairs
//           .filter(([t0, t1], i, otherPairs) => {
//             // find the first index in the array at which there are the same 2 tokens as the current
//             const firstIndexInOtherPairs = otherPairs.findIndex(([t0Other, t1Other]) => {
//               return (t0.equals(t0Other) && t1.equals(t1Other)) || (t0.equals(t1Other) && t1.equals(t0Other))
//             })
//             // only accept the first occurrence of the same 2 tokens
//             return firstIndexInOtherPairs === i
//           })
//           // optionally filter out some pairs for tokens with custom bases defined
//           .filter(([tA, tB]) => {
//             if (!chainId) return true
//             const customBases = CUSTOM_BASES[chainId]
//
//             const customBasesA: Token[] | undefined = customBases?.[tA.address]
//             const customBasesB: Token[] | undefined = customBases?.[tB.address]
//
//             if (!customBasesA && !customBasesB) return true
//
//             if (customBasesA && !customBasesA.find((base) => tB.equals(base))) return false
//             if (customBasesB && !customBasesB.find((base) => tA.equals(base))) return false
//
//             return true
//           })
//         : [],
//     [tokenA, tokenB, bases, basePairs, chainId],
//   )
// }

export function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Pair[] {
  const { chainId } = useActiveChainId()

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined]

  const bases: Token[] = useMemo(() => {
    if (!chainId) return []

    if (!Object.values(ChainId).includes(chainId)) return [];

    const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []
    const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
    const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []

    return [...common, ...additionalA, ...additionalB]
  }, [chainId, tokenA, tokenB])

  const basePairs: [Token, Token][] = useMemo(
    () => flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase])),
    [bases],
  )

  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
          // the direct pair
          [tokenA, tokenB],
          // token A against all bases
          ...bases.map((base): [Token, Token] => [tokenA, base]),
          // token B against all bases
          ...bases.map((base): [Token, Token] => [tokenB, base]),
          // each base against all bases
          ...basePairs,
        ]
          .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
          .filter(([t0, t1]) => t0.address !== t1.address)
          .filter(([tokenA_, tokenB_]) => {
            if (!chainId) return true
            const customBases = CUSTOM_BASES[chainId]

            const customBasesA: Token[] | undefined = customBases?.[tokenA_.address]
            const customBasesB: Token[] | undefined = customBases?.[tokenB_.address]

            if (!customBasesA && !customBasesB) return true

            if (customBasesA && !customBasesA.find((base) => tokenB_.equals(base))) return false
            if (customBasesB && !customBasesB.find((base) => tokenA_.equals(base))) return false

            return true
          })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId],
  )

  const allPairs = useV2Pairs(allPairCombinations)

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      Object.values(
        allPairs
          // filter out invalid pairs
          .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
          // filter out duplicated pairs
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
            return memo
          }, {}),
      ),
    [allPairs],
  )
}

const MAX_HOPS = 3

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(
  currencyAmountIn?: CurrencyAmount<Currency>,
  currencyOut?: Currency,
): Trade<Currency, Currency, TradeType> | null {
  const allowedPairs = useAllCommonPairs(currencyAmountIn?.currency, currencyOut)

  const [singleHopOnly] = useUserSingleHopOnly()

  return useMemo(() => {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
      if (singleHopOnly) {
        return (
          Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: 1, maxNumResults: 1 })[0] ??
          null
        )
      }
      // search through trades with varying hops, find best trade out of them
      let bestTradeSoFar: Trade<Currency, Currency, TradeType> | null = null
      for (let i = 1; i <= MAX_HOPS; i++) {
        const currentTrade: Trade<Currency, Currency, TradeType> | null =
          Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: i, maxNumResults: 1 })[0] ??
          null
        // if current trade is best yet, save it
        if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
          bestTradeSoFar = currentTrade
        }
      }
      return bestTradeSoFar
    }

    return null
  }, [allowedPairs, currencyAmountIn, currencyOut, singleHopOnly])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount<Currency>,
): Trade<Currency, Currency, TradeType> | null {
  const allowedPairs = useAllCommonPairs(currencyIn, currencyAmountOut?.currency)

  const [singleHopOnly] = useUserSingleHopOnly()

  return useMemo(() => {
    if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
      if (singleHopOnly) {
        return (
          Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, { maxHops: 1, maxNumResults: 1 })[0] ??
          null
        )
      }
      // search through trades with varying hops, find best trade out of them
      let bestTradeSoFar: Trade<Currency, Currency, TradeType> | null = null
      for (let i = 1; i <= MAX_HOPS; i++) {
        const currentTrade =
          Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, { maxHops: i, maxNumResults: 1 })[0] ??
          null
        if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
          bestTradeSoFar = currentTrade
        }
      }
      return bestTradeSoFar
    }
    return null
  }, [currencyIn, currencyAmountOut, allowedPairs, singleHopOnly])
}
//
// export function useIsTransactionUnsupported(currencyIn?: Currency | null, currencyOut?: Currency | null): boolean {
//   const unsupportedTokens: { [address: string]: Token } = useUnsupportedTokens()
//   const { chainId } = useActiveChainId()
//
//   const tokenIn = wrappedCurrency(currencyIn, chainId)
//   const tokenOut = wrappedCurrency(currencyOut, chainId)
//
//   // if unsupported list loaded & either token on list, mark as unsupported
//   if (unsupportedTokens) {
//     if (tokenIn && Object.keys(unsupportedTokens).includes(tokenIn.address)) {
//       return true
//     }
//     if (tokenOut && Object.keys(unsupportedTokens).includes(tokenOut.address)) {
//       return true
//     }
//   }
//
//   return false
// }
//
// export function useIsTransactionWarning(currencyIn?: Currency, currencyOut?: Currency): boolean {
//   const warningTokens: { [address: string]: Token } = useWarningTokens()
//   const { chainId } = useActiveChainId()
//
//   const tokenIn = wrappedCurrency(currencyIn, chainId)
//   const tokenOut = wrappedCurrency(currencyOut, chainId)
//
//   if (warningTokens) {
//     if (tokenIn && Object.keys(warningTokens).includes(tokenIn.address)) {
//       return true
//     }
//     if (tokenOut && Object.keys(warningTokens).includes(tokenOut.address)) {
//       return true
//     }
//   }
//
//   return false
// }
