import {ApiService} from "@src/core/services/api-service";
import {Contract} from "ethers";
import TownHall from "@src/global/contracts/Barracks.json"; // intentional
import {appConfig} from "@src/config";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";
import {ERC721} from "@src/global/contracts/Abis";
import {DEFAULT_CHAIN_ID} from "@src/config/chains";

const config = appConfig();

interface PendingNft {
  nftAddress: string;
  nftId: string;
  amount: number;
}

interface StakeRequestProps {
  nfts?: PendingNft[];
  collectionAddress: string;
  isAll?: boolean;
}

interface UnstakeRequestProps {
  nfts?: PendingNft[];
  collectionAddress?: string;
  isAll?: boolean;
  invalidOnly?: boolean;
}

const useTownHallStakeNfts = () => {
  const {requestSignature} = useEnforceSignature();
  const user = useUser();

  const stakeNfts = async ({nfts, collectionAddress, isAll}: StakeRequestProps) => {
    if (!user.address) throw 'User is not logged in';
    if (!isAll && (!nfts || !collectionAddress)) throw 'No NFTs to stake';

    try {
      const nftContract = new Contract(collectionAddress, ERC721, user.provider.signer);
      const isApproved = await nftContract.isApprovedForAll(user.address!.toLowerCase(), config.contracts.townHall);
      if (!isApproved) {
        let tx = await nftContract.setApprovalForAll(config.contracts.townHall, true);
        await tx.wait();
      }

      const signature = await requestSignature();
      const townHall = new Contract(config.contracts.townHall, TownHall, user.provider.signer);

      const approval = await ApiService.withoutKey().ryoshiDynasties.requestTownHallStakeAuthorization(
        {
          nfts: nfts ?? [],
          collectionAddress,
          isAll: isAll ?? false
        },
        user.address,
        signature,
        DEFAULT_CHAIN_ID
      );

      const stakeTx = await townHall.startStake(approval.data.stakeApproval, approval.data.signature);
      await stakeTx.wait();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const unstakeNfts = async ({nfts, collectionAddress, isAll, invalidOnly}: UnstakeRequestProps) => {
    if (!user.address) throw 'User is not logged in';
    if (!isAll && !invalidOnly && (!nfts || !collectionAddress)) throw 'No NFTs to unstake';

    try {
      const signature = await requestSignature();
      const townHall = new Contract(config.contracts.townHall, TownHall, user.provider.signer);

      const approval = await ApiService.withoutKey().ryoshiDynasties.requestTownHallUnstakeAuthorization(
        {
          nfts: nfts ?? [],
          collectionAddress,
          isAll: isAll ?? false,
          invalidOnly: invalidOnly ?? false
        },
        user.address,
        signature,
        DEFAULT_CHAIN_ID
      );
      const withdrawTx = await townHall.endStake(approval.data.unstakeApproval, approval.data.signature);
      await withdrawTx.wait();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return {stakeNfts, unstakeNfts} as const;
};

export default useTownHallStakeNfts;
