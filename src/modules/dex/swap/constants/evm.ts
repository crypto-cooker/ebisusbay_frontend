import {ChainMap, ChainTokenList} from "@dex/swap/constants/types";
import {cronosTokens, USDC, USDT} from "@pancakeswap/tokens";
import {ChainId, Token, WNATIVE} from "@pancakeswap/sdk";

export const SMART_ROUTER_ADDRESSES = {
  [ChainId.ETHEREUM]: '',
  [ChainId.CRONOS]: '0xa476c97D8d1ec7D263EAfa0039645DBe0cc0a012',
  [ChainId.CRONOS_TESTNET]: '',
} as const satisfies Record<ChainId, string>

export const V2_ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '',
  [ChainId.CRONOS]: '0xa476c97D8d1ec7D263EAfa0039645DBe0cc0a012',
  [ChainId.CRONOS_TESTNET]: '',
}

export const STABLE_SWAP_INFO_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '',
  [ChainId.CRONOS]: '',
  [ChainId.CRONOS_TESTNET]: '',
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  [ChainId.CRONOS]: [
    WNATIVE[ChainId.CRONOS],
    USDC[ChainId.CRONOS],
    cronosTokens.frtn
  ],
  [ChainId.CRONOS_TESTNET]: [],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {}
