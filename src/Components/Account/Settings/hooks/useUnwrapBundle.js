import { useState } from 'react';
import {Contract, ethers} from "ethers";

import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from './useCreateSigner';
import {useSelector} from "react-redux";
import {appConfig} from "@src/Config";
import Bundle from "@src/Contracts/Bundle.json";

const useUnwrapBundle = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const config = appConfig();

  const [isLoading, getSigner] = useCreateSigner();

  const user = useSelector((state) => state.user);

  const unwrapBundle = async (bundleId) => {
    console.log('bundleId', bundleId)
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

        const bundleContract = new Contract(config.contracts.bundle, Bundle.abi, user.provider.getSigner());

        const newBundle = await bundleContract.unwrap(bundleId) 
        let tbAwait = await newBundle.wait();

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

  return [unwrapBundle, response];
};

export default useUnwrapBundle;
