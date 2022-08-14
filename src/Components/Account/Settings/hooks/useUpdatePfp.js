import { useState } from 'react';
import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from './useCreateSigner';

const useUpdatePfp = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const requestUpdatePfp = async (formData, address) => {
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
        const fetchResponse = await fetch(
          `http://localhost:4000/profile/update_profile_picture?` +
            new URLSearchParams({ signature: signatureInStorage, address }),
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

  return [requestUpdatePfp, response];
};

export default useUpdatePfp;
