import {ERC20Token, Percent, Token, WNATIVE, WCRO} from '@pancakeswap/sdk'
import {cronosTestnetTokens, cronosTokens, cronosZkEvmTokens, cronosZkEvmTestnetTokens, FRTN, USDC, USDT} from '@pancakeswap/tokens'
import {ChainTokenList} from './types'
import {ChainId} from "@pancakeswap/chains";

export {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
  V2_ROUTER_ADDRESS,
} from '@pancakeswap/smart-router'

export const CHAIN_REFRESH_TIME = {
  [ChainId.ETHEREUM]: 12_000,
  [ChainId.CRONOS]: 6_000,
  [ChainId.CRONOS_TESTNET]: 6_000,
  [ChainId.CRONOS_ZKEVM]: 6_000,
  [ChainId.CRONOS_ZKEVM_TESTNET]: 6_000,
}// as const satisfies Record<ChainId, number>

// used for display in the default list when adding liquidity
// @ts-ignore
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM]],
  [ChainId.CRONOS]: [cronosTokens.usdc, cronosTokens.frtn, cronosTokens.wcro],
  [ChainId.CRONOS_TESTNET]: [
    cronosTestnetTokens.frtn,
    cronosTestnetTokens.wcro,
    cronosTestnetTokens.red,
    cronosTestnetTokens.blue
  ],
  [ChainId.CRONOS_ZKEVM]: [
    cronosZkEvmTokens.wcro,
    cronosZkEvmTokens.usdc,
  ],
  [ChainId.CRONOS_ZKEVM_TESTNET]: [
    cronosZkEvmTestnetTokens.wcro,
    cronosZkEvmTestnetTokens.usdc,
    cronosZkEvmTestnetTokens.red,
    cronosZkEvmTestnetTokens.blue,
    cronosZkEvmTestnetTokens.frtn,
  ]
}

// used to construct the list of all pairs we consider by default in the frontend
// @ts-ignore
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  [ChainId.CRONOS]: [cronosTokens.usdc, cronosTokens.frtn, cronosTokens.wcro],
  [ChainId.CRONOS_TESTNET]: [cronosTestnetTokens.frtn, cronosTestnetTokens.wcro],
  [ChainId.CRONOS_ZKEVM]: [cronosZkEvmTokens.usdc, cronosZkEvmTokens.wcro],
  [ChainId.CRONOS_ZKEVM_TESTNET]: [
    cronosZkEvmTestnetTokens.wcro,
    cronosZkEvmTestnetTokens.usdc,
    cronosZkEvmTestnetTokens.red,
    cronosZkEvmTestnetTokens.blue,
    cronosZkEvmTestnetTokens.frtn,
  ],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.ETHEREUM]: [
    [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]],
    [WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  ],
  [ChainId.CRONOS]: [
    [FRTN[ChainId.CRONOS], USDC[ChainId.CRONOS]],
    [FRTN[ChainId.CRONOS], WCRO[ChainId.CRONOS]],
    [USDC[ChainId.CRONOS], WCRO[ChainId.CRONOS]],
  ],
  [ChainId.CRONOS_TESTNET]: [
    [cronosZkEvmTestnetTokens.wcro, cronosZkEvmTestnetTokens.usdc]
  ],
}

export const BIG_INT_ZERO = 0n
export const BIG_INT_TEN = 10n

// one basis point
export const BIPS_BASE = 10000n
export const ONE_BIPS = new Percent(1n, BIPS_BASE)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(100n, BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(300n, BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(500n, BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(1000n, BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(1500n, BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_CRO: bigint = BIG_INT_TEN ** 15n // .001 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50n, BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(30n, BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

// BNB
export const DEFAULT_INPUT_CURRENCY = 'CRO'
// CAKE
export const DEFAULT_OUTPUT_CURRENCY = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'

// Handler string is passed to Gelato to use PCS router
export const GELATO_HANDLER = 'pancakeswap'
export const GENERIC_GAS_LIMIT_ORDER_EXECUTION = 500000n

export const LIMIT_ORDERS_DOCS_URL = 'https://docs.pancakeswap.finance/products/pancakeswap-exchange/limit-orders'

export const EXCHANGE_PAGE_PATHS = ['/dex/swap', '/limit-orders', '/dex/liquidity', '/add', '/find', '/remove', '/stable', '/v2']
