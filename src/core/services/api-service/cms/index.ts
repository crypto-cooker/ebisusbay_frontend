import ProfilesRepository from "@src/core/services/api-service/cms/repositories/profiles";
import GdcClaimsRepository from "@src/core/services/api-service/cms/repositories/gdc-claims";
import {BankStakeNft, BarracksStakeNft} from "@src/core/services/api-service/types";
import RyoshiDynastiesRepository from "@src/core/services/api-service/cms/repositories/ryoshi-dynasties";

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

  async requestBankStakeAuthorization(nfts: BankStakeNft[], address: string) {
    return this.ryoshiDynasties.requestBankStakeAuthorization(nfts, address);
  }

  async requestBarracksStakeAuthorization(nfts: BarracksStakeNft[], address: string) {
    return this.ryoshiDynasties.requestBarracksStakeAuthorization(nfts, address);
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

  async requestSeasonalRewardsClaimAuthorization(address: string, amount: number, seasonId: number, signature: string) {
    return this.ryoshiDynasties.requestSeasonalRewardsClaimAuthorization(address, amount, seasonId, signature);
  }
}

export default Cms;