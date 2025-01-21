import { useCallback, useState, useLayoutEffect } from 'react';
import { getLayers as _getLayers } from '@src/core/cms/endpoints/layerbooth';

export const useGetLayerBooth = (account) => {
  const [response, setResponse] = useState({
    isLoading: true,
    signer: null,
    response: null,
  });

  const getLayers = useCallback(
    async (account) => {
      setResponse({
        ...response,
        isLoading: true,
      });

      if (account) {
        try {
          const payload = await _getLayers(account);

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
          response: null,
          error: { message: 'Something went wrong' },
        });
      }
    },
    [setResponse, response],
  );

  useLayoutEffect(() => {
    getLayers(account);
  }, [account]);

  return [response];
};

export default useGetLayerBooth;
