import {createContext, Dispatch, SetStateAction} from "react";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {NextSlot, PendingNft} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/types";

export interface BankStakeNftContextProps {
  pendingNfts: PendingNft[];
  setPendingNfts: Dispatch<SetStateAction<PendingNft[]>>;
  onNftsStaked: (nfts: PendingNft[]) => void;
  stakedNfts: StakedToken[];
  nextSlot?: NextSlot;
  selectedChainId: number;
  collections: any[];
}

export const BankStakeNftContext = createContext<BankStakeNftContextProps | null>(null);