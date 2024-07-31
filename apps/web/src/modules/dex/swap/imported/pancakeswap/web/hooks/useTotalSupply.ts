import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useTokenContract } from '@eb-pancakeswap-web/hooks/useContract'
import {useConfig, useReadContract} from "wagmi";

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Currency): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token?.isToken ? token.address : undefined)

  const result = contract && contract.abi && contract.address ? useReadContract({
    abi: contract.abi,
    address: contract.address,
    functionName: 'totalSupply',
  }) : undefined;

  const totalSupplyStr: string | undefined = result?.data?.toString();

  return useMemo(
    () => (token?.isToken && totalSupplyStr ? CurrencyAmount.fromRawAmount(token, totalSupplyStr) : undefined),
    [token, totalSupplyStr],
  )
}

export default useTotalSupply
