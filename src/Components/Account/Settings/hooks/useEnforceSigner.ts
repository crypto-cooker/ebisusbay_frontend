import {useCallback, useEffect, useState} from 'react';

import {getAuthSignerInStorage, removeAuthSignerInStorage} from '@src/helpers/storage';
import {useAppSelector} from "@src/Store/hooks";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {ciEquals} from "@src/utils";
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import useLocalStorage from "@src/Components/Account/Settings/hooks/useLocalStorage";

const useEnforceSignature = () => {
  const user = useAppSelector((state) => state.user);
  const [_, getSigner] = useCreateSigner();
  const [connectWallet] = useAuthedFunction();
  const [signer] = useLocalStorage('AUTH_SIGNATURE');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const checkSigninStatus = async () => {
    if (!user.address) return false;

    let authSignature = getAuthSignerInStorage();
    let signatureInStorage: string | null | undefined = authSignature?.signature;
    const sigMatchesUser = !!authSignature?.address && ciEquals(authSignature?.address, user.address);

    console.log('HELP', !!signatureInStorage, sigMatchesUser);
    return !!signatureInStorage && sigMatchesUser;
  }

  const retrieveSignature = useCallback(async () => {
    const signedIn = await checkSigninStatus();
    if (!signedIn) {
      removeAuthSignerInStorage();
      const { signature } = await getSigner();
      return signature;
    }

    return (getAuthSignerInStorage() as any).signature;
  }, [user, getSigner]);

  const requestSignature = async (fn?: (signature?: string) => void) => {
    const signature = await retrieveSignature();

    if (!!fn && !!signature) {
      fn(signature);
    }

    if (!signature) throw new Error('No signature found');

    return signature;
  };

  const signin = async () => {
    // await connectWallet(async () => {
    //   await retrieveSignature();
    // });
    await retrieveSignature();
  }

  useEffect(() => {
    async function refreshSignin() {
      console.log('refreshSignin1')
      const signedIn = await checkSigninStatus();
      console.log('refreshSignin2', signedIn);
      setIsSignedIn(signedIn);
    }
    console.log('signature changed, check signin...')
    refreshSignin();
  }, [signer, user.address]);

  return {isSignedIn, signin, requestSignature} as const;
};

export default useEnforceSignature;
