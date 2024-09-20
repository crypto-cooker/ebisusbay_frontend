export interface PendingNft {
  nftAddress: string;
  nftId: string;
  image: string;
  rank: number;
  multiplier: number;
  adder: number;
  troops: number;
  isAlreadyStaked: boolean;
  isActive: boolean;
  refBalance: number;
  chainId: number;
}

export interface NextSlot {
  index: number;
  cost: {
    frtn: number;
    koban: number;
  }
}