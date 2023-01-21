import { useState } from 'react';

import useCreateListingSigner from '../../../../hooks/useCreateListingSigner';
import {useSelector} from "react-redux";
import {cancelListing, createListing} from '@src/core/cms/endpoints/gaslessListing';
import UUID from "uuid-int";
import {isGaslessListing} from "@src/utils";

const generator = UUID(0);

const useUpdateGaslessListing = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoadingListing, createListingSigner] = useCreateListingSigner();

  const user = useSelector((state) => state.user);

  const updateGaslessListing = async (listings) => {
    if (!Array.isArray(listings)) listings = [listings];

    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    const cancelIds = {
      legacy: listings
        .filter((listing) => !isGaslessListing(listing.listingId))
        .map((listing) => listing.listingId),
      gasless: listings
        .filter((listing) => isGaslessListing(listing.listingId))
        .map((listing) => listing.listingId),
    };

    // Deciding to instead hide legacy listings at this time
    // if (cancelIds.legacy.length > 0) {
    //   const port = user.contractService.market;
    //   await port.cancelListings(cancelIds.legacy)
    // }

    if (cancelIds.gasless.length > 0) {
      const { data: orders } = await cancelListing(cancelIds.gasless);
      const ship = user.contractService.ship;
      const tx = await ship.cancelOrders(orders);
      await tx.wait()
    }

    try {
      for (const listing of listings) {
        listing.salt = generator.uuid();
        listing.listingTime = Math.round(new Date().getTime() / 1000);
        listing.expirationDate = Math.round(listing.expirationDate / 1000)
        const {objectSignature, objectHash} = await createListingSigner(listing);
        listing.sellerSignature = objectSignature;
        listing.seller = user.address.toLowerCase();
        listing.digest = objectHash;
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

  return [updateGaslessListing, response];
};

export default useUpdateGaslessListing;
