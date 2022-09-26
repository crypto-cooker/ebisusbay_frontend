import { useCallback, useState } from 'react';
import { getAuthSignerInStorage } from '@src/helpers/storage';

import { setOwner } from "@src/core/api/next/collectioninfo";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {addFavorite, removeFavorite} from "@src/core/cms/next/favorites";

export const useToggleFavorite = () => {
  const [response, setResponse] = useState({
    isLoading: false,
    response: null,
    error: null
  });

  const [isLoading, getSigner] = useCreateSigner();

  const toggleFavorite = useCallback(async (address, collectionAddress, tokenId, shouldAdd = true) => {
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
        const payload = shouldAdd ?
          await addFavorite(collectionAddress, tokenId, address, signatureInStorage) :
          await removeFavorite(collectionAddress, tokenId, address, signatureInStorage);

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

  }, [toggleFavorite, response, getSigner]);

  return [response, toggleFavorite];
};

export default useToggleFavorite;
