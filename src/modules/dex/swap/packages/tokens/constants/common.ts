import { ChainId } from '@eb-pancakeswap/chains'
import { ERC20Token } from '@eb-pancakeswap/sdk'

export const FRTN_MAINNET = new ERC20Token(
  ChainId.CRONOS,
  '0xaF02D78F39C0002D14b95A3bE272DA02379AfF21',
  18,
  'FRTN',
  'Fortune',
  'https://ebisusbay.com/',
)

export const FRTN_TESTNET = new ERC20Token(
  ChainId.CRONOS_TESTNET,
  '0x119adb5E05e85d55690BC4Da7b37c06BfEcF2071',
  18,
  'FRTN',
  'Fortune',
  'https://ebisusbay.com/',
)

export const USDC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD Coin',
)

export const USDC_CRONOS = new ERC20Token(
  ChainId.CRONOS,
  '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
  6,
  'USDC',
  'USD Coin',
)

export const USDC_TESTNET = new ERC20Token(
  ChainId.CRONOS_TESTNET,
  '0x1E1d0765439d0d53ee40CC4fB454C2343c84342b',
  18,
  'USDC',
  'USD Coin Testnet'
)

export const USDT_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/',
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

export const FRTN = {
  [ChainId.ETHEREUM]: USDT_ETH,
  [ChainId.CRONOS]: FRTN_MAINNET,
  [ChainId.CRONOS_TESTNET]: FRTN_TESTNET
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
