import { useState } from 'react';

import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from './useCreateSigner';
import {useSelector} from "react-redux";
import { cancelListing } from '@src/core/cms/endpoints/gaslessListing';

const useCancelGaslessListing = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const user = useSelector((state) => state.user);

  const cancelGaslessListing = async ({listingNonce, address, id}) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {

        const res = await cancelListing(signatureInStorage, user.address.toLowerCase(), listingNonce, address, id)

        setResponse({
          ...response,
          loading: false,
          error: null,
        });

        return true;
      } catch (error) {
        console.log(error)
        setResponse({
          ...response,
          loading: false,
          error: error,
        });
        throw error;
      }
    } else {
      setResponse({
        isLoading: false,
        response: [],
        error: { message: 'Something went wrong' },
      });

      throw new Error();
    }
  };

  return [cancelGaslessListing, response];
};

export default useCancelGaslessListing;
