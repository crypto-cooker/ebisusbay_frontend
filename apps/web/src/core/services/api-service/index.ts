import { ListingsQueryParams } from '@src/core/services/api-service/mapi/queries/listings';
import { PagedList } from '@src/core/services/api-service/paginated-list';
import Cms from '@src/core/services/api-service/cms';
import Mapi from '@src/core/services/api-service/mapi';
import SearchQuery from '@src/core/services/api-service/mapi/queries/search';
import { OffersQueryParams } from '@src/core/services/api-service/mapi/queries/offers';
import { Listing, OwnerListing } from '@src/core/models/listing';
import {
  Api,
  BankStakeNft,
  BarracksStakeNft,
  PokerCollection,
  RyoshiDynastiesApi,
  StakedTokenType,
} from '@src/core/services/api-service/types';
import { Offer } from '@src/core/models/offer';
import { WalletsQueryParams } from './mapi/queries/wallets';
import WalletNft from '@src/core/models/wallet-nft';
import Graph from '@src/core/services/api-service/graph';
import { ciEquals } from '@market/helpers/utils';
import { GetBattleLog } from '@src/core/services/api-service/cms/queries/battle-log';
import { getOwners } from '@src/core/subgraph';
import { Player, RankPlayers, RankPlayersByWorst } from '@src/core/poker-rank-players';
import { OffersV2QueryParams } from '@src/core/services/api-service/mapi/queries/offersV2';
import { FullCollectionsQueryParams } from '@src/core/services/api-service/mapi/queries/fullcollections';
import { CollectionInfoQueryParams } from '@src/core/services/api-service/mapi/queries/collectioninfo';
import {
  TownHallStakeRequest,
  TownHallUnstakeRequest,
} from '@src/core/services/api-service/cms/queries/staking/town-hall';
import { FactionUpdateRequest } from '@src/core/services/api-service/cms/queries/faction';
import { DeployTroopsRequest } from '@src/core/services/api-service/cms/queries/deploy';
import { MerchantPurchaseRequest } from '@src/core/services/api-service/cms/queries/merchant-purchase';
import { AttackRequest } from '@src/core/services/api-service/cms/queries/attack';
import { DealListQueryParams } from '@src/core/services/api-service/mapi/queries/deallist';
import { FarmsQueryParams } from '@src/core/services/api-service/mapi/queries/farms';
import { ChainId } from '@pancakeswap/chains';
import { DEFAULT_CHAIN_ID } from '@src/config/chains';
import { CmsToken } from '@src/components-v2/global-data-fetcher';

export class ApiService implements Api {
  private mapi: Mapi;
  private cms: Cms;
  private graph: Graph;

  public ryoshiDynasties: RyoshiDynastiesApi;

  constructor(apiKey?: string, chainId?: number) {
    const chain = chainId ?? DEFAULT_CHAIN_ID;
    this.mapi = new Mapi(apiKey);
    this.cms = new Cms(apiKey);
    this.graph = new Graph(apiKey, chain);
    this.ryoshiDynasties = new RyoshiDynastiesGroup(apiKey, chain);
  }

  static withKey(apiKey?: string) {
    return new ApiService(apiKey);
  }

  static withoutKey() {
    return new ApiService();
  }

  static forChain(chainId: number) {
    return new ApiService(undefined, chainId);
  }

  static async allMitamaForChains(address: string, chainIds: number[]) {
    let fortuneBalance = BigInt(0);
    let mitamaBalance = BigInt(0);
    for (const chainId of chainIds) {
      const fortuneAndMitama = await ApiService.forChain(chainId).ryoshiDynasties.getErc20Account(
        address.toLowerCase(),
      );
      fortuneBalance += BigInt(fortuneAndMitama?.fortuneBalance ? fortuneAndMitama?.fortuneBalance : 0);
      mitamaBalance += BigInt(fortuneAndMitama?.mitamaBalance ? fortuneAndMitama?.mitamaBalance : 0);
    }
    return {fortuneBalance: fortuneBalance.toString(), mitamaBalance: mitamaBalance.toString()};
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
    return await this.mapi.getWallet({ ...query, wallet: address });
  }

  async getMadeOffersByUser(address: string, query?: OffersQueryParams): Promise<PagedList<Offer>> {
    if (!query) query = {};
    query.purchaser = address;

    return await this.getOffers(query);
  }

