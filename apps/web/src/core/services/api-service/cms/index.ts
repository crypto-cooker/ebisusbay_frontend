import ProfilesRepository from "@src/core/services/api-service/cms/repositories/profiles";
import GdcClaimsRepository from "@src/core/services/api-service/cms/repositories/gdc-claims";
import {
  BankStakeNft,
  BarracksStakeNft,
  RdBattleLog,
  StakedTokenType,
  TownHallStakeNft
} from "@src/core/services/api-service/types";
import RyoshiDynastiesRepository from "@src/core/services/api-service/cms/repositories/ryoshi-dynasties";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import {GetBattleLog} from "@src/core/services/api-service/cms/queries/battle-log";
import {
  TownHallStakeRequest,
  TownHallUnstakeRequest
} from "@src/core/services/api-service/cms/queries/staking/town-hall";
import {FactionUpdateRequest} from "@src/core/services/api-service/cms/queries/faction";
import {DeployTroopsRequest} from "@src/core/services/api-service/cms/queries/deploy";
import {MerchantPurchaseRequest} from "@src/core/services/api-service/cms/queries/merchant-purchase";
import {AttackRequest} from "@src/core/services/api-service/cms/queries/attack";
import OrdersRepository from "@src/core/services/api-service/cms/repositories/orders";

class Cms {
  private profiles: ProfilesRepository;
  private gdcClaims: GdcClaimsRepository;
  private ryoshiDynasties: RyoshiDynastiesRepository;
  private orders: OrdersRepository;

  constructor(apiKey?: string) {
    this.profiles = new ProfilesRepository(apiKey);
    this.gdcClaims = new GdcClaimsRepository(apiKey);
    this.ryoshiDynasties = new RyoshiDynastiesRepository(apiKey);
    this.orders = new OrdersRepository(apiKey);
  }

  async getProfile(addressOrUsername: string): Promise<any> {
    return this.profiles.getProfile(addressOrUsername);
  }

  async getGdcClaimSignature(email: string, address: string, signature: string): Promise<any> {
    return this.gdcClaims.getClaimSignature(email, address, signature);
  }

  async requestBankStakeAuthorization(nfts: BankStakeNft[], address: string, signature: string) {
    return this.ryoshiDynasties.requestBankStakeAuthorization(nfts, address, signature);
  }

  async requestBankUnstakeAuthorization(nfts: BankStakeNft[], address: string, signature: string) {
    return this.ryoshiDynasties.requestBankUnstakeAuthorization(nfts, address, signature);
  }

  async requestBarracksStakeAuthorization(nfts: BarracksStakeNft[], address: string, signature: string) {
    return this.ryoshiDynasties.requestBarracksStakeAuthorization(nfts, address, signature);
  }

  async requestBarracksUnstakeAuthorization(nfts: BarracksStakeNft[], address: string, signature: string) {
    return this.ryoshiDynasties.requestBarracksUnstakeAuthorization(nfts, address, signature);
  }

  async requestTownHallStakeAuthorization(request: TownHallStakeRequest, address: string, signature: string) {
    return this.ryoshiDynasties.requestTownHallStakeAuthorization(request, address, signature);
  }

  async requestTownHallUnstakeAuthorization(request: TownHallUnstakeRequest, address: string, signature: string) {
    return this.ryoshiDynasties.requestTownHallUnstakeAuthorization(request, address, signature);
  }

  async requestRewardsSpendAuthorization(cost: number | string, quantity: number, id: string, address: string, signature: string) {
    return this.ryoshiDynasties.requestRewardsSpendAuthorization(cost, quantity, id, address, signature);
  }

  async getDailyRewards(address: string) {
    return this.ryoshiDynasties.getDailyRewards(address);
  }

  async getSeasonalRewards(address: string, seasonId?: number) {
    return this.ryoshiDynasties.getSeasonalRewards(address, seasonId);
  }

  async claimDailyRewards(address: string, signature: string) {
    return this.ryoshiDynasties.claimDailyRewards(address, signature);
  }

  async getResourcesBalances(address: string, signature: string) {
    return this.ryoshiDynasties.getResourcesBalances(address, signature);
  }

  async requestResourcesWithdrawalAuthorization(tokenId: number, amount: number, address: string, signature: string) {
    return this.ryoshiDynasties.requestResourcesWithdrawalAuthorization(tokenId, amount, address, signature);
  }

  async requestSeasonalRewardsClaimAuthorization(address: string, amount: number, signature: string, chainId: number) {
    return this.ryoshiDynasties.requestSeasonalRewardsClaimAuthorization(address, amount, signature, chainId);
  }

  async requestSeasonalRewardsCompoundAuthorization(address: string, amount: number, vaultIndex: number, signature: string, chainId: number) {
    return this.ryoshiDynasties.requestSeasonalRewardsCompoundAuthorization(address, amount, vaultIndex, signature, chainId);
  }

