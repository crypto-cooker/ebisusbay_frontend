import {useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {ApiService} from "@src/core/services/api-service";
import {Contract} from "ethers";
import Barracks from "@src/Contracts/Barracks.json";
import {appConfig} from "@src/Config";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {caseInsensitiveCompare} from "@src/utils";

const config = appConfig();

interface PendingNft {
  nftAddress: string;
  nftId: string;
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

  const user = useAppSelector((state) => state.user);

  const stakeNfts = async (pendingNfts: PendingNft[], stakedNfts: StakedToken[]) => {
    if (!user.address) throw 'User is not logged in';

    let signature: string | null = null;
    try {
      const barracks = new Contract(config.contracts.barracks, Barracks, user.provider.getSigner());

      let shouldWithdraw = false;
      for (const stakedNft of stakedNfts) {
        if (!pendingNfts.some((nft) => caseInsensitiveCompare(nft.nftAddress, stakedNft.contractAddress) && nft.nftId === stakedNft.tokenId)) {
          shouldWithdraw = true;
          break;
        }
      }

      const unstakedNfts = pendingNfts.filter((nft) => !stakedNfts.some((stakedNft) => caseInsensitiveCompare(nft.nftAddress, stakedNft.contractAddress) && nft.nftId === stakedNft.tokenId));

      if (shouldWithdraw) {
        const withdrawTx = await barracks.withdrawStake(
          stakedNfts.map((nft) => nft.contractAddress),
          stakedNfts.map((nft) => nft.tokenId),
        );
        await withdrawTx.wait();
      }

      if (unstakedNfts.length > 0) {
        const approval = await ApiService.withoutKey().ryoshiDynasties.requestBarracksStakeAuthorization(unstakedNfts, user.address);
        signature = approval.data.signature;
        const stakeTx = await barracks.startStake(approval.data.stakeApproval, approval.data.signature);
        await stakeTx.wait();
      }

      setResponse({
        ...response,
        loading: false,
        error: null,
      });
    } catch (error) {
      if (!!signature) {
        await ApiService.withoutKey().ryoshiDynasties.cancelStakeAuthorization(signature);
      }

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
