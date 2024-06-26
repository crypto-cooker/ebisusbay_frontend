import {Currency, CurrencyAmount, Pair, pancakePairV2ABI} from '@eb-pancakeswap/sdk'
import { useMemo } from 'react'

import { wrappedCurrency } from '@eb-pancakeswap-web/utils/wrappedCurrency'
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId'
import {useGetPairs} from "@eb-pancakeswap-web/hooks/useGetPairs";
import {parseUnits} from "ethers/lib/utils";

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useV2Pairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveChainId()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        try {
          return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
        } catch (error: any) {
          // Debug Invariant failed related to this line
          console.error(
            error.msg,
            `- pairAddresses: ${tokenA?.address}-${tokenB?.address}`,
            `chainId: ${tokenA?.chainId}`,
          )

          return undefined
        }
      })
        .filter((item): item is `0x${string}` => item !== undefined),
    [tokens],
  )

  console.log('useV2Pairs0', tokens, pairAddresses);

  const { loading, error, data: results } = useGetPairs(pairAddresses);
  console.log('useV2Pairs1', results);
  // const results = useMultipleContractSingleData({
  //   addresses: pairAddresses,
  //   abi: PairAbi,
  //   functionName: 'getReserves',
  // })
  // console.log('useV2Pairs2', data);

  return useMemo(() => {
    return results.map((result, i) => {
      const tokenA = tokens.flatMap(token => token).find(token => token?.address.toLowerCase() === result.token0.id.toLowerCase());
      const tokenB = tokens.flatMap(token => token).find(token => token?.address.toLowerCase() === result.token1.id.toLowerCase());

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      if (!result.reserve0 || !result.reserve1) return [PairState.NOT_EXISTS, null]
      console.log('useV2Pairs2',
        token0.symbol,
        parseUnits(result.reserve0, token0.decimals).toString(),
        token1.symbol,
        parseUnits(result.reserve1, token1.decimals).toString()
      );
      return [
        PairState.EXISTS,
        new Pair(
          CurrencyAmount.fromRawAmount(token0, parseUnits(result.reserve0, token0.decimals).toString()),
          CurrencyAmount.fromRawAmount(token1, parseUnits(result.reserve1, token1.decimals).toString()),
        ),
      ]
    })
  }, [results, tokens])
}

export function useV2Pair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const pairCurrencies = useMemo<[Currency | undefined, Currency | undefined][]>(
    () => [[tokenA, tokenB]],
    [tokenA, tokenB],
  )
  return useV2Pairs(pairCurrencies)[0]
}