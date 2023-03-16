import {appConfig} from "@src/Config";
import CmsRepository from "@src/core/services/api-service/cms/repositories/index";

class GdcClaimsRepository extends CmsRepository {

  async getClaimSignature(email: string, address: string, signature: string) {
    const response = await this.cms.post('ryoshi-tales/game-promotion/signature', {
        email
    },
      {params:{address, signature}})
    return response.data;
  }
}

export default GdcClaimsRepository;