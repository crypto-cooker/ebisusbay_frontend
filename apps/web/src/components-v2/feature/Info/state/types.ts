// POOLS

export interface PairData {
  pairAddres: string;
  dailyVolumeUSD: number;
  reserve0: number;
  reserve1: number;
  token0: {
    id: string;
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    totalLiquidity: number;
  };

  token1: {
    id: string;
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    totalLiquidity: number;
  };

  volumeUSD: number;
  volumeOutUSD?: number;
  volumeUSDChange: number;
  volumeUSDWeek: number;
  volumeOutUSDWeek?: number;
  volumeUSDChangeWeek: number;

  totalFees24h: number;
  lpFees24h: number;
  lpApr24h: number;

  liquidityUSD: number;
  liquidityUSDChange: number;
}
