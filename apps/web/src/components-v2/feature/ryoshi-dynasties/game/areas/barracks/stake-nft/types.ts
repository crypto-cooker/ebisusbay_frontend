import WalletNft from "@src/core/models/wallet-nft";

export interface PendingNft {
  nft: WalletNft;
  stake: {
    multiplier: number;
    bonusTroops: number;
    isAlreadyStaked: boolean;
    isActive: boolean;
    refBalance: number;
  }
  chainId: number;
}

export interface NextSlot {
  index: number;
  cost: {
    frtn: number;
    koban: number;
  }
}