  async checkBlacklistStatus(address: string) {
    return this.ryoshiDynasties.checkBlacklistStatus(address);
  }

  async getPendingFortuneAuthorizations(address: string, signature: string) {
    return this.ryoshiDynasties.getPendingFortuneAuthorizations(address, signature);
  }

  async getGlobalContext() {
    return this.ryoshiDynasties.getGlobalContext();
  }

  async getUserContext(address: string, signature: string) {
    return this.ryoshiDynasties.getUserContext(address, signature);
  }

  async getGameContext() {
    return this.ryoshiDynasties.getGameContext();
  }

  async getFactions(gameId?: number) {
    return this.ryoshiDynasties.getFactions(gameId);
  }

  async getGameWinners(gameId: number) {
    return this.ryoshiDynasties.getGameWinners(gameId);
  }

  async getBattleLog(query: GetBattleLog) {
    const response = await this.ryoshiDynasties.getBattleLog(query);

    return new PagedList<RdBattleLog>(
      response.logs,
      response.currentPage,
      response.currentPage < response.totalPages
    );
  }

  async getTroopsBreakdown(gameId: number, address: string, signature: string) {
    return this.ryoshiDynasties.getTroopsBreakdown(gameId, address, signature);
  }

  async getStakedTokenTotals(type: StakedTokenType) {
    return this.ryoshiDynasties.getStakedTokenTotals(type);
  }

  async getTownHallUserStaked(collectionAddress: string, collection: string, signature: string) {
    return this.ryoshiDynasties.getTownHallUserStaked(collectionAddress, collection, signature);
  }

  async getTownHallUserInvalidStaked(address: string, signature: string) {
    return this.ryoshiDynasties.getTownHallUserInvalidStaked(address, signature);
  }

  async deployTroops(request: DeployTroopsRequest, address: string, signature: string) {
    return this.ryoshiDynasties.deployTroops(request, address, signature)
  }

  async relocateTroops(troops: number, fromControlPointId: number, toControlPointId: number, fromFactionId: number, toFactionId: number, address: string, signature: string) {
    return this.ryoshiDynasties.relocateTroops(troops, fromControlPointId, toControlPointId, fromFactionId, toFactionId, address, signature)
  }

  async fetchGift(address: string, signature: string) {
    return this.ryoshiDynasties.fetchGift(address, signature)
  }

  async fetchValentinesGift(address: string, signature: string) {
    return this.ryoshiDynasties.fetchValentinesGift(address, signature)
  }



  async getFactionsByPoints(gameId: number) {
    return this.ryoshiDynasties.getFactionsByPoints(gameId);
  }

  async requestCardTradeInAuthorization(nftIds: string[], nftAmounts: number[], direct: boolean, address: string, signature: string) {
    return this.ryoshiDynasties.requestCardTradeInAuthorization(nftIds, nftAmounts, direct, address, signature);
  }

  async getTownHallWinningFaction() {
    return this.ryoshiDynasties.getTownHallWinningFaction();
  }

  async updateFaction(request: FactionUpdateRequest, address: string, signature: string) {
    return this.ryoshiDynasties.updateFaction(request, address, signature);
  }

  async getFaction(id: number, address: string, signature: string) {
    return this.ryoshiDynasties.getFaction(id, address, signature);
  }

  async getMerchantItems() {
    return this.ryoshiDynasties.getMerchantItems();
  }

  async requestMerchantPurchaseAuthorization(payload: MerchantPurchaseRequest, address: string, signature: string) {
    return this.ryoshiDynasties.requestMerchantPurchaseAuthorization(payload, address, signature);
  }

  async attack(request: AttackRequest, address: string, signature: string) {
    return this.ryoshiDynasties.attack(request, address, signature);
  }

  async getBattleCardsByWallet(address: string, signature: string) {
    return this.ryoshiDynasties.getBattleCardsByWallet(address, signature);
  }

  async requestBattleCardsWithdrawalAuthorization(address: string, signature: string) {
    return this.ryoshiDynasties.requestBattleCardsWithdrawalAuthorization(address, signature);
  }

  async createDeal(request: any, address: string, signature: string) {
    return await this.orders.createDeal(request, address, signature);
  }

  async getDeal(id: any) {
    return await this.orders.getDeal(id);
  }

  async requestAcceptDealAuthorization(id: string, address: string, signature: string) {
    return await this.orders.requestAcceptDealAuthorization(id, address, signature);
  }

  async cancelDeal(id: string, address: string, signature: string) {
    return await this.orders.cancelDeal(id, address, signature);
  }

  async rejectDeal(id: string, address: string, signature: string) {
    return await this.orders.rejectDeal(id, address, signature);
  }

  async validateDeal(id: string) {
    return await this.orders.validateDeal(id);
  }
}

export default Cms;