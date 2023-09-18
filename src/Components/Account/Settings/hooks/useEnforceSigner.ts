import {useCallback, useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {ciEquals} from "@src/utils";
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {useAtom} from "jotai";
import {storageSignerAtom} from "@src/jotai/atoms/storage";
import {RESET} from "jotai/utils";

const useEnforceSignature = () => {
  const user = useAppSelector((state) => state.user);
  const [_, getSigner] = useCreateSigner();
  const [connectWallet] = useAuthedFunction();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signer, setSigner] = useAtom(storageSignerAtom);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const checkSigninStatus = async () => {
    if (!user.address) return false;

    let authSignature = signer;
    let signatureInStorage: string | null | undefined = authSignature?.signature;
    const sigMatchesUser = !!authSignature?.address && ciEquals(authSignature?.address, user.address);

    return !!signatureInStorage && sigMatchesUser;
  }

  const retrieveSignature = useCallback(async () => {
    const signedIn = await checkSigninStatus();
    if (!signedIn) {
      setSigner(RESET);
      const { signature } = await getSigner();
      return signature;
    }

    return signer.signature;
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
    try {
      setIsSigningIn(true);
      await connectWallet(async () => {
        await retrieveSignature();
      });
    } finally {
      setIsSigningIn(false);
    }
  }

  useEffect(() => {
    async function refreshSignin() {
      const signedIn = await checkSigninStatus();
      setIsSignedIn(signedIn);
    }
    refreshSignin();
  }, [signer, user.address]);

  return {isSignedIn, isSigningIn, signin, requestSignature, signature: signer.signature} as const;
};

export default useEnforceSignature;
