import {BrokerCurrency} from "@market/hooks/use-currency-broker";

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
  rewarders: MapiFarmRewarder[];
}

export interface MapiPairFarm extends MapiFarm {
  pair: MapiPair;
}

interface MapiFrtnFarm extends MapiFarm {
  pair: null;
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

export interface MapiFarmRewarder {
  id: number;
  token: string;
  accRewardPerShare: string;
  allocPoint: number;
  lastRewardBlock: number;
  isMain: boolean;
  tokenDecimals: number;
  rewardPerBlock: string;
  rewardPerBlockInUSD: number;
  rewardPerDay: string;
  rewardPerDayInUSD: number;
  rewardPerMonth: string;
  rewardPerMonthInUSD: number;
  rewardPerLPPerBlock: string;
  rewardPerLPPerBlockInUSD: number;
  rewardPerLPPerDay: string;
  rewardPerLPPerDayInUSD: number;
}

export interface DerivedFarm {
  derived: FarmRow;
  data: MapiPairFarm;
}

export interface FarmRow {
  name: string;
  dailyRewards: Array<{token: BrokerCurrency, amount: string, endsAt: number}>;
  stakedLiquidity: string;
  apr: string;
  state: FarmState;
}

export enum FarmState {
  ACTIVE = 'active',
  FINISHED = 'finished'
}