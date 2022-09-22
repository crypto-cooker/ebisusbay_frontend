import { useCallback, useState } from 'react';
import { getAuthSignerInStorage } from '@src/helpers/storage';

import { setOwner } from "@src/core/api/next/collectioninfo";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

export const useSetOwner = () => {
  const [response, setResponse] = useState({
    isLoading: false,
    response: null,
    error: null
  });

  const [isLoading, getSigner] = useCreateSigner();

  const setNewOwner = useCallback(async (address, collectionAddress, ownerAddress) => {
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
      const payload = await setOwner({ signature: signatureInStorage, address }, collectionAddress, ownerAddress);

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
    [setNewOwner, response, getSigner]
  );

  return [response, setNewOwner];
};

export default useSetOwner;
