import { ChainId } from '@eb-pancakeswap/chains'
import { WETH9 } from '@eb-pancakeswap/sdk'

import { USDC, USDT } from './common'

export const ethereumTokens = {
  weth: WETH9[ChainId.ETHEREUM],
  usdt: USDT[ChainId.ETHEREUM],
  usdc: USDC[ChainId.ETHEREUM]
}
