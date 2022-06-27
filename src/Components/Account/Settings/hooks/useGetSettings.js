import { useRef, useCallback, useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import useCreateSigner from './useCreateSigner';
// import { appConfig } from "../../../Config";

export const useGetSettings = () => {
  const [response, setResponse] = useState({
    isLoading: true,
    signer: null,
    response: [],
  });
  const [isLoading, getSigner] = useCreateSigner();

  const user = useSelector((state) => state.user);
  const signer = user.authSignature;
  const prevProvider = useRef();

  const getProfileSettings = useCallback(async () => {
    if (user.provider) {
      setResponse({
        ...response,
        isLoading: true,
      });

      const { signature, nonce } = await getSigner();

      // console.log(signature, nonce);
      if (signature) {
        const response = await fetch(
          `http://localhost:4000/profile/profile?` + new URLSearchParams({ signature, nonce })
        );
        const payload = await response.json();

        setResponse({
          isLoading: false,
          response: payload,
        });
      } else {
        setResponse({
          isLoading: false,
          response: [],
          error: { message: 'Something when wrong' },
        });
      }
    }
  }, [setResponse, response, signer, user.provider]);

  useLayoutEffect(() => {
    if (user.provider && !prevProvider.current) getProfileSettings();
    prevProvider.current = user.provider;
  }, [signer, user.provider]);

  return response;
};

export default useGetSettings;
