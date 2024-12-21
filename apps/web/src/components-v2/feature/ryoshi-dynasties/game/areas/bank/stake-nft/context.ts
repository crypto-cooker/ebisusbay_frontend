import { createContext } from 'react';
import { StakedToken } from '@src/core/services/api-service/graph/types';
import { NextSlot, PendingNft } from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/types';

export interface StakedItems {
  all: StakedToken[];
  common: StakedToken[];
  mit?: StakedToken;
}

export interface PendingItems {
  all: PendingNft[];
  common: PendingNft[];
  mit?: PendingNft;
}

export interface BankStakeNftContextProps {
  onNftsStaked: (nfts: PendingNft[]) => void;
  nextSlot?: NextSlot;
  selectedChainId: number;
  collections: any[];
  stakedItems: StakedItems;
  pendingItems: PendingItems;
  setPendingItems: (nfts: PendingNft[]) => void;
}

export const BankStakeNftContext = createContext<BankStakeNftContextProps | null>(null);