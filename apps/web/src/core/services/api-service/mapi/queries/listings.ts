import {InvalidState, ListingState} from "@src/core/services/api-service/types";
import Query from "@src/core/services/api-service/mapi/queries/index";
import * as Yup from "yup";

export const listingsQuerySchema: Yup.SchemaOf<ListingsQueryParams> = Yup.object().shape({
    listingId: Yup.array().of(Yup.string()).optional(),
    collection: Yup.array().of(Yup.string()).optional(),
    tokenId: Yup.array().of(Yup.string()).optional(),
    seller: Yup.string().optional(),
    sortBy: Yup.mixed().oneOf(['listingId', 'listingTime', 'saleTime', 'price', 'rank', 'expirationDate']).default('listingTime'),
    direction: Yup.mixed().oneOf(['asc', 'desc']).default('desc'),
    state: Yup.number().optional(),
    page: Yup.number().optional().default(1),
    pageSize: Yup.number().optional().default(50),
    traits: Yup.object().optional(),
    powertraits: Yup.object().optional(),
    search: Yup.string().optional(),
    invalid: Yup.number().optional(),
    minPrice: Yup.number().optional(),
    maxPrice: Yup.number().optional(),
    minListingTime: Yup.number().optional(),
    maxListingTime: Yup.number().optional(),
    minSaleTime: Yup.number().optional(),
    maxSaleTime: Yup.number().optional(),
    minRank: Yup.number().optional(),
    maxRank: Yup.number().optional(),
    verified: Yup.number().optional(),
    currency: Yup.string().optional(),
    chain: Yup.number().optional()
}).noUnknown();

export interface ListingsQueryParams {
    listingId?: string[];
    collection?: string[];
    tokenId?: string[];
    seller?: string;
    sortBy?: 'listingId' | 'listingTime' | 'saleTime' | 'price' | 'rank' | 'expirationDate';
    direction?: 'asc' | 'desc';
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
    verified?: number;
    currency?: string;
    chain?: number;
}

export class ListingsQuery extends Query<ListingsQueryParams> {

    defaultParams(): ListingsQueryParams {
        return {
            state: ListingState.ACTIVE
        };
    }
}
