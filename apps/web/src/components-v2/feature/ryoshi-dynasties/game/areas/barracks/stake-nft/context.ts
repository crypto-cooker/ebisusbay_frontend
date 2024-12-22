import {createContext, Dispatch, SetStateAction} from "react";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {PendingNft} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/types";
import {NextSlot} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/types";

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

export interface BarracksStakeNftContextProps {
  onNftsStaked: (nfts: PendingNft[]) => void;
  nextSlot?: NextSlot;
  selectedChainId: number;
  collections: any[];
  stakedItems: StakedItems;
  pendingItems: PendingItems;
  setPendingItems: (nfts: PendingNft[]) => void;
}

export const BarracksStakeNftContext = createContext<BarracksStakeNftContextProps | null>(null);