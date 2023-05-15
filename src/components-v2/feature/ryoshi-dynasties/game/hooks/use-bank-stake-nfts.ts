import {useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {ApiService} from "@src/core/services/api-service";
import {Contract} from "ethers";
import Bank from "@src/Contracts/Bank.json";
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

const useBankStakeNfts = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: null,
  });

  const user = useAppSelector((state) => state.user);

  const stakeNfts = async (pendingNfts: PendingNft[], stakedNfts: StakedToken[]) => {
    if (!user.address) throw 'User is not logged in';

    try {
      const bank = new Contract(config.contracts.bank, Bank, user.provider.getSigner());

      let shouldWithdraw = false;
      for (const stakedNft of stakedNfts) {
        if (!pendingNfts.some((nft) => caseInsensitiveCompare(nft.nftAddress, stakedNft.contractAddress) && nft.nftId === stakedNft.tokenId)) {
          shouldWithdraw = true;
          break;
        }
      }
      const unstakedNfts = pendingNfts.filter((nft) => !stakedNfts.some((stakedNft) => caseInsensitiveCompare(nft.nftAddress, stakedNft.contractAddress) && nft.nftId === stakedNft.tokenId));

      if (shouldWithdraw) {
        const withdrawTx = await bank.withdrawStake(
          stakedNfts.map((nft) => nft.contractAddress),
          stakedNfts.map((nft) => nft.tokenId),
        );
        await withdrawTx.wait();
      }

      if (unstakedNfts.length > 0) {
        const approval = await ApiService.withoutKey().requestBankStakeAuthorization(unstakedNfts, user.address);
        const stakeTx = await bank.startStake(approval.data.stakeApproval, approval.data.signature);
        await stakeTx.wait();
      }

      setResponse({
        ...response,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      // @todo send cancellation to CMS if wallet confirmation cancelled?

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

export default useBankStakeNfts;
