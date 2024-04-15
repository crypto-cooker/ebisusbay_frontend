import {isEmptyObj} from "@market/helpers/utils";
import Query from "@src/core/services/api-service/mapi/queries/index";
import * as Yup from 'yup';

export const walletsQuerySchema: Yup.SchemaOf<WalletsQueryParams> = Yup.object().shape({
  wallet: Yup.string().optional(),
  collection: Yup.array().of(Yup.string()).optional(),
  pageSize: Yup.number().optional().default(50),
  page: Yup.number().optional().default(1),
  sortBy: Yup.mixed().oneOf(['id', 'rank', 'receivedTimestamp', 'address', 'price', 'offerPrice']).default('receivedTimestamp'),
  direction: Yup.mixed().oneOf(['asc', 'desc']).default('desc'),
  type: Yup.mixed().oneOf(['1155', '721']),
  listed: Yup.number().optional(),
  offered: Yup.number().optional(),
  minRank: Yup.number().optional(),
  maxRank: Yup.number().optional(),
  minPrice: Yup.number().optional(),
  maxPrice: Yup.number().optional(),
  minListingTime: Yup.number().optional(),
  maxListingTime: Yup.number().optional(),
  search: Yup.string().optional(),
  currency: Yup.string().optional()
}).noUnknown();

export interface WalletsQueryParams {
  wallet?: string;
  collection?: string[];
  pageSize?: number;
  page?: number;
  sortBy?: 'id' | 'rank' | 'receivedTimestamp' | 'address' | 'price' | 'offerPrice';
  direction?: 'asc' | 'desc';
  type?: '1155' | '721';
  listed?: number;
  offered?: number;
  minRank?: number;
  maxRank?: number;
  minPrice?: number;
  maxPrice?: number;
  minListingTime?: number;
  maxListingTime?: number;
  search?: string;
  currency?: string;
}

class WalletsQuery extends Query<WalletsQueryParams> {

  defaultParams(): WalletsQueryParams {
    return {
      page: 1,
      pageSize: 50,
      sortBy: 'receivedTimestamp',
      direction: 'desc'
    };
  }

  toQuery() {
    if (!this.params) throw 'Invalid params';

    const obj: any = {
      wallet: this.params.wallet,
      collection: Array.isArray(this.params.collection) ? this.params.collection.join(',') : this.params.collection,
      pageSize: this.params.pageSize,
      page: this.params.page,
      sortBy: this.params.sortBy,
      direction: this.params.direction,
      type: this.params.type,
      listed: this.params.listed,
      offered: this.params.offered,
      search: this.params.search,
    };

    if (!!this.params.minRank) obj.minRank = this.params.minRank;
    if (!!this.params.maxRank) obj.maxRank = this.params.maxRank;
    if (!!this.params.minPrice) obj.minPrice = this.params.minPrice;
    if (!!this.params.maxPrice) obj.maxPrice = this.params.maxPrice;
    if (!!this.params.minListingTime) obj.minListingTime = this.params.minListingTime;
    if (!!this.params.maxListingTime) obj.maxListingTime = this.params.maxListingTime;
    if (!!this.params.currency) obj.currency = this.params.currency;

    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
      return v !== undefined && !isEmptyObj(v)
    }));
  }
}

export default WalletsQuery;