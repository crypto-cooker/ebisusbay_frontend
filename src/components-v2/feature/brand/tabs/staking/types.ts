import {ContractTransaction, ethers} from "ethers";

export interface Staker {
    address: string;
    collections: string[];
    abi: string[];
    booster?: BoosterStaker;

    stake(payload: StakePayload, signer: ethers.Signer): Promise<ContractTransaction>;
    unstake(payload: UnstakePayload, signer: ethers.Signer): Promise<ContractTransaction>;

    getAll(userAddress: string, collectionAddress: string): any;

    getStaked(userAddress: string, collectionAddress: string): any;
    getUnstaked(userAddress: string, collectionAddress: string): any;
}

export interface StakerWithRewards extends Staker {
    rewardsSymbol: string;
    getRewards(userAddress: string): any;
    claimRewards(userAddress: string, signer: ethers.Signer): Promise<ContractTransaction>;
}

export interface BoosterStaker extends Staker {
    slots: number;

    stake(payload: BoosterStakePayload, signer: ethers.Signer): Promise<ContractTransaction>;
    unstake(payload: BoosterUnstakePayload, signer: ethers.Signer): Promise<ContractTransaction>;
    getSlots(userAddress: string): Promise<BoosterSlot[]>;
}

export interface StakePayload {
    nftAddress: string;
    nftId: string;
}
export interface UnstakePayload {
    nftAddress: string;
    nftId: string;
}

export enum StakingStatusFilters {
    ALL,
    STAKED,
    UNSTAKED
}

export interface BoosterStakePayload {
    nftAddress: string;
    nftId: string;
    slot: number;
}
export interface BoosterUnstakePayload {
    nftAddress: string;
    nftId: string;
    slot: number;
}

export interface BoosterSlot {
    slot: number;
    nft: any;
}