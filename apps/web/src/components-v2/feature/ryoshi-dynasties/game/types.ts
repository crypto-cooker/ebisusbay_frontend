export interface RyoshiConfig {
  platform: RyoshiConfigPlatform;
  bank: RyoshiConfigBank;
  barracks: RyoshiConfigBarracks;
  townHall: RyoshiConfigTownHall;
  rewards: RyoshiConfigCheckinRewards;
  factions: RyoshiConfigFactions;
  presale: RyoshiConfigPresale;
  armies: RyoshiConfigArmies;
  reputations: RyoshiConfigReputation;
  experience: RyoshiConfigExperience;
  bonusPoints: RyoshiConfigBonusPoints;
  controlPointDecay: RyoshiConfigControlPointDecay;
}

export interface RyoshiConfigControlPointDecay {
  [key: string]: number;
}

interface RyoshiConfigBonusPoints {
  [key: string]: number[];
}

interface RyoshiConfigReputation {
  points: RyoshiConfigReputationPoints
}

interface RyoshiConfigReputationPoints {
  battle: {
    kill: number;
    attacker: number;
    defender: number;
  };
  deploy: number;
  delegated: number;
  recall: number;
}

interface RyoshiConfigPlatform {
  staking: {
    troops: {
      values: RyoshiConfigStakingMultiplier[];
      bonus: Array<{value: number, traits: RyoshiConfigTraitEligibility[]}>;
    }
  };
}


interface RyoshiConfigBank {
  staking: RyoshiConfigBankStaking;
}

interface RyoshiConfigBankStaking {
  fortune: RyoshiConfigBankStakingFortune;
  nft: RyoshiConfigBankStakingNFT;
}

interface RyoshiConfigBankStakingFortune {
  minimum: number;
  termLength: number;
  maxTerms: number;
  mitamaTroopsRatio: number;
  startingDebt: number;
  apr: {[key: number]: number};
}

interface RyoshiConfigBankStakingNFT {
  slots: RyoshiConfigStakingSlots;
  maxMultiplier: number;
  collections: RyoshiConfigBankStakingNFTCollection[];
}

interface RyoshiConfigStakingSlots {
  max: number;
  included: number;
  cost: Array<{frtn: number, koban: number}>;
}

export interface RyoshiConfigBankStakingNFTCollection extends RyoshiConfigCollections {
  active: boolean;
  minId: number;
  maxId: number;
  apr: RyoshiConfigBankStakingAPR;
  troops?: RyoshiConfigBankStakingTroops;
}

interface RyoshiConfigBankStakingAPR {
  multipliers: RyoshiConfigStakingMultiplier[];
  adders: RyoshiConfigStakingMultiplier[];
  ids: RyoshiConfigStakingIdMultiplier[];
}

interface RyoshiConfigBankStakingTroops {
  values: RyoshiConfigStakingMultiplier[];
  bonus: {
    value: number;
    traits: RyoshiConfigTraitEligibility[]
  }
}

interface RyoshiConfigStakingMultiplier {
  percentile: number;
  value: number;
}

interface RyoshiConfigStakingIdMultiplier {
  id: number;
  bonus: number;
}

interface RyoshiConfigBarracks {
  staking: RyoshiConfigBarracksStaking;
}

interface RyoshiConfigBarracksStaking {
  nft: RyoshiConfigBarracksStakingNFT;
}

interface RyoshiConfigBarracksStakingNFT {
  maxSlots: number;
  collections: RyoshiConfigBarracksStakingNFTCollection[];
}

export interface RyoshiConfigBarracksStakingNFTCollection extends RyoshiConfigCollections {
  active: boolean;
  minId: number;
  maxId: number;
  traits: RyoshiConfigTraitEligibility[];
  multipliers: RyoshiConfigStakingMultiplier[];
  ids: RyoshiConfigStakingIdMultiplier[];
  bonus: RyoshiConfigBarracksStakingNFTBonus[];
}

interface RyoshiConfigBarracksStakingNFTBonus {
  value: number;
  traits: RyoshiConfigTraitEligibility[];
}


interface RyoshiConfigTownHall {
  staking: RyoshiConfigTownHallStaking;
  ryoshi: RyoshiConfigTownHallRyoshi;
}

interface RyoshiConfigTownHallStaking {
  nft: RyoshiConfigTownHallStakingNFT;
}

interface RyoshiConfigTownHallStakingNFT {
  maxSlots: number;
  collections: RyoshiConfigTownHallStakingNFTCollection[];
}

export interface RyoshiConfigTownHallStakingNFTCollection extends RyoshiConfigCollections {
  active: boolean;
  fortune: number;
}

interface RyoshiConfigTownHallRyoshi {
  restockCutoff: number;
  upkeepDecay: number;
  upkeepActiveDays: number;
  upkeepCosts: Array<{ threshold: number, multiplier: number }>;
  tradeIn: {
    tierMultiplier: number[],
    base: {[key: number]: number}
  }
}

interface RyoshiConfigTraitEligibility {
  type: string;
  inclusion: RyoshiConfigTraitInclusionType;
  values: string[]
}

export enum RyoshiConfigTraitInclusionType {
  INCLUDE = 'include',
  EXCLUDE = 'exclude'
}

export interface RyoshiConfigCollections {
  name: string;
  slug: string;
  address: string;
  chainId: number;
}

interface RyoshiConfigCheckinRewards {
  daily: number[];
}

interface RyoshiConfigPresale {
  bonus: number[];
}

interface RyoshiConfigFactions {
  editableDays: number;
  registration: RyoshiConfigFactionsRegistration;
}

interface RyoshiConfigFactionsRegistration {
  fortuneCost: number;
  mitamaCost: number;
  forbiddenAddresses: string[];
}

interface RyoshiConfigArmies {
  redeploymentDelay: number[];
  recallTax: number;
}

export interface ExperienceEvent {
  points: number;
  coolDown: number;
  usd?: number;
}

export interface RyoshiConfigExperience {
  DAILY_CHECK_IN: ExperienceEvent;
  DEPLOY_TROOPS: ExperienceEvent;
  TROOP_KILLED: ExperienceEvent;
  STAKE_VIP: ExperienceEvent;
  STAKE_MITAMA: ExperienceEvent;
  ITEM_SOLD_SELLER: ExperienceEvent;
  OFFER_ACCEPTED_SELLER: ExperienceEvent;
  ITEM_SOLD_BUYER: ExperienceEvent;
  CLAIM_PLATFORM_REWARD: ExperienceEvent;
  COMPOUND_PLATFORM_REWARD: ExperienceEvent;
  CLAIM_MARKET_STAKING_REWARD: ExperienceEvent;
  VERIFY_EMAIL: ExperienceEvent;
}