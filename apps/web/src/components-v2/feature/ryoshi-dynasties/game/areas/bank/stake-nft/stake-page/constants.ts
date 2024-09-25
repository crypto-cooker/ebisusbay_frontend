export const queryKeys = {
  bankStakedNfts: (walletAddress: string) => ['BankStakedNfts', walletAddress],
  bankUnstakedNfts: (walletAddress: string, collectionAddress: string) => ['BankUnstakedNfts', walletAddress, collectionAddress],
};