import {ListingsQuery} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import Cms from "@src/core/services/api-service/cms";
import Mapi from "@src/core/services/api-service/mapi";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import OffersQuery, {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import Listing from "@src/core/models/listing";
import {Api} from "@src/core/services/api-service/types";
import {Offer} from "@src/core/models/offer";



export class ApiService implements Api {
  private mapi: Mapi;
  private cms: Cms;

  constructor(apiKey?: string) {
    this.mapi = new Mapi(apiKey);
    this.cms = new Cms(apiKey);
  }

  static withKey(apiKey: string) {
    return new ApiService(apiKey);
  }

  async getListings(query?: ListingsQuery): Promise<PagedList<any>> {
    return await this.mapi.getListings(query);
  }

  async getProfile(addressOrUsername: string): Promise<any> {
    return await this.cms.getProfile(addressOrUsername);
  }

  async search(query?: SearchQuery): Promise<PagedList<any>> {
    return await this.mapi.search(query);
  }

  async getOffers(query?: OffersQueryParams): Promise<PagedList<Offer>> {
    return await this.mapi.getOffers(query);
  }

  async getMadeOffersByUser(address: string, query?: OffersQueryParams): Promise<PagedList<Offer>> {
    if (!query) query = {};
    query.purchaser = address;

    return await this.getOffers(query);
  }
}

