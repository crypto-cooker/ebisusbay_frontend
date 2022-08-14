import { getAuthSignerInStorage } from '@src/helpers/storage';
import { useState } from 'react';
import axios from 'axios';

import useCreateSigner from './useCreateSigner';
import { appConfig } from "@src/Config";
import {verifyEmail} from "@src/core/cms/endpoints/profile";

const useResendEmailVerification = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const requestNewSettings = async (address) => {

    const config = appConfig();

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
        await verifyEmail(signatureInStorage, address);

        setResponse({
          ...response,
          loading: false,
          error: null,
        });

        return response;
      } catch (error) {
        setResponse({
          ...response,
          loading: false,
          error: error,
        });
      }
    } else {
      setResponse({
        isLoading: false,
        response: [],
        error: { message: 'Something went wrong' },
      });
    }
  };

  return [requestNewSettings, response];
};

export default useResendEmailVerification;
