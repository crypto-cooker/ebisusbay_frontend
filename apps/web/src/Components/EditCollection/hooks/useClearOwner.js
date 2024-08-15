import {useCallback, useState} from 'react';
import {clearOwner} from "@src/core/api/next/collectioninfo";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

export const useClearOwner = () => {
  const [response, setResponse] = useState({
    isLoading: false,
    response: null,
    error: null
  });

  const {requestSignature} = useEnforceSignature();

  const clearCollectionOwner = useCallback(async (address, collectionAddress) => {
    setResponse({
      ...response,
      isLoading: true,
      error: null,
    });

    try {
      const signature = await requestSignature();
      const payload = await clearOwner({ signature: signature, address }, collectionAddress);

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
  },
    [response, requestSignature]
  );

  return [response, clearCollectionOwner];
};

export default useClearOwner;
