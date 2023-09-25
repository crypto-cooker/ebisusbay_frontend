import {useCallback, useState} from 'react';

import {setOwner} from "@src/core/api/next/collectioninfo";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

export const useSetOwner = () => {
  const [response, setResponse] = useState({
    isLoading: false,
    response: null,
    error: null
  });

  const {requestSignature} = useEnforceSignature();

  const setNewOwner = useCallback(async (address, collectionAddress, ownerAddress) => {
    setResponse({
      ...response,
      isLoading: true,
      error: null,
    });

    try {
      const signature = await requestSignature();
      const payload = await setOwner({ signature: signature, address }, collectionAddress, ownerAddress);

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

  }, [response, requestSignature]);

  return [response, setNewOwner];
};

export default useSetOwner;
