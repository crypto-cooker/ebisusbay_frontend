import {createSlice} from '@reduxjs/toolkit';
import {caseInsensitiveCompare} from "@src/utils";

const batchListingSlice = createSlice({
  name: 'batchListing',
  initialState: {
    nfts: [],
    isDrawerOpen: false,
    approvals: {},
  },
  reducers: {
    addToBatchListingCart: (state, action) => {
      const nftToAdd = action.payload;
      state.nfts.push({nft: nftToAdd, price: null});
      state.isDrawerOpen = true;
    },
    removeFromBatchListingCart: (state, action) => {
      const nftToRemove = action.payload;
      state.nfts = state.nfts.filter((o) => !(caseInsensitiveCompare(o.nft.address, nftToRemove.address) && o.nft.id === nftToRemove.id));

      const approvals = state.approvals;
      delete approvals[nftToRemove.address];
      state.approvals = approvals;
    },
    clearBatchListingCart: (state) => {
      state.nfts = [];
      state.approvals = {};
    },
    openBatchListingCart: (state) => {
      state.isDrawerOpen = true;
    },
    closeBatchListingCart: (state) => {
      state.isDrawerOpen = false;
      state.nfts = [];
      state.approvals = {};
    },
    minimizeBatchListingCart: (state) => {
      state.isDrawerOpen = false;
    },
    initialize: (state) => {
      state.isDrawerOpen = false;
      state.nfts = [];
      state.approvals = {};
    },
    updatePrice: (state, action) => {
      const itemToModify = action.payload.nft;
      const price = action.payload.price;
      const foundIndex = state.nfts.findIndex((o) => caseInsensitiveCompare(o.nft.address, itemToModify.address) && o.nft.id === itemToModify.id);
      if (foundIndex >= 0) {
        const nft = state.nfts[foundIndex]
        nft.price = price;
        state.nfts[foundIndex] = nft;
      }
    },
    cascadePrices: (state, action) => {
      let currentPrice = action.payload;
      state.nfts = state.nfts.map((o) => {
        const price = currentPrice > 1 ? currentPrice : 1;
        currentPrice--;
        return {nft: o.nft, price}
      });
    },
    applyPriceToAll: (state, action) => {
      const price = action.payload;
      state.nfts = state.nfts.map((o) => {
        return {nft: o.nft, price}
      });
    },
    setApproval: (state, action) => {
      state.approvals = {...state.approvals, [action.payload.address]:action.payload.status}
    }
  },
});

export const {
  addToBatchListingCart,
  removeFromBatchListingCart,
  clearBatchListingCart,
  closeBatchListingCart,
  minimizeBatchListingCart,
  updatePrice,
  cascadePrices,
  applyPriceToAll,
  setApproval,
} = batchListingSlice.actions;

export default batchListingSlice.reducer;
