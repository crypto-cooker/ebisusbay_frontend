import {useState} from 'react';

import useCreateListingSigner, {ListingSignerProps} from '@market/hooks/useCreateListingSigner';
import {cancelListing, expressCancelListing, upsertListing} from '@src/core/cms/endpoints/gaslessListing';
import UUID from "uuid-int";
import {ciEquals, isGaslessListing} from "@market/helpers/utils";
import NextApiService from "@src/core/services/api-service/next";
import {getItemType} from "@market/helpers/chain";
import {useContractService, useUser} from "@src/components-v2/useUser";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import { ChainId } from '@pancakeswap/chains';
import { useListingsTokens, useSupportedApiTokens } from '@src/global/hooks/use-supported-tokens';

const generator = UUID(0);
// const config = appConfig();

export interface PendingListing {
  collectionAddress: string;
  tokenId: string;
  price: number;
  amount: number;
  expirationDate: number;
  is1155: boolean;
  currencySymbol?: string;
  listingId?: string;
  chainId: number;
}

type ResponseProps = {
  loading: boolean;
  error?: any;
};

const useUpsertGaslessListings = (chainId?: number) => {
  const [response, setResponse] = useState<ResponseProps>({
    loading: false,
    error: null,
  });

  const [_, createListingSigner] = useCreateListingSigner(chainId);
  const { requestSignature } = useEnforceSignature();

  const user = useUser();
  const contractService = useContractService();
  const { tokens: listableCurrencies, search: findCurrency } = useListingsTokens(chainId ?? ChainId.CRONOS);

  const upsertGaslessListings = async (pendingListings: PendingListing[] | PendingListing, secureCancel: boolean = false) => {
    if (!Array.isArray(pendingListings)) pendingListings = [pendingListings];

    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    // Get any existing listings
    const listingsResponse = await NextApiService.getAllListingsByUser(user.address!);
    const existingListings = listingsResponse.data.filter((eListing) => {
      return (pendingListings as Array<PendingListing>).some((pListing) => {
        const matchesListingId = !!pListing.listingId && ciEquals(eListing.listingId, pListing.listingId);
        const matchesNft = ciEquals(eListing.nftAddress, pListing.collectionAddress) &&
          eListing.nftId.toString() === pListing.tokenId.toString();
        return matchesListingId || (!pListing.is1155 && matchesNft);
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
      if (secureCancel) {
        const { data: orders } = await cancelListing(cancelIds.gasless);
        const ship = contractService!.ship;
        const tx = await ship.cancelOrders(orders);
        await tx.wait();
      } else {
        const signature = await requestSignature();
        await expressCancelListing(cancelIds.gasless, user.address, signature);
      }
    }

    try {
      let itemTypes: {[key: string]: number} = {};
      for (const pendingListing of pendingListings) {
        if (itemTypes[pendingListing.collectionAddress] === undefined) {
          itemTypes[pendingListing.collectionAddress] = await getItemType(pendingListing.collectionAddress, pendingListing.chainId);
        }

        const currency = findCurrency({symbol: pendingListing.currencySymbol});

        if (!currency) {
          throw new Error('Unsupported currency for listings');
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
          currency: currency
        };

        const {objectSignature, objectHash} = await createListingSigner(listingSignerProps);
        const res = await upsertListing({
          ...listingSignerProps,
          sellerSignature: objectSignature,
          seller: user.address!.toLowerCase(),
          digest: objectHash,
          currency: currency.address,
          chainId: pendingListing.chainId
        });
      }

      setResponse({
        ...response,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      console.log(error);
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
