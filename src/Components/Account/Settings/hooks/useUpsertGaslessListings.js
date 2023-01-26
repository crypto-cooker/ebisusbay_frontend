import { useState } from 'react';

import useCreateListingSigner from '../../../../hooks/useCreateListingSigner';
import {useSelector} from "react-redux";
import {cancelListing, upsertListing} from '@src/core/cms/endpoints/gaslessListing';
import UUID from "uuid-int";
import {caseInsensitiveCompare, isGaslessListing} from "@src/utils";
import {getAllListingsByUser} from "@src/core/api/next/listings";

const generator = UUID(0);

const useUpsertGaslessListings = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const [isLoadingListing, createListingSigner] = useCreateListingSigner();

  const user = useSelector((state) => state.user);

  const upsertGaslessListings = async (pendingListings) => {
    if (!Array.isArray(pendingListings)) pendingListings = [pendingListings];

    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    // Get any existing listings
    const listingsResponse = await getAllListingsByUser(user.address);
    console.log('listings', pendingListings, listingsResponse.data.listings)
    const existingListings = listingsResponse.data.listings.filter((eListing) => {
      return pendingListings.some((pListing) => {
        return caseInsensitiveCompare(eListing.nftAddress, pListing.collectionAddress) &&
          eListing.nftId.toString() === pListing.tokenId.toString();
      })
    });
    // Split legacy so that we can run one cancel tx for all gasless
    const cancelIds = {
      legacy: existingListings
        .filter((listing) => !isGaslessListing(listing.listingId))
        .map((listing) => listing.listingId),
      gasless: existingListings
        .filter((listing) => isGaslessListing(listing.listingId))
        .map((listing) => listing.listingId),
    }

    // Deciding to instead hide legacy listings at this time
    // if (cancelIds.legacy.length > 0) {
    //   const port = user.contractService.market;
    //   await port.cancelListings(cancelIds.legacy)
    // }

    // Cancel the old gasless
    if (cancelIds.gasless.length > 0) {
      const { data: orders } = await cancelListing(cancelIds.gasless);
      const ship = user.contractService.ship;
      const tx = await ship.cancelOrders(orders);
      await tx.wait()
    }

    try {
      for (const pendingListing of pendingListings) {
        pendingListing.salt = generator.uuid();
        pendingListing.listingTime = Math.round(new Date().getTime() / 1000);
        pendingListing.expirationDate = Math.round(pendingListing.expirationDate / 1000)
        const {objectSignature, objectHash} = await createListingSigner(pendingListing);
        pendingListing.sellerSignature = objectSignature;
        pendingListing.seller = user.address.toLowerCase();
        pendingListing.digest = objectHash;
        const res = await upsertListing(pendingListing)
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

  return [upsertGaslessListings, response];
};

export default useUpsertGaslessListings;
