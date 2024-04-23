import { ChainId, Currency, NativeCurrency, Token, UNI_ADDRESSES, WETH9 } from '@uniswap/sdk-core'

export enum SwapTab {
  Swap = 'swap',
  Limit = 'limit',
  Send = 'send',
}

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}