  async getPokerLeaderboardAtBlock(page: number, pageSize: number, pokerCollection: PokerCollection): Promise<any> {
    //info from subgraph
    const owners = await getOwners(pokerCollection);

    let gameNumber = 0;

    if (pokerCollection == PokerCollection.Diamonds) {
      gameNumber = 1;
    } else if (pokerCollection == PokerCollection.Clubs) {
      gameNumber = 2;
    } else if (pokerCollection == PokerCollection.Hearts) {
      gameNumber = 3;
    } else if (pokerCollection == PokerCollection.Spades) {
      gameNumber = 4;
    }

    const response = await RankPlayers(owners, gameNumber);

    let combined = [];
    if (pokerCollection == PokerCollection.Hearts) {
      let worstHands = await RankPlayers(owners, gameNumber);
      worstHands = await RankPlayersByWorst(worstHands, gameNumber);

      for (let i = 0; i < response.length; i++) {
        combined.push(response[i]);
        combined.push(worstHands[i]);
      }
    } else {
      combined = response;
    }

    function paginate(array: any, page_size: number, page_number: number) {
      return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    //convert response to paged list
    const paginatedResponse = paginate(combined, pageSize, page);
    const totalPages = Math.ceil(combined.length / pageSize);

    return new PagedList<Player>(paginatedResponse, page, page < totalPages);
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

    const unqiueCollectionAddresses = new Set(
      pointsByAddress.filter((entry) => entry.type === 'COLLECTION').map((entry) => entry.address),
    );
    const collections = await this.mapi.getCollections({
      address: Array.from(unqiueCollectionAddresses),
      pageSize: 200,
    });
    const mappedCollections = collections.data.map((collection: any) => {
      return {
        name: collection.name,
        address: collection.address,
        avatar: collection.metadata.avatar,
        type: 'COLLECTION',
        frtnPerCollection: pointsByAddress.find((entry) => ciEquals(entry.address, collection.address))
          ?.frtnPerCollection,
        eligibleListings: pointsByAddress.find((entry) => ciEquals(entry.address, collection.address))
          ?.eligibleListings,
        frtnPerListing: pointsByAddress.find((entry) => ciEquals(entry.address, collection.address))?.frtnPerListing,
        points: pointsByAddress
          .filter((entry) => ciEquals(entry.address, collection.address))
          .reduce((prev, next) => {
            return prev + next.points;
          }, 0),
      };
    });

    const uniqueWalletAddresses = new Set(
      pointsByAddress.filter((entry) => entry.type === 'WALLET').map((entry) => entry.address),
    );
    const walletRecords = Array.from(uniqueWalletAddresses).map((address) => {
      return {
        name: address,
        address: address,
        avatar: null,
        type: 'WALLET',
        frtnPerCollection: pointsByAddress.find((entry) => ciEquals(entry.address, address))?.frtnPerCollection,
        eligibleListings: pointsByAddress.find((entry) => ciEquals(entry.address, address))?.eligibleListings,
        frtnPerListing: pointsByAddress.find((entry) => ciEquals(entry.address, address))?.frtnPerListing,
        points: pointsByAddress
          .filter((entry) => ciEquals(entry.address, address))
          .reduce((prev, next) => {
            return prev + next.points;
          }, 0),
      };
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
        rank: thisRank,
      };
    });
  }

  async getCollectionTraits(address: string, chainId: number) {
    return await this.mapi.getCollectionTraits(address, chainId);
  }

  async getCollections(query?: CollectionInfoQueryParams) {
    return await this.mapi.getCollections(query);
  }

  async getStakedRyoshi(address: string) {
    return await this.graph.getStakedRyoshi(address);
  }

  async createDeal(request: any, address: string, signature: string) {
    return await this.cms.createDeal(request, address, signature);
  }

  async getDeal(id: string) {
    return await this.mapi.getDeal(id);
  }

  async requestAcceptDealAuthorization(id: string, address: string, signature: string) {
    return await this.cms.requestAcceptDealAuthorization(id, address, signature);
  }

  async cancelDeal(id: string, address: string, signature: string) {
    return await this.cms.cancelDeal(id, address, signature);
  }

