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

export interface ModalState {
  isOpen: boolean;
  onClose: () => void;
}

export type PairDataNormalized = {
  time: number
  token0Id: string
  token1Id: string
  reserve0: number
  reserve1: number
}[]

export type DerivedPairDataNormalized = {
  time: number
  token0Id: string
  token1Id: string
  token0DerivedUSD: number
  token1DerivedUSD: number
}[]

export type PairPricesNormalized = {
  time: Date
  value: number
}[]

export enum PairDataTimeWindowEnum {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}
