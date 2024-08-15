import {BigNumber, Contract, ContractTransaction, ethers} from "ethers";
import {
    BoosterStaker,
    StakePayload,
    StakerWithRewards,
    UnstakePayload
} from "@src/components-v2/feature/brand/tabs/staking/types";
import {appConfig} from "@src/config";
import {getNfts} from "@src/core/api/endpoints/nft";
import NextApiService from "@src/core/services/api-service/next";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

export class WorldOfCatsStaker implements StakerWithRewards {
    booster?: BoosterStaker | undefined;
    rewardsSymbol = 'FELINE';
    abi = [
        'function stakeNfts(uint256[] tokenIds)',
        'function unstakeNfts(uint256[] tokenIds)',
        'function getNftsIdsbyAddress(address _add) public view returns (uint256[] memory)',
        'function getUserstakedNftIds(address _user) public view returns (uint256[] memory)',
        'function viewRewards(address account) public view returns (uint256)',
        'function claimRewards()'
    ];
    address = '0x70E4bFAB4d470b9c485634289e8eB27248dE12A3';
    collections = [
        '0x4Ce0B9608006533dA056170f1efe8eEa771e0d19'
    ];

    async stake(payload: StakePayload, signer: any): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.stakeNfts([payload.nftId]);
    }

    async unstake(payload: UnstakePayload, signer: any): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.unstakeNfts([payload.nftId]);
    }

    async getAll(userAddress: string, collectionAddress: string) {
        const staked = await this.getStaked(userAddress, collectionAddress);
        const unstaked = await this.getUnstaked(userAddress, collectionAddress);

        return [...staked, ...unstaked];
    }

    async getStaked(userAddress: string, collectionAddress: string) {
        const readContract = new Contract(this.address, this.abi, readProvider);
        const stakedIds = await readContract.getUserstakedNftIds(userAddress);
        if (stakedIds.length < 1) return [];
        
        const nfts = await getNfts(collectionAddress, stakedIds.map((id: BigNumber) => id.toNumber()));

        if (nfts.data) {
            return nfts.data.map((item: any) => ({...item.nft, isStaked: true}));
        } else {
            return [{...nfts.nft, isStaked: true}];
        }
    }

    async getUnstaked(userAddress: string, collectionAddress: string) {
        const walletNfts = await NextApiService.getWallet(userAddress, {pageSize: 100, collection: [collectionAddress]});
        if (!walletNfts.data) return [];

        return walletNfts.data.map((item: any) => ({...item, isStaked: false}));
    }

    async getRewards(userAddress: string) {
        const readContract = new Contract(this.address, this.abi, readProvider);
        const rewards = await readContract.viewRewards(userAddress);
        return ethers.utils.formatEther(rewards);
    }
    async claimRewards(userAddress: string, signer: ethers.Signer): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.claimRewards();
    }
}

export default WorldOfCatsStaker;