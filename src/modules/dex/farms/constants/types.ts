export interface MapiFarm {
  pid: number;
  lpBalance: string;
  pair: MapiPair | null;
  accFRTNPerShare: string;
  allocPoint: number;
  lastRewardBlock: number;
  rewarderCount: number;
  totalUsersCount: number;
  userCount: number;
  apr: string;
  frtnPerBlockInUSD: number | null;
  frtnPerBlock: string | null;
  frtnPerDay: string | null;
  frtnPerDayInUSD: number | null;
  frtnPerMonth: string | null;
  frtnPerMonthInUSD: number | null;
  frtnPerLPPerBlock: string | null;
  frtnPerLPPerBlockInUSD: number | null;
  frtnPerLPPerDay: string | null;
  frtnPerLPPerDayInUSD: number | null;
}
export interface MapiPairFarm extends MapiFarm {
  pair: MapiPair;
  frtnPerBlockInUSD: number;
  frtnPerBlock: string;
  frtnPerDay: string;
  frtnPerDayInUSD: number;
  frtnPerMonth: string;
  frtnPerMonthInUSD: number;
  frtnPerLPPerBlock: string;
  frtnPerLPPerBlockInUSD: number;
  frtnPerLPPerDay: string;
  frtnPerLPPerDayInUSD: number;
}

interface MapiFrtnFarm extends MapiFarm {
  pair: null;
  frtnPerBlockInUSD: null;
  frtnPerBlock: null;
  frtnPerDay: null;
  frtnPerDayInUSD: null;
  frtnPerMonth: null;
  frtnPerMonthInUSD: null;
  frtnPerLPPerBlock: null;
  frtnPerLPPerBlockInUSD: null;
  frtnPerLPPerDay: null;
  frtnPerLPPerDayInUSD: null;
}

export interface MapiPair {
  id: string;
  name: string;
  derivedUSD: string;
  totalSupply: string;
  totalValueUSD: string;
  token0: MapiPairToken;
  token1: MapiPairToken;
}

export interface MapiPairToken {
  id: string;
  symbol: string;
  derivedUSD: string;
  reserve: {
    quantity: string;
    quantityPerLP: string;
    valueUSD: string;
  }
}

export interface DerivedFarm {
  derived: FarmRow;
  data: MapiPairFarm;
}

export interface FarmRow {
  name: string;
  dailyRewards: string;
  stakedLiquidity: string;
  apr: string;
  state: FarmState;
}

export enum FarmState {
  ACTIVE = 'active',
  FINISHED = 'finished'
}