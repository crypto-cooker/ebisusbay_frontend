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