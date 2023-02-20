import {InvalidState, ListingState} from "@src/core/services/api-service/types";
import {isEmptyObj} from "@src/utils";

export class ListingsQuery {
    listingId?: string | string[];
    collection?: string | string[];
    tokenId?: string | string[];
    seller?: string;
    sortBy?: string;
    direction?: string;
    state?: ListingState;
    page?: number;
    pageSize?: number;
    traits = {};
    powertraits = {};
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

    constructor(json: any) {
        Object.assign(this, json);
    }

    static default() {
        return new ListingsQuery({});
    }

    static fromCollectionFilter(json: any) {
        let query = new ListingsQuery(json);

        if (Object.keys(json).includes('address')) {
            query.collection = json.address;
        }

        return query;
    }

    static fromMarketFilter(json: any) {
        let query = new ListingsQuery(json);
        query.collection = json.address;

        return query;
    }

    toQuery() {
        const collection = Array.isArray(this.collection) ? this.collection.join(',') : this.collection;
        const tokenId = Array.isArray(this.tokenId) ? this.tokenId.join(',') : this.tokenId;
        const listingId = Array.isArray(this.listingId) ? this.listingId.join(',') : this.listingId;
        const obj = {
            listingId: listingId,
            collection: collection,
            tokenId: tokenId,
            seller: this.seller,
            sortBy: this.sortBy,
            direction: this.direction,
            state: this.state,
            page: this.page,
            pageSize: this.pageSize,
            traits: this.traits,
            powertraits: this.powertraits,
            search: this.search,
            invalid: this.invalid,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            minListingTime: this.minListingTime,
            maxListingTime: this.maxListingTime,
            minSaleTime: this.minSaleTime,
            maxSaleTime: this.maxSaleTime,
            minRank: this.minRank,
            maxRank: this.maxRank,
            verified: this.verified,
        };

        return Object.fromEntries(Object.entries(obj).filter(([k, v]) => {
            return v !== undefined && !isEmptyObj(v)
        }));
    }
}
