import {ContractTransaction, ethers} from "ethers";

export interface Staker {
    address: string;
    collections: string[];
    abi: string[];

    stake(payload: StakePayload, signer: ethers.Signer): Promise<ContractTransaction>;
    unstake(payload: UnstakePayload, signer: ethers.Signer): Promise<ContractTransaction>;

    getAll(userAddress: string, collectionAddress: string): any;

    getStaked(userAddress: string, collectionAddress: string): any;
    getUnstaked(userAddress: string, collectionAddress: string): any;
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
};