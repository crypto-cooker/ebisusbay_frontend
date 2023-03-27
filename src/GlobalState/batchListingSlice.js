import {createSlice, current} from '@reduxjs/toolkit';
import {caseInsensitiveCompare, round} from "@src/utils";

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
      if (!state.nfts.some((o) => caseInsensitiveCompare(o.nft.nftAddress, nftToAdd.nftAddress) && o.nft.nftId === nftToAdd.nftId)) {
        state.nfts.push({nft: nftToAdd, price: null, quantity: null, expiration: 2592000000});
      }

      if (state.nfts.length === 1) {
        state.isDrawerOpen = true;
      }
    },
    removeFromBatchListingCart: (state, action) => {
      const nftToRemove = action.payload;
      state.nfts = state.nfts.filter((o) => !(caseInsensitiveCompare(o.nft.nftAddress, nftToRemove.nftAddress) && o.nft.nftId === nftToRemove.nftId));

      if (!state.nfts.some((o) => caseInsensitiveCompare(o.nft.nftAddress, nftToRemove.nftAddress))) {
        const extras = state.extras;
        delete extras[nftToRemove.nftAddress.toLowerCase()];
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
      const foundIndex = state.nfts.findIndex((o) => caseInsensitiveCompare(o.nft.nftAddress, itemToModify.nftAddress) && o.nft.nftId === itemToModify.nftId);
      if (foundIndex >= 0) {
        const nft = state.nfts[foundIndex]
        nft.price = price;
        state.nfts[foundIndex] = nft;
      }
    },
    updateExpiration: (state, action) => {
      const itemToModify = action.payload.nft;
      const expiration = action.payload.expiration;
      const foundIndex = state.nfts.findIndex((o) => caseInsensitiveCompare(o.nft.nftAddress, itemToModify.nftAddress) && o.nft.nftId === itemToModify.nftId);
      if (foundIndex >= 0) {
        const nft = state.nfts[foundIndex]
        nft.expiration = expiration;
        state.nfts[foundIndex] = nft;
      }
    },
    update1155Quantity: (state, action) => {
      const itemToModify = action.payload.nft;
      const quantity = action.payload.quantity;
      const foundIndex = state.nfts.findIndex((o) => caseInsensitiveCompare(o.nft.nftAddress, itemToModify.nftAddress) && o.nft.nftId === itemToModify.nftId);
      if (foundIndex >= 0 && itemToModify.multiToken) {
        const nft = state.nfts[foundIndex]
        nft.quantity = quantity;
        state.nfts[foundIndex] = nft;
      }
    },
    cascadePrices: (state, action) => {
      const startingItem = action.payload.startingItem ?? state.nfts[0];
      let currentPrice = Number(action.payload.startingPrice);
      const step = Number(action.payload.step ?? 1);
      let startingIndex = null;
      state.nfts = state.nfts.map((o, index) => {
        const isStartingItem = caseInsensitiveCompare(o.nft.nftAddress, startingItem.nft.nftAddress) && o.nft.nftId === startingItem.nft.nftId;

        if (isStartingItem) startingIndex = index;
        else if (startingIndex === null) return o;
        if (!state.extras[o.nft.nftAddress.toLowerCase()]?.approval) return o;

        const price = currentPrice > 1 ? currentPrice : 1;
        currentPrice += step;
        console.log('cascade', price, currentPrice, step)
        return {...o, price}
      });
    },
    cascadePricesPercent: (state, action) => {
      const startingItem = action.payload.startingItem ?? state.nfts[0];
      let currentPrice = Number(action.payload.startingPrice);
      const step = Number(action.payload.step ?? 1);
      let startingIndex = null;
      state.nfts = state.nfts.map((o, index) => {
        const isStartingItem = caseInsensitiveCompare(o.nft.nftAddress, startingItem.nft.nftAddress) && o.nft.nftId === startingItem.nft.nftId;

        if (isStartingItem) startingIndex = index;
        else if (startingIndex === null) return o;
        if (!state.extras[o.nft.nftAddress.toLowerCase()]?.approval) return o;

        const price = currentPrice > 1 ? currentPrice : 1;
        currentPrice += round(currentPrice * (step * 0.01));
        return {...o, price}
      });
    },
    applyPriceToAll: (state, action) => {
      const { price, expiration } = action.payload;
      state.nfts = state.nfts.map((o) => {
        const obj = {...o, price};
        if (expiration) obj.expiration = expiration;
        return obj;
      });
    },
    applyExpirationToAll: (state, action) => {
      const expiration = action.payload;
      state.nfts = state.nfts.map((o) => {
        return {...o, expiration};
      });
    },
    applyFloorPriceToAll: (state, action) => {
      state.nfts = state.nfts.map((o) => {
        const extra = state.extras[o.nft.nftAddress.toLowerCase()] ?? {};
        if (extra?.floorPrice) return {...o, price: extra.floorPrice}
        return o;
      });
    },
    applyFloorPctToAll: (state, action) => {
      const { pct } = action.payload;
      state.nfts = state.nfts.map((o) => {
        const extra = state.extras[o.nft.nftAddress.toLowerCase()] ?? {};
        if (extra?.floorPrice) {
          const price = round(extra.floorPrice * (1 + (pct / 100)))
          return {...o, price}
        }
        return o;
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
    sortAll: (state, action) => {
      const { field, direction } = action.payload;
      state.nfts = state.nfts.sort((a, b) => {
        const dir1 = direction === 'asc' ? 1 : -1;
        const dir2 = direction === 'asc' ? -1 : 1;

        if (field === 'rank') {
          if (!a.nft.rank) return 1;
          if (!b.nft.rank) return -1;
          return a.nft.rank > b.nft.rank ? dir1 : dir2;
        }
        if (field === 'floor') {
          const aExtra = state.extras[a.nft.nftAddress.toLowerCase()] ?? {};
          const bExtra = state.extras[b.nft.nftAddress.toLowerCase()] ?? {};
          const aFloorPrice = aExtra?.floorPrice ? Number(aExtra.floorPrice) : 0;
          const bFloorPrice = bExtra?.floorPrice ? Number(bExtra.floorPrice) : 0;
          return aFloorPrice > bFloorPrice ? dir1 : dir2;
        }
      });
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
  cascadePricesPercent,
  applyPriceToAll,
  applyExpirationToAll,
  applyFloorPriceToAll,
  applyFloorPctToAll,
  setApproval,
  setFloorPrice,
  setExtras,
  setRefetchNfts,
  setBatchType,
  sortAll
} = batchListingSlice.actions;

export default batchListingSlice.reducer;
