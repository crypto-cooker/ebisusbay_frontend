import { createSlice } from '@reduxjs/toolkit';
import { getCollectionMetadata, getMarketMetadata, sortAndFetchAuctions } from '../../../../../core/api';
import {Auction} from "../../../../../core/models/auction";
import {appConfig} from "../../../../../config";

const auctionsSlice = createSlice({
  name: 'auctions',
  initialState: {
    loading: false,
    error: false,
    auctions: [],
    curPage: 0,
    curFilter: {},
    curSort: {},
    totalPages: 0,
    collection: null,
    marketData: null,
    hasRank: false,
  },
  reducers: {
    auctionsLoading: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    auctionsReceived: (state, action) => {
      state.loading = false;
      state.error = false;
      state.auctions.push(...action.payload.auctions);
      state.curPage = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.hasRank = action.payload.hasRank;
    },
    clearSet: (state, action) => {
      const hardClear = action.payload || false;

      state.auctions = [];
      state.curPage = 0;
      state.totalPages = 0;
      state.curFilter = {};
      state.curSort = {};

      if (hardClear) {
        state.cachedFilter = {};
        state.cachedSort = {};
      }
    },
    onFilter: (state, action) => {
      const { cacheName, ...payload } = action.payload;

      state.auctions = [];
      state.totalPages = 0;
      state.curPage = 0;
      state.curFilter = payload;

      if (cacheName) {
        state.cachedFilter[cacheName] = payload;
      }
    },
    onSort: (state, action) => {
      const { cacheName, ...payload } = action.payload;

      state.auctions = [];
      state.totalPages = 0;
      state.curPage = 0;
      state.curSort = payload;

      if (cacheName) {
        state.cachedSort[cacheName] = payload;
      }
    },
    onCollectionDataLoaded: (state, action) => {
      state.collection = action.payload.collection;
    },
    onMarketDataLoaded(state, action) {
      state.marketData = action.payload.marketdata;
    },
  },
});

export const {
  auctionsLoading,
  auctionsReceived,
  onFilter,
  onSort,
  clearSet,
  onCollectionDataLoaded,
  onRankingsLoaded,
  onMarketDataLoaded,
} = auctionsSlice.actions;

export default auctionsSlice.reducer;

export const init = (sort, filter) => async (dispatch, getState) => {
  dispatch(clearSet(false));

  if (sort) {
    dispatch(
      onSort({
        type: sort.type,
        direction: sort.direction,
      })
    );
  }

  if (filter) {
    dispatch(
      onFilter({
        type: filter.type,
        address: filter.address,
      })
    );
  }
};

export const fetchListings = () => async (dispatch, getState) => {
  const state = getState();

  dispatch(auctionsLoading());
  let response = await sortAndFetchAuctions(
    state.auctions.curPage + 1,
    state.auctions.curSort,
    state.auctions.curFilter.type,
    state.auctions.curFilter.address
  );
  response.hasRank = response.auctions.length > 0 && typeof response.auctions[0].nft.rank !== 'undefined';

  const mappedAuctions = response.auctions.map(o => new Auction(o));
  response = {...response, ...{ auctions: mappedAuctions }};

  dispatch(auctionsReceived(response));
};
