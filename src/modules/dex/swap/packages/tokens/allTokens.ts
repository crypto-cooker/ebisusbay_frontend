import { ChainId } from '@eb-pancakeswap/chains'

import { cronosTokens } from './constants/cronos'
import { cronosTestnetTokens } from './constants/cronosTestnet'
import { ethereumTokens } from './constants/eth'

export const allTokens = {
  [ChainId.ETHEREUM]: ethereumTokens,
  [ChainId.CRONOS]: cronosTokens,
  [ChainId.CRONOS_TESTNET]: cronosTestnetTokens,
}
