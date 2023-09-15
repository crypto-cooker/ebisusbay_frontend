import {useCallback, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {JsonRpcProvider} from "@ethersproject/providers";
import * as Sentry from '@sentry/react';
import {useAtom} from "jotai/index";
import {storageSignerAtom} from "@src/jotai/atoms/storage";

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
  const [getSignatureInStorage, setSignatureInStorage] = useAtom(storageSignerAtom);

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

  const createSigner = async () => {
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

      setSignatureInStorage(signer);
      setIsLoading(false);

      return [signature, address];
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);

    return [null, address];
  };

  const getSigner = async () => {
    let signature: string | null = null;
    let address: string | null = null;

    if (getSignatureInStorage && !!getSignatureInStorage.signature) {
      signature = getSignatureInStorage.signature;
      address = getSignatureInStorage.address;
    } else {
      [signature, address] = await createSigner();
    }

    return { signature, address };
  };

  return [isLoading, getSigner] as const;
};

export default useSignature;
