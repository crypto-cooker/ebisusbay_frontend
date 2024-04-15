import { applyMiddleware, compose, createStore, combineReducers } from 'redux';

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
});

const reduxDevToolsComposeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// @ts-ignore
const sentryEnhancedMiddlewares = applyMiddleware(thunk);

const enableDevTools = process.env.NODE_ENV !== 'production' || process.env.REACT_APP_DEVTOOLS === 'true';

const reduxDevToolsEnhancedMiddlewares = enableDevTools
  ? reduxDevToolsComposeEnhancers(sentryEnhancedMiddlewares)
  : sentryEnhancedMiddlewares;

const store = createStore(rootReducer, applyMiddleware(thunk));


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;