import {ListingsQuery} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import Cms from "@src/core/services/api-service/cms";
import Mapi from "@src/core/services/api-service/mapi";
import axios, {AxiosInstance} from "axios";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import OffersQuery from "@src/core/services/api-service/mapi/queries/offers";
import Listing from "@src/core/models/listing";

interface Api {
  getListings(query?: ListingsQuery): Promise<PagedList<Listing>>;
  getProfile(addressOrUsername: string): Promise<any>;
  search(query?: SearchQuery): Promise<PagedList<any>>;
  getOffers(query?: OffersQuery): Promise<PagedList<any>>
}

export class ApiService implements Api {
  private mapi: Mapi;
  private cms: Cms;

  constructor() {
    this.mapi = new Mapi();
    this.cms = new Cms();
  }

  async getListings(query?: ListingsQuery): Promise<PagedList<Listing>> {
    return await this.mapi.getListings(query);
  }

  async getProfile(addressOrUsername: string): Promise<any> {
    return await this.cms.getProfile(addressOrUsername);
  }

  async search(query?: SearchQuery): Promise<PagedList<any>> {
    return await this.mapi.search(query);
  }

  async getOffers(query?: OffersQuery): Promise<PagedList<any>> {
    return await this.mapi.getOffers(query);
  }

  async getOffersByUser(address: string, query?: OffersQuery): Promise<PagedList<any>> {
    return await this.mapi.getOffersByUser(address, query);
  }
}

export class NextApiService implements Api {
  private next: AxiosInstance;

  constructor() {
    this.next = axios.create({baseURL: '/api'});
  }

  async getListings(query?: ListingsQuery): Promise<PagedList<Listing>> {
    return await this.next.get(`listings`, {
      params: query
    });
  }

  async getProfile(addressOrUsername: string): Promise<any> {
    return await this.next.get(`users/${addressOrUsername}/profile`, {
      params: {addressOrUsername}
    });
  }

  async search(query?: SearchQuery): Promise<PagedList<any>> {
    return await this.next.get(`search`, {
      params: query
    });
  }

  async getOffers(query?: OffersQuery): Promise<PagedList<any>> {
    return await this.next.get(`offers`, {
      params: query
    });
  }
}