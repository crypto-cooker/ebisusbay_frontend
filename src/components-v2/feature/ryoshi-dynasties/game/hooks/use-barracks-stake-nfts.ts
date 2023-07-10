import {useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {ApiService} from "@src/core/services/api-service";
import {Contract} from "ethers";
import Barracks from "@src/Contracts/Barracks.json";
import {appConfig} from "@src/Config";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {caseInsensitiveCompare} from "@src/utils";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import Constants from "@src/constants";

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

  const stakeNfts = async (pendingNfts: PendingNft[], stakedNfts: StakedToken[]) => {
    if (!user.address) throw 'User is not logged in';

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const barracks = new Contract(config.contracts.barracks, Barracks, user.provider.getSigner());

        let withdrawNfts = [];
        for (const stakedNft of stakedNfts) {
          if (!pendingNfts.some((nft) => caseInsensitiveCompare(nft.nftAddress, stakedNft.contractAddress) && nft.nftId === stakedNft.tokenId)) {
            withdrawNfts.push(stakedNft);
          }
        }


        const unstakedNfts = pendingNfts.filter((nft) => !stakedNfts.some((stakedNft) => caseInsensitiveCompare(nft.nftAddress, stakedNft.contractAddress) && nft.nftId === stakedNft.tokenId));

        if (withdrawNfts.length > 0) {
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
