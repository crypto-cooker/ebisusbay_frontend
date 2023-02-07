import { useCallback, useState } from 'react';
import { getAuthSignerInStorage } from '@src/helpers/storage';

import { setOwner } from "@src/core/api/next/collectioninfo";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {addFavorite, removeFavorite} from "@src/core/cms/next/favorites";
import {ContractReceipt} from "ethers";

type ResponseProps = {
  isLoading: boolean;
  error?: any;
  response?: any;
};

export const useToggleFavorite = () => {
  const [response, setResponse] = useState<ResponseProps>({
    isLoading: false,
    response: null,
    error: null
  });

  const [isLoading, getSigner] = useCreateSigner();

  const toggleFavorite = useCallback(async (address: string, collectionAddress: string, tokenId: string, shouldAdd: boolean = true) => {
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
      } catch (e: any) {
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

  }, [response, getSigner]);

  return [response, toggleFavorite] as const;
};

export default useToggleFavorite;
