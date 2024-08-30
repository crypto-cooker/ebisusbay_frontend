import {ChainId} from "@pancakeswap/chains";

export function isOffersEnabledForChain(chainId: number) {
  return chainId && [ChainId.CRONOS, ChainId.CRONOS_TESTNET].includes(chainId);
}