import { useState } from 'react';
import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from './useCreateSigner';
import {updateBanner} from "@src/core/cms/endpoints/profile";

const useUpdateBanner = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const requestUpdateBanner = async (formData, address) => {
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
        const fetchResponse = await updateBanner(formData, signatureInStorage, address);

        setResponse({
          ...response,
          loading: false,
          error: null,
        });

        return fetchResponse.data;
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

  return [requestUpdateBanner, response];
};

export default useUpdateBanner;
