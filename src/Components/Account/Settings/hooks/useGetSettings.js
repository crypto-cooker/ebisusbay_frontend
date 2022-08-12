import { useCallback, useState, useLayoutEffect } from 'react';
import { getProfile } from "@src/core/cms/endpoints/profile";

export const useGetSettings = (account) => {
  const [response, setResponse] = useState({
    isLoading: true,
    signer: null,
    response: null,
  });

  const getProfileSettings = useCallback(async (account) => {
    setResponse({
      ...response,
      isLoading: true,
    });

    if (account) {
      try {
        const payload = await getProfile(account);

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
    [setResponse, response]
  );

  useLayoutEffect(() => {
    getProfileSettings(account);
  }, [account]);

  const updateProfileSettings = useCallback(() => {
    getProfileSettings(account);
  }, [account]);

  return [response, updateProfileSettings];
};

export default useGetSettings;
