import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import WalletNft from "@src/core/models/wallet-nft";
import {Listing} from "@src/core/models/listing";
import {
    Erc20Account,
    FortuneStakingAccount,
    StakedToken,
    StakingAccount
} from "@src/core/services/api-service/graph/types";
import {RyoshiConfig} from "@src/components-v2/feature/ryoshi-dynasties/game/types";
import {GetBattleLog} from "@src/core/services/api-service/cms/queries/battle-log";

export interface Api {
    getListings(query?: ListingsQueryParams): Promise<PagedList<Listing>>;
    getProfile(addressOrUsername: string): Promise<any>;
    search(query?: SearchQuery): Promise<PagedList<any>>;
    getOffers(query?: OffersQueryParams): Promise<PagedList<any>>;
    getWallet(address: string, query?: WalletsQueryParams): Promise<PagedList<WalletNft>>;
    getUserUnfilteredListings(address: string, query?: ListingsQueryParams): Promise<PagedList<Listing>>;
    // ryoshiDynasties: RyoshiDynastiesApi;
    getCollectionTraits(address: string): Promise<any>;
}

export interface RyoshiDynastiesApi {
    globalTotalPurchased(): Promise<number>;
    userTotalPurchased(address: string): Promise<any>;
    getUserStakedFortune(address: string): Promise<FortuneStakingAccount | null>;
    getErc20Account(address: string): Promise<Erc20Account | null>;
    getStakedTokens(address: string, type: StakedTokenType): Promise<StakedToken[]>;
    requestBankStakeAuthorization(nfts: BankStakeNft[], address: string, signature: string): Promise<any>;
    requestBarracksStakeAuthorization(nfts: BarracksStakeNft[], address: string, signature: string): Promise<any>;
    requestBarracksUnstakeAuthorization(nfts: BarracksStakeNft[], address: string, signature: string): Promise<any>;
    getDailyRewards(address: string): Promise<any>
    getSeasonalRewards(address: string, seasonId?: number): Promise<any>
    claimDailyRewards(address: string, signature: string): Promise<any>
    requestSeasonalRewardsClaimAuthorization(address: string, amount: number, seasonId: number, signature: string): Promise<any>;
    getGlobalContext(): Promise<RyoshiConfig>;
    getUserContext(address: string, signature: string): Promise<RdUserContext>;
    getGameContext(): Promise<RdGameContext>;
    getBankStakingAccount(address: string): Promise<StakingAccount | null>;
    getFactions(gameId?: number): Promise<RdFaction[]>;
    getBattleLog(query: GetBattleLog): Promise<PagedList<RdBattleLog>>;
}

export enum ListingState {
    ACTIVE,
    SOLD,
    CANCELLED
}

export enum OfferState {
    ACTIVE,
    ACCEPTED,
    REJECTED,
    CANCELLED
}

export enum InvalidState {
    FALSE,
    UNKNOWN,
    OWNER_SELLER,
    SELLER_BALANCE,
    APPROVALS,
    IS_STAKED,
    LEGACY
}

export enum OfferType {
    DIRECT = 'direct',
    COLLECTION = 'collection'
}

export interface BankStakeNft {
    nftAddress: string;
    nftId: string;
    amount: number;
}

export interface BarracksStakeNft {
    nftAddress: string;
    nftId: string;
    amount: number;
}

export enum StakedTokenType {
    BANK = 'bank',
    BARRACKS = 'barracks'
}

export interface RdFaction {
    addresses: string[];
    id: number;
    image: string;
    name: string;
    troops: number;
    type: RdFactionType;
    uuid: string;
    isEnabled: boolean;
}

export enum RdFactionType {
    WALLET = 'WALLET',
    COLLECTION = 'COLLECTION'
}

export interface RdControlPoint {
    coordinates: string;
    id: number;
    name: string;
    points: number;
    regionId: number;
    rewardId: number;
    uuid: string;
    leaderBoard: RdControlPointLeaderBoard[];
}

export interface RdControlPointLeaderBoard {
    id: number;
    image: string;
    name: string;
    totalTroops: number;
}

export interface RdArmy {
    controlPointId?: number;
    factionId: number;
    id: number;
    parentId: number;
    profileId?: number;
    troops?: number;
    uuid: string;
}

export interface RdUserContext {
    faction: RdFaction;
    armies: RdUserContextArmies;
    armiesInfo: RDArmiesInfo;
    season: RdUserContextSeason;
    bank: {
        nfts: any[];
        bonus: {
            mApr: number;
            aApr: number;
        }
    },
    barracks: {
        nfts: any[];
        bonus: {
            troops: number;
        }
    },
    dailyRewards: {
        streak: number;
        nextClaim: string;
        nextReward: number;
    }
}

interface RdUserContextSeason {
    faction: RdFaction;
    troops: {
        deployed: number;
        undeployed: number;
    }
}

interface RdUserContextArmies {
    redeploymentDelay: number;
}

interface RDArmiesInfo {
    available: {
        availableControlPoint: number;
        // nativeAvailableTroops: number; would be nice to have this
        availableTroops: number;
        othersPlayersDeployedTroopsLived: number;
        ownDeployedTroops: number;
    };
    delegate: {
        delegateTroopsPerPlayer: any[];
    };
    deployed: {
        deployedTroopsPerOthersPlayers: number;
        playersDeployerTroops: any[];
        troopsPerControlPoint: any[];
    };
    slain: {
        slainTroopsPerControlPoint: any[];
        slainTroopsPerPlayer: any[];
    };
    total: {
        delegatedTroops: number;
        deployedTroops: number;
        nativeTroops: number;
        // slainTroops: number; would be nice to have this
    };
}

export interface RdGameContext {
    season: RdSeason;
    game: RdGame;
    rewards: RdGameRewards;
    state: RdGameState;
    gameLeaders: {
        factions: {
            id: number;
            image: string;
            name: string;
            totalTroops: number;
        }[];
    }[];
    history: {
        previousGameId: number;
    };
}

interface RdGameBase {
    id: number;
    uuid: string;
    startAt: string;
    endAt: string;
}

interface RdGame extends RdGameBase {
    parent: RdSeason;
}

interface RdSeason extends RdGameBase {
    blockId: number;
    endAt: string;
    id: number;
    startAt: string;
    uuid: string;
    map: RdSeasonMap;
}

interface RdSeasonMap {
    id: number;
    regions: RdSeasonRegion[];
    uuid: string;
};

interface RdSeasonRegion {
    id: number;
    name: string;
    uuid: string;
    controlPoints: RdSeasonRegionControlPoint[],
}

interface RdSeasonRegionControlPoint {
    id: number;
    name: string;
    coordinates: string;
    uuid: string;
}

interface RdGameRewards {
    burnPercentage: number;
}

export enum RdGameState {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED',
    UPCOMING = 'UPCOMING',
    RESET = 'RESET',
    IN_MAINTENANCE = 'IN_MAINTENANCE'
}

export interface RdBattleLog {
    controlPoint: string;
    currentTroops: number;
    date: number;
    entity1: any;
    entity2: any;
    event: string;
    pastTroops: number;
}