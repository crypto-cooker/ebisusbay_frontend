import {InvalidState, OfferState} from "@src/core/services/api-service/types";
import {isEmptyObj} from "@src/utils";

class OffersQuery {
  offerId?: string;
  verified?: boolean;
  collection?: string;
  tokenId?: string;
  seller?: string;
  purchaser?: string;
  sortBy?: 'listingId' | 'listingTime' | 'saleTime' | 'price' | 'rank';
  direction?: 'asc' | 'desc';
  state?: OfferState = OfferState.ACTIVE;
  page?: number;
  pageSize?: number;
  traits? = {};
  search?: string;
  invalid?: InvalidState;
  powertraits? = {};
  minPrice?: number;
  maxPrice?: number;
  minListingTime?: number;
  maxListingTime?: number;
  minSaleTime?: number;
  maxSaleTime?: number;
  minRank?: number;
  maxRank?: number;

  toQuery() {
    const obj = {...this};

    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
      return v !== undefined && !isEmptyObj(v)
    }));
  }
}

export default OffersQuery;