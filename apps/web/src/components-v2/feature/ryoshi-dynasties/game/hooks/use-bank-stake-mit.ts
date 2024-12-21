import { ApiService } from '@src/core/services/api-service';
import { Contract } from 'ethers';
import Bank from '@src/global/contracts/Bank.json';
import useEnforceSignature from '@src/Components/Account/Settings/hooks/useEnforceSigner';
import { useUser } from '@src/components-v2/useUser';
import { getChainById } from '@src/helpers';
import { PendingNft } from '@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/types';
import { BankStakeNft } from '@src/core/services/api-service/types';
import { StakedToken } from '@src/core/services/api-service/graph/types';


const useBankStakeMit = () => {
  const {requestSignature} = useEnforceSignature();
  const user = useUser();

  const stakeMit = async (mit: PendingNft, chainId: number) => {
    if (!user.address) throw 'User is not logged in';

    try {
      const chainConfig = getChainById(chainId);
      const signature = await requestSignature();
      const bank = new Contract(chainConfig.contracts.bank, Bank, user.provider.getSigner());

      const mapped: BankStakeNft[] = [mit].map((nft) => ({
        nftAddress: nft.nft.nftAddress,
        nftId: nft.nft.nftId,
        amount: 1
      }));

      const approval = await ApiService.withoutKey().ryoshiDynasties.requestBankStakeAuthorization(
        mapped,
        user.address!,
        signature,
        chainId
      );
      const stakeTx = await bank.startStake(approval.data.stakeApproval, approval.data.signature);
      await stakeTx.wait();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const unstakeMit = async (mit: StakedToken, chainId: number) => {
    try {
      const chainConfig = getChainById(chainId);
      const signature = await requestSignature();
      const bank = new Contract(chainConfig.contracts.bank, Bank, user.provider.getSigner());

      const mapped: BankStakeNft[] = [mit].map((nft) => ({
        nftAddress: nft.contractAddress,
        nftId: nft.tokenId,
        amount: 1
      }));

      const approval = await ApiService.withoutKey().ryoshiDynasties.requestBankUnstakeAuthorization(
        mapped,
        user.address!,
        signature,
        chainId
      );
      const withdrawTx = await bank.endStake(approval.data.unstakeApproval, approval.data.signature);
      await withdrawTx.wait();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return {
    stakeMit,
    unstakeMit
  }
};

export default useBankStakeMit;
