import {createSlice, Dispatch} from '@reduxjs/toolkit';
import {addToCartInStorage, clearCartInStorage, getCartInStorage, removeFromCartInStorage} from "@src/helpers/storage";

type CartSliceState = {
  nfts: any[];
  shouldPrompt: boolean;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    nfts: [],
    shouldPrompt: false,
  } as CartSliceState,
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
    },
    populateCart: (state, action) => {
      state.nfts = action.payload;
    }
  },
});

export const { addToCart, removeFromCart, clearCart, acknowledgePrompt, openCart, populateCart } = cartSlice.actions;

export default cartSlice.reducer;

export const syncCartStorage = () => (dispatch: Dispatch) => {
  const nfts = getCartInStorage();
  dispatch(populateCart(nfts));
}