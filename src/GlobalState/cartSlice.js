import {createSlice} from '@reduxjs/toolkit';
import {addToCartInStorage, getCartInStorage, removeFromCartInStorage} from "@src/helpers/storage";

const data = typeof window !== "undefined" ? getCartInStorage() : []
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    nfts: data,
    shouldPrompt: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const nftToAdd = action.payload;
      state.nfts.push(nftToAdd);
      addToCartInStorage(nftToAdd);
      state.shouldPrompt = state.nfts.length === 1;
    },
    removeFromCart: (state, action) => {
      const nftToDelete = action.payload;
      state.nfts = state.nfts.filter((nft) => !(nft.id === nftToDelete.id && nft.address === nftToDelete.address));
      removeFromCartInStorage(nftToDelete);
    },
    clearCart: (state) => {
      state.nfts = [];
      state.shouldPrompt = false;
    },
    acknowledgePrompt: (state) => {
      state.shouldPrompt = false;
    }
  },
});

export const { addToCart, removeFromCart, clearCart, acknowledgePrompt } = cartSlice.actions;

export default cartSlice.reducer;
