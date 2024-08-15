import {isEmptyObj} from "@market/helpers/utils";
import {limitSizeOptions} from "../../../Components/components/constants/filter-options";

export class ListingsQuery {
  listingId = null;
  collection = null;
  tokenId = null;
  seller = null;
  sortBy = null;
  direction = null;
  state = null;
  page = null;
  pageSize = null
  traits = {};
  powertraits = {};
  search = null;
  invalid = null;
  minPrice = null;
  maxPrice = null;
  minListingTime = null;
  maxListingTime = null;
  minSaleTime = null;
  maxSaleTime = null;
  minRank = null;
  maxRank = null;
  verified = null;

  constructor(json) {
    Object.assign(this, json);
  }

  static default() {
    return new ListingsQuery();
  }

  static fromCollectionFilter(json) {
    let query = new ListingsQuery(json);

    if (Object.keys(query).includes('address')) {
      query.collection = query.address;
      delete query.address;
    }

    return query;
  }

  static fromMarketFilter(json) {
    let query = new ListingsQuery(json);
    query.collection = json.address;
    delete query.address;

    return query;
  }

  toApi() {
    const collection = Array.isArray(this.collection) ? this.collection.join(',') : this.collection;
    const obj = {
      listingId: this.listingId,
      collection: collection,
      tokenId: this.tokenId,
      seller: this.seller,
      sortBy: this.sortBy,
      direction: this.direction,
      state: this.state,
      page: this.page,
      pageSize: this.pageSize,
      traits: this.traits,
      powertraits: this.powertraits,
      search: this.search,
      invalid: this.invalid,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minListingTime: this.minListingTime,
      maxListingTime: this.maxListingTime,
      minSaleTime: this.minSaleTime,
      maxSaleTime: this.maxSaleTime,
      minRank: this.minRank,
      maxRank: this.maxRank,
      verified: this.verified,
    };

    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
      return !!v && !isEmptyObj(v)
    }));
  }
}
