import {createSlice, Dispatch} from '@reduxjs/toolkit';
import { listingState } from '../../../../../core/api/enums';
import {refreshToken} from "@src/core/api/endpoints/refresh";
import {toast} from "react-toastify";
import {getNft} from "@src/core/api/endpoints/nft";
import {getNftFavorites} from "@src/core/cms/next/favorites";
import { MapiCollectionBlacklist } from '@src/core/services/api-service/mapi/types';

type NftSliceState = {
  loading: boolean;
  error: boolean;
  nft: any;
  history: any[];
  powertraits: any[];
  currentListing?: any;
  refreshing: boolean;
  favorites: number;
  collection: any;
  blacklisted: MapiCollectionBlacklist;
}

const nftSlice = createSlice({
  name: 'nft',
  initialState: {
    loading: false,
    error: false,
    nft: null,
    history: [],
    powertraits: [],
    currentListing: null,
    refreshing: false,
    favorites: 0,
    collection: null,
    blacklisted: MapiCollectionBlacklist.LISTABLE
  } as NftSliceState,
  reducers: {
    nftLoading: (state) => {
      state.loading = true;
      state.error = false;
    },
    nftReceived: (state, action) => {
      state.loading = false;
      state.error = false;
      state.nft = action.payload.nft;
      state.history = action.payload.listings ?? [];
      state.powertraits = action.payload.powertraits ?? [];
      state.currentListing = action.payload.currentListing;
      state.favorites = action.payload.favorites;
      state.collection = action.payload.collection;
      state.blacklisted = action.payload.blacklisted;
    },
    nftRefreshing: (state) => {
      state.refreshing = true;
    },
    nftRefreshingComplete: (state) => {
      state.refreshing = false;
    },
    nftFavorited: (state, action) => {
      state.favorites = action.payload;
    }
  },
});

export const { nftLoading, nftReceived, nftRefreshing, nftRefreshingComplete, nftFavorited } = nftSlice.actions;

export default nftSlice.reducer;

export const getNftDetails = (collectionAddress: string, nftId: string, chainId: number) => async (dispatch: Dispatch) => {
  dispatch(nftLoading());
  let response = await getNft(collectionAddress, nftId, chainId);

  const currentListing = response.listings ? response.listings
    .find((l: any) => l.state === listingState.ACTIVE) : null;
  response.nft = { ...response.nft, address: collectionAddress, id: nftId };
  response.currentListing = currentListing;
  try {
    response.favorites = await getNftFavorites(collectionAddress, nftId);
  } catch (e) {
    console.log(e);
  }
  dispatch(nftReceived(response));
  return response.nft;
};

export const refreshMetadata = (collectionAddress: string, nftId: string, listingId?: string) => async (dispatch: Dispatch) => {
  dispatch(nftRefreshing());
  await refreshToken(collectionAddress, nftId, listingId);
  toast.success('Refresh queued! Check back in a few minutes.')
  dispatch(nftRefreshingComplete());
}

export const tickFavorite = (num: number) => async (dispatch: Dispatch, getState: any) => {
  const { nft } = getState();
  let count = nft.favorites + num;
  dispatch(nftFavorited(count));
}