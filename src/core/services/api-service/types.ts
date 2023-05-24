import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import WalletNft from "@src/core/models/wallet-nft";
import {Listing} from "@src/core/models/listing";
import {Erc20Account, FortuneStakingAccount, StakedToken} from "@src/core/services/api-service/graph/types";

export interface Api {
    getListings(query?: ListingsQueryParams): Promise<PagedList<Listing>>;
    getProfile(addressOrUsername: string): Promise<any>;
    search(query?: SearchQuery): Promise<PagedList<any>>;
    getOffers(query?: OffersQueryParams): Promise<PagedList<any>>;
    getWallet(address: string, query?: WalletsQueryParams): Promise<PagedList<WalletNft>>;
    getUserUnfilteredListings(address: string, query?: ListingsQueryParams): Promise<PagedList<Listing>>;
    // ryoshiDynasties: RyoshiDynastiesApi;
}

export interface RyoshiDynastiesApi {
    globalTotalPurchased(): Promise<number>;
    userTotalPurchased(address: string): Promise<any>;
    getUserStakedFortune(address: string): Promise<FortuneStakingAccount | null>;
    getErc20Account(address: string): Promise<Erc20Account | null>;
    getStakedTokens(address: string, type: StakedTokenType): Promise<StakedToken[]>;
    requestBankStakeAuthorization(nfts: BankStakeNft[], address: string): Promise<any>;
    requestBarracksStakeAuthorization(nfts: BarracksStakeNft[], address: string): Promise<any>
    getDailyRewards(address: string): Promise<any>
    getSeasonalRewards(address: string, seasonId?: number): Promise<any>
    claimDailyRewards(address: string, signature: string): Promise<any>
    requestSeasonalRewardsClaimAuthorization(address: string, amount: number, seasonId: number, signature: string): Promise<any>;
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