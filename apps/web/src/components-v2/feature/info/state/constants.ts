import { ChainId } from '@pancakeswap/chains';
import chainConfigs from '@src/config/chains';

export const ITEMS_PER_INFO_TABLE_PAGE = 10;

export const chainPaths: Record<number, string> = {
  [ChainId.CRONOS]: `/${chainConfigs[ChainId.CRONOS].slug}`,
  [ChainId.CRONOS_TESTNET]: `/${chainConfigs[ChainId.CRONOS_TESTNET].slug}`,
  [ChainId.CRONOS_ZKEVM]: `/${chainConfigs[ChainId.CRONOS_ZKEVM].slug}`,
  [ChainId.CRONOS_ZKEVM_TESTNET]: `/${chainConfigs[ChainId.CRONOS_ZKEVM_TESTNET].slug}`,
};

export const chainIdByChainPath = (chainName: string): number => {
  switch (chainName) {
    case chainConfigs[ChainId.CRONOS_TESTNET].slug:
      return ChainId.CRONOS_TESTNET;
    case chainConfigs[ChainId.CRONOS_ZKEVM].slug:
      return ChainId.CRONOS_ZKEVM;
    case chainConfigs[ChainId.CRONOS_ZKEVM_TESTNET].slug:
      return ChainId.CRONOS_ZKEVM_TESTNET;
    default:
      return ChainId.CRONOS;
  }
};

export const WEEKS_IN_YEAR = 52.1429;
export const DAYS_IN_YEAR = 365;
export const TOTAL_FEE = 0.001;
export const LP_HOLDERS_FEE = 0.0017;
export const ONE_HOUR_SECONDS = 3600
export const MINIMUM_SEARCH_CHARACTERS = 2;