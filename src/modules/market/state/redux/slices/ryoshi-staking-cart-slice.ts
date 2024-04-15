import {createSlice} from '@reduxjs/toolkit';
import {caseInsensitiveCompare} from "@market/helpers/utils";

export interface BatchExtras {
  address: string;
  approval: boolean;
  royalty?: number;
  floorPrice?: number;
}

interface RyoshiStakingCartSliceState {
  nfts: any[];
  isDrawerOpen: boolean;
  context: 'unstake' | 'stake';
  extras: {[key: string]: BatchExtras};
}

const ryoshiStakingCartSlice = createSlice({
  name: 'ryoshiStakingCart',
  initialState: {
    nfts: [],
    isDrawerOpen: false,
    context: 'unstake',
    extras: {}
  } as RyoshiStakingCartSliceState,
  reducers: {
    addToCart: (state, action) => {
      const nftToAdd = action.payload;
      if (!state.nfts.some((o) => caseInsensitiveCompare(o.nft.nftAddress, nftToAdd.nftAddress) && o.nft.nftId === nftToAdd.nftId)) {
        state.nfts.push({nft: nftToAdd, price: null});
      }

      if (state.nfts.length === 1) {
        state.isDrawerOpen = true;
      }
    },
    removeFromCart: (state, action) => {
      const nftToRemove = action.payload;
      state.nfts = state.nfts.filter((o) => !(caseInsensitiveCompare(o.nft.nftAddress, nftToRemove.nftAddress) && o.nft.nftId === nftToRemove.nftId));

      if (!state.nfts.some((o) => caseInsensitiveCompare(o.nft.nftAddress, nftToRemove.nftAddress))) {
        const extras = state.extras;
        delete extras[nftToRemove.nftAddress.toLowerCase()];
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
