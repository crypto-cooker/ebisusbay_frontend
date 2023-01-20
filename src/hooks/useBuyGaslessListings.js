import {useState} from 'react';
import {ethers} from "ethers";
import {toast} from 'react-toastify';

import {getAuthSignerInStorage} from '@src/helpers/storage';
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner';
import {useSelector} from "react-redux";
import {getServerSignature} from '@src/core/cms/endpoints/gaslessListing';
import {pluralize} from "@src/utils";

const useBuyGaslessListings = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const user = useSelector((state) => state.user);

  const buyGaslessListings = async (listingIds, cartPrice) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      const buyContract = user.contractService.ship;
      const price = ethers.utils.parseEther(`${cartPrice}`);

      const { data: serverSig } = await getServerSignature(user.address.toLowerCase(), listingIds);
      const { signature, orderData, ...sigData } = serverSig;
      const total = price.add(sigData.feeAmount);
      const tx = await buyContract.fillOrders(orderData, sigData, signature, { value: total });
      await tx.wait()
      toast.success(`${pluralize(listingIds.length, 'NFT')} successfully purchased`);

      setResponse({
        ...response,
        loading: false,
        error: null,
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

  return [buyGaslessListings, response];
};

export default useBuyGaslessListings;
