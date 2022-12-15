import { useState } from 'react';
import {Contract, ethers} from "ethers";

import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from './useCreateSigner';
import {useSelector} from "react-redux";
import {appConfig} from "@src/Config";
import { createListing } from '@src/core/cms/endpoints/gaslessListing';

const useCreateGaslessListing = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const config = appConfig();

  const [isLoading, getSigner] = useCreateSigner();

  const user = useSelector((state) => state.user);

  const createGaslessListing = async (listing) => {
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
        
        const res = await createListing(signatureInStorage, user.address.toLowerCase(), listing)

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

  return [createGaslessListing, response];
};

export default useCreateGaslessListing;
