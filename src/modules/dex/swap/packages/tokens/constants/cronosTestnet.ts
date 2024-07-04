// import {FRTN_TESTNET, USDC_TESTNET} from "@eb-pancakeswap/tokens";
import {WCRO} from "@eb-pancakeswap/swap-sdk-evm";
import {ChainId} from "@eb-pancakeswap/chains";

export const cronosTestnetTokens = {
  wcro: WCRO[ChainId.CRONOS_TESTNET],
  // usdc: USDC_TESTNET,
  // frtn: FRTN_TESTNET
}
