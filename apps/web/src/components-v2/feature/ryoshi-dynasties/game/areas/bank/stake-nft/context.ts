import {createContext} from "react";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {NextSlot, PendingNft} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/types";

export interface BankStakeNftContextProps {
  pendingNfts: PendingNft[];
  stakedNfts: StakedToken[];
  nextSlot?: NextSlot;
};

export const BankStakeNftContext = createContext<BankStakeNftContextProps | null>(null);