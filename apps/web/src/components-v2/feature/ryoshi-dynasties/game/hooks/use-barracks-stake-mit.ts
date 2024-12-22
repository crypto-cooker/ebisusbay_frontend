import { ApiService } from '@src/core/services/api-service';
import { Contract } from 'ethers';
import Barracks from '@src/global/contracts/Barracks.json';
import useEnforceSignature from '@src/Components/Account/Settings/hooks/useEnforceSigner';
import { useUser } from '@src/components-v2/useUser';
import { getChainById } from '@src/helpers';
import { PendingNft } from '@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/types';
import { BarracksStakeNft } from '@src/core/services/api-service/types';
import { StakedToken } from '@src/core/services/api-service/graph/types';


const useBarracksStakeMit = () => {
  const {requestSignature} = useEnforceSignature();
  const user = useUser();

  const stakeMit = async (mit: PendingNft, chainId: number) => {
    if (!user.address) throw 'User is not logged in';

    try {
      const chainConfig = getChainById(chainId);
      const signature = await requestSignature();
      const barracks = new Contract(chainConfig.contracts.barracks, Barracks, user.provider.getSigner());

      const mapped: BarracksStakeNft[] = [mit].map((nft) => ({
        nftAddress: nft.nft.nftAddress,
        nftId: nft.nft.nftId,
        amount: 1
      }));

      const approval = await ApiService.withoutKey().ryoshiDynasties.requestBarracksStakeAuthorization(
        mapped,
        user.address!,
        signature,
        chainId
      );
      const stakeTx = await barracks.startStake(approval.data.stakeApproval, approval.data.signature);
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
      const barracks = new Contract(chainConfig.contracts.barracks, Barracks, user.provider.getSigner());

      const mapped: BarracksStakeNft[] = [mit].map((nft) => ({
        nftAddress: nft.contractAddress,
        nftId: nft.tokenId,
        amount: 1
      }));

      const approval = await ApiService.withoutKey().ryoshiDynasties.requestBarracksUnstakeAuthorization(
        mapped,
        user.address!,
        signature,
        chainId
      );
      const withdrawTx = await barracks.endStake(approval.data.unstakeApproval, approval.data.signature);
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

export default useBarracksStakeMit;
