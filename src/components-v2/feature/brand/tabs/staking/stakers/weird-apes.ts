import {Contract, ContractTransaction, ethers} from "ethers";
import {BoosterStaker, StakePayload, StakerWithRewards} from "@src/components-v2/feature/brand/tabs/staking/types";
import {ERC721} from "@src/global/contracts/Abis";
import {appConfig} from "@src/config";
import NextApiService from "@src/core/services/api-service/next";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

export class WeirdApesStaker implements StakerWithRewards {
    rewardsSymbol = 'WAC';
    booster?: BoosterStaker | undefined;

    abi = [
        'function stake(uint256 _tokenId)',
        'function unstake(uint256 _tokenId)'
    ];
    address = '0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44';
    collections = [
        "0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44"
    ];

    rewardsAddress = '0xcf639e01bCDAe12c5405fe575B60499107A6B4FC';
    rewardsAbi = [
        'function getTotalClaimable(address _user) public view returns (uint256)',
        'function getReward()',
    ];

    async stake(payload: StakePayload, signer: any): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.stake(payload.nftId);
    }

    async unstake(payload: StakePayload, signer: any): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.unstake(payload.nftId);
    }

    async getAll(userAddress: string, collectionAddress: string): Promise<any> {
        const walletNfts = await NextApiService.getWallet(userAddress, {pageSize: 100, collection: [collectionAddress]});
        if (!walletNfts.data) return [];

        const readContract = new Contract(this.collections[0], ERC721, readProvider);
        return Promise.all(walletNfts.data.map(async (nft: any) =>{
            const isStaked = await readContract.stakedApes(nft.nftId);
            return {...nft, isStaked}
        }));
    }

    async getStaked(userAddress: string, collectionAddress: string): Promise<any> {
        const nfts = await this.getAll(userAddress, collectionAddress);

        return nfts.filter((nft: any) => nft.isStaked);
    }

    async getUnstaked(userAddress: string, collectionAddress: string): Promise<any> {
        const nfts = await this.getAll(userAddress, collectionAddress);

        return nfts.filter((nft: any) => !nft.isStaked);
    }

    async getRewards(userAddress: string) {
        const readContract = new Contract(this.rewardsAddress, this.rewardsAbi, readProvider);
        const rewards = await readContract.getTotalClaimable(userAddress);
        return ethers.utils.formatEther(rewards);
    }
    async claimRewards(userAddress: string, signer: ethers.Signer): Promise<ContractTransaction> {
        const contract = new Contract(this.rewardsAddress, this.rewardsAbi, signer);
        return await contract.getReward();
    }
}

export default WeirdApesStaker;