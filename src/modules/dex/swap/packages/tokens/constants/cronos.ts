import { USDC, WBTC_CRONOS } from './common'
import {ERC20Token, WCRO} from "@eb-pancakeswap/swap-sdk-evm";
import {ChainId} from "@eb-pancakeswap/sdk";

export const cronosTokens = {
  wcro: WCRO[ChainId.CRONOS],
  usdc: USDC[ChainId.CRONOS],
  wbtc: WBTC_CRONOS,
  frtn: new ERC20Token(
    ChainId.CRONOS,
    '0xaF02D78F39C0002D14b95A3bE272DA02379AfF21',
    18,
    'FRTN',
    'Fortune',
    'https://ebisusbay.com/',
  )
}
