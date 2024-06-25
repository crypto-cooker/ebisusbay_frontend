import { ChainId } from "@dex/swap/constants/chainId";
import { Currency, CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import {Native} from "@pancakeswap/swap-sdk-evm";
import {WNATIVE} from "@dex/swap/constants/tokens/native";

export function wrappedCurrency(
  currency: Currency | undefined | null,
  chainId: ChainId | undefined,
): Token | undefined {
  return chainId && currency?.isNative ? WNATIVE[chainId] : currency?.isToken ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount<Currency> | undefined,
  chainId: ChainId | undefined,
): CurrencyAmount<Token> | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? CurrencyAmount.fromRawAmount(token, currencyAmount.quotient) : undefined
}

export function unwrappedToken(token?: Token): Currency | undefined {
  if (token && token.equals(WNATIVE[token.chainId as keyof typeof WNATIVE])) return Native.onChain(token.chainId)
  return token
}

