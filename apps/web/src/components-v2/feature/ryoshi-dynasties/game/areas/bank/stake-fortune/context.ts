import {SupportedChainId} from "@src/config/chains";
import {createContext} from "react";

export enum VaultType {
  TOKEN = 'token',
  LP = 'LP'
}

export interface Vault {
  pool: string
}

export interface BankStakeTokenContextProps {
  chainId: SupportedChainId;
  vaultType: VaultType
}

export const BankStakeTokenContext = createContext<BankStakeTokenContextProps | null>(null);