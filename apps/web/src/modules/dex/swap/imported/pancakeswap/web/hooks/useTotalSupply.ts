import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import {useTokenContract, useTokenContractByChainId} from '@eb-pancakeswap-web/hooks/useContract'
import {useConfig, useReadContract} from "wagmi";

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Currency, chainId?: number): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token?.isToken ? token.address : undefined, chainId);

  const shouldReadContract = !!(contract && contract.abi && contract.address);
  const result = useReadContract({
    abi: contract?.abi,
    address: contract?.address,
    functionName: 'totalSupply',
    query: {
      enabled: shouldReadContract
    }
  });

  const totalSupplyStr: string | undefined = result?.data?.toString();

  return useMemo(
    () => (token?.isToken && totalSupplyStr ? CurrencyAmount.fromRawAmount(token, totalSupplyStr) : undefined),
    [token, totalSupplyStr],
  );
}

export default useTotalSupply
