import {useState} from 'react';
import {ApiService} from "@src/core/services/api-service";
import {Contract} from "ethers";
import Bank from "@src/global/contracts/Bank.json";
import {appConfig} from "@src/config";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {ciEquals} from "@market/helpers/utils";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useUser} from "@src/components-v2/useUser";
import {PendingNft} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/types";
import {BankStakeNft} from "@src/core/services/api-service/types";
import {getChainById} from "@src/helpers";


interface StakablePendingNft extends PendingNft {
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
  const {requestSignature} = useEnforceSignature();
  const user = useUser();

  const stakeNfts = async (pendingNfts: StakablePendingNft[], stakedNfts: StakedToken[], chainId: number) => {
    if (!user.address) throw new Error('User is not logged in');
    if (pendingNfts.some((nft) => nft.chainId !== chainId)) {
      throw new Error('Only one chain allowed at a time');
    }

    try {
      const chainConfig = getChainById(chainId);
      const signature = await requestSignature();
      const bank = new Contract(chainConfig.contracts.bank, Bank, user.provider.getSigner());

      // Note that stakedNfts are not flattened like pendingNfts
      // i.e. multiple entries for the same nft in pendingNfts will consolidate into one entry in stakedNfts with an amount
      let withdrawNfts = [];
      for (const stakedNft of stakedNfts) {
        const pendingAmount = pendingNfts.filter((nft) => ciEquals(nft.nft.nftAddress, stakedNft.contractAddress) && nft.nft.nftId === stakedNft.tokenId).length;
        if (Number(stakedNft.amount) > pendingAmount) {
          const amountToWithdraw = Number(stakedNft.amount) - pendingAmount;
          withdrawNfts.push({...stakedNft, amount: amountToWithdraw});
        }
      }

      const newNfts = pendingNfts.filter((nft) => !nft.stake.isAlreadyStaked);

      if (withdrawNfts.length > 0) {
        const approval = await ApiService.withoutKey().ryoshiDynasties.requestBankUnstakeAuthorization(
          withdrawNfts.map((nft) => ({
            nftAddress: nft.contractAddress,
            nftId: nft.tokenId,
            amount: Number(nft.amount),
          })),
          user.address,
          signature,
          chainId
        );
        const withdrawTx = await bank.endStake(approval.data.unstakeApproval, approval.data.signature);
        await withdrawTx.wait();
      }

      if (newNfts.length > 0) {
        const mapped: BankStakeNft[] = newNfts.map((nft) => ({
          nftAddress: nft.nft.nftAddress,
          nftId: nft.nft.nftId,
          amount: nft.amount
        }))
        const approval = await ApiService.withoutKey().ryoshiDynasties.requestBankStakeAuthorization(mapped, user.address, signature, chainId);
        const stakeTx = await bank.startStake(approval.data.stakeApproval, approval.data.signature);
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

export default useBankStakeNfts;
