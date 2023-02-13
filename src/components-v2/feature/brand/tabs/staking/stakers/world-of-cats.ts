import {BigNumber, Contract, ContractTransaction, ethers} from "ethers";
import {StakePayload, Staker, UnstakePayload} from "@src/components-v2/feature/brand/tabs/staking/types";
import {getQuickWallet} from "@src/core/api/endpoints/wallets";
import {appConfig} from "@src/Config";
import {getNfts} from "@src/core/api/endpoints/nft";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

export class WorldOfCatsStaker implements Staker {
    abi = [
        'function stakeNfts(uint256[] tokenIds)',
        'function unstakeNfts(uint256[] tokenIds)',
        'function getNftsIdsbyAddress(address _add) public view returns (uint256[] memory)',
        'function getUserstakedNftIds(address _user) public view returns (uint256[] memory)'
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

        const nfts = await getNfts(collectionAddress, stakedIds.map((id: BigNumber) => id.toNumber()));

        return nfts.data.map((item: any) => ({...item.nft, isStaked: true}));
    }

    async getUnstaked(userAddress: string, collectionAddress: string) {
        // const readContract = new Contract(this.address, this.abi, readProvider);
        // const stakedIds = await readContract.getNftsIdsbyAddress(walletAddress);
        const quickWallet = await getQuickWallet(userAddress, {collection: collectionAddress, pageSize: 1000});
        if (!quickWallet.data) return [];

        return quickWallet.data.map((item: any) => ({...item, isStaked: false}));
    }
}

export default WorldOfCatsStaker;