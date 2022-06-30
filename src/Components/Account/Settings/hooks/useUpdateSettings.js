import { useState } from 'react';
// import { appConfig } from '../../../../Config';
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

    const { signature, nonce } = await getSigner();
    if (signature) {
      try {
        const fetchResponse = await fetch(
          `http://localhost:4000/profile?` + new URLSearchParams({ signature, nonce }),
          {
            method: 'patch',
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
