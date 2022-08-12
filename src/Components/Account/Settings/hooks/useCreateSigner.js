import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';

import { setAuthSignerInStorage } from '../../../../helpers/storage';
import { setAuthSigner } from '../../../../GlobalState/User';

const nonce = 'ProfileSettings';

const useSignature = () => {
  const user = useSelector((state) => state.user);
  const signer = user.authSignature;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const signMessage = useCallback(
    async (message) => {
      if (!user.provider) throw new Error();

      const hash = await ethers.utils.id(message);
      const provider = user.provider;
      const signer = provider.getSigner();
      const signature = await signer.signMessage(ethers.utils.arrayify(hash));

      return signature;
    },
    [user.provider]
  );

  const createSigner = useCallback(async () => {
    setIsLoading(true);

    try {
      const signature = await signMessage(nonce);
      const date = new Date();
      const signer = {
        date,
        signature,
        nonce,
      };

      dispatch(setAuthSigner(signer));
      setAuthSignerInStorage(signer);
      setIsLoading(false);

      return [signature, nonce];
    } catch (err) {
      console.log(err?.message);
    }

    setIsLoading(false);

    return [null, nonce];
  }, [nonce, signMessage]);

  const getSigner = useCallback(async () => {
    let signature = null;
    let nonce = null;

    const dateFormat = typeof signer?.date;

    if (signer && typeof signer.signature === 'string' && (dateFormat === 'string' || dateFormat === 'object')) {
      signature = signer.signature;
      nonce = signer.nonce;
    } else {
      [signature, nonce] = await createSigner();
    }

    return { signature, nonce };
  }, [signer, user]);

  return [isLoading, getSigner];
};

export default useSignature;
