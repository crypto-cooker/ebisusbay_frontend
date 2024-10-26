// Pairs
export interface PairData {
  id: string;
  name: string;
  volumeUSD: number;
  liquidity: number;
  dailyVolumeUSD: number;
  token0: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    derivedUSD: number;
    derivedCRO: number;
    totalLiquidity: number;
    dailyVolumeUSD: number;
    reserveUSD: number;
  };

  token1: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    derivedUSD: number;
    derivedCRO: number;
    totalLiquidity: number;
    dailyVolumeUSD: number;
    reserveUSD: number;
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
  priceUSD: number;
  decimals: number;
  totalLiquidity: number;
  totalLiquidityUSD: number;
  tradeVolume: number;
  tradeVolumeUSD: number;
  volume24h: number;
  volumeUSD24h: number;
  priceUSD24h: number;
  totalLiquidity24h: number;
  priceChange: number;
}
