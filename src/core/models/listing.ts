import {InvalidState, ListingState} from "@src/core/services/api-service/types";

class Listing {
  listingId: string | any;
  nftId: string | any;
  nftAddress: string | any;
  valid: boolean | any;
  invalid: InvalidState | any;
  seller: string | any;
  purchaser: string | any;
  state: ListingState | any;
  price: number | any;
  royalty: number | any;
  fee: number | any;
  saleTime: number | any;
  listingTime: number | any;
  expirationDate: number | any;
  nft: any;
  collection: any;

  public constructor(init: Listing) {
    Object.assign(this, init);
  }

}

export default Listing;