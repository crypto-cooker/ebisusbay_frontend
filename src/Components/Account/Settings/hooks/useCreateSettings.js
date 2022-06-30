import { useState } from 'react';
// import { appConfig } from '../../../../Config';
import useCreateSigner from './useCreateSigner';

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

    const { signature, nonce } = await getSigner();

    try {
      const fetchResponse = await fetch(`http://localhost:4000/profile?` + new URLSearchParams({ signature, nonce }), {
        method: 'post',
        body: formData,
      });

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
  };

  return [requestNewSettings, response];
};

export default useCreateSettings;
