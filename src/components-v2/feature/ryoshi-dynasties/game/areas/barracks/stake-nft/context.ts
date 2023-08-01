import {createContext} from "react";
import {StakedToken} from "@src/core/services/api-service/graph/types";

export interface BarracksStakeNftContextProps {
  pendingNfts: Array<{nftAddress: string, nftId: string}>;
  stakedNfts: StakedToken[];
};

export const BarracksStakeNftContext = createContext<BarracksStakeNftContextProps | null>(null);