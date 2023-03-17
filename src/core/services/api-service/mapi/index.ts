import ListingsRepository from "@src/core/services/api-service/mapi/repositories/listings";
import {ListingsQuery, ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import axios from "axios";
import {appConfig} from "@src/Config";
import Listing from "@src/core/models/listing";
import OffersQuery, {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import OffersRepository from "@src/core/services/api-service/mapi/repositories/offers";
import {Offer} from "@src/core/models/offer";
import WalletsQuery, {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import WalletsRepository from "@src/core/services/api-service/mapi/repositories/wallets";
import WalletNft from "@src/core/models/wallet-nft";
import {enrichWalletNft} from "@src/core/services/api-service/mapi/enrichment";
import {findCollectionByAddress} from "@src/utils";
const config = appConfig();

class Mapi {
  private listings;
  private offers;
  private wallets;

  constructor(apiKey?: string) {
    this.listings = new ListingsRepository(apiKey);
    this.offers = new OffersRepository(apiKey);
    this.wallets = new WalletsRepository(apiKey);
  }

  async getListings(query?: ListingsQueryParams): Promise<PagedList<Listing>> {
    const response = await this.listings.getListings(new ListingsQuery(query));

    return new PagedList<Listing>(
      response.data.listings,
      response.data.page,
      response.data.page < response.data.totalPages
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
      response.data.page < response.data.totalPages
    )
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
      response.data.page < response.data.totalPages
    )
  }

  async getMadeOffersByUser(address: string, query?: OffersQueryParams): Promise<PagedList<Offer>> {
    if (!query) query = {};
    query.purchaser = address;

    return await this.getOffers(query);
  }
}

export default Mapi;