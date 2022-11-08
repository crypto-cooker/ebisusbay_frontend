import {createSlice} from '@reduxjs/toolkit';
import {caseInsensitiveCompare} from "@src/utils";

const ryoshiStakingCartSlice = createSlice({
  name: 'ryoshiStakingCart',
  initialState: {
    nfts: [],
    isDrawerOpen: false,
    extras: {}
  },
  reducers: {
    addToBatch: (state, action) => {
      const nftToAdd = action.payload;
      if (!state.nfts.some((o) => caseInsensitiveCompare(o.nft.address, nftToAdd.address) && o.nft.id === nftToAdd.id)) {
        state.nfts.push({nft: nftToAdd, price: null});
      }

      if (state.nfts.length === 1) {
        state.isDrawerOpen = true;
      }
    },
    removeFromBatch: (state, action) => {
      const nftToRemove = action.payload;
      state.nfts = state.nfts.filter((o) => !(caseInsensitiveCompare(o.nft.address, nftToRemove.address) && o.nft.id === nftToRemove.id));

      if (!state.nfts.some((o) => caseInsensitiveCompare(o.nft.address, nftToRemove.address))) {
        const extras = state.extras;
        delete extras[nftToRemove.address.toLowerCase()];
        state.extras = extras;
      }
    },
    clearBatch: (state) => {
      state.nfts = [];
      state.extras = {};
    },
    openBatch: (state) => {
      state.isDrawerOpen = true;
    },
    closeBatch: (state) => {
      state.isDrawerOpen = false;
      state.nfts = [];
      state.extras = {};
    },
    minimizeBatch: (state) => {
      state.isDrawerOpen = false;
    },
    initialize: (state) => {
      state.isDrawerOpen = false;
      state.nfts = [];
      state.extras = {};
    },
    setApproval: (state, action) => {
      const extra = state.extras[action.payload.address] ?? {};
      extra.approval = action.payload.status;
      state.extras[action.payload.address.toLowerCase()] = extra;
    },
    setExtras: (state, action) => {
      state.extras[action.payload.address.toLowerCase()] = action.payload;
    }
  },
});

export const {
  addToBatch,
  removeFromBatch,
  clearBatch,
  openBatch,
  closeBatch,
  minimizeBatch,
  setApproval,
  setExtras
} = ryoshiStakingCartSlice.actions;

export default ryoshiStakingCartSlice.reducer;
