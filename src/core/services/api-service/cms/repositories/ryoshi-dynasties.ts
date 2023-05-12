import CmsRepository from "@src/core/services/api-service/cms/repositories/index";
import {BankStakeNft} from "@src/core/services/api-service/types";

class RyoshiDynastiesRepository extends CmsRepository {

  async requestBankStakeAuthorization(address: string, nfts: BankStakeNft[], signature: string) {
    const response = await this.cms.get('ryoshi-dynasties/staking/authorize/bank', {
      params: {
        address,
        signature
      }
    })
    return response.data;
  }
}

export default RyoshiDynastiesRepository;