import {isEmptyObj} from "@src/utils";

export class FullCollectionsQuery {
  address?: string;
  token?: string;
  listed?: boolean;
  traits = {};
  powertraits = {};
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minListingTime?: number;
  maxListingTime?: number;
  minRank?: number;
  maxRank?: number;

  constructor(json: any) {
    Object.assign(this, json);
  }

  static default() {
    return new FullCollectionsQuery({});
  }

  static createApiQuery(json: any) {
    return new FullCollectionsQuery(json);
  }

  toQuery() {
    const obj = {
      address: this.address,
      token: this.token,
      listed: this.listed,
      traits: this.traits,
      powertraits:  this.powertraits,
      search: this.search,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minListingTime: this.minListingTime,
      maxListingTime: this.maxListingTime,
      minRank: this.minRank,
      maxRank: this.maxRank,
    };

    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
      return !!v && !isEmptyObj(v)
    }));
  }
}
