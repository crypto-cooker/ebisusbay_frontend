export interface RyoshiConfig {
  bank: RyoshiConfigBank;
  barracks: RyoshiConfigBarracks;
  rewards: RyoshiConfigCheckinRewards;
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
  apr: {[key: number]: number};
}

interface RyoshiConfigBankStakingNFT {
  maxSlots: number;
  maxMultiplier: number;
  collections: RyoshiConfigBankStakingNFTCollection[];
}

interface RyoshiConfigBankStakingNFTCollection extends RyoshiConfigCollections {
  multipliers: RyoshiConfigStakingMultiplier[];
  adders: RyoshiConfigStakingMultiplier[];
}

interface RyoshiConfigStakingMultiplier {
  percentile: number;
  value: number;
}

interface RyoshiConfigBarracks {
  staking: RyoshiConfigBarracksStaking;
}

interface RyoshiConfigBarracksStaking {
  nft: RyoshiConfigBarracksStakingNFT;
}

interface RyoshiConfigBarracksStakingNFT {
  maxSlots: number;
  bonusTroops: number;
  collections: RyoshiConfigBarracksStakingNFTCollection[];
}

interface RyoshiConfigBarracksStakingNFTCollection extends RyoshiConfigCollections {
  traits: RyoshiConfigTraitEligibility[];
  multipliers: RyoshiConfigStakingMultiplier[];
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