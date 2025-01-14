import { SupportedChainId } from '@src/config/chains';

export const queryKeys = {
  bankUserAccount: (walletAddress?: string, tab?: SupportedChainId, currentVaultType?: string) =>
    ['UserStakeAccount', walletAddress, tab, currentVaultType].filter(Boolean),

  bankUserVaultBoosts: (walletAddress?: string) =>
    ['UserVaultBoosts', walletAddress].filter(Boolean),
};
