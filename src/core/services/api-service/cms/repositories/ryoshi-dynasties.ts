import CmsRepository from "@src/core/services/api-service/cms/repositories/index";
import {
  BankStakeNft,
  BarracksStakeNft, RdBattleLog,
  RdFaction,
  RdGameContext,
  RdUserContext, TownHallStakeNft
} from "@src/core/services/api-service/types";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import {GetBattleLog} from "@src/core/services/api-service/cms/queries/battle-log";

class RyoshiDynastiesRepository extends CmsRepository {

  async requestBankStakeAuthorization(nfts: BankStakeNft[], address: string, signature: string) {
    const response = await this.cms.get('ryoshi-dynasties/staking/authorize/bank', {
      params: {
        user: address,
        contractAddress: nfts.map(nft => nft.nftAddress),
        tokenId: nfts.map(nft => nft.nftId),
        amount: nfts.map(nft => nft.amount),
        address,
        signature
      }
    })
    return response.data;
  }

  async requestBankUnstakeAuthorization(nfts: BankStakeNft[], address: string, signature: string) {
    const response = await this.cms.get('ryoshi-dynasties/staking/authorize/bank/withdraw', {
      params: {
        user: address,
        contractAddress: nfts.map(nft => nft.nftAddress),
        tokenId: nfts.map(nft => nft.nftId),
        amount: nfts.map(nft => nft.amount),
        address,
        signature
      }
    })
    return response.data;
  }

  async requestBarracksStakeAuthorization(nfts: BarracksStakeNft[], address: string, signature: string) {
    const response = await this.cms.get('ryoshi-dynasties/staking/authorize/barracks', {
      params: {
        user: address,
        contractAddress: nfts.map(nft => nft.nftAddress),
        tokenId: nfts.map(nft => nft.nftId),
        amount: nfts.map(nft => nft.amount),
        address,
        signature
      }
    })
    return response.data;
  }

  async requestBarracksUnstakeAuthorization(nfts: BarracksStakeNft[], address: string, signature: string) {
    const response = await this.cms.get('ryoshi-dynasties/staking/authorize/barracks/withdraw', {
      params: {
        user: address,
        contractAddress: nfts.map(nft => nft.nftAddress),
        tokenId: nfts.map(nft => nft.nftId),
        amount: nfts.map(nft => nft.amount),
        address,
        signature
      }
    })
    return response.data;
  }

  async requestTownHallStakeAuthorization(nfts: TownHallStakeNft[], address: string, signature: string) {
    const response = await this.cms.get('ryoshi-dynasties/staking/authorize/town-hall', {
      params: {
        user: address,
        contractAddress: nfts.map(nft => nft.nftAddress),
        tokenId: nfts.map(nft => nft.nftId),
        amount: nfts.map(nft => nft.amount),
        address,
        signature
      }
    })
    return response.data;
  }

  async requestTownHallUnstakeAuthorization(nfts: TownHallStakeNft[], address: string, signature: string) {
    const response = await this.cms.get('ryoshi-dynasties/staking/authorize/town-hall/withdraw', {
      params: {
        user: address,
        contractAddress: nfts.map(nft => nft.nftAddress),
        tokenId: nfts.map(nft => nft.nftId),
        amount: nfts.map(nft => nft.amount),
        address,
        signature
      }
    })
    return response.data;
  }

  async requestRewardsSpendAuthorization(amount: number | string, address: string, signature: string) {
    const response = await this.cms.post(
      'ryoshi-dynasties/fortune-rewards/spend',
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

    return response.data.data;
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
    const response = await this.cms.get(`ryoshi-dynasties/fortune-rewards/season-rewards`, {
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


  async requestSeasonalRewardsClaimAuthorization(address: string, amount: number, signature: string) {
    const response = await this.cms.post(
      `ryoshi-dynasties/fortune-rewards/withdraw`,
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

  async requestSeasonalRewardsCompoundAuthorization(address: string, amount: number, vaultIndex: number, signature: string) {
    const response = await this.cms.post(
      `ryoshi-dynasties/fortune-rewards/compound/${vaultIndex}`,
      {
        amount
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

  async getPendingFortuneAuthorizations(address: string, signature: string) {
    const response = await this.cms.get(
      `ryoshi-dynasties/fortune-rewards/pending`,
      {
        params: {
          address,
          signature
        }
      }
    );

    return response.data.data;
  }

  async getGlobalContext() {
    const response = await this.cms.get('ryoshi-dynasties/context');
    return response.data.data as RyoshiConfig;
  }

  async getUserContext(address: string, signature: string) {
    const response = await this.cms.get('ryoshi-dynasties/context/user',
      {
        params: {
          address,
          signature
        }
    });
    return response.data.data as RdUserContext;
  }

  async getGameContext() {
    const response = await this.cms.get('ryoshi-dynasties/context/game');
    return response.data.data as RdGameContext;
  }

  async getFactions(gameId?: number) {
    if (!gameId) {
      let gameID = await this.cms.get("ryoshi-dynasties/games/0");
      if (!gameID.data.data) return [];
      gameId = gameID.data.data.id;
    }

    let data = await this.cms.get(`ryoshi-dynasties/factions/all`,
      {params: {gameId}});
    return data.data.data as RdFaction[];
  }

  async getGameWinners(gameId: number) {
    const response = await this.cms.get(`ryoshi-dynasties/games/${gameId}/winners`);
    return response.data.data as Array<{ address: string; points: number; type: string }>;
  }

  async getBattleLog(query: GetBattleLog) {
    const response = await this.cms.get('ryoshi-dynasties/game-log',
      {
        params: query
      });

    return response.data.data as {currentPage: number, logs: RdBattleLog[], pageSize: number, totalPages: number};
  }
}

export default RyoshiDynastiesRepository;