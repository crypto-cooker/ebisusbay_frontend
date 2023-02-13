import {Contract, ContractTransaction, ethers} from "ethers";
import {StakePayload, Staker} from "@src/components-v2/feature/brand/tabs/staking/types";
import {getQuickWallet} from "@src/core/api/endpoints/wallets";
import {ERC721} from "@src/Contracts/Abis";
import {appConfig} from "@src/Config";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

export class WeirdApesStaker implements Staker {
    abi = [
        'function stake(uint256 _tokenId)',
        'function unstake(uint256 _tokenId)'
    ];
    address = '0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44';
    collections = [
        "0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44"
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
        const quickWallet = await getQuickWallet(userAddress, {collection: collectionAddress, pageSize: 1000});
        if (!quickWallet.data) return [];

        const readContract = new Contract(this.collections[0], ERC721, readProvider);
        return Promise.all(quickWallet.data.map(async (nft: any) =>{
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
}

export default WeirdApesStaker;