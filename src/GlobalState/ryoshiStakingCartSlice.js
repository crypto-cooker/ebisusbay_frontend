import {createSlice} from '@reduxjs/toolkit';
import {caseInsensitiveCompare} from "@src/utils";

const ryoshiStakingCartSlice = createSlice({
  name: 'ryoshiStakingCart',
  initialState: {
    nfts: [],
    isDrawerOpen: false,
    context: 'unstake',
    extras: {}
  },
  reducers: {
    addToCart: (state, action) => {
      const nftToAdd = action.payload;
      if (!state.nfts.some((o) => caseInsensitiveCompare(o.nft.address, nftToAdd.address) && o.nft.id === nftToAdd.id)) {
        state.nfts.push({nft: nftToAdd, price: null});
      }

      if (state.nfts.length === 1) {
        state.isDrawerOpen = true;
      }
    },
    removeFromCart: (state, action) => {
      const nftToRemove = action.payload;
      state.nfts = state.nfts.filter((o) => !(caseInsensitiveCompare(o.nft.address, nftToRemove.address) && o.nft.id === nftToRemove.id));

      if (!state.nfts.some((o) => caseInsensitiveCompare(o.nft.address, nftToRemove.address))) {
        const extras = state.extras;
        delete extras[nftToRemove.address.toLowerCase()];
        state.extras = extras;
      }
    },
    clearCart: (state) => {
      state.nfts = [];
      state.extras = {};
    },
    openCart: (state) => {
      state.isDrawerOpen = true;
    },
    closeCart: (state) => {
      state.isDrawerOpen = false;
      state.nfts = [];
      state.extras = {};
    },
    minimizeCart: (state) => {
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
    },
    setCartContext: (state, action) => {
      state.context = action.payload;
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  closeCart,
  openCart,
  minimizeCart,
  setApproval,
  setExtras,
  setCartContext
} = ryoshiStakingCartSlice.actions;

export default ryoshiStakingCartSlice.reducer;
