import { Interface } from '@ethersproject/abi'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { useMemo } from 'react'

import { nativeOnChain } from '@dex/imported/constants/tokens'
import {useAccount} from "wagmi";
import {isAddress} from "@market/helpers/utils";
import {useMultipleContractSingleData} from "@dex/imported/hooks/multicall";
import {erc20Abi} from "viem";

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useNativeCurrencyBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount<Currency> | undefined
} {
  const { chain } = useAccount()
  // const multicallContract = useInterfaceMulticall()

  const validAddressInputs: [string][] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
            .map((addr) => [addr])
        : [],
    [uncheckedAddresses]
  )

  // const results = useSingleContractMultipleData(multicallContract, 'getEthBalance', validAddressInputs)
  const results: any = null;

  return useMemo(
    () =>
      validAddressInputs.reduce<{ [address: string]: CurrencyAmount<Currency> }>((memo, [address], i) => {
        const value = results?.[i]?.result?.[0]
        if (value && chain?.id)
          memo[address] = CurrencyAmount.fromRawAmount(nativeOnChain(chain?.id), JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [validAddressInputs, chain?.id, results]
  )
}

const ERC20Interface = new Interface(erc20Abi)
const tokenBalancesGasRequirement = { gasRequired: 185_000 }

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const { chain } = useAccount() // we cannot fetch balances cross-chain
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false && t?.chainId === chain?.id) ?? [],
    [chain?.id, tokens]
  )
  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20Interface,
    'balanceOf',
    useMemo(() => [address], [address]),
    tokenBalancesGasRequirement
  )

  const anyLoading: boolean = useMemo(() => balances.some((callState: any) => callState.loading), [balances])

  return useMemo(
    () => [
      address && validatedTokens.length > 0
        ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, token, i) => {
            const value = balances?.[i]?.result?.[0]
            const amount = value ? JSBI.BigInt(value.toString()) : undefined
            if (amount) {
              memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
            }
            return memo
          }, {})
        : {},
      anyLoading,
    ],
    [address, validatedTokens, anyLoading, balances]
  )
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(
    account,
    useMemo(() => [token], [token])
  )
  if (!token) return undefined
  return tokenBalances[token.address]
}

/**
 * Returns balances for tokens on currently-connected chainId via RPC.
 * See useTokenBalancesQuery for multichain portfolio balances via GQL.
 */
export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken ?? false) ?? [],
    [currencies]
  )

  const { chain } = useAccount()
  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies])
  const ethBalance = useNativeCurrencyBalances(useMemo(() => (containsETH ? [account] : []), [containsETH, account]))

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency || currency.chainId !== chain?.id) return undefined
        if (currency.isToken) return tokenBalances[currency.address]
        if (currency.isNative) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, chain?.id, currencies, ethBalance, tokenBalances]
  )
}

export default function useCurrencyBalance(
  account?: string,
  currency?: Currency
): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(
    account,
    useMemo(() => [currency], [currency])
  )[0]
}
