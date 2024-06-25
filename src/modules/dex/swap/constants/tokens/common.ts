import {ChainId} from "@dex/swap/constants/chainId";
import { ERC20Token } from 'pancakeswap/sdk'
import {USDC_ETH, USDT_ETH} from "@pancakeswap/tokens";

export const USDC_CRONOS = new ERC20Token(
  ChainId.CRONOS,
  '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
  6,
  'USDC',
  'USD Coin',
)

export const USDC_TESTNET = new ERC20Token(
  ChainId.CRONOS_TESTNET,
  '0x64544969ed7EBf5f083679233325356EbE738930',
  18,
  'USDC',
  'Binance-Peg USD Coin',
  'https://www.centre.io/usdc',
)

export const USDT_CRONOS = new ERC20Token(
  ChainId.CRONOS,
  '0x66e428c3f67a68878562e79A0234c1F83c208770',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const USDC = {
  [ChainId.ETHEREUM]: USDC_ETH,
  [ChainId.CRONOS]: USDC_CRONOS,
  [ChainId.CRONOS_TESTNET]: USDC_TESTNET,
}

export const USDT = {
  [ChainId.ETHEREUM]: USDT_ETH,
  [ChainId.CRONOS]: USDT_CRONOS,
}

export const WBTC_CRONOS = new ERC20Token(
  ChainId.CRONOS,
  '0x062E66477Faf219F25D27dCED647BF57C3107d52',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const STABLE_COIN = {
  [ChainId.ETHEREUM]: USDT[ChainId.ETHEREUM],
  [ChainId.CRONOS]: USDT[ChainId.CRONOS],
  [ChainId.CRONOS_TESTNET]: USDC_TESTNET,
} satisfies Record<ChainId, ERC20Token>
