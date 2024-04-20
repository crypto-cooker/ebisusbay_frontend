export interface DexToken {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI: string;
}

export interface DexTokenBalance extends DexToken {
  balance: bigint;
}

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export interface ModalState {
  isOpen: boolean;
  onClose: () => void;
}