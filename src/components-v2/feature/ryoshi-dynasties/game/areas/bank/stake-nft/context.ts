import {createContext} from "react";

export interface BankStakeNftContextProps {
  nftAddress: string;
  nftId: string;
};

export const BankStakeNftContext = createContext<BankStakeNftContextProps[] | null>(null);