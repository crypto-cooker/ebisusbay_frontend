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
import RdGame7Winners from "@src/core/data/rd-game7-winners.json";
import {caseInsensitiveCompare} from "@src/utils";

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

  async getRewardedEntities(gameId: number): Promise<any> {
    const pointsByAddress = await this.cms.getGameWinners(gameId);
    // const ids = rewardedCollections.map((collection: any) => collection.id);
    // const pointsByAddress = Object.values(RdGame7Winners).reduce((result, record) => {
    //   record.faction.addresses.forEach(address => {
    //     const existingEntry = result.find(entry => entry.address === address);
    //
    //     if (existingEntry) {
    //       existingEntry.points += record.points;
    //     } else {
    //       result.push({
    //         address: address,
    //         points: record.points,
    //         type: record.faction.type
    //       });
    //     }
    //   });
    //
    //   return result;
    // }, [] as Array<{ address: string; points: number; type: string }>);

    const collectionAddresses = pointsByAddress
      .filter(entry => entry.type === 'COLLECTION')
      .map(entry => entry.address);
    const collections = await this.mapi.getCollections({address: collectionAddresses, pageSize: 200});
    const mappedCollections = collections.data.map((collection: any) => {
      return {
        name: collection.name,
        address: collection.address,
        avatar: collection.metadata.avatar,
        type: 'COLLECTION',
        points: pointsByAddress.find(entry => caseInsensitiveCompare(entry.address, collection.address))?.points ?? 0
      }
    });

    const walletAddresses = pointsByAddress
      .filter(entry => entry.type === 'WALLET')
      .map(entry => {
        return {
          name: entry.address,
          address: entry.address,
          avatar: null,
          type: 'WALLET',
          points: entry.points
        }
      });

    return mappedCollections.concat(walletAddresses).sort((a, b) => b.points - a.points);
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

  async cancelStakeAuthorization(signature: string): Promise<void> {
    return this.cms.cancelStakeAuthorization(signature);
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

  async getGlobalContext() {
    return this.cms.getGlobalContext();
  }

  async getUserContext(address: string, signature: string) {
    return this.cms.getUserContext(address, signature);
  }

  async getGameContext() {
    return this.cms.getGameContext();
  }

  async getBankStakingAccount(address: string) {
    return this.graph.getBankStakingAccount(address);
  }

  async getFactions(gameId?: number) {
    return this.cms.getFactions(gameId);
  }
}