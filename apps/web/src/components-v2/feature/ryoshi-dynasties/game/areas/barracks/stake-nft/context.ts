import {createContext, Dispatch, SetStateAction} from "react";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {PendingNft} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/types";
import {NextSlot} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/types";

export interface BarracksStakeNftContextProps {
  pendingNfts: PendingNft[];
  setPendingNfts: Dispatch<SetStateAction<PendingNft[]>>;
  onNftsStaked: (nfts: PendingNft[]) => void;
  stakedNfts: StakedToken[];
  nextSlot?: NextSlot;
  selectedChainId: number;
  collections: any[];
}

export const BarracksStakeNftContext = createContext<BarracksStakeNftContextProps | null>(null);