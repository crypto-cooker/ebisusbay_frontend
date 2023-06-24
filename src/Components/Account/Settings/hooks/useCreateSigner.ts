import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';

import {setAuthSignerInStorage} from '@src/helpers/storage';
import {setAuthSigner} from '@src/GlobalState/User';
import {useAppSelector} from "@src/Store/hooks";
import {JsonRpcProvider} from "@ethersproject/providers";
import * as Sentry from '@sentry/react';

const message = (address: string) => {
  return "Welcome to Ebisu's Bay!\n\n" +
    "Click to sign in and accept the Ebisu's Bay Terms of Service: https://app.ebisusbay.com/terms-of-service.html\n\n" +
    "This request will not trigger a blockchain transaction or cost any gas fees.\n\n" +
    `Wallet address:\n${address.toLowerCase()}`
}

type SignerProps = {
  date: Date;
  signature: string;
  address: string;
}

const useSignature = () => {
  const user = useAppSelector((state) => state.user);
  const signer: SignerProps | null = user.authSignature;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const signMessage = useCallback(
    async (message: string) => {
      if (!user.provider) throw new Error();

      try {
        const provider = user.provider as JsonRpcProvider;
        const signer = provider.getSigner();
        return await signer.signMessage(message);
      } catch (err: any) {
        Sentry.captureException(err);
        throw new Error(err);
      }
    },
    [user.provider]
  );

  const createSigner = useCallback(async () => {
    setIsLoading(true);
    const address = user.address!;

    try {
      const signature = await signMessage(message(address));
      const date = new Date();
      const signer: SignerProps = {
        date,
        signature,
        address,
      };

      dispatch(setAuthSigner(signer));
      setAuthSignerInStorage(signer);
      setIsLoading(false);

      return [signature, address];
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);

    return [null, address];
  }, [signMessage]);

  const getSigner = useCallback(async () => {
    let signature: string | null = null;
    let address: string | null = null;

    if (signer) {
      signature = (signer as SignerProps).signature;
      address = (signer as SignerProps).address;
    } else {
      [signature, address] = await createSigner();
    }

    return { signature, address };
  }, [signer, user]);

  return [isLoading, getSigner] as const;
};

export default useSignature;
