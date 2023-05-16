import {createContext} from "react";

export interface BarracksStakeNftContextProps {
  nftAddress: string;
  nftId: string;
};

export const BarracksStakeNftContext = createContext<BarracksStakeNftContextProps[] | null>(null);