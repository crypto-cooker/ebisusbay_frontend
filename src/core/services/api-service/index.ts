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
import {GetBattleLog} from "@src/core/services/api-service/cms/queries/battle-log";
import {getOwners} from "@src/core/subgraph"
import {Player, RankPlayers} from "@src/core/poker-rank-players"
import {OffersV2QueryParams} from "@src/core/services/api-service/mapi/queries/offersV2";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";
import {CollectionInfoQueryParams} from "@src/core/services/api-service/mapi/queries/collectioninfo";
import {PokerCollection} from "@src/core/services/api-service/types";

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

  async getCollectionItems(query: FullCollectionsQueryParams): Promise<PagedList<any>> {
    return await this.mapi.getCollectionItems(query);
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

  async getRyoshiDiamondsLeaderboardAtBlock(page: number, pageSize: number, pokerCollection: PokerCollection): Promise<any> {
    //info from subgraph

    const owners = await getOwners(pokerCollection);
    //rank the info

    let gameNumber = 2;

    if (pokerCollection == PokerCollection.Diamonds) {
      gameNumber = 1;
    } else if (pokerCollection == PokerCollection.Clubs) {
      gameNumber = 2;
    }
    
    const response = await RankPlayers(owners, false, gameNumber);

    function paginate(array : any, page_size:number, page_number:number) {
      return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    //convert response to paged list
    const paginatedResponse = paginate(response, pageSize, page);
    const totalPages = Math.ceil(response.length / pageSize);

    return new PagedList<Player>(
      paginatedResponse,
      page,
      page < totalPages
    );
  }

  async getReceivedOffersByUser(address: string, query?: OffersV2QueryParams): Promise<PagedList<Offer>> {
    if (!query) query = {};
    query.wallet = address;

    return await this.mapi.getReceivedOffers(query);
  }

  async getOffersOverview(address: string): Promise<any> {
    return await this.mapi.getOffersOverview(address);
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

    const unqiueCollectionAddresses = new Set(pointsByAddress
      .filter(entry => entry.type === 'COLLECTION')
      .map(entry => entry.address));
    const collections = await this.mapi.getCollections({address: Array.from(unqiueCollectionAddresses), pageSize: 200});
    const mappedCollections = collections.data.map((collection: any) => {
      return {
        name: collection.name,
        address: collection.address,
        avatar: collection.metadata.avatar,
        type: 'COLLECTION',
        points: pointsByAddress
          .filter(entry => caseInsensitiveCompare(entry.address, collection.address))
          .reduce((prev, next) => {
            return prev + next.points;
          }, 0)
      }
    });

    const uniqueWalletAddresses = new Set(pointsByAddress
      .filter(entry => entry.type === 'WALLET')
      .map(entry => entry.address));
    const walletRecords = Array.from(uniqueWalletAddresses).map(address => {
      return {
        name: address,
        address: address,
        avatar: null,
        type: 'WALLET',
        points: pointsByAddress
          .filter(entry => caseInsensitiveCompare(entry.address, address))
          .reduce((prev, next) => {
            return prev + next.points;
          }, 0)
      }
    });

    const completeRankings = mappedCollections.concat(walletRecords).sort((a, b) => b.points - a.points);

    let rank = 1;
    return completeRankings.map((record, index) => {
      let thisRank;
      if (index > 0 && completeRankings[index - 1].points !== record.points) {
        thisRank = rank + 1;
        rank++;
      } else if (index === 0) {
        thisRank = 1;
      } else {
        thisRank = '';
      }

      return {
        ...record,
        rank: thisRank
      }
    });
  }

  async getCollectionTraits(address: string) {
    return await this.mapi.getCollectionTraits(address);
  }

  async getCollections(query?: CollectionInfoQueryParams) {
    return await this.mapi.getCollections(query);
  }

  async getStakedRyoshi(address: string) {
    return await this.graph.getStakedRyoshi(address);
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

  async presaleVault(address: string) {
    return this.graph.getPresaleVault(address);
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

  async requestBankStakeAuthorization(nfts: BankStakeNft[], address: string, signature: string) {
    return this.cms.requestBankStakeAuthorization(nfts, address, signature);
  }

  async requestBankUnstakeAuthorization(nfts: BankStakeNft[], address: string, signature: string) {
    return this.cms.requestBankUnstakeAuthorization(nfts, address, signature);
  }

  async requestBarracksStakeAuthorization(nfts: BarracksStakeNft[], address: string, signature: string) {
    return this.cms.requestBarracksStakeAuthorization(nfts, address, signature);
  }

  async requestBarracksUnstakeAuthorization(nfts: BarracksStakeNft[], address: string, signature: string) {
    return this.cms.requestBarracksUnstakeAuthorization(nfts, address, signature);
  }

  async requestRewardsSpendAuthorization(amount: number | string, address: string, signature: string) {
    return this.cms.requestRewardsSpendAuthorization(amount, address, signature);
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

  async requestSeasonalRewardsClaimAuthorization(address: string, amount: number, signature: string) {
    return this.cms.requestSeasonalRewardsClaimAuthorization(address, amount, signature);
  }

  async requestSeasonalRewardsCompoundAuthorization(address: string, amount: number, vaultIndex: number, signature: string) {
    return this.cms.requestSeasonalRewardsCompoundAuthorization(address, amount, vaultIndex, signature);
  }


  async getPendingFortuneAuthorizations(address: string, signature: string) {
    return this.cms.getPendingFortuneAuthorizations(address, signature);
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

  async getBattleLog(query: GetBattleLog) {
    return this.cms.getBattleLog(query);
  }
}