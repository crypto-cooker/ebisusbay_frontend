import axios, {AxiosInstance} from "axios";
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import Listing from "@src/core/models/listing";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import {Api, OfferType} from "@src/core/services/api-service/types";
import {Offer} from "@src/core/models/offer";

class NextApiService implements Api {
  private next: AxiosInstance;

  constructor() {
    this.next = axios.create({
      baseURL: '/api',
      paramsSerializer: {
        indexes: null
      }
    });
  }

  async getListings(query?: ListingsQueryParams): Promise<PagedList<Listing>> {
    const response = await this.next.get(`listings`, {
      params: query
    });

    return response.data;
  }

  async getProfile(addressOrUsername: string): Promise<any> {
    const response = await this.next.get(`users/${addressOrUsername}/profile`, {
      params: {addressOrUsername}
    });

    return response.data;
  }

  async search(query?: SearchQuery): Promise<PagedList<any>> {
    const response = await this.next.get(`search`, {
      params: query
    });

    return response.data;
  }

  async getOffers(query?: OffersQueryParams): Promise<PagedList<Offer>> {
    const response = await this.next.get(`offers`, {
      params: query
    });

    return response.data;
  }


  // Non-interface convenience methods

  async getListingsByCollection(address: string, query?: ListingsQueryParams): Promise<PagedList<any>> {
    if (!query) query = {};
    query.collection = address;

    return await this.getListings(query);
  }

  async getListingsByIds(listingIds: string | string[], query?: ListingsQueryParams): Promise<PagedList<any>> {
    if (!Array.isArray(listingIds)) listingIds = [listingIds];

    if (!query) query = {};
    query.listingId = listingIds;

    return await this.getListings(query);
  }

  /**
   * Get all listings by user, bypassing paging
   *
   * @param address
   * @param query
   */
  async getAllListingsByUser(address: string, query?: ListingsQueryParams): Promise<PagedList<any>> {
    if (!query) query = {};
    query.seller = address;
    query.pageSize = 1000;

    return await this.getListings(query);
  }

  async getMadeOffersByUser(address: string, type: OfferType, query?: OffersQueryParams): Promise<PagedList<Offer>> {
    if (!query) query = {};
    query.purchaser = address;
    query.type = type

    return await this.getOffers(query);
  }
}

export default new NextApiService();