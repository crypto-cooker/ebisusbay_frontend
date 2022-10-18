import { getAuthSignerInStorage } from '@src/helpers/storage';
import { useState } from 'react';

import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner';
import { reportCollection } from "@src/core/cms/endpoints/collections";

const useReportCollection = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoading, getSigner] = useCreateSigner();

  const createNewReport = async (address, data) => {
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
        const fetchResponse = await reportCollection( address, signatureInStorage, data);

        setResponse({
          ...response,
          loading: false,
          error: null,
        });

        return fetchResponse;
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

  return [createNewReport, response];
};

export default useReportCollection;
