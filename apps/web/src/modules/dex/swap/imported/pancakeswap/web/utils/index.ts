import memoize from 'lodash/memoize'
import { Address, getAddress } from 'viem'
import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/sdk'
import { TokenAddressMap } from '@pancakeswap/token-lists'

export const safeGetAddress = memoize((value: any): Address | undefined => {
  try {
    let value_ = value
    if (typeof value === 'string' && !value.startsWith('0x')) {
      value_ = `0x${value}`
    }
    return getAddress(value_)
  } catch {
    return undefined
  }
})

export function calculateGasMargin(value: bigint, margin = 1000n): bigint {
  return (value * (10000n + margin)) / 10000n
}

export function isTokenOnList(defaultTokens: TokenAddressMap<ChainId>, currency?: Currency): boolean {
  if (currency?.isNative) return true
  return Boolean(currency?.isToken && defaultTokens[currency.chainId as ChainId]?.[currency.address])
}