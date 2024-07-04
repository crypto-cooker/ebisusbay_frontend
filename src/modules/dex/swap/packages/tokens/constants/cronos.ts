import {FRTN_MAINNET, USDC, WBTC_CRONOS} from './common'
import {ERC20Token, WCRO} from "@eb-pancakeswap/swap-sdk-evm";
import {ChainId} from "@eb-pancakeswap/sdk";

export const cronosTokens = {
  wcro: WCRO[ChainId.CRONOS],
  usdc: USDC[ChainId.CRONOS],
  wbtc: WBTC_CRONOS,
  frtn: FRTN_MAINNET
}
