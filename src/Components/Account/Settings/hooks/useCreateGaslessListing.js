import { useState } from 'react';

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

  const user = useSelector((state) => state.user);

  const createGaslessListing = async (listings) => {
    if (!Array.isArray(listings)) listings = [listings];

    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      for (const listing of listings) {
        listing.salt = generator.uuid();
        listing.listingTime = Math.round(new Date().getTime() / 1000);
        listing.expirationDate = Math.round(listing.expirationDate / 1000)
        const { objectSignature, objectHash } = await createListingSigner(listing);
        listing.sellerSignature = objectSignature;
        listing.seller = user.address.toLowerCase();
        listing.digest = objectHash
        const res = await createListing(listing)
      }

      setResponse({
        ...response,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      setResponse({
        ...response,
        loading: false,
        error: error,
      });
      throw error;
    }
  };

  return [createGaslessListing, response];
};

export default useCreateGaslessListing;
