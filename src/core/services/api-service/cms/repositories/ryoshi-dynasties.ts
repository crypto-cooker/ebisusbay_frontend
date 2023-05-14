import CmsRepository from "@src/core/services/api-service/cms/repositories/index";
import {BankStakeNft} from "@src/core/services/api-service/types";

class RyoshiDynastiesRepository extends CmsRepository {

  async requestBankStakeAuthorization(nfts: BankStakeNft[], address: string) {
    const response = await this.cms.get('ryoshi-dynasties/staking/authorize/bank', {
      params: {
        user: address,
        contractAddress: nfts.map(nft => nft.nftAddress),
        tokenId: nfts.map(nft => nft.nftId),
        amount: nfts.map(nft => nft.amount),
      }
    })
    return response.data;
  }
}

export default RyoshiDynastiesRepository;