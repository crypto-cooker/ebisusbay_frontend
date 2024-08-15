import {BigNumber, Contract, ContractTransaction, ethers} from "ethers";
import {StakePayload, StakerWithRewards, UnstakePayload} from "@src/components-v2/feature/brand/tabs/staking/types";
import {appConfig} from "@src/config";
import {getNfts} from "@src/core/api/endpoints/nft";
import CroCrowBoosterStaker from "@src/components-v2/feature/brand/tabs/staking/stakers/cro-crow-booster";
import NextApiService from "@src/core/services/api-service/next";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

export class CroCrowStaker implements StakerWithRewards {
    abi = [
        'function stake(uint256[] calldata ids) public',
        'function unstake(uint256[] calldata ids) public',
        'function crowsOfOwner(address _owner) public view returns (uint256[] memory)',
        'function availableRewards(address _owner) public view returns (uint256)',
        'function claimRewards()'
    ];
    address = '0x777777777795f2A6A74CC442ff6048aE4710FA2C';
    collections = [
        '0xe4ab77ed89528d90e6bcf0e1ac99c58da24e79d5'
    ];

    booster = new CroCrowBoosterStaker();
    rewardsSymbol = 'CRO';

    async stake(payload: StakePayload, signer: ethers.Signer): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.stake([payload.nftId]);
    }

    async unstake(payload: UnstakePayload, signer: ethers.Signer): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.unstake([payload.nftId]);
    }

    async getAll(userAddress: string, collectionAddress: string) {
        const staked = await this.getStaked(userAddress, collectionAddress);
        const unstaked = await this.getUnstaked(userAddress, collectionAddress);

        return [...staked, ...unstaked];
    }

    async getStaked(userAddress: string, collectionAddress: string) {
        const readContract = new Contract(this.address, this.abi, readProvider);
        const stakedIds = await readContract.crowsOfOwner(userAddress);
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
        const rewards = await readContract.availableRewards(userAddress);
        return ethers.utils.formatEther(rewards);
    }

    async claimRewards(userAddress: string, signer: ethers.Signer): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.claimRewards();
    }
}

export default CroCrowStaker;