import { ChainId } from '@pancakeswap/chains';

export const ITEMS_PER_INFO_TABLE_PAGE = 10;

export const chainPaths: Record<number, string> = {
  [ChainId.CRONOS]: '/cronos',
  [ChainId.CRONOS_TESTNET]: '/cronos-testnet',
  [ChainId.CRONOS_ZKEVM]: '/cronos-zkevm',
  [ChainId.CRONOS_ZKEVM_TESTNET]: '/cronos-zkevm-testnet',
};

export const chainIdByChainPath = (chainName: string): number => {
  switch (chainName) {
    case 'cronos-testnet':
      return ChainId.CRONOS_TESTNET;
    case 'cronos-zkevm':
      return ChainId.CRONOS_ZKEVM;
    case 'cronos-zkevm-testnet':
      return ChainId.CRONOS_ZKEVM_TESTNET;
    default:
      return ChainId.CRONOS;
  }
};

export const chainQueryName = {
  [ChainId.CRONOS]: 'cronos',
  [ChainId.CRONOS_TESTNET]: 'cronos-testnet',
  [ChainId.CRONOS_ZKEVM]: 'cronos-zkevm',
  [ChainId.CRONOS_ZKEVM_TESTNET]: 'cronos-zkevm-testnet',
}

export const WEEKS_IN_YEAR = 52.1429;
export const DAYS_IN_YEAR = 365;
export const TOTAL_FEE = 0.001;
export const LP_HOLDERS_FEE = 0.0017;
export const ONE_HOUR_SECONDS = 3600