  async rejectDeal(id: string, address: string, signature: string) {
    return await this.cms.rejectDeal(id, address, signature);
  }

  async getDeals(query?: DealListQueryParams) {
    return await this.mapi.getDeals(query);
  }

  async validateDeal(id: string) {
    return await this.cms.validateDeal(id);
  }

  async getFarms(query?: FarmsQueryParams) {
    return await this.mapi.getFarms(query);
  }

  async getFarmsUser(address: string) {
    return await this.graph.getFarmsUser(address);
  }

  async getSupportedTokens() {
    return await this.cms.getSupportedTokens();
  }

  async getCollectionMarketTokens(address: string, chainId: number): Promise<CmsToken[]> {
    return await this.cms.getCollectionMarketTokens(address, chainId);
  }
}

class RyoshiDynastiesGroup implements RyoshiDynastiesApi {
  private cms: Cms;
  private graph: Graph;

  constructor(apiKey?: string, chainId?: number) {
    const chain = chainId ?? ChainId.CRONOS;
    this.cms = new Cms(apiKey);
    this.graph = new Graph(apiKey, chain);
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
    if (type === StakedTokenType.BANK) {
      return this.cms.getBankUserStaked(address);
    } else if (type === StakedTokenType.BARRACKS) {
      return this.cms.getBarracksUserStaked(address);
    }

    return [];
  }

  async getTownHallUserStaked(address: string, collection: string, signature: string) {
    return this.cms.getTownHallUserStaked(address, collection, signature);
  }

  async getTownHallUserInvalidStaked(address: string, signature: string) {
    return this.cms.getTownHallUserInvalidStaked(address, signature);
  }

  async getStakedTokenTotals(type: StakedTokenType) {
    return this.cms.getStakedTokenTotals(type);
  }

  async requestBankStakeAuthorization(nfts: BankStakeNft[], address: string, signature: string, chainId: number) {
    return this.cms.requestBankStakeAuthorization(nfts, address, signature, chainId);
  }

  async checkBlacklistStatus(address: string) {
    return this.cms.checkBlacklistStatus(address);
  }

  async requestBankUnstakeAuthorization(nfts: BankStakeNft[], address: string, signature: string, chainId: number) {
    return this.cms.requestBankUnstakeAuthorization(nfts, address, signature, chainId);
  }

  async requestBarracksStakeAuthorization(
    nfts: BarracksStakeNft[],
    address: string,
    signature: string,
    chainId: number,
  ) {
    return this.cms.requestBarracksStakeAuthorization(nfts, address, signature, chainId);
  }

  async requestBarracksUnstakeAuthorization(
    nfts: BarracksStakeNft[],
    address: string,
    signature: string,
    chainId: number,
  ) {
    return this.cms.requestBarracksUnstakeAuthorization(nfts, address, signature, chainId);
  }

  async requestTownHallStakeAuthorization(
    request: TownHallStakeRequest,
    address: string,
    signature: string,
    chainId: number,
  ) {
    return this.cms.requestTownHallStakeAuthorization(request, address, signature, chainId);
  }

  async requestTownHallUnstakeAuthorization(
    request: TownHallUnstakeRequest,
    address: string,
    signature: string,
    chainId: number,
  ) {
    return this.cms.requestTownHallUnstakeAuthorization(request, address, signature, chainId);
  }

