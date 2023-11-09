import {createContext} from "react";
import {StakedToken} from "@src/core/services/api-service/graph/types";

export interface TownHallStakeNftContextProps {
  pendingNfts: Array<{nftAddress: string, nftId: string}>;
  stakedNfts: StakedToken[];
  totals: {[key: string]: number}
};

export const TownHallStakeNftContext = createContext<TownHallStakeNftContextProps | null>(null);