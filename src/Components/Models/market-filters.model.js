import {isEmptyObj} from "@market/helpers/utils";
import {limitSizeOptions} from "../components/constants/filter-options";

export class MarketFilters {
  collection = MarketFilterCollection.default();
  search = null;
  limit = limitSizeOptions.lg;
  seller = null;
  tokenId = null;
  verified = 0;

  static default() {
    return new MarketFilters();
  }

  /**
   * Maps to an object that is acceptable to use as a URL query string.
   * Includes values such as current tab
   *
   * @returns {*}
   */
  toQuery() {
    let address = this.collection.value;
    let token = this.tokenId;

    const values = address?.split('-') ?? '';
    if (values.length > 1) {
      address = values[0];
      token = values[1];
    }

    const obj = {
      address: address,
      seller: this.seller,
      search: this.search,
      limit: this.limit,
      tokenId: token,
      verified: this.verified
    };

    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
      return !!v && !isEmptyObj(v)
    }));
  }
}

export class MarketFilterCollection {
  label = 'All';
  value = null;

  constructor(label, value) {
    this.label = label ?? 'All';
    this.value = value;
  }

  static default() {
    return new MarketFilterCollection();
  }
}