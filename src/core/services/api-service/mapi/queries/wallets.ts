import {isEmptyObj} from "@src/utils";
import Query from "@src/core/services/api-service/mapi/queries/index";
import {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import {OfferState} from "@src/core/services/api-service/types";

export interface WalletsQueryParams {
  wallet?: string;
  collection?: string[] | string;
  pageSize?: number;
  page?: number;
  sortBy?: 'id' | 'rank' | 'receivedTimestamp' | 'address';
  direction?: 'asc' | 'desc';
  type?: '1155' | '721';
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

  // constructor(wallet: string, json: any) {
  //   this.wallet = wallet;
  //   Object.assign(this, json);
  // }
  //
  toQuery() {
    if (!this.params) throw 'Invalid params';

    const obj = {
      wallet: this.params.wallet,
      collection: Array.isArray(this.params.collection) ? this.params.collection.join(',') : this.params.collection,
      pageSize: this.params.pageSize,
      page: this.params.page,
      sortBy: this.params.sortBy,
      direction: this.params.direction,
      type: this.params.type
    };

    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
      return !!v && !isEmptyObj(v)
    }));
  }
}

export default WalletsQuery;