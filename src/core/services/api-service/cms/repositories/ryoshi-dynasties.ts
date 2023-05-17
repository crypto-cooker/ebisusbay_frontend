import CmsRepository from "@src/core/services/api-service/cms/repositories/index";
import {BankStakeNft, BarracksStakeNft} from "@src/core/services/api-service/types";

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

  async requestBarracksStakeAuthorization(nfts: BarracksStakeNft[], address: string) {
    const response = await this.cms.get('ryoshi-dynasties/staking/authorize/barracks', {
      params: {
        user: address,
        contractAddress: nfts.map(nft => nft.nftAddress),
        tokenId: nfts.map(nft => nft.nftId),
        amount: nfts.map(nft => nft.amount),
      }
    })
    return response.data;
  }

  async getDailyRewards(address: string) {
    const response = await this.cms.get('ryoshi-dynasties/game-tokens', {
      params: {
        user: address,
      }
    })
    return response.data;
  }

  async claimDailyRewards(address: string) {
    const response = await this.cms.get('ryoshi-dynasties/game-tokens/daily-reward', {
      params: {
        user: address,
      }
    })
    return response.data;
  }
}

export default RyoshiDynastiesRepository;