import {SupportedChainId} from "@src/config/chains";
import {createContext} from "react";

export enum VaultType {
  TOKEN = 'TOKEN',
  LP = 'LP'
}

export interface Vault {
  pool: string
}

export interface BankStakeTokenContextProps {
  chainId: SupportedChainId;
  vaultType: VaultType;
  userVaultBoosts: any;
}

export const BankStakeTokenContext = createContext<BankStakeTokenContextProps | null>(null);