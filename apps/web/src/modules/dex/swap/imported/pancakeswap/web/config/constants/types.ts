import { Currency, CurrencyAmount, ERC20Token, Percent, Price, Token, Trade, TradeType } from '@pancakeswap/sdk'
import { LegacyTradeWithStableSwap as TradeWithStableSwap } from '@pancakeswap/smart-router/legacy-router'

export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type TeamImages = {
  alt: string
} & Images

export type Team = {
  id: number
  name: string
  description: string
  isJoinable?: boolean
  users: number
  points: number
  images: TeamImages
  background: string
  textColor: string
}

export type PageMeta = {
  title: string
  description?: string
  image?: string
}

export const FetchStatus = {
  Idle: 'idle',
  Fetching: 'pending',
  Fetched: 'success',
  Failed: 'error',
} as const

export type TFetchStatus = (typeof FetchStatus)[keyof typeof FetchStatus]

export const isStableSwap = (trade: ITrade): trade is StableTrade => {
  return (
    Boolean((trade as StableTrade)?.maximumAmountIn) &&
    !(trade as Trade<Currency, Currency, TradeType> | TradeWithStableSwap<Currency, Currency, TradeType>)?.route
  )
}

export type ITrade =
  | Trade<Currency, Currency, TradeType>
  | StableTrade
  | TradeWithStableSwap<Currency, Currency, TradeType>
  | undefined

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

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

export type UnsafeCurrency = Currency | ERC20Token | null | undefined
