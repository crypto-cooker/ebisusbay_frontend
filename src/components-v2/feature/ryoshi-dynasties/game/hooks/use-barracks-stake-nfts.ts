import {useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {ApiService} from "@src/core/services/api-service";
import {Contract} from "ethers";
import Barracks from "@src/Contracts/Barracks.json";
import Barracks2 from "@src/Contracts/Barracks2.json";
import {appConfig} from "@src/Config";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {caseInsensitiveCompare} from "@src/utils";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import Constants from "@src/constants";
import useFeatureFlag from "@src/hooks/useFeatureFlag";

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
  const [_, getSigner] = useCreateSigner();

  const user = useAppSelector((state) => state.user);

  const { Features } = Constants;
  const isNewBarracksEnabled = useFeatureFlag(Features.NEW_BARRACKS);

  const stakeNfts = async (pendingNfts: PendingNft[], stakedNfts: StakedToken[]) => {
    if (!user.address) throw 'User is not logged in';

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const barracksAbi = isNewBarracksEnabled ? Barracks2 : Barracks;
        const barracks = new Contract(config.contracts.barracks, barracksAbi, user.provider.getSigner());

        let withdrawNfts = [];
        for (const stakedNft of stakedNfts) {
          if (!pendingNfts.some((nft) => caseInsensitiveCompare(nft.nftAddress, stakedNft.contractAddress) && nft.nftId === stakedNft.tokenId)) {
            withdrawNfts.push(stakedNft);
          }
        }


        const unstakedNfts = pendingNfts.filter((nft) => !stakedNfts.some((stakedNft) => caseInsensitiveCompare(nft.nftAddress, stakedNft.contractAddress) && nft.nftId === stakedNft.tokenId));

        if (withdrawNfts.length > 0) {
          if (isNewBarracksEnabled) {
            const approval = await ApiService.withoutKey().ryoshiDynasties.requestBarracksUnstakeAuthorization(
              withdrawNfts.map((nft) => ({
                nftAddress: nft.contractAddress,
                nftId: nft.tokenId,
                amount: Number(nft.amount),
              })),
              user.address,
              signatureInStorage
            );
            const withdrawTx = await barracks.endStake(approval.data.unstakeApproval, approval.data.signature);
            await withdrawTx.wait();
          } else {
            const withdrawTx = await barracks.withdrawStake(
              withdrawNfts.map((nft) => nft.contractAddress),
              withdrawNfts.map((nft) => nft.tokenId),
            );
            await withdrawTx.wait();
          }
        }

        if (unstakedNfts.length > 0) {
          const approval = await ApiService.withoutKey().ryoshiDynasties.requestBarracksStakeAuthorization(unstakedNfts, user.address, signatureInStorage);
          const stakeTx = await barracks.startStake(approval.data.stakeApproval, approval.data.signature);
          await stakeTx.wait();
        }

        setResponse({
          ...response,
          loading: false,
          error: null,
        });
      } catch (error) {
        setResponse({
          ...response,
          loading: false,
          error: error,
        });
        throw error;
      }
    }
  };

  return [stakeNfts, response] as const;
};

export default useBarracksStakeNfts;
