import {createContext} from "react";
import {StakedToken} from "@src/core/services/api-service/graph/types";

export interface BankStakeNftContextProps {
  pendingNfts: Array<{nftAddress: string, nftId: string}>;
  stakedNfts: StakedToken[];
};

export const BankStakeNftContext = createContext<BankStakeNftContextProps | null>(null);