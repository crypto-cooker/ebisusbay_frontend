import {createSlice} from '@reduxjs/toolkit';
import {ciEquals, round} from "@market/helpers/utils";
import WalletNft from "@src/core/models/wallet-nft";

type BrokerCurrency = {
  address: string;
  symbol: string;
  name: string;
  image: any;
  decimals: number;
}

export interface UserBatchItem {
  nft: WalletNft;
  quantity: number;
  price?: number;
  expiration?: number;
  currency?: string;
  priceType: 'each' | 'total';
}

export interface UserBatchExtras {
  address: string;
  approval: boolean,
  canTransfer?: boolean;
  canList?: boolean;
  royalty?: number;
  floorPrice?: number;
  availableCurrencies?: BrokerCurrency[];
}

interface UserBatchState {
  items: UserBatchItem[];
  isDrawerOpen: boolean;
  extras: {[key: string]: UserBatchExtras};
  refetchNfts: boolean;
  type: 'listing' | 'bundle' | 'transfer';
}

const batchListingSlice = createSlice({
  name: 'batchListing',
  initialState: {
    items: [],
    isDrawerOpen: false,
    extras: {},
    refetchNfts: false,
    type: 'listing'
  } as UserBatchState,
  reducers: {
    addToBatchListingCart: (state, action) => {
      const nftToAdd = action.payload;
      if (!state.items.some((o) => ciEquals(o.nft.nftAddress, nftToAdd.nftAddress) && o.nft.nftId === nftToAdd.nftId)) {
        state.items.push({nft: nftToAdd, price: undefined, quantity: 1, expiration: 2592000000, currency: 'cro', priceType: 'each'});
      }

      if (state.items.length === 1) {
        state.isDrawerOpen = true;
      }
    },
    removeFromBatchListingCart: (state, action) => {
      const nftToRemove = action.payload;
      state.items = state.items.filter((o) => !(ciEquals(o.nft.nftAddress, nftToRemove.nftAddress) && o.nft.nftId === nftToRemove.nftId));

      if (!state.items.some((o) => ciEquals(o.nft.nftAddress, nftToRemove.nftAddress))) {
        const extras = state.extras;
        delete extras[nftToRemove.nftAddress.toLowerCase()];
        state.extras = extras;
      }
    },
    clearBatchListingCart: (state) => {
      state.items = [];
      state.extras = {};
    },
    openBatchListingCart: (state) => {
      state.isDrawerOpen = true;
    },
    closeBatchListingCart: (state) => {
      state.isDrawerOpen = false;
      state.items = [];
      state.extras = {};
    },
    minimizeBatchListingCart: (state) => {
      state.isDrawerOpen = false;
    },
    initialize: (state) => {
      state.isDrawerOpen = false;
      state.items = [];
      state.extras = {};
    },
    updatePrice: (state, action) => {
      const itemToModify = action.payload.nft;
      const price = action.payload.price;
      const foundIndex = state.items.findIndex((o) => ciEquals(o.nft.nftAddress, itemToModify.nftAddress) && o.nft.nftId === itemToModify.nftId);
      if (foundIndex >= 0) {
        const nft = state.items[foundIndex]
        nft.price = price;
        state.items[foundIndex] = nft;
      }
    },
    updateExpiration: (state, action) => {
      const itemToModify = action.payload.nft;
      const expiration = action.payload.expiration;
      const foundIndex = state.items.findIndex((o) => ciEquals(o.nft.nftAddress, itemToModify.nftAddress) && o.nft.nftId === itemToModify.nftId);
      if (foundIndex >= 0) {
        const nft = state.items[foundIndex]
        nft.expiration = expiration;
        state.items[foundIndex] = nft;
      }
    },
    update1155Quantity: (state, action) => {
      const itemToModify = action.payload.nft;
      const quantity = action.payload.quantity;
      const foundIndex = state.items.findIndex((o) => ciEquals(o.nft.nftAddress, itemToModify.nftAddress) && o.nft.nftId === itemToModify.nftId);
      if (foundIndex >= 0 && itemToModify.is1155) {
        const nft = state.items[foundIndex]
        nft.quantity = quantity;
        state.items[foundIndex] = nft;
      }
    },
    updateCurrency: (state, action) => {
      const itemToModify = action.payload.nft;
      const currency = action.payload.currency;
      const foundIndex = state.items.findIndex((o) => ciEquals(o.nft.nftAddress, itemToModify.nftAddress) && o.nft.nftId === itemToModify.nftId);
      if (foundIndex >= 0) {
        const nft = state.items[foundIndex]
        nft.currency = currency;
        state.items[foundIndex] = nft;
      }
    },
    updatePriceType: (state, action) => {
      const itemToModify = action.payload.nft;
      const priceType = action.payload.priceType;
      const foundIndex = state.items.findIndex((o) => ciEquals(o.nft.nftAddress, itemToModify.nftAddress) && o.nft.nftId === itemToModify.nftId);
      if (foundIndex >= 0) {
        const nft = state.items[foundIndex]
        nft.priceType = priceType;
        state.items[foundIndex] = nft;
      }
    },
    cascadePrices: (state, action) => {
      const currencyRates = action.payload.currencyRates;
      const startingItem = action.payload.startingItem ?? state.items[0];
      let currentPrice = Number(action.payload.startingPrice);
      const step = Number(action.payload.step ?? 1);
      let startingIndex: number | null = null;
      state.items = state.items.map((o, index) => {
        const isStartingItem = ciEquals(o.nft.nftAddress, startingItem.nft.nftAddress) && o.nft.nftId === startingItem.nft.nftId;

        if (isStartingItem) startingIndex = index;
        else if (startingIndex === null) return o;
        if (!state.extras[o.nft.nftAddress.toLowerCase()]?.approval) return o;

        let price = currentPrice > 1 ? currentPrice : 1;
        if (o.currency && currencyRates[o.currency.toLowerCase()]) {
          price = round(price * currencyRates[o.currency.toLowerCase()]);
        }

        currentPrice += step;
        return {...o, price}
      });
    },
    cascadePricesPercent: (state, action) => {
      const currencyRates = action.payload.currencyRates;
      const startingItem = action.payload.startingItem ?? state.items[0];
      let currentPrice = Number(action.payload.startingPrice);
      const step = Number(action.payload.step ?? 1);
      let startingIndex: number | null = null;
      state.items = state.items.map((o, index) => {
        const isStartingItem = ciEquals(o.nft.nftAddress, startingItem.nft.nftAddress) && o.nft.nftId === startingItem.nft.nftId;

        if (isStartingItem) startingIndex = index;
        else if (startingIndex === null) return o;
        if (!state.extras[o.nft.nftAddress.toLowerCase()]?.approval) return o;

        let price = currentPrice > 1 ? currentPrice : 1;

        if (o.currency && currencyRates[o.currency.toLowerCase()]) {
          price = round(price * currencyRates[o.currency.toLowerCase()]);
        }

        currentPrice += round(currentPrice * (step * 0.01));
        return {...o, price}
      });
    },
    applyPriceToAll: (state, action) => {
      const { price, currencyRates, expiration } = action.payload;
      state.items = state.items.map((o) => {
        let newPrice = price;
        if (o.currency && currencyRates[o.currency.toLowerCase()]) {
          newPrice = round(newPrice * currencyRates[o.currency.toLowerCase()]);
        }
        const obj = {...o, price: newPrice};
        if (expiration) obj.expiration = expiration;
        return obj;
      });
    },
    applyCurrencyToAll: (state, action) => {
      const currency = action.payload;
      state.items = state.items.map((o) => {
        return {...o, currency};
      });
    },
    applyExpirationToAll: (state, action) => {
      const expiration = action.payload;
      state.items = state.items.map((o) => {
        return {...o, expiration};
      });
    },
    applyFloorPriceToAll: (state, action) => {
      const { currencyRates } = action.payload;
      state.items = state.items.map((o) => {
        const extra = state.extras[o.nft.nftAddress.toLowerCase()] ?? {};
        if (extra?.floorPrice) {
          let price = extra.floorPrice;
          if (o.currency && currencyRates[o.currency.toLowerCase()]) {
            price = round(price * currencyRates[o.currency.toLowerCase()]);
          }
          return {...o, price}
        }
        return o;
      });
    },
    applyFloorPctToAll: (state, action) => {
      const { pct, currencyRates } = action.payload;
      state.items = state.items.map((o) => {
        const extra = state.extras[o.nft.nftAddress.toLowerCase()] ?? {};
        if (extra?.floorPrice) {
          let price = round(extra.floorPrice * (1 + (pct / 100)))
          if (o.currency && currencyRates[o.currency.toLowerCase()]) {
            price = round(price * currencyRates[o.currency.toLowerCase()]);
          }
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
      if (!!action.payload.availableCurrencies && action.payload.availableCurrencies.length > 0) {
        state.items
          .filter((o) => ciEquals(o.nft.nftAddress, action.payload.address))
          .forEach((o) => o.currency = action.payload.availableCurrencies[0].symbol);
      }
    },
    setRefetchNfts: (state, action) => {
      state.refetchNfts = action.payload;
    },
    setBatchType: (state, action) => {
      state.type = action.payload;
    },
    sortAll: (state, action) => {
      const { field, direction } = action.payload;
      state.items = (state.items as UserBatchItem[]).sort((a, b) => {
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
        return 1;
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
  updateCurrency,
  updatePriceType,
  cascadePrices,
  cascadePricesPercent,
  applyPriceToAll,
  applyCurrencyToAll,
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