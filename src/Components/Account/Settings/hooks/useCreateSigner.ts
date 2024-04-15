import {useCallback, useState} from 'react';
import * as Sentry from '@sentry/react';
import {useAtom} from "jotai";
import {storageSignerAtom} from "@market/state/jotai/atoms/storage";
import {useSignMessage} from "wagmi";
import {useUser} from "@src/components-v2/useUser";

export const signinMessage = (address: string) => {
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
  const user = useUser();
  const [getSignatureInStorage, setSignatureInStorage] = useAtom(storageSignerAtom);

  const [isLoading, setIsLoading] = useState(false);
  const { signMessageAsync: performSignMessage } = useSignMessage();

  const signMessage = useCallback(
    async (message: string) => {
      if (!user.wallet.isConnected) throw new Error();

      try {
        return await performSignMessage({message});
      } catch (err: any) {
        Sentry.captureException(err);
        throw new Error(err);
      }
    },
    [user.wallet.isConnected]
  );

  const createSigner = async () => {
    setIsLoading(true);
    const address = user.wallet.address!;

    try {
      const signature = await signMessage(signinMessage(address));
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

  const getSigner = async (forceNew?: boolean) => {
    let signature: string | null = null;
    let address: string | null = null;

    if (getSignatureInStorage && !!getSignatureInStorage.signature && !forceNew) {
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