  async requestRewardsSpendAuthorization(
    cost: number | string,
    quantity: number,
    id: string,
    address: string,
    signature: string,
  ) {
    return this.cms.requestRewardsSpendAuthorization(cost, quantity, id, address, signature);
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

  async getResourcesBalances(address: string, signature: string) {
    return this.cms.getResourcesBalances(address, signature);
  }

  async requestResourcesWithdrawalAuthorization(tokenId: number, amount: number, address: string, signature: string) {
    return this.cms.requestResourcesWithdrawalAuthorization(tokenId, amount, address, signature);
  }

  async requestSeasonalRewardsClaimAuthorization(address: string, amount: number, signature: string, chainId: number) {
    return this.cms.requestSeasonalRewardsClaimAuthorization(address, amount, signature, chainId);
  }

  async requestSeasonalRewardsCompoundAuthorization(
    address: string,
    amount: number,
    vaultIndex: number,
    signature: string,
    chainId: number,
  ) {
    return this.cms.requestSeasonalRewardsCompoundAuthorization(address, amount, vaultIndex, signature, chainId);
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

  async getTroopsBreakdown(gameId: number, address: string, signature: string) {
    return this.cms.getTroopsBreakdown(gameId, address, signature);
  }

  async getUserMeeples(address: string) {
    return await this.graph.getUserMeeples(address);
  }

  async deployTroops(request: DeployTroopsRequest, address: string, signature: string) {
    return this.cms.deployTroops(request, address, signature);
  }

  async relocateTroops(
    troops: number,
    fromControlPointId: number,
    toControlPointId: number,
    fromFactionId: number,
    toFactionId: number,
    address: string,
    signature: string,
  ) {
    return this.cms.relocateTroops(
      troops,
      fromControlPointId,
      toControlPointId,
      fromFactionId,
      toFactionId,
      address,
      signature,
    );
  }

  async fetchGift(address: string, signature: string) {
    return this.cms.fetchGift(address, signature);
  }

  async fetchValentinesGift(address: string, signature: string) {
    return this.cms.fetchValentinesGift(address, signature);
  }

  async getFactionsByPoints(gameId: number) {
    return this.cms.getFactionsByPoints(gameId);
  }

  async requestCardTradeInAuthorization(
    nftIds: string[],
    nftAmounts: number[],
    direct: boolean,
    address: string,
    signature: string,
  ) {
    return this.cms.requestCardTradeInAuthorization(nftIds, nftAmounts, direct, address, signature);
  }

  async getTownHallWinningFaction() {
    return this.cms.getTownHallWinningFaction();
  }

  async updateFaction(request: FactionUpdateRequest, address: string, signature: string) {
    return this.cms.updateFaction(request, address, signature);
  }

  async getFaction(id: number, address: string, signature: string) {
    return this.cms.getFaction(id, address, signature);
  }

  async getMerchantItems() {
    return this.cms.getMerchantItems();
  }

  async requestMerchantPurchaseAuthorization(payload: MerchantPurchaseRequest, address: string, signature: string) {
    return this.cms.requestMerchantPurchaseAuthorization(payload, address, signature);
  }

  async attack(request: AttackRequest, address: string, signature: string) {
    return this.cms.attack(request, address, signature);
  }

  async getBattleCardsByWallet(address: string, signature: string) {
    return this.cms.getBattleCardsByWallet(address, signature);
  }

  async requestBattleCardsWithdrawalAuthorization(address: string, signature: string) {
    return this.cms.requestBattleCardsWithdrawalAuthorization(address, signature);
  }

  async requestSlotUnlockAuthorization(type: number, chainId: number, address: string, signature: string) {
    return this.cms.requestSlotUnlockAuthorization(type, chainId, address, signature);
  }

  async sendTroopsToFarm(farmId: number, chainId: number, troops: string, address: string, signature: string) {
    return this.cms.sendTroopsToFarm(farmId, chainId, troops, address, signature);
  }

  async getFarmBoosts(address: string, active: boolean) {
    return this.cms.getFarmBoosts(address, active);
  }

  async claimFarmBoost(farmId: number, address: string, signature: string) {
    return this.cms.claimFarmBoost(farmId, address, signature);
  }

  async getUserDailyFrtnRewards(address: string) {
    return this.cms.getUserDailyFrtnRewards(address);
  }

  async getUserPredictedFrtnRewards(farmId: number, chainId: number, address: string, signature: string) {
    return this.cms.getUserPredictedFrtnRewards(farmId, chainId, address, signature);
  }

  async upkeepMeeple(amount: number, address: string, signature: string) {
    return this.cms.upkeepMeeple(amount, address, signature);
  }

  async resetMeepleUpkeep(address: string, signature: string) {
    return this.cms.resetMeepleUpkeep(address, signature);
  }

  async boostVault(vaultId: number, chainId: number, troops: number, address: string, signature: string) {
    return this.cms.boostVault(vaultId, chainId, troops, address, signature);
  }

  async getVaultBoosts(address: string) {
    return this.cms.getVaultBoosts(address);
  }

  async claimVaultBoost(vaultId: number, address: string, signature: string) {
    return this.cms.claimVaultBoost(vaultId, address, signature);
  }
}
