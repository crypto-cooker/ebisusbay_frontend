import CmsRepository from "@src/core/services/api-service/cms/repositories/index";
import {BankStakeNft, BarracksStakeNft} from "@src/core/services/api-service/types";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";

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

  async cancelStakeAuthorization(signature: string): Promise<void> {
    const response = await this.cms.post('ryoshi-dynasties/staking/authorize/cancel', {
      signature
    })
    return response.data;
  }

  async getDailyRewards(address: string) {
    const response = await this.cms.get('ryoshi-dynasties/game-tokens', {
      params: {
        address,
      }
    })
    return response.data;
  }


  async getSeasonalRewards(address: string, seasonId?: number) {
    const endpoint = seasonId ? `season-rewards/${seasonId}` : 'all-season-rewards';
    const response = await this.cms.get(`ryoshi-dynasties/fortune-rewards/${endpoint}`, {
      params: {
        walletAddress: address,
      }
    })
    return response.data;
  }

  async claimDailyRewards(address: string, signature: string) {
    const response = await this.cms.get('ryoshi-dynasties/game-tokens/daily-reward', {
      params: {
        address,
        signature
      }
    })
    return response.data;
  }


  async requestSeasonalRewardsClaimAuthorization(address: string, amount: number, seasonId: number, signature: string) {
    const response = await this.cms.post(
      `ryoshi-dynasties/fortune-rewards/withdraw/${seasonId}`,
      {
        amount,
      },
      {
        params: {
          address,
          signature
        }
      }
    );
    return response.data;
  }

  async getGlobalContext() {
    const response = await this.cms.get('ryoshi-dynasties/context');
    return response.data.data as RyoshiConfig;
  }
}

export default RyoshiDynastiesRepository;