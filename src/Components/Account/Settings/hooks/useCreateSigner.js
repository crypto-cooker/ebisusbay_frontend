import {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {setAuthSignerInStorage} from '@src/helpers/storage';
import {setAuthSigner} from '@src/GlobalState/User';

const message = (address) => {
  return "Welcome to Ebisu's Bay!\n\n" +
    "Click to sign in and accept the Ebisu's Bay Terms of Service: https://cdn.ebisusbay.com/terms-of-service.html\n\n" +
    "This request will not trigger a blockchain transaction or cost any gas fees.\n\n" +
    `Wallet address:\n${address}`
}

const useSignature = () => {
  const user = useSelector((state) => state.user);
  const signer = user.authSignature;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const signMessage = useCallback(
    async (message) => {
      if (!user.provider) throw new Error();

      try {
        const provider = user.provider;
        const signer = provider.getSigner();
        return await signer.signMessage(message);
      } catch (err) {
        Sentry.captureException(err);
        throw new Error(err);
      }

      return signature;
    },
    [user.provider]
  );

  const createSigner = useCallback(async () => {
    setIsLoading(true);
    const address = user.address;

    try {
      const signature = await signMessage(message(address));
      const date = new Date();
      const signer = {
        date,
        signature,
        address,
      };

      dispatch(setAuthSigner(signer));
      setAuthSignerInStorage(signer);
      setIsLoading(false);

      return [signature, address];
    } catch (err) {
      console.log(err?.message);
    }

    setIsLoading(false);

    return [null, address];
  }, [signMessage]);

  const getSigner = useCallback(async () => {
    let signature = null;
    let address = null;

    const dateFormat = typeof signer?.date;

    if (signer && typeof signer.signature === 'string' && (dateFormat === 'string' || dateFormat === 'object')) {
      signature = signer.signature;
      address = signer.address;
    } else {
      [signature, address] = await createSigner();
    }

    return { signature, address };
  }, [signer, user]);

  return [isLoading, getSigner];
};

export default useSignature;
