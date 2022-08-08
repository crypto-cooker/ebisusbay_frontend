import { getAuthSignerInStorage } from '@src/helpers/storage';
import { useState } from 'react';
import axios from 'axios';

import useCreateSigner from './useCreateSigner';
import { appConfig } from "@src/Config";

const useResendEmailVerification = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const requestNewSettings = async (data) => {

    const config = appConfig();

    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    let signatureInStorage = getAuthSignerInStorage()?.signature;

    const nonce = 'ProfileSettings';

    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }

    if (signatureInStorage) {
      try {

        await axios.get(`${config.urls.cms}profile/email-verification?signature=${signatureInStorage}&nonce=${nonce}`);

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
