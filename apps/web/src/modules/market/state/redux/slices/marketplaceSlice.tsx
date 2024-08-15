import { createSlice } from '@reduxjs/toolkit';
import { getCollectionMetadata, getMarketMetadata } from '../../../../../core/api';
import { SortOption } from '../../../../../Components/Models/sort-option.model';
import {MarketFilters} from "../../../../../Components/Models/market-filters.model";
import {ListingsQuery} from "../../../../../core/api/queries/listings";
import {sortAndFetchListings} from "../../../../../core/api/endpoints/listings";

interface MarketplaceState {
  loading: boolean;
  error: boolean;
  listings: any[];
  query: any;
  totalPages: number;
  collection: any;
  marketData: any;
  hasRank: boolean;
  cachedFilter: any;
  cachedSort: any;
}

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState: {
    loading: false,
    error: false,
    listings: [],
    query: {
      page: 0,
      filter: MarketFilters.default(),
      sort: {},
    },
    totalPages: 0,
    collection: null,
    marketData: null,
    hasRank: false,
    cachedFilter: {},
    cachedSort: {},
  } as MarketplaceState,
  reducers: {
    listingsLoading: (state) => {
      state.loading = true;
      state.error = false;
    },
    listingsReceived: (state, action) => {
      state.loading = false;
      state.error = false;
      state.listings.push(...action.payload.listings);
      state.query.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.hasRank = action.payload.hasRank;
    },
    clearSet: (state, action) => {
      const hardClear = action.payload || false;

      state.listings = [];
      state.totalPages = 0;
      state.query.filter = MarketFilters.default();
      state.query.sort = SortOption.default();
    },
    onFilter: (state, action) => {
      const { cacheName, option } = action.payload;

      state.listings = [];
      state.totalPages = 0;
      state.query.page = 0;
      state.query.filter = option;
    },
    onSort: (state, action) => {
      const { cacheName, option } = action.payload;

      state.listings = [];
      state.totalPages = 0;
      state.query.page = 0;
      state.query.sort = option;
    },
    onSearch: (state, action) => {
      const { cacheName, search } = action.payload;

      state.listings = [];
      state.totalPages = 0;
      state.query.page = 0;
      state.query.filter.search = search;
    },
    onCollectionFilter: (state, action) => {
      const { cacheName, option } = action.payload;

      state.listings = [];
      state.totalPages = 0;
      state.query.page = 0;
      state.query.filter.collection = option;
    },
    onVerifiedFilter: (state, action) => {
      const {verified} = action.payload

      state.listings = [];
      state.totalPages = 0;
      state.query.page = 0;
      state.query.filter.verified = verified;
    },
    onCollectionDataLoaded: (state, action) => {
      state.collection = action.payload.collection;
    },
    onMarketDataLoaded(state, action) {
      state.marketData = action.payload.marketdata;
    },
  },
  // extraReducers: (builder) => {
  //     builder.addCase(getListings.fulfilled, (state, action) => {
  //         state.listings = action.payload;
  //     })
  // }
});

export const {
  listingsLoading,
  listingsReceived,
  onFilter,
  onSort,
  onSearch,
  clearSet,
  onCollectionDataLoaded,
  onMarketDataLoaded,
  onCollectionFilter,
  onVerifiedFilter,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;

export const init = (sortOption: any, filterOption: any) => async (dispatch: any, getState: any) => {
  dispatch(clearSet(false));

  if (sortOption && sortOption instanceof SortOption) {
    dispatch(onSort({ option: sortOption }));
  }

  if (filterOption && filterOption instanceof MarketFilters) {
    dispatch(onFilter({ option: filterOption }));
  }
};

export const fetchListings = (isSales = false) => async (dispatch: any, getState: any) => {
    const state = getState();

    dispatch(listingsLoading());
    const { response, cancelled } = await sortAndFetchListings(
      state.marketplace.query.page + 1,
      state.marketplace.query.sort,
      ListingsQuery.fromMarketFilter(state.marketplace.query.filter.toQuery()),
      isSales ? 1 : 0,
      state.marketplace.query.filter.limit
    );

    if (!cancelled && !!response.listings) {
      response.hasRank = response.listings.length > 0 && typeof response.listings[0].nft.rank !== 'undefined';
      dispatch(listingsReceived(response));
    }
  };

export const filterListings = (filterOption: any, cacheName: string, isSales = false) =>
  async (dispatch: any) => {
    dispatch(onCollectionFilter({ option: filterOption, cacheName }));
    dispatch(fetchListings(isSales));
  };

export const filterListingsByVerification = (isSales = false, verified: boolean | null = null) =>
  async (dispatch: any) => {
    dispatch(onVerifiedFilter({verified}));
    dispatch(fetchListings(isSales));
  };

export const sortListings =
  (sortOption: any, cacheName: string, isSales = false) =>
  async (dispatch: any) => {
    dispatch(onSort({ option: sortOption, cacheName }));
    dispatch(fetchListings(isSales));
  };

export const searchListings = (value: string, cacheName: string, isSales: boolean) => async (dispatch: any) => {
  dispatch(onSearch({ search: value, cacheName }));
  dispatch(fetchListings(isSales));
};

export const getMarketData = () => async (dispatch: any) => {
  try {
    const response = await getMarketMetadata();
    dispatch(
      onMarketDataLoaded({
        marketdata: response,
      })
    );
  } catch (error) {
    console.log(error);
  }
};
