export enum SwapTab {
  Swap = 'swap',
  Limit = 'limit',
  Send = 'send',
}

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const TOTAL_FEE = 0.003
export const LP_HOLDERS_FEE = 0.0025
export const TREASURY_FEE = 0.0005

export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20
export const L2_DEADLINE_FROM_NOW = 60 * 5

export const FAST_INTERVAL = 10000
export const SLOW_INTERVAL = 60000