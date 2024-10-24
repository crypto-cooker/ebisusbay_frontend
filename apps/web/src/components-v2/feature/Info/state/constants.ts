import { ChainId } from "@pancakeswap/chains"

export const ITEMS_PER_INFO_TABLE_PAGE = 10

export const chainPaths:Record<number, string> = {
  [ChainId.CRONOS]: '',
  [ChainId.CRONOS_TESTNET]: '/cro-test',
  [ChainId.CRONOS_ZKEVM]: '/cro-zkevm',
  [ChainId.CRONOS_ZKEVM_TESTNET]: '/cro-zkevm-test'
}

export const chainIdByChainPath = (chainName: string): number => {
  switch(chainName){
    case 'cro-test':
      return ChainId.CRONOS_TESTNET;
    case 'cro-zkevm':
      return ChainId.CRONOS_ZKEVM;
    case 'cro-zkevm-test':
      return ChainId.CRONOS_ZKEVM_TESTNET;
    default:
      return ChainId.CRONOS;
  }
}