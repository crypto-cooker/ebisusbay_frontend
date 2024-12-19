import axios, {AxiosInstance} from "axios";
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import {Listing, OwnerListing} from "@src/core/models/listing";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import {Api, OfferType} from "@src/core/services/api-service/types";
import {Offer} from "@src/core/models/offer";
import {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import WalletNft from "@src/core/models/wallet-nft";
import {OffersV2QueryParams} from "@src/core/services/api-service/mapi/queries/offersV2";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";

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

  async getCollectionItems(address: string, query?: FullCollectionsQueryParams): Promise<PagedList<any>> {
    const response = await this.next.get(`collection/${address}/items`, {
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

  async getWallet(address: string, query?: WalletsQueryParams): Promise<PagedList<WalletNft>> {
    const response = await this.next.get(`users/${address}/wallet`, {
      params: query
    });

    return response.data;
  }

  async getUserUnfilteredListings(address: string, query?: ListingsQueryParams): Promise<PagedList<OwnerListing>> {
    const response = await this.next.get(`users/${address}/unfilteredlistings`, {
      params: query
    });

    return response.data;
  }

  // Non-interface convenience methods

  async getListingsByCollection(address: string, query?: ListingsQueryParams): Promise<PagedList<any>> {
    if (!query) query = {};
    query.collection = [address];

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

  async getReceivedOffersByUser(address: string, query?: OffersV2QueryParams): Promise<PagedList<Offer>> {
    const response = await this.next.get(`users/${address}/received-offers`, {
      params: query
    });

    return response.data;
  }

  async getOffersOverview(address: string): Promise<any> {
    const response = await this.next.get(`users/${address}/offers/overview`);
    return response.data;
  }

  getCollectionTraits(address: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async getFilteredCollection(query?: any): Promise<any> {
    const response = await this.next.get('collections', {
      params: query
    });
    return response.data
  }
}

export default new NextApiService();