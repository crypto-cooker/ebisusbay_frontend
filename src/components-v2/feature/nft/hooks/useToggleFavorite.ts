import {useCallback, useState} from 'react';
import {addFavorite, removeFavorite} from "@src/core/cms/next/favorites";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

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

  const {requestSignature} = useEnforceSignature();

  const toggleFavorite = useCallback(async (address: string, collectionAddress: string, tokenId: string, shouldAdd: boolean = true) => {
    setResponse({
      ...response,
      isLoading: true,
      error: null,
    });

    try {
      const signature = await requestSignature();
      const payload = shouldAdd ?
        await addFavorite(collectionAddress, tokenId, address, signature) :
        await removeFavorite(collectionAddress, tokenId, address, signature);

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

  }, [response, requestSignature]);

  return [response, toggleFavorite] as const;
};

export default useToggleFavorite;
