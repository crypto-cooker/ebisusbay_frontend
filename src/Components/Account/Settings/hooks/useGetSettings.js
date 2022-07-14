import { useCallback, useState, useLayoutEffect } from 'react';

export const useGetSettings = (account) => {
  const [response, setResponse] = useState({
    isLoading: true,
    signer: null,
    response: null,
  });

  const getProfileSettings = useCallback(
    async (account) => {
      setResponse({
        ...response,
        isLoading: true,
      });

      if (account) {
        try {
          const response = await fetch(`http://localhost:5555/profile?` + new URLSearchParams({ account }));
          const payload = await response.json();

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

  return response;
};

export default useGetSettings;
