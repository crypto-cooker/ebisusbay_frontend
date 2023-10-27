import ProfilesRepository from "@src/core/services/api-service/cms/repositories/profiles";
import GdcClaimsRepository from "@src/core/services/api-service/cms/repositories/gdc-claims";
import {BankStakeNft, BarracksStakeNft, RdBattleLog, TownHallStakeNft} from "@src/core/services/api-service/types";
import RyoshiDynastiesRepository from "@src/core/services/api-service/cms/repositories/ryoshi-dynasties";
import {CollectionInfoQuery} from "@src/core/services/api-service/mapi/queries/collectioninfo";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import {Listing} from "@src/core/models/listing";
import {GetBattleLog} from "@src/core/services/api-service/cms/queries/battle-log";

class Cms {
  private profiles;
  private gdcClaims;
  private ryoshiDynasties;

  constructor(apiKey?: string) {
    this.profiles = new ProfilesRepository(apiKey);
    this.gdcClaims = new GdcClaimsRepository(apiKey);
    this.ryoshiDynasties = new RyoshiDynastiesRepository(apiKey);
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

  async requestTownHallStakeAuthorization(nfts: TownHallStakeNft[], address: string, signature: string) {
    return this.ryoshiDynasties.requestTownHallStakeAuthorization(nfts, address, signature);
  }

  async requestTownHallUnstakeAuthorization(nfts: TownHallStakeNft[], address: string, signature: string) {
    return this.ryoshiDynasties.requestTownHallUnstakeAuthorization(nfts, address, signature);
  }

  async requestRewardsSpendAuthorization(amount: number | string, address: string, signature: string) {
    return this.ryoshiDynasties.requestRewardsSpendAuthorization(amount, address, signature);
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

  async requestSeasonalRewardsClaimAuthorization(address: string, amount: number, signature: string) {
    return this.ryoshiDynasties.requestSeasonalRewardsClaimAuthorization(address, amount, signature);
  }

  async requestSeasonalRewardsCompoundAuthorization(address: string, amount: number, vaultIndex: number, signature: string) {
    return this.ryoshiDynasties.requestSeasonalRewardsCompoundAuthorization(address, amount, vaultIndex, signature);
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
}

export default Cms;