import {createContext} from "react";
import {StakedToken} from "@src/core/services/api-service/graph/types";

export interface TownHallStakeNftContextProps {
  selectedNfts: Array<{name: string, nftAddress: string, nftId: string, rank: number}>;
};

export const TownHallStakeNftContext = createContext<TownHallStakeNftContextProps | null>(null);