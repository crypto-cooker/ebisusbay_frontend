import {appConfig} from "@src/config";
import CmsRepository from "@src/core/services/api-service/cms/repositories/index";

class GdcClaimsRepository extends CmsRepository {

  async getClaimSignature(email: string, address: string, signature: string) {
    const response = await this.cms.get('ryoshi-tales/game-promotion/signature', {
      params: {
        email,
        address,
        signature
      }
    })
    return response.data;
  }
}

export default GdcClaimsRepository;