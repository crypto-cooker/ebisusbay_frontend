import ProfilesRepository from "@src/core/services/api-service/cms/repositories/profiles";

class Cms {
  private profiles;

  constructor(apiKey?: string) {
    this.profiles = new ProfilesRepository(apiKey);
  }

  async getProfile(addressOrUsername: string): Promise<any> {
    return this.profiles.getProfile(addressOrUsername);
  }
}

export default Cms;