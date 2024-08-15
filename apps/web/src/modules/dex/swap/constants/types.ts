import {ChainId} from "@pancakeswap/chains";
import { Currency, CurrencyAmount, ERC20Token, Percent, Price, Token, Trade, TradeType } from '@pancakeswap/sdk'

export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>

export type V2TradeAndStableSwap = Trade<Currency, Currency, TradeType> | StableTrade | undefined

export interface StableTrade {
  tradeType: TradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  executionPrice: Price<Currency, Currency>
  priceImpact: null
  maximumAmountIn: (slippaged: Percent) => CurrencyAmount<Currency>
  minimumAmountOut: (slippaged: Percent) => CurrencyAmount<Currency>
}