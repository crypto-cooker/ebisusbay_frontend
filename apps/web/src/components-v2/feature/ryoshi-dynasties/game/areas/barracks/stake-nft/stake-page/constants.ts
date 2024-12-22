export const queryKeys = {
  barracksStakedNfts: (walletAddress: string) => ['BarracksStakedNfts', walletAddress],
  barracksUnstakedNfts: (walletAddress: string, collectionAddress: string) => ['BarracksUnstakedNfts', walletAddress, collectionAddress],
  barracksUnstakedMits: (walletAddress: string) => ['BarracksUserMits', walletAddress],
};