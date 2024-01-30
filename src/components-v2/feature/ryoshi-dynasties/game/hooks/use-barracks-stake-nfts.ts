import {useState} from 'react';
import {ApiService} from "@src/core/services/api-service";
import {Contract} from "ethers";
import Barracks from "@src/Contracts/Barracks.json";
import {appConfig} from "@src/Config";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {caseInsensitiveCompare} from "@src/utils";
import Constants from "@src/constants";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();

interface PendingNft {
  nftAddress: string;
  nftId: string;
  amount: number;
  refBalance: number;
  isAlreadyStaked: boolean;
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

  const { Features } = Constants;

  const stakeNfts = async (pendingNfts: PendingNft[], stakedNfts: StakedToken[]) => {
    if (!user.address) throw 'User is not logged in';
    try {
      const signature = await requestSignature();
      const barracks = new Contract(config.contracts.barracks, Barracks, user.provider.getSigner());

      // Note that stakedNfts are not flattened like pendingNfts
      // i.e. multiple entries for the same nft in pendingNfts will consolidate into one entry in stakedNfts with an amount
      let withdrawNfts = [];
      for (const stakedNft of stakedNfts) {
        const pendingAmount = pendingNfts.filter((nft) => caseInsensitiveCompare(nft.nftAddress, stakedNft.contractAddress) && nft.nftId === stakedNft.tokenId).length;
        if (Number(stakedNft.amount) > pendingAmount) {
          const amountToWithdraw = Number(stakedNft.amount) - pendingAmount;
          for (let i = 0; i < amountToWithdraw; i++) {
            withdrawNfts.push({...stakedNft, amount: amountToWithdraw});
          }
        }
      }

      const newNfts = pendingNfts.filter((nft) => !nft.isAlreadyStaked);

      if (withdrawNfts.length > 0) {
        const approval = await ApiService.withoutKey().ryoshiDynasties.requestBarracksUnstakeAuthorization(
          withdrawNfts.map((nft) => ({
            nftAddress: nft.contractAddress,
            nftId: nft.tokenId,
            amount: Number(nft.amount),
          })),
          user.address,
          signature
        );
        const withdrawTx = await barracks.endStake(approval.data.unstakeApproval, approval.data.signature);
        await withdrawTx.wait();
      }

      if (newNfts.length > 0) {
        const approval = await ApiService.withoutKey().ryoshiDynasties.requestBarracksStakeAuthorization(newNfts, user.address, signature);
        const stakeTx = await barracks.startStake(approval.data.stakeApproval, approval.data.signature);
        await stakeTx.wait();
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
