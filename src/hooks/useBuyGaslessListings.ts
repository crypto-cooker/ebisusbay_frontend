import {useState} from 'react';
import {ethers} from "ethers";
import {toast} from 'react-toastify';

import {getAuthSignerInStorage} from '@src/helpers/storage';
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner';
import {useSelector} from "react-redux";
import {getServerSignature} from '@src/core/cms/endpoints/gaslessListing';
import {pluralize} from "@src/utils";
import {useAppSelector} from "@src/Store/hooks";
import ContractService from "@src/core/contractService";

type ResponseProps = {
  loading: boolean;
  error?: any;
  tx?: string;
};

const useBuyGaslessListings = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: undefined,
    tx: undefined
  });

  const {contractService, address} = useAppSelector((state) => state.user);

  const buyGaslessListings = async (listingIds: string[], cartPrice: number | string) => {
    setResponse({
      ...response,
      loading: true,
      error: undefined,
      tx: undefined
    });

    try {
      const buyContract = (contractService! as ContractService).ship;
      const price = ethers.utils.parseEther(`${cartPrice}`);

      const { data: serverSig } = await getServerSignature((address! as string), listingIds);
      const { signature, orderData, ...sigData } = serverSig;
      const total = price.add(sigData.feeAmount);
      const tx = await buyContract.fillOrders(orderData, sigData, signature, { value: total });
      const receipt = await tx.wait()
      toast.success(`${pluralize(listingIds.length, 'NFT')} successfully purchased`);

      setResponse({
        ...response,
        loading: false,
        error: undefined,
        tx: receipt
      });

      return true;
    } catch (error) {
      console.log(error)
      toast.error('Error');
      setResponse({
        ...response,
        loading: false,
        error: error,
      });
      throw error;
    }
  };

  return [buyGaslessListings, response] as const;
};

export default useBuyGaslessListings;
