// Pairs
export interface PairData {
  id: string;
  name: string;
  volumeUSD: number;
  liquidity: number;
  dailyVolumeUSD: number;
  token0: {
    address: string,
    name: string;
    symbol: string;
    decimals: number;
    derivedUSD: number;
    totalLiquidity: number;
  };
  token1: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    derivedUSD: number;
    totalLiquidity: number;
  };

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
  txCount:number;
}

export interface Block {
  number: number
  timestamp: string
}

export interface TvlChartEntry {
  date: number
  liquidityUSD: number
}

export interface VolumeChartEntry {
  date: number
  volumeUSD: number
  liquidityUSD: number
}

/**
 * Formatted type for Candlestick charts
 */
export interface PriceChartEntry {
  time: number
  open: number
  close: number
  high: number
  low: number
}

export enum TransactionType {
  SWAP,
  MINT,
  BURN,
}

export type Transaction = {
  type: TransactionType
  hash: string
  timestamp: string
  sender: string
  token0Symbol?: string
  token1Symbol?: string
  token0Address?: string
  token1Address?: string
  amountUSD: number
  amountToken0: number
  amountToken1: number
}

export interface ProtocolData {
  volumeUSD: number
  volumeUSDChange: number // in 24h, as percentage

  liquidityUSD: number
  liquidityUSDChange: number // in 24h, as percentage

  txCount: number
  txCountChange: number
}