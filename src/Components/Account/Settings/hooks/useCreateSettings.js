import { getAuthSignerInStorage } from '@src/helpers/storage';
import { useState } from 'react';
// import { appConfig } from '../../../../Config';
import useCreateSigner from './useCreateSigner';
import {createProfile} from "@src/core/cms/endpoints/profile";

const useCreateSettings = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const requestNewSettings = async (formData) => {
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
        const fetchResponse = await createProfile(formData, signatureInStorage, nonce);

        setResponse({
          ...response,
          loading: false,
          error: null,
        });

        return fetchResponse.json();
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

export default useCreateSettings;
