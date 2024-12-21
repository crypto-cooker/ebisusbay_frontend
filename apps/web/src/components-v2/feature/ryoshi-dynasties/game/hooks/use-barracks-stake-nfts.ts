import {useState} from 'react';
import {ApiService} from "@src/core/services/api-service";
import {Contract} from "ethers";
import Barracks from "@src/global/contracts/Barracks.json";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {ciEquals} from "@market/helpers/utils";
import Constants from "@src/constants";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";
import {getChainById} from "@src/helpers";
import {PendingNft} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/types";
import {BarracksStakeNft} from "@src/core/services/api-service/types";


interface StakablePendingNft extends PendingNft {
  amount: number;
}

type ResponseProps = {
  loading: boolean;
  error?: any;
};

const useBarracksStakeNfts = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: null,
  });
  const {requestSignature} = useEnforceSignature();
  const user = useUser();

  const stakeNfts = async (pendingNfts: StakablePendingNft[], stakedNfts: StakedToken[], chainId: number) => {
    if (!user.address) throw 'User is not logged in';

    try {
      const chainConfig = getChainById(chainId);
      const signature = await requestSignature();
      const barracks = new Contract(chainConfig.contracts.barracks, Barracks, user.provider.getSigner());

      // Note that stakedNfts are not flattened like pendingNfts
      // i.e. multiple entries for the same nft in pendingNfts will consolidate into one entry in stakedNfts with an amount
      let withdrawNfts = [];
      for (const stakedNft of stakedNfts) {
        const pendingsMatched = pendingNfts.filter((nft) => ciEquals(nft.nft.nftAddress, stakedNft.contractAddress) && nft.nft.nftId === stakedNft.tokenId);
        const pendingAmount = pendingsMatched.length;

        if (Number(stakedNft.amount) > pendingAmount) {

          if (pendingsMatched.some(nft => nft.chainId !== chainId)) {
            throw new Error('can only unstake from one chain at a time');
          }

          const amountToWithdraw = Number(stakedNft.amount) - pendingAmount;
          withdrawNfts.push({...stakedNft, amount: amountToWithdraw});
        }
      }

      const newNfts = pendingNfts.filter((nft) => !nft.stake.isAlreadyStaked);
      if (newNfts.some(nft => nft.chainId !== chainId)) {
        throw new Error('can only stake from one chain at a time');
      }

      if (withdrawNfts.length > 0) {
        const approval = await ApiService.withoutKey().ryoshiDynasties.requestBarracksUnstakeAuthorization(
          withdrawNfts.map((nft) => ({
            nftAddress: nft.contractAddress,
            nftId: nft.tokenId,
            amount: Number(nft.amount),
          })),
          user.address,
          signature,
          chainId
        );
        const withdrawTx = await barracks.endStake(approval.data.unstakeApproval, approval.data.signature);
        await withdrawTx.wait();
      }

      if (newNfts.length > 0) {
        const mapped: BarracksStakeNft[] = newNfts.map((nft) => ({
          nftAddress: nft.nft.nftAddress,
          nftId: nft.nft.nftId,
          amount: nft.amount
        }))
        const approval = await ApiService.withoutKey().ryoshiDynasties.requestBarracksStakeAuthorization(mapped, user.address, signature, chainId);
        const stakeTx = await barracks.startStake(approval.data.stakeApproval, approval.data.signature);
        await stakeTx.wait();
      }

      if (newNfts.length === 0 && withdrawNfts.length === 0) {
        throw new Error('No changes made')
      }

      setResponse({
        ...response,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.log(error);
      setResponse({
        ...response,
        loading: false,
        error: error,
      });
      throw error;
    }
  };

  return [stakeNfts, response] as const;
};

export default useBarracksStakeNfts;
