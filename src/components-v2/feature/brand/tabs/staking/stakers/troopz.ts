import {BigNumber, Contract, ContractTransaction, ethers} from "ethers";
import {StakePayload, Staker, UnstakePayload} from "@src/components-v2/feature/brand/tabs/staking/types";
import {appConfig} from "@src/config";
import {getNfts} from "@src/core/api/endpoints/nft";
import NextApiService from "@src/core/services/api-service/next";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

export class TroopzStaker implements Staker {
    abi = [
        'function batchDeposit(address[] calldata _contractAddress, uint256[] calldata _tokenId)',
        'function getStakedList(address _address) external view returns (uint256[] memory)',
    ];
    address = '0xA588fA62c9722Ea6824851641F3a51545D083e68';
    collections = [
        '0x51112Bf32B9a1C64716DF2e6b82e63a04Bd384Fd',
        '0xea4DF145322ec9dFCE037b062b08083141c6af8f',
        '0x96628048830a499b156aBdC04cC169C18c3A17f2',
        '0xEB54ea91C92Ce404Ba7AD7B0EF2e36fD75C889A7',
        '0xB82F6B5a4491D38292DFCd6706aa12DD5701D7e2',
        '0x2FfF5FE8a3e13A10509E4297DF9d1fdaF1eE7DC4',
        '0x75233B3C8b60b7191704C0f6100850dc769bb857',
        '0xf8e63021C3d757b63eb53a9124271251A964D572',
        '0xE13A2bf710c4D1fD3a04a85e14489B4D352CA2F0',
        '0xd9C2Aa899c031F565071e1b966C3c1710b3c6D63'
    ];

    async stake(payload: StakePayload, signer: any): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.batchDeposit([payload.nftAddress], [payload.nftId]);
    }

    async unstake(payload: UnstakePayload, signer: any): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.batchDeposit([payload.nftId]);
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
        const walletNfts = await NextApiService.getWallet(userAddress, {pageSize: 100, collection: [collectionAddress]});
        if (!walletNfts.data) return [];

        return walletNfts.data.map((item: any) => ({...item, isStaked: false}));
    }
}

export default TroopzStaker;