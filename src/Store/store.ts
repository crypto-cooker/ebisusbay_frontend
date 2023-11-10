import { applyMiddleware, compose, createStore, combineReducers } from 'redux';

import thunk from 'redux-thunk';

import { memberships } from '../GlobalState/Memberships';
import marketplaceReducer from '../GlobalState/marketplaceSlice';
import auctionsReducer from '../GlobalState/auctionsSlice';
import auctionReducer from '../GlobalState/auctionSlice';
import metaverseReducer from '../GlobalState/metaverseSlice';
import nftReducer from '../GlobalState/nftSlice';
import collectionsReducer from '../GlobalState/collectionsSlice';
import { appInitializeStateReducer } from '../GlobalState/InitSlice';
import leaderBoardReducer from '../GlobalState/leaderBoardSlice';
import cartReducer from '../GlobalState/cartSlice';
import batchListingReducer from '../GlobalState/user-batch';
import ryoshiStakingReducer from '../GlobalState/ryoshi-staking-cart-slice';
import { user } from '../GlobalState/User';

const rootReducer = combineReducers({
  memberships: memberships,
  marketplace: marketplaceReducer,
  auctions: auctionsReducer,
  auction: auctionReducer,
  nft: nftReducer,
  user: user,
  appInitialize: appInitializeStateReducer,
  collections: collectionsReducer,
  metaverse: metaverseReducer,
  leaderBoard: leaderBoardReducer,
  cart: cartReducer,
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