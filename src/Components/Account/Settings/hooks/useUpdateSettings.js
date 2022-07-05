import { useState } from 'react';
// import { appConfig } from '../../../../Config';
import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from './useCreateSigner';

const useCreateSettings = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const requestUpdateSettings = async (formData) => {
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
        const fetchResponse = await fetch(
          `http://localhost:4000/profile?` + new URLSearchParams({ signature: signatureInStorage, nonce }),
          {
            method: 'PATCH',
            body: formData,
          }
        );

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

  return [requestUpdateSettings, response];
};

export default useCreateSettings;
