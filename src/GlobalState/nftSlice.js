import { createSlice } from '@reduxjs/toolkit';
import { getNft } from '../core/api';
import { listingState } from '../core/api/enums';
import {refreshToken} from "@src/core/api/endpoints/refresh";
import {toast} from "react-toastify";

const nftSlice = createSlice({
  name: 'nft',
  initialState: {
    loading: false,
    error: false,
    nft: null,
    history: [],
    powertraits: [],
    currentListing: null,
    refreshing: false
  },
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
    },
    nftRefreshing: (state) => {
      state.refreshing = true;
    },
    nftRefreshingComplete: (state) => {
      state.refreshing = false;
    }
  },
});

export const { nftLoading, nftReceived, nftRefreshing, nftRefreshingComplete } = nftSlice.actions;

export default nftSlice.reducer;

export const getNftDetails = (collectionAddress, nftId) => async (dispatch, getState) => {
  dispatch(nftLoading());
  let response = await getNft(collectionAddress, nftId);

  const currentListing = response.listings ? response.listings
    .sort((a, b) => (parseInt(a.price) > parseInt(b.price) ? 1 : -1))
    .find((l) => l.state === listingState.ACTIVE) : null;
  response.nft = { ...response.nft, address: collectionAddress, id: nftId };
  response.currentListing = currentListing;

  dispatch(nftReceived(response));
  return response.nft;
};

export const refreshMetadata = (collectionAddress, nftId) => async (dispatch, getState) => {
  dispatch(nftRefreshing());
  await refreshToken(collectionAddress, nftId);
  toast.success('Refresh queued! Check back in a few minutes.')
  dispatch(nftRefreshingComplete());
}
