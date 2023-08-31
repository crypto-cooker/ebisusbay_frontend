import {InvalidState, OfferState} from "@src/core/services/api-service/types";

export interface Offer {
  offerId: string;
  hash: string;
  offerIndex: string;
  nftId: string;
  nftAddress: string;
  valid: boolean;
  invalid: InvalidState;
  seller?: string;
  purchaser: string;
  state: OfferState;
  price: string;
  saleTime: number;
  listingTime: number;
  nft: any;
  collection: any;
  metadata?: any;
}