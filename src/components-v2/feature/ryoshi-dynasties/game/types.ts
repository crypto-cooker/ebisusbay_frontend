export interface RyoshiConfig {
  bank: RyoshiConfigBank;
  barracks: RyoshiConfigBarracks;
  townHall: RyoshiConfigTownHall;
  rewards: RyoshiConfigCheckinRewards;
  factions: RyoshiConfigFactions;
  presale: RyoshiConfigPresale;
  armies: RyoshiConfigArmies;
  reputations: RyoshiConfigReputation;
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