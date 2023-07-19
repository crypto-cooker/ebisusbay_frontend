import {useState} from 'react';

import useCreateListingSigner, {ListingSignerProps} from '../../../../hooks/useCreateListingSigner';
import {cancelListing, upsertListing} from '@src/core/cms/endpoints/gaslessListing';
import UUID from "uuid-int";
import {caseInsensitiveCompare, isGaslessListing} from "@src/utils";
import NextApiService from "@src/core/services/api-service/next";
import {getItemType} from "@src/helpers/chain";
import {useAppSelector} from "@src/Store/hooks";

const generator = UUID(0);

export interface PendingListings {
  collectionAddress: string;
  tokenId: string;
  price: number;
  amount: number;
  expirationDate: number;
  is1155: boolean;
}

interface ListingCandidate {
  itemType: string;
  salt: string;
  listingTime: number;
  expirationDate: number;
}

type ResponseProps = {
  loading: boolean;
  error?: any;
};

const useUpsertGaslessListings = () => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: null,
  });

  const [_, createListingSigner] = useCreateListingSigner();

  const user = useAppSelector((state) => state.user);

  const upsertGaslessListings = async (pendingListings: PendingListings[]) => {
    if (!Array.isArray(pendingListings)) pendingListings = [pendingListings];

    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    // Get any existing listings
    const listingsResponse = await NextApiService.getAllListingsByUser(user.address!);
    const existingListings = listingsResponse.data.filter((eListing) => {
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
      const ship = user.contractService!.ship;
      const tx = await ship.cancelOrders(orders);
      await tx.wait()
    }

    try {
      let itemTypes: {[key: string]: number} = {};
      for (const pendingListing of pendingListings) {
        if (itemTypes[pendingListing.collectionAddress] === undefined) {
          itemTypes[pendingListing.collectionAddress] = await getItemType(pendingListing.collectionAddress);
        }

        const listingSignerProps: ListingSignerProps = {
          price: pendingListing.price.toString(),
          itemType: itemTypes[pendingListing.collectionAddress],
          collectionAddress: pendingListing.collectionAddress,
          tokenId: pendingListing.tokenId,
          listingTime: Math.round(new Date().getTime() / 1000),
          expirationDate: Math.round(pendingListing.expirationDate / 1000),
          salt: generator.uuid(),
          amount: pendingListing.amount,
        };

        const {objectSignature, objectHash} = await createListingSigner(listingSignerProps);

        const res = await upsertListing({
          ...listingSignerProps,
          sellerSignature: objectSignature,
          seller: user.address!.toLowerCase(),
          digest: objectHash,
        });
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

  return [upsertGaslessListings, response] as const;
};

export default useUpsertGaslessListings;
