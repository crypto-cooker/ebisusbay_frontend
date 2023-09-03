import Query from "@src/core/services/api-service/mapi/queries/index";

export interface FullCollectionsQueryParams {
  address?: string;
  token?: string;
  listed?: number;
  traits?: string; // [key: string]: string[]
  powertraits?: string; // [key: string]: string[]
  page?: number;
  pageSize?: number;
  sortBy?: 'id' | 'name' | 'rank' | 'price' | 'listingId' | 'listingTime' | 'expirationDate';
  direction?: 'asc' | 'desc';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minListingTime?: number;
  maxListingTime?: number;
  minRank?: number;
  maxRank?: number;
  burnt?: number;
  currency?: string;
}

export class FullCollectionsQuery extends Query<FullCollectionsQueryParams> {

  defaultParams(): FullCollectionsQueryParams {
    return {};
  }
}

// export class FullCollectionsQuery {
//   address?: string;
//   token?: string;
//   listed?: boolean;
//   traits = {};
//   powertraits = {};
//   search?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   minListingTime?: number;
//   maxListingTime?: number;
//   minRank?: number;
//   maxRank?: number;
//
//   constructor(json: any) {
//     Object.assign(this, json);
//   }
//
//   static default() {
//     return new FullCollectionsQuery({});
//   }
//
//   static createApiQuery(json: any) {
//     return new FullCollectionsQuery(json);
//   }
//
//   toQuery() {
//     const obj = {
//       address: this.address,
//       token: this.token,
//       listed: this.listed,
//       traits: this.traits,
//       powertraits:  this.powertraits,
//       search: this.search,
//       minPrice: this.minPrice,
//       maxPrice: this.maxPrice,
//       minListingTime: this.minListingTime,
//       maxListingTime: this.maxListingTime,
//       minRank: this.minRank,
//       maxRank: this.maxRank,
//     };
//
//     return Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
//       return !!v && !isEmptyObj(v)
//     }));
//   }
// }
