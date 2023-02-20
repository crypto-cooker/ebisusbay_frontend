import {ListingsQuery} from "@src/core/services/api-service/mapi/queries/listings";
import {PagedList} from "@src/core/services/api-service/paginated-list";
import Listing from "@src/core/models/listing";
import SearchQuery from "@src/core/services/api-service/mapi/queries/search";
import OffersQuery from "@src/core/services/api-service/mapi/queries/offers";

export interface Api {
    getListings(query?: ListingsQuery): Promise<PagedList<any>>;
    getProfile(addressOrUsername: string): Promise<any>;
    search(query?: SearchQuery): Promise<PagedList<any>>;
    getOffers(query?: OffersQuery): Promise<PagedList<any>>
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