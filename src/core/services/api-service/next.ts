import axios, {AxiosInstance} from "axios";
import {ListingsQuery} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import Listing from "@src/core/models/listing";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import OffersQuery from "@src/core/services/api-service/mapi/queries/offers";
import {Api} from "@src/core/services/api-service/types";

class NextApiService implements Api {
  private next: AxiosInstance;

  constructor() {
    this.next = axios.create({baseURL: '/api'});
  }

  async getListings(query?: ListingsQuery): Promise<PagedList<any>> {
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

  async getOffers(query?: OffersQuery): Promise<PagedList<any>> {
    const response = await this.next.get(`offers`, {
      params: query
    });

    return response.data;
  }


  // Non-interface convenience methods

  async getListingsByCollection(address: string, query?: ListingsQuery): Promise<PagedList<any>> {
    if (!query) query = ListingsQuery.default();
    query.collection = address;

    return await this.getListings(query);
  }

  async getListingsByIds(listingIds: string | string[], query?: ListingsQuery): Promise<PagedList<any>> {
    if (!Array.isArray(listingIds)) listingIds = [listingIds];

    if (!query) query = ListingsQuery.default();
    query.listingId = listingIds;

    return await this.getListings(query);
  }

  /**
   * Get all listings by user, bypassing paging
   *
   * @param address
   * @param query
   */
  async getAllListingsByUser(address: string, query?: ListingsQuery): Promise<PagedList<any>> {
    if (!query) query = ListingsQuery.default();
    query.seller = address;
    query.pageSize = 1000;

    return await this.getListings(query);
  }
}

export default new NextApiService();