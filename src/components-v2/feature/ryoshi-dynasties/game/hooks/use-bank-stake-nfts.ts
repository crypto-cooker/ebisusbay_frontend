import {useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {ApiService} from "@src/core/services/api-service";
import {Contract} from "ethers";
import Bank from "@src/Contracts/Bank.json";
import {appConfig} from "@src/Config";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import {caseInsensitiveCompare} from "@src/utils";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {getAuthSignerInStorage} from "@src/helpers/storage";

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
  const [_, getSigner] = useCreateSigner();

  const user = useAppSelector((state) => state.user);

  const stakeNfts = async (pendingNfts: PendingNft[], stakedNfts: StakedToken[]) => {
    if (!user.address) throw 'User is not logged in';

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const bank = new Contract(config.contracts.bank, Bank, user.provider.getSigner());

        let withdrawNfts = [];
        for (const stakedNft of stakedNfts) {
          if (!pendingNfts.some((nft) => caseInsensitiveCompare(nft.nftAddress, stakedNft.contractAddress) && nft.nftId === stakedNft.tokenId)) {
            withdrawNfts.push(stakedNft);
          }
        }
        const unstakedNfts = pendingNfts.filter((nft) => !stakedNfts.some((stakedNft) => caseInsensitiveCompare(nft.nftAddress, stakedNft.contractAddress) && nft.nftId === stakedNft.tokenId));

        if (withdrawNfts.length > 0) {
          const withdrawTx = await bank.withdrawStake(
            withdrawNfts.map((nft) => nft.contractAddress),
            withdrawNfts.map((nft) => nft.tokenId),
          );
          await withdrawTx.wait();
        }

        if (unstakedNfts.length > 0) {
          const approval = await ApiService.withoutKey().ryoshiDynasties.requestBankStakeAuthorization(unstakedNfts, user.address, signatureInStorage);
          const stakeTx = await bank.startStake(approval.data.stakeApproval, approval.data.signature);
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

export default useBankStakeNfts;
