import {InvalidState, OfferState, OfferType} from "@src/core/services/api-service/types";
import Query from "@src/core/services/api-service/mapi/queries/index";

export interface OffersQueryParams {
  offerId?: string;
  verified?: boolean;
  collection?: string[];
  type?: OfferType;
  tokenId?: string;
  seller?: string;
  purchaser?: string;
  sortBy?: 'offerId' | 'listingId' | 'listingTime' | 'saleTime' | 'price' | 'rank' | 'nft' | 'name' | 'collectionName';
  direction?: 'asc' | 'desc';
  state?: OfferState;
  page?: number;
  pageSize?: number;
  traits?: object;
  search?: string;
  invalid?: InvalidState;
  powertraits?: object;
  minPrice?: number;
  maxPrice?: number;
  minListingTime?: number;
  maxListingTime?: number;
  minSaleTime?: number;
  maxSaleTime?: number;
  minRank?: number;
  maxRank?: number;
}

class OffersQuery extends Query<OffersQueryParams> {

  defaultParams(): OffersQueryParams {
    return {
      state: OfferState.ACTIVE,
      traits: {},
      powertraits: {},
      page: 1
    };
  }

}

export default OffersQuery;