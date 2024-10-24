// POOLS

export interface PairData {
  pairAddres: string;
  dailyVolumeUSD: number;
  reserve0: number;
  reserve1: number;
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

  volumeUSD: number;
  volumeUSDChange: number;

  totalFees24h: number;
  lpFees24h: number;
  lpApr24h: number;

  liquidityUSD: number;
  liquidityUSDChange: number;
}
