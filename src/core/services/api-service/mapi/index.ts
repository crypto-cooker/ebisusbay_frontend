import ListingsRepository from "@src/core/services/api-service/mapi/repositories/listings";
import {ListingsQuery, ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import axios from "axios";
import {appConfig} from "@src/Config";
import {Listing, ListingMapper, OwnerListing} from "@src/core/models/listing";
import OffersQuery, {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import OffersRepository from "@src/core/services/api-service/mapi/repositories/offers";
import {Offer} from "@src/core/models/offer";
import WalletsQuery, {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import WalletsRepository from "@src/core/services/api-service/mapi/repositories/wallets";
import WalletNft from "@src/core/models/wallet-nft";
import {enrichOwnerListing, enrichWalletNft} from "@src/core/services/api-service/mapi/enrichment";
import {findCollectionByAddress} from "@src/utils";
import CollectionsRepository from "@src/core/services/api-service/mapi/repositories/collections";
import {
  CollectionInfoQuery,
  CollectionInfoQueryParams
} from "@src/core/services/api-service/mapi/queries/collectioninfo";
import OffersV2Query, {OffersV2QueryParams} from "@src/core/services/api-service/mapi/queries/offersV2";
import {
  FullCollectionsQuery,
  FullCollectionsQueryParams
} from "@src/core/services/api-service/mapi/queries/fullcollections";
import OrdersRepository from "@src/core/services/api-service/mapi/repositories/orders";

const config = appConfig();

class Mapi {
  private listings;
  private offers;
  private wallets;
  private collections;
  private orders;

  constructor(apiKey?: string) {
    this.listings = new ListingsRepository(apiKey);
    this.offers = new OffersRepository(apiKey);
    this.wallets = new WalletsRepository(apiKey);
    this.collections = new CollectionsRepository(apiKey);
    this.orders = new OrdersRepository(apiKey);
  }

  async getListings(query?: ListingsQueryParams): Promise<PagedList<Listing>> {
    const response = await this.listings.getListings(new ListingsQuery(query));

    return new PagedList<Listing>(
      response.data.listings,
      response.data.page,
      response.data.page < response.data.totalPages,
      response.data.totalCount
    )
  }

  async getCollectionItems(query: FullCollectionsQueryParams): Promise<PagedList<any>> {
    const response = await this.collections.getFullCollections(new FullCollectionsQuery(query));

    return new PagedList<any>(
      response.data.nfts,
      response.data.page,
      response.data.page < response.data.totalPages,
      response.data.totalCount
    )
  }

  async getUnfilteredListings(query?: ListingsQueryParams): Promise<PagedList<OwnerListing>> {
    const response = await this.listings.getUnfilteredListings(new ListingsQuery(query));

    const walletNfts: WalletNft[] = [];
    let hasNextPage = true;
    let page = 1;
    while(hasNextPage) {
      const walletData = await this.getWallet({wallet: query?.seller, pageSize: 100, page});
      walletNfts.push(...walletData.data);
      hasNextPage = walletData.hasNextPage;
      page++;
    }

    const listings = await Promise.all(response.data.listings.map(async (listing: any): Promise<OwnerListing> => {
      return enrichOwnerListing(ListingMapper.fromMapi(listing), walletNfts);
    }));

    return new PagedList<OwnerListing>(
      listings,
      response.data.page,
      response.data.page < response.data.totalPages,
      response.data.totalCount
    )
  }

  async search(query?: SearchQuery): Promise<PagedList<any>> {
    const api = axios.create({baseURL: config.urls.api});
    return await api.get(`search`, {params: {query}});
  }

  async getOffers(query?: OffersQueryParams): Promise<PagedList<Offer>> {
    const response = await this.offers.getOffers(new OffersQuery(query));

    return new PagedList<Offer>(
      response.data.offers,
      response.data.page,
      response.data.page < response.data.totalPages,
      response.data.totalCount
    )
  }

  async getReceivedOffers(query?: OffersV2QueryParams): Promise<PagedList<Offer>> {
    const response = await this.offers.getReceivedOffers(new OffersV2Query(query));

    return new PagedList<Offer>(
      response.data.offers,
      response.data.page,
      response.data.page < response.data.totalPages,
      response.data.totalCount
    )
  }

  async getOffersOverview(address: string): Promise<any> {
    return await this.offers.getOffersOverview(address);
  }

  async getWallet(query?: WalletsQueryParams): Promise<PagedList<WalletNft>> {
    const response = await this.wallets.get(new WalletsQuery(query));

    const filteredNfts = response.data.nfts.filter((nft: any) => {
      return !!findCollectionByAddress(nft.nftAddress, nft.nftId);
    });

    const nfts = await Promise.all(filteredNfts.map(async (nft: any): Promise<WalletNft> => {
      const walletNft = WalletNft.fromMapi(nft);
      return await enrichWalletNft(walletNft);
    }));

    return new PagedList<WalletNft>(
      nfts,
      response.data.page,
      response.data.page < response.data.totalPages,
      response.data.totalCount
    )
  }

  async getMadeOffersByUser(address: string, query?: OffersQueryParams): Promise<PagedList<Offer>> {
    if (!query) query = {};
    query.purchaser = address;

    return await this.getOffers(query);
  }

  async getCollections(query?: CollectionInfoQueryParams): Promise<PagedList<any>> {
    const response = await this.collections.getCollections(new CollectionInfoQuery(query));

    return new PagedList<Listing>(
      response.data.collections,
      response.data.page,
      response.data.page < response.data.totalPages,
      response.data.totalCount
    )
  }

  async getCollectionTraits(address: string) {
    const response = await this.collections.getCollectionTraits(address);

    if (response.data.collections.length > 0 && response.data.collections[0].rarity) {
      const {['_meta']: _, ...filteredRarity} = response.data.collections[0].rarity;
      return filteredRarity;
    }

    return {}
  }

  async getDeal(id: string) {
    const response = await this.orders.getDeal(id);

    return response.data.swaps[0];
  }
}

export default Mapi;