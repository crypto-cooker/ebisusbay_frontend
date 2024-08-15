import {appConfig} from "@src/config";
import CmsRepository from "@src/core/services/api-service/cms/repositories/index";

class ProfilesRepository extends CmsRepository {

  async getProfile(addressOrUsername: string) {
    const response = await this.cms.get('profile', {
      params: {
        walletAddress: addressOrUsername
      }
    })
    return response.data;
  }
}

export default ProfilesRepository;