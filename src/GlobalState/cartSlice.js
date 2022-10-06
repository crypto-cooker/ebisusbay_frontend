import {createSlice} from '@reduxjs/toolkit';
import {addToCartInStorage, clearCartInStorage, getCartInStorage, removeFromCartInStorage} from "@src/helpers/storage";

const data = typeof window !== "undefined" ? getCartInStorage() : []
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    nfts: data,
    shouldPrompt: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const itemToAdd = action.payload;
      state.nfts.push(itemToAdd);
      addToCartInStorage(itemToAdd.listingId, itemToAdd);
      state.shouldPrompt = state.nfts.length === 1;
    },
    removeFromCart: (state, action) => {
      const listingId = action.payload;
      state.nfts = state.nfts.filter((nft) => nft.listingId !== listingId);
      removeFromCartInStorage(listingId);
    },
    clearCart: (state) => {
      state.nfts = [];
      state.shouldPrompt = false;
      clearCartInStorage();
    },
    acknowledgePrompt: (state) => {
      state.shouldPrompt = false;
    },
    openCart: (state) => {
      state.shouldPrompt = true;
    }
  },
});

export const { addToCart, removeFromCart, clearCart, acknowledgePrompt, openCart } = cartSlice.actions;

export default cartSlice.reducer;
