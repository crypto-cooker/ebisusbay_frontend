import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import WalletNft from "@src/core/models/wallet-nft";
import {Listing} from "@src/core/models/listing";
import {
    Erc20Account,
    FortuneStakingAccount, PresaleVault,
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
    presaleVault(address: string): Promise<PresaleVault | null>
    getUserStakedFortune(address: string): Promise<FortuneStakingAccount | null>;
    getErc20Account(address: string): Promise<Erc20Account | null>;
    getStakedTokens(address: string, type: StakedTokenType): Promise<StakedToken[]>;
    requestBankStakeAuthorization(nfts: BankStakeNft[], address: string, signature: string): Promise<any>;
    requestBankUnstakeAuthorization(nfts: BankStakeNft[], address: string, signature: string): Promise<any>;
    requestBarracksStakeAuthorization(nfts: BarracksStakeNft[], address: string, signature: string): Promise<any>;
    requestBarracksUnstakeAuthorization(nfts: BarracksStakeNft[], address: string, signature: string): Promise<any>;
    requestRewardsSpendAuthorization(amount: number | string, address: string, signature: string): Promise<any>;
    getDailyRewards(address: string): Promise<any>
    getSeasonalRewards(address: string, seasonId?: number): Promise<any>
    claimDailyRewards(address: string, signature: string): Promise<any>
    requestSeasonalRewardsClaimAuthorization(address: string, amount: number, signature: string): Promise<any>;
    requestSeasonalRewardsCompoundAuthorization(address: string, amount: number, vaultIndex: number, signature: string): Promise<any>;
    getPendingFortuneAuthorizations(address: string, signature: string): Promise<any>;
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

export enum ReceivedOfferType {
    ERC721 = '721',
    ERC1155 = '1155'
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

export interface RdUserContext {
    faction: RdFaction;
    armies: RdUserContextArmies;
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
    },
    reputations: Reputation[];
    experience: Experience;
}

interface RdUserContextSeason {
    faction: RdFaction;
    troops: RdUserContextOwnerFactionTroops | RdUserContextNoOwnerFactionTroops;
    registrations: RdUserContextSeasonRegistration;
}

export interface RdUserContextOwnerFactionTroops {
    overall: {
        owned: number;
        delegated: number;
        total: number;
    },
    available: {
        owned: number;
        total: number;
    },
    delegate: {
        users: RdUserContextDelegatedTroopsProfile[];
        total: number;
    },
    deployed: {
        users: RdUserTroopsContext[];
        total: number;
    },
    slain: {
        users: RdUserTroopsContext[];
        total: number;
    }
}

export interface RdUserContextNoOwnerFactionTroops {
    overall: {
        owned: number;
        delegated: number;
        total: number;
    },
    available: {
        owned: number;
        total: number;
    },
    delegate: {
        factions: RdUserContextDelegateTroopsFaction[];
        total: number;
    },
    deployed: {
        factions: RdFactionTroopsContext[];
        total: number;
    },
    slain: {
        factions: RdFactionTroopsContext[];
        total: number;
    }
}

interface RdControlPointContext {
    controlPointId: number;
    name: string;
    troops: number;
}

interface RdUserContextDelegatedTroopsProfile {
    profileId: number;
    profileWalletAddress: string;
    profileName: string,
    troops: number;
}

interface RdUserContextDelegateTroopsFaction {
    factionId: number,
    factionName: string,
    troops: number,
}
interface RdFactionTroopsContext {
    factionId: number;
    factionName: string;
    troops: number;
    controlPoints: RdControlPointContext[];
}

interface RdUserTroopsContext {
    profileId: number;
    profileWalletAddress: string;
    profileName: string;
    troops: number;
    controlPoints: RdControlPointContext[];
}

interface RdUserContextArmies {
    redeploymentDelay: number;
}

interface RdUserContextSeasonRegistration {
    current: boolean;
    next: boolean;
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

interface RdGame {
    id: number;
    uuid: string;
    startAt: string;
    stopAt: string;
    endAt: string;
    season: RdSeason;
}

interface RdSeason {
    id: number;
    uuid: string;
    startAt: string;
    endAt: string;
    blockId: number;
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

interface Reputation {
    profileId: number;
    otherFactionId: number;
    points: number;
    level: ReputationLevel;
}

interface Experience {
    points: number;
    level: number;
}

export enum ReputationLevel {
    Nefarious = "Nefarious",
    Infamous = "Infamous",
    Defamed = "Defamed",
    Outcast = "Outcast",
    Scorned = "Scorned",
    Vilified = "Vilified",
    Hated = "Hated",
    Spurned = "Spurned",
    Disliked = "Disliked",
    Unfriendly = "Unfriendly",
    Neutral = "Neutral",
    Friendly = "Friendly",
    Respected = "Respected",
    Admired = "Admired",
    Esteemed = "Esteemed",
    Honored = "Honored",
    Praised = "Praised",
    Revered = "Revered",
    Acclaimed = "Acclaimed",
    Notorious = "Notorious",
    Exalted = "Exalted"
}

interface Experience {
    points: number;
    level: number;
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

export enum PokerCollection{
    Diamonds = 'Diamonds', 
    Clubs = 'Clubs',
    Live = 'Live',
}

export interface XPProfile {
    walletAddress: string;
    username: string;
    avatar: string;
    experience: number;
    level: number;
    rank: number;
}