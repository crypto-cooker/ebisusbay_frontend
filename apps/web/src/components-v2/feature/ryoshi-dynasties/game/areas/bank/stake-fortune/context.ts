import {SupportedChainId} from "@src/config/chains";
import {createContext} from "react";

export interface BankStakeTokenContextProps {
  chainId: SupportedChainId;
}

export const BankStakeTokenContext = createContext<BankStakeTokenContextProps | null>(null);