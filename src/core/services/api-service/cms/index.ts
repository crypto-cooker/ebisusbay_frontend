import ProfilesRepository from "@src/core/services/api-service/cms/repositories/profiles";
import GdcClaimsRepository from "@src/core/services/api-service/cms/repositories/gdc-claims";

class Cms {
  private profiles;
  private gdcClaims;

  constructor(apiKey?: string) {
    this.profiles = new ProfilesRepository(apiKey);
    this.gdcClaims = new GdcClaimsRepository(apiKey);
  }

  async getProfile(addressOrUsername: string): Promise<any> {
    return this.profiles.getProfile(addressOrUsername);
  }

  async getGdcClaimSignature(email: string, address: string, signature: string): Promise<any> {
    return this.gdcClaims.getClaimSignature(email, address, signature);
  }
}

export default Cms;