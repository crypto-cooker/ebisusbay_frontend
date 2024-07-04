import { ChainId } from '@eb-pancakeswap/chains'

export default {
  multiCall: {
    [ChainId.ETHEREUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.CRONOS]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.CRONOS_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  }
} as const satisfies Record<string, Record<number, `0x${string}`>>
