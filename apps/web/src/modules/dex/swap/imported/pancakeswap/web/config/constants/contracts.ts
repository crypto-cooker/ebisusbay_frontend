import { ChainId } from '@pancakeswap/chains'

export default {
  multiCall: {
    [ChainId.ETHEREUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.CRONOS]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.CRONOS_TESTNET]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.CRONOS_ZKEVM_TESTNET]: '0xA44d020A117C14645E3686Db0e539657236c289F',
  }
} as const satisfies Record<string, Record<number, `0x${string}`>>
