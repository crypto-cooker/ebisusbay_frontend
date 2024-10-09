import {BrokerCurrency} from "@market/hooks/use-currency-broker";
import {MultichainBrokerCurrency} from "@market/hooks/use-multichain-currency-broker";

export interface MapiFarm {
  pid: number;
  pair: MapiPair | null;
  lpBalance: string;
  rewarderCount: number;
  totalUsersCount: number;
  userCount: number;
  rewarders: MapiFarmRewarder[];
  lpBalanceInUSD: number;
  apr: string;
  rewardPerBlockInUSD: number;
  rewardPerDayInUSD: number;
  rewardPerMonthInUSD: number;
  rewardPerLPPerBlockInUSD: number;
  rewardPerLPPerDayInUSD: number;
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
  id: number | string;
  token: string;
  accRewardPerShare: string;
  allocPoint: number;
  lastRewardBlock: number;
  poolCount?: number;
  rewardStart?: number;
  rewardEnd?: number;
  rewardPerSecond?: number;
  isMain: boolean;
  tokenDecimals: number;
  price: string;
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
  dailyRewards: Array<{rewarder: MapiFarmRewarder, token: MultichainBrokerCurrency, amount: string}>;
  stakedLiquidity: string;
  apr: string;
  state: FarmState;
  chainId: number;
  hasActiveBoost: boolean;
}

export enum FarmState {
  ACTIVE = 'active',
  FINISHED = 'finished'
}