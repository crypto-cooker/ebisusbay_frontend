import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import Cms from "@src/core/services/api-service/cms";
import Mapi from "@src/core/services/api-service/mapi";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import {Listing, OwnerListing} from "@src/core/models/listing";
import {
  Api,
  BankStakeNft,
  BarracksStakeNft,
  RyoshiDynastiesApi,
  StakedTokenType
} from "@src/core/services/api-service/types";
import {Offer} from "@src/core/models/offer";
import {WalletsQueryParams} from "./mapi/queries/wallets";
import WalletNft from "@src/core/models/wallet-nft";
import Graph from "@src/core/services/api-service/graph";


export class ApiService implements Api {
  private mapi: Mapi;
  private cms: Cms;
  private graph: Graph;

  public ryoshiDynasties: RyoshiDynastiesApi;

  constructor(apiKey?: string) {
    this.mapi = new Mapi(apiKey);
    this.cms = new Cms(apiKey);
    this.graph = new Graph(apiKey);
    this.ryoshiDynasties = new RyoshiDynastiesGroup(apiKey);
  }

  static withKey(apiKey: string) {
    return new ApiService(apiKey);
  }

  static withoutKey() {
    return new ApiService();
  }

  async getListings(query?: ListingsQueryParams): Promise<PagedList<Listing>> {
    return await this.mapi.getListings(query);
  }

  async getUserUnfilteredListings(address: string, query?: ListingsQueryParams): Promise<PagedList<OwnerListing>> {
    if (!query) query = {};
    query.seller = address;

    return await this.mapi.getUnfilteredListings(query);
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

  async getWallet(address: string, query?: WalletsQueryParams): Promise<PagedList<WalletNft>> {
    return await this.mapi.getWallet({...query, wallet: address});
  }

  async getMadeOffersByUser(address: string, query?: OffersQueryParams): Promise<PagedList<Offer>> {
    if (!query) query = {};
    query.purchaser = address;

    return await this.getOffers(query);
  }
}

class RyoshiDynastiesGroup implements RyoshiDynastiesApi {
  private cms: Cms;
  private graph: Graph;

  constructor(apiKey?: string) {
    this.cms = new Cms(apiKey);
    this.graph = new Graph(apiKey);
  }

  async globalTotalPurchased() {
    return this.graph.globalTotalPurchased();
  }

  async userTotalPurchased(address: string) {
    return this.graph.userTotalPurchased(address);
  }

  async getUserStakedFortune(address: string) {
    return this.graph.getUserStakedFortune(address);
  }
  async getErc20Account(address: string) {
    return this.graph.getErc20Account(address);
  }

  async getStakedTokens(address: string, type: StakedTokenType) {
    return this.graph.getStakedTokens(address, type);
  }

  async requestBankStakeAuthorization(nfts: BankStakeNft[], address: string) {
    return this.cms.requestBankStakeAuthorization(nfts, address);
  }

  async requestBarracksStakeAuthorization(nfts: BarracksStakeNft[], address: string) {
    return this.cms.requestBarracksStakeAuthorization(nfts, address);
  }

  async getDailyRewards(address: string) {
    return this.cms.getDailyRewards(address);
  }

  async getSeasonalRewards(address: string, seasonId?: number) {
    return this.cms.getSeasonalRewards(address, seasonId);
  }

  async claimDailyRewards(address: string, signature: string) {
    return this.cms.claimDailyRewards(address, signature);
  }

  async requestSeasonalRewardsClaimAuthorization(address: string, amount: number, seasonId: number, signature: string) {
    return this.cms.requestSeasonalRewardsClaimAuthorization(address, amount, seasonId, signature);
  }
}