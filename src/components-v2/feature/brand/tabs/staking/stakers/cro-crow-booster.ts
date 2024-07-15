import {BigNumber, Contract, ContractTransaction, ethers} from "ethers";
import {
    BoosterStakePayload,
    BoosterStaker,
    BoosterUnstakePayload
} from "@src/components-v2/feature/brand/tabs/staking/types";
import {appConfig} from "@src/config";
import {getNfts} from "@src/core/api/endpoints/nft";
import abi from "@market/assets/abis/cro-crow-forest.json";
import {ciEquals} from "@market/helpers/utils";
import NextApiService from "@src/core/services/api-service/next";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

export class CroCrowBoosterStaker implements BoosterStaker {
    slots = 5;
    abi = [
        'function stakeBooster(uint256 slot, uint256 id, address c)',
        'function unstakeBooster(uint256 slot)',
        'function boostersOfOwner(address _owner) public view returns (Booster[] memory)'
    ];
    address = '0x777777777795f2A6A74CC442ff6048aE4710FA2C';
    collections = [
        '0x65AB0251d29c9C473c8d01BFfa2966F891fB1181',
        '0x937879726455531dB135F9b8D88F38dF5D4Eb13b',
        '0x0f1439A290E86a38157831Fe27a3dCD302904055',
        '0xccc777777ac85999Fc9fe355F25cd908060eC9ea'
    ];

    async stake(payload: BoosterStakePayload, signer: any): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.stakeBooster(payload.slot, payload.nftId, payload.nftAddress);
    }

    async unstake(payload: BoosterUnstakePayload, signer: any): Promise<ContractTransaction> {
        const contract = new Contract(this.address, this.abi, signer);
        return await contract.unstakeBooster(payload.slot);
    }

    async getAll(userAddress: string, collectionAddress: string) {
        const staked = await this.getStaked(userAddress, collectionAddress);
        const unstaked = await this.getUnstaked(userAddress, collectionAddress);

        return [...staked, ...unstaked];
    }

    async getStaked(userAddress: string, collectionAddress: string) {
        const readContract = new Contract(this.address, abi, readProvider);
        const stakedObjs = await readContract.boostersOfOwner(userAddress);
        const stakedIds = stakedObjs
            .filter((obj: { id: BigNumber, adr: string }) => ciEquals(obj.adr, collectionAddress))
            .map((obj: { id: BigNumber, adr: string }) => obj.id);

        if (stakedIds.length < 1) return [];

        const nfts = await getNfts(collectionAddress, stakedIds.map((id: BigNumber) => id.toNumber()));

        return nfts.data.map((item: any) => ({...item.nft, isStaked: true}));
    }

    async getUnstaked(userAddress: string, collectionAddress: string) {
        const walletNfts = await NextApiService.getWallet(userAddress, {pageSize: 100, collection: [collectionAddress]});
        if (!walletNfts.data) return [];

        return walletNfts.data.map((item: any) => ({...item, isStaked: false}));
    }

    async getSlots(userAddress: string) {
        const readContract = new Contract(this.address, abi, readProvider);
        const stakedObjs = await readContract.boostersOfOwner(userAddress);

        const colMappedIds = stakedObjs.reduce((a: any, b: any) => {
            if (!(b.adr in a)) {
                a[b.adr] = []
            }
            a[b.adr].push(b.id);

            return a;
        }, {});

        let fullNfts: any = [];
        for (const [nftAddress, nftIds] of Object.entries(colMappedIds)) {
            if (nftAddress === ethers.constants.AddressZero) continue;
            const nfts = await getNfts(nftAddress, (nftIds as BigNumber[]).map((id: BigNumber) => id.toNumber()));
            if (nfts.data) {
                fullNfts.push(...nfts.data.map((item: any) => item.nft));
            } else {
                fullNfts.push(nfts.nft);
            }
        }

        return stakedObjs.map((obj: any, index: number) => {
            return {
                slot: index,
                nft: fullNfts.find((nft: any) => ciEquals(nft.nftAddress, obj.adr) && nft.nftId.toString() === obj.id.toString())
            }
        });
    }
}

export default CroCrowBoosterStaker;