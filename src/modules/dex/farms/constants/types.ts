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
  apr: number;
  frtnPerBlockInUSD: string | null;
  frtnPerBlock: string | null;
  frtnPerDay: string | null;
  frtnPerDayInUSD: string | null;
  frtnPerMonth: string | null;
  frtnPerMonthInUSD: string | null;
}
export interface MapiPairFarm extends MapiFarm {
  pair: MapiPair;
  frtnPerBlockInUSD: string;
  frtnPerBlock: string;
  frtnPerDay: string;
  frtnPerDayInUSD: string;
  frtnPerMonth: string;
  frtnPerMonthInUSD: string;
}

interface MapiFrtnFarm extends MapiFarm {}

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
};