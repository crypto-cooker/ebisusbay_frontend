import {ChainId} from "@dex/swap/constants/chainId";
import {ERC20Token} from "@pancakeswap/swap-sdk-evm";
import {ChainMap, ChainTokenList} from "@dex/swap/constants/types";
import {USDC} from "@dex/swap/constants/tokens/common";
import {USDT, WBTC_ETH} from "@pancakeswap/tokens";
import {Token} from "@pancakeswap/sdk";
import {cronosTokens} from "@dex/swap/constants/tokens/cronos";
import {WNATIVE} from "@dex/swap/constants/tokens/native";
import {Address, Hash} from "viem";

export const FACTORY_ADDRESS = '0x5f1D751F447236f486F4268b883782897A902379'

const FACTORY_ADDRESS_ETH = '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362'

export const FACTORY_ADDRESS_MAP = {
  [ChainId.ETHEREUM]: FACTORY_ADDRESS_ETH,
  [ChainId.CRONOS]: FACTORY_ADDRESS,
  [ChainId.CRONOS_TESTNET]: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
} as const satisfies Record<ChainId, Address>

export const INIT_CODE_HASH = '0x347deace88ba101bfe81fb4a9b4306e0a67b3d6d354f8da19b7ed90cee4b7016'

const INIT_CODE_HASH_ETH = '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d'
export const INIT_CODE_HASH_MAP = {
  [ChainId.ETHEREUM]: INIT_CODE_HASH_ETH,
  [ChainId.CRONOS]: INIT_CODE_HASH,
  [ChainId.CRONOS_TESTNET]: INIT_CODE_HASH,
} as const satisfies Record<ChainId, Hash>

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
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
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
