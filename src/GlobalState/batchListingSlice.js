import {createSlice} from '@reduxjs/toolkit';
import {caseInsensitiveCompare} from "@src/utils";

const batchListingSlice = createSlice({
  name: 'batchListing',
  initialState: {
    nfts: [],
    isDrawerOpen: false,
    extras: {},
    extrasBundle: {},
    refetchNfts: false,
    type: 'listing'
  },
  reducers: {
    addToBatchListingCart: (state, action) => {
      const nftToAdd = action.payload;
      if (!state.nfts.some((o) => caseInsensitiveCompare(o.nft.address, nftToAdd.address) && o.nft.id === nftToAdd.id)) {
        state.nfts.push({nft: nftToAdd, price: null, quantity: null, expiration: null});
      }

      if (state.nfts.length === 1) {
        state.isDrawerOpen = true;
      }
    },
    removeFromBatchListingCart: (state, action) => {
      const nftToRemove = action.payload;
      state.nfts = state.nfts.filter((o) => !(caseInsensitiveCompare(o.nft.address, nftToRemove.address) && o.nft.id === nftToRemove.id));

      if (!state.nfts.some((o) => caseInsensitiveCompare(o.nft.address, nftToRemove.address))) {
        const extras = state.extras;
        delete extras[nftToRemove.address.toLowerCase()];
        state.extras = extras;
      }
    },
    clearBatchListingCart: (state) => {
      state.nfts = [];
      state.extras = {};
    },
    openBatchListingCart: (state) => {
      state.isDrawerOpen = true;
    },
    closeBatchListingCart: (state) => {
      state.isDrawerOpen = false;
      state.nfts = [];
      state.extras = {};
    },
    minimizeBatchListingCart: (state) => {
      state.isDrawerOpen = false;
    },
    initialize: (state) => {
      state.isDrawerOpen = false;
      state.nfts = [];
      state.extras = {};
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
    updateExpiration: (state, action) => {
      const itemToModify = action.payload.nft;
      const expiration = action.payload.expiration;
      const foundIndex = state.nfts.findIndex((o) => caseInsensitiveCompare(o.nft.address, itemToModify.address) && o.nft.id === itemToModify.id);
      if (foundIndex >= 0) {
        const nft = state.nfts[foundIndex]
        nft.expiration = expiration;
        state.nfts[foundIndex] = nft;
      }
    },
    update1155Quantity: (state, action) => {
      const itemToModify = action.payload.nft;
      const quantity = action.payload.quantity;
      const foundIndex = state.nfts.findIndex((o) => caseInsensitiveCompare(o.nft.address, itemToModify.address) && o.nft.id === itemToModify.id);
      if (foundIndex >= 0 && itemToModify.multiToken) {
        const nft = state.nfts[foundIndex]
        nft.quantity = quantity;
        state.nfts[foundIndex] = nft;
      }
    },
    cascadePrices: (state, action) => {
      const startingItem = action.payload.startingItem;
      let currentPrice = action.payload.startingPrice;
      let startingIndex = null;
      state.nfts = state.nfts.map((o, index) => {
        const isStartingItem = caseInsensitiveCompare(o.nft.address, startingItem.nft.address) && o.nft.id === startingItem.nft.id;

        if (isStartingItem) startingIndex = index;
        else if (startingIndex === null) return o;
        if (!state.extras[o.nft.address.toLowerCase()]?.approval) return o;

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
      const extra = state.extras[action.payload.address.toLowerCase()] ?? {};
      extra.approval = action.payload.status;
      state.extras[action.payload.address.toLowerCase()] = extra;
    },
    setFloorPrice: (state, action) => {
      const extra = state.extras[action.payload.address.toLowerCase()] ?? {};
      extra.floorPrice = action.payload.floorPrice;
      state.extras[action.payload.address.toLowerCase()] = extra;
    },
    setExtras: (state, action) => {
      state.extras[action.payload.address.toLowerCase()] = action.payload;
    },
    setRefetchNfts: (state, action) => {
      state.refetchNfts = action.payload;
    },
    setBatchType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const {
  addToBatchListingCart,
  removeFromBatchListingCart,
  clearBatchListingCart,
  openBatchListingCart,
  closeBatchListingCart,
  minimizeBatchListingCart,
  updatePrice,
  updateExpiration,
  update1155Quantity,
  cascadePrices,
  applyPriceToAll,
  setApproval,
  setFloorPrice,
  setExtras,
  setRefetchNfts,
  setBatchType
} = batchListingSlice.actions;

export default batchListingSlice.reducer;
