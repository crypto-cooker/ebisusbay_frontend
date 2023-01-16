import { useState } from 'react';

import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from './useCreateSigner';
import useCreateListingSigner from '../../../../hooks/useCreateListingSigner';
import {useSelector} from "react-redux";
import { createListing } from '@src/core/cms/endpoints/gaslessListing';
import UUID from 'uuid-int';

const generator = UUID(0);

const useCreateGaslessListing = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoadingListing, createListingSigner] = useCreateListingSigner();
  const [isLoading, getSigner] = useCreateSigner();

  const user = useSelector((state) => state.user);

  const createGaslessListing = async (listing) => {
    setResponse({
      ...response,
      loading: true,
      error: null,
    });
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        listing.salt = generator.uuid();
        listing.listingTime = Math.round(new Date().getTime() / 1000);
        listing.expirationDate = Math.round(listing.expirationDate / 1000)
        const { objectSignature, objectHash } = await createListingSigner(listing);
        listing.sellerSignature = objectSignature;
        listing.digest = objectHash

        const res = await createListing(signatureInStorage, user.address.toLowerCase(), listing)

        setResponse({
          ...response,
          loading: false,
          error: null,
        });

        return true;
      } catch (error) {
        console.log(error)
        setResponse({
          ...response,
          loading: false,
          error: error,
        });
        throw error;
      }
    } else {
      setResponse({
        isLoading: false,
        response: [],
        error: { message: 'Something went wrong' },
      });

      throw new Error();
    }
  };

  return [createGaslessListing, response];
};

export default useCreateGaslessListing;
