import {InvalidState, ListingState} from "@src/core/services/api-service/types";

export interface Listing {
  listingId: string;
  nftId: string;
  nftAddress: string;
  valid: boolean;
  invalid: InvalidState;
  seller: string;
  purchaser: string;
  state: ListingState;
  price: string;
  royalty: string;
  fee: string;
  saleTime: number | null;
  listingTime: number;
  expirationDate: number | null;
  transactionHash: string | null;
  nft: any;
  collection: any;
  currency: string;
  amount: number;
  chain: number;
}

export interface OwnerListing extends Listing {
  isInWallet: boolean;
}

export class ListingMapper {

  static fromMapi(props: any): Listing {
    return {
      listingId: props.listingId,
      nftId: props.nftId,
      nftAddress: props.nftAddress,
      valid: props.valid,
      invalid: props.invalid,
      seller: props.seller,
      purchaser: props.purchaser,
      state: props.state,
      price: props.price,
      royalty: props.royalty,
      fee: props.fee,
      saleTime: Number(props.saleTime),
      listingTime: Number(props.listingTime),
      expirationDate: Number(props.expirationDate),
      transactionHash: props.transactionHash,
      nft: props.nft,
      collection: props.collection,
      currency: props.currency,
      amount: Number(props.amount)
    }
  }

}