import CmsRepository from "@src/core/services/api-service/cms/repositories/index";
import {
  BankStakeNft,
  BarracksStakeNft,
  RdBattleLog,
  RdFaction,
  RdGameContext,
  RdUserContext,
  RdUserContextGameTroops,
  StakedTokenType
} from "@src/core/services/api-service/types";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import {GetBattleLog} from "@src/core/services/api-service/cms/queries/battle-log";
import {
  TownHallStakeRequest,
  townHallStakeRequestSchema,
  TownHallUnstakeRequest,
  townHallUnstakeRequestSchema
} from "@src/core/services/api-service/cms/queries/staking/town-hall";
import {FactionUpdateRequest, factionUpdateRequestSchema} from "@src/core/services/api-service/cms/queries/faction";
import {DeployTroopsRequest, deployTroopsRequestSchema} from "@src/core/services/api-service/cms/queries/deploy";
import {MerchantItem, MerchantPurchaseRequestResponse} from "@src/core/services/api-service/cms/response-types";
import {MerchantPurchaseRequest} from "@src/core/services/api-service/cms/queries/merchant-purchase";
import {AttackRequest, attackRequestSchema} from "@src/core/services/api-service/cms/queries/attack";

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

  async requestTownHallStakeAuthorization(request: TownHallStakeRequest, address: string, signature: string) {
    await townHallStakeRequestSchema.validate(request);

    const response = await this.cms.get('ryoshi-dynasties/staking/authorize/town-hall', {
      params: {
        tokenId: request.nfts.map(nft => nft.nftId),
        amount: request.nfts.map(nft => nft.amount),
        contractAddress: request.collectionAddress,
        isAll: request.isAll,
        user: address,
        address,
        signature
      }
    })
    return response.data;
  }

  async requestTownHallUnstakeAuthorization(request: TownHallUnstakeRequest, address: string, signature: string) {
    await townHallUnstakeRequestSchema.validate(request);

    const response = await this.cms.get('ryoshi-dynasties/staking/authorize/town-hall/withdraw', {
      params: {
        tokenId: request.nfts.map(nft => nft.nftId),
        amount: request.nfts.map(nft => nft.amount),
        contractAddress: request.collectionAddress,
        isAll: request.isAll,
        invalidOnly: request.invalidOnly,
        user: address,
        address,
        signature
      }
    })
    return response.data;
  }

  async requestRewardsSpendAuthorization(cost: number | string, quantity: number, id: string, address: string, signature: string) {
    const response = await this.cms.post(
      'ryoshi-dynasties/fortune-rewards/spend',
      {
        user: address,
        amount: cost,
        item: id,
        itemAmount: quantity
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
    const response = await this.cms.get('ryoshi-dynasties/game-tokens/daily-reward/claim', {
      params: {
        address,
        signature
      }
    })
    return response.data;
  }

  async getResourcesBalances(address: string, signature: string) {
    const response = await this.cms.get('ryoshi-dynasties/game-tokens/resources/user-balances', {
      params: {
        address,
        signature
      }
    })
    return response.data.data;
  }

  async requestResourcesWithdrawalAuthorization(tokenId: number, amount: number, address: string, signature: string) {
    const response = await this.cms.post(
      `ryoshi-dynasties/game-tokens/resources/withdraw`,
      {
        tokenId,
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

  async checkBlacklistStatus(address: string) {
    const response = await this.cms.get(
      `ryoshi-dynasties/fortune-rewards/blacklist/${address}`,
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
    return response.data.data as Array<{ address: string; points: number; type: string, frtnPerCollection: number, eligibleListings: number, frtnPerListing: number }>;
  }

  async getBattleLog(query: GetBattleLog) {
    const response = await this.cms.get('ryoshi-dynasties/game-log',
      {
        params: query
      });

    return response.data.data as {currentPage: number, logs: RdBattleLog[], pageSize: number, totalPages: number};
  }

  async getTroopsBreakdown(gameId: number, address: string, signature: string) {
    const response = await this.cms.get(`ryoshi-dynasties/armies/breakdown`, {
      params: {
        gameId,
        address,
        signature
      }
    });
    return response.data.data as RdUserContextGameTroops;
  }

  async getStakedTokenTotals(type: StakedTokenType): Promise<{[key: string]: number}> {
    const response = await this.cms.get(`ryoshi-dynasties/staking/town-hall/totals`, {
      params: {
        type
      }
    });
    return response.data.data;
  }

  async getTownHallUserStaked(address: string, collection: string, signature: string) {
    const response = await this.cms.get(`ryoshi-dynasties/staking/town-hall/staked`, {
      params: {
        collection,
        address,
        signature
      }
    });
    return response.data.data;
  }

  async getTownHallUserInvalidStaked(address: string, signature: string) {
    const response = await this.cms.get(`ryoshi-dynasties/staking/town-hall/invalid`, {
      params: {
        address,
        signature
      }
    });
    return response.data.data;
  }

  async deployTroops(request: DeployTroopsRequest, address: string, signature: string) {
    await deployTroopsRequestSchema.validate(request);

    const response = await this.cms.patch(
      `ryoshi-dynasties/armies/deploy`,
      {
        ...request
      },
      {params: {address, signature}}
    );
    return response.data;
  }

  async relocateTroops(troops: number, fromControlPointId: number, toControlPointId: number, fromFactionId: number, toFactionId: number, address: string, signature: string) {
    const response = await this.cms.patch(
      `ryoshi-dynasties/armies`,
      {troops, fromControlPointId, toControlPointId, fromFactionId, toFactionId},
      {params: {address, signature, action: "RELOCATE"}}
    );
    return response.data;
  }

  async fetchGift(address: string, signature: string) {
    const response = await this.cms.get(
      `ryoshi-dynasties/game-tokens/shake-tree`, {
        params: {
          address,
          signature
        }
    });
    return response.data;
  }

  async fetchValentinesGift(address: string, signature: string) {
    const response = await this.cms.get(
      `ryoshi-dynasties/game-tokens/valentines`, {
        params: {
          address,
          signature
        }
    });
    return response.data;
  }



  async getFactionsByPoints(gameId: number) {
    const response = await this.cms.get(`ryoshi-dynasties/games/${gameId}/interval-points`);
    return response.data.data;
  }

  async requestCardTradeInAuthorization(nftIds: string[], nftAmounts: number[], direct: boolean, address: string, signature: string) {
    const response = await this.cms.post(
      'ryoshi-dynasties/meeple/trading-card',
      {
        nftId: nftIds,
        amount: nftAmounts,
        direct: direct
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

  async getTownHallWinningFaction() {
    const response = await this.cms.get(`ryoshi-dynasties/staking/town-hall/winners`);
    // const mockData = {
    //   faction: {
    //     id: 1,
    //     name: 'Faction 1',
    //     image: 'https://cdn-prod.ebisusbay.com/storage/DreadTeslaRadiance-1687109338105.jpg',
    //     factionCollectionsSnapshot: {
    //       '0xcf7aedebc5223c4c620625a560300582b77d8719': {
    //         name: 'Ryoshi Tales VIP',
    //         image: 'https://cdn-prod.ebisusbay.com/storage/DreadTeslaRadiance-1687109338105.jpg',
    //         slug: 'ryoshi-tales-vip',
    //       },
    //       '0xe51377a260043381b8b525d33b9ffbc601a1469b': {
    //         name: 'Ryoshi Tales Halloween',
    //         image: 'https://cdn-prod.ebisusbay.com/storage/DreadTeslaRadiance-1687109338105.jpg',
    //         slug: 'ryoshi-tales-halloween',
    //       },
    //       '0xa3a9bd5142bfaf3126734096cacc96a71103611f': {
    //         name: 'Elf Citizens',
    //         image: 'https://cdn-prod.ebisusbay.com/storage/DreadTeslaRadiance-1687109338105.jpg',
    //         slug: 'elf-citizens',
    //       }
    //     }
    //   }
    // }
    // return mockData.faction;
    return response.data?.data ? response.data.data.faction : null;
  }

  async updateFaction(request: FactionUpdateRequest, address: string, signature: string) {
    await factionUpdateRequestSchema.validate(request);

    const response = await this.cms.patch(
      'ryoshi-dynasties/factions',
      {...request},
      {
        params: {
          address,
          signature
        }
      }
    );
    return response.data.data;
  }

  async getFaction(id: number, address: string, signature: string) {
    const response = await this.cms.get(
      `ryoshi-dynasties/factions/${id}`, {
        params: {
          address,
          signature
        }
      }
    );

    return response.data.data;
  }

  async getMerchantItems() {
    const response = await this.cms.get('ryoshi-dynasties/game-tokens/merchant/available');

    return response.data.data as MerchantItem[];
  }

  async requestMerchantPurchaseAuthorization(payload: MerchantPurchaseRequest, address: string, signature: string) {
    const response = await this.cms.get(
      'ryoshi-dynasties/game-tokens/merchant/authorize/purchase',
      {
        params: {
          ...payload,
          address,
          signature
        }
      }
    );

    return response.data.data as MerchantPurchaseRequestResponse;
  }

  async attack(request: AttackRequest, address: string, signature: string) {
    await attackRequestSchema.validate(request);

    const response = await this.cms.post(
      'ryoshi-dynasties/battle-transactions',
      {
        troops: request.troops,
        controlPointId: request.controlPointId,
        factionId: request.factionId,
        defendingFactionId: request.defendingFactionId,
        battleType: request.battleType,
        role: request.role
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
}

export default RyoshiDynastiesRepository;