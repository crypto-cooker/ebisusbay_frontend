import {InvalidState, ListingState} from "@src/core/services/api-service/types";
import Query from "@src/core/services/api-service/mapi/queries/index";

export interface ListingsQueryParams {
    listingId?: string | string[];
    collection?: string | string[];
    tokenId?: string | string[];
    seller?: string;
    sortBy?: string;
    direction?: string;
    state?: ListingState;
    page?: number;
    pageSize?: number;
    traits?: object;
    powertraits?: object;
    search?: string;
    invalid?: InvalidState;
    minPrice?: number;
    maxPrice?: number;
    minListingTime?: number;
    maxListingTime?: number;
    minSaleTime?: number;
    maxSaleTime?: number;
    minRank?: number;
    maxRank?: number;
    verified?: boolean;
}

export class ListingsQuery extends Query<ListingsQueryParams> {

    defaultParams(): ListingsQueryParams {
        return {
            state: ListingState.ACTIVE
        };
    }

    toQuery() {
        let query = super.toQuery();
        query.collection = Array.isArray(query.collection) ? query.collection.join(',') : query.collection;
        query.tokenId = Array.isArray(query.tokenId) ? query.tokenId.join(',') : query.tokenId;
        query.listingId = Array.isArray(query.listingId) ? query.listingId.join(',') : query.listingId;
        return query;
    }
}
