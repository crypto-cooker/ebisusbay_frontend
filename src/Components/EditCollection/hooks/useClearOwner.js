import { useCallback, useState, useLayoutEffect } from 'react';
import { clearOwner } from "@src/core/api/next/collectioninfo";
import { getAuthSignerInStorage } from '@src/helpers/storage';

import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

export const useClearOwner = () => {
  const [response, setResponse] = useState({
    isLoading: false,
    response: null,
    error: null
  });

  const [isLoading, getSigner] = useCreateSigner();

  const clearCollectionOwner = useCallback(async (address, collectionAddress) => {
    setResponse({
      ...response,
      isLoading: true,
      error: null,
    });

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        const payload = await clearOwner({ signature: signatureInStorage, address }, collectionAddress);

        setResponse({
          isLoading: false,
          response: payload,
        });
      } catch (e) {
        setResponse({
          isLoading: false,
          response: null,
          error: e,
        });
      }
    } else {
      setResponse({
        isLoading: false,
        response: [],
        error: { message: 'Something went wrong' },
      });
    }
  },
    [clearCollectionOwner, response, getSigner]
  );

  return [response, clearCollectionOwner];
};

export default useClearOwner;
