import { applyMiddleware, compose, combineReducers, configureStore } from '@reduxjs/toolkit';

import thunk from 'redux-thunk';

import { memberships } from '@market/state/redux/slices/Memberships';
import marketplaceReducer from '@market/state/redux/slices/marketplaceSlice';
import auctionsReducer from '@market/state/redux/slices/auctionsSlice';
import auctionReducer from '@market/state/redux/slices/auctionSlice';
import nftReducer from '@market/state/redux/slices/nftSlice';
import collectionsReducer from '@market/state/redux/slices/collectionsSlice';
import { appInitializeStateReducer } from '@market/state/redux/slices/InitSlice';
import leaderBoardReducer from '@market/state/redux/slices/leaderBoardSlice';
import batchListingReducer from '@market/state/redux/slices/user-batch';
import ryoshiStakingReducer from '@market/state/redux/slices/ryoshi-staking-cart-slice';
import pancakeUser from '@eb-pancakeswap-web/state/user/reducer'
import pancakeGlobal from '@eb-pancakeswap-web/state/global/reducer'

const rootReducer = combineReducers({
  memberships: memberships,
  marketplace: marketplaceReducer,
  auctions: auctionsReducer,
  auction: auctionReducer,
  nft: nftReducer,
  appInitialize: appInitializeStateReducer,
  collections: collectionsReducer,
  leaderBoard: leaderBoardReducer,
  batchListing: batchListingReducer,
  ryoshiStakingCart: ryoshiStakingReducer,
  pancakeUser: pancakeUser,
  pancakeGlobal: pancakeGlobal
});

const reduxDevToolsComposeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// @ts-ignore
const sentryEnhancedMiddlewares = applyMiddleware(thunk);

const enableDevTools = process.env.NODE_ENV !== 'production' || process.env.REACT_APP_DEVTOOLS === 'true';

const reduxDevToolsEnhancedMiddlewares = enableDevTools
  ? reduxDevToolsComposeEnhancers(sentryEnhancedMiddlewares)
  : sentryEnhancedMiddlewares;

let store: ReturnType<typeof makeStore>;

export function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  })
}

export const initializeStore = (preloadedState: any = undefined) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined as any
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) {
    store = _store
  }

  return _store
}

store = initializeStore()


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;