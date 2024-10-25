// Pairs
export interface PairData {
  pairAddress: string;
  dailyVolumeUSD: number;
  reserveUSD:number;
  token0: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    totalLiquidity: number;
  };

  token1: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    totalLiquidity: number;
  };

  volumeUSDChange: number;

  totalFees24h: number;
  lpFees24h: number;
  lpApr24h: number;

  liquidityUSD: number;
  liquidityUSDChange: number;
}

// TOKENS
export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  totalLiquidity: number;
  decimals: number;
  tradeVolume: number;
  tradeVolumeUSD: number;
  derivedUSD: number;
}
