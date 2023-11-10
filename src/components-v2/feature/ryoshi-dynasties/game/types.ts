export interface RyoshiConfig {
  bank: RyoshiConfigBank;
  barracks: RyoshiConfigBarracks;
  townHall: RyoshiConfigTownHall;
  rewards: RyoshiConfigCheckinRewards;
  factions: RyoshiConfigFactions;
  presale: RyoshiConfigPresale;
  armies: RyoshiConfigArmies;
  reputations: RyoshiConfigReputation;
  experience: RyoshiConfigExperience;
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
  maxSlots: number;
  maxMultiplier: number;
  collections: RyoshiConfigBankStakingNFTCollection[];
}

interface RyoshiConfigBankStakingNFTCollection extends RyoshiConfigCollections {
  active: boolean;
  multipliers: RyoshiConfigStakingMultiplier[];
  adders: RyoshiConfigStakingMultiplier[];
  ids: RyoshiConfigStakingIdMultiplier[];
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
  meepleUpkeep: number;
}

interface RyoshiConfigBarracksStaking {
  nft: RyoshiConfigBarracksStakingNFT;
}

interface RyoshiConfigBarracksStakingNFT {
  maxSlots: number;
  collections: RyoshiConfigBarracksStakingNFTCollection[];
}

interface RyoshiConfigBarracksStakingNFTCollection extends RyoshiConfigCollections {
  active: boolean;
  traits: RyoshiConfigTraitEligibility[];
  multipliers: RyoshiConfigStakingMultiplier[];
  ids: RyoshiConfigStakingIdMultiplier[];
}

interface RyoshiConfigTownHall {
  staking: RyoshiConfigTownHallStaking;
}

interface RyoshiConfigTownHallStaking {
  nft: RyoshiConfigTownHallStakingNFT;
}

interface RyoshiConfigTownHallStakingNFT {
  maxSlots: number;
  collections: RyoshiConfigTownHallStakingNFTCollection[];
}

export interface RyoshiConfigTownHallStakingNFTCollection extends RyoshiConfigCollections {
  fortune: number;
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
  slug: string;
  address: string;
  maxSupply: number;
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