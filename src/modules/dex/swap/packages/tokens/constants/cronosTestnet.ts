import {USDC_TESTNET} from "@eb-pancakeswap/tokens";
import {ERC20Token, WCRO} from "@eb-pancakeswap/swap-sdk-evm";
import {ChainId} from "@eb-pancakeswap/chains";

export const cronosTestnetTokens = {
  wcro: WCRO[ChainId.CRONOS_TESTNET],
  // usdc: USDC_TESTNET,
  frtn: new ERC20Token(
    ChainId.CRONOS_TESTNET,
    '0x119adb5E05e85d55690BC4Da7b37c06BfEcF2071',
    18,
    'FRTN',
    'Fortune',
    'https://ebisusbay.com/',
  )
}
