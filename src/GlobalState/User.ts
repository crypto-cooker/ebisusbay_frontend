import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Contract, ethers} from 'ethers';

import {toast} from 'react-toastify';
import {createSuccessfulTransactionToastContent,} from '../utils';
import {setThemeInStorage} from '../helpers/storage';
import {appConfig} from '../Config';
import {MarketFilterCollection} from '../Components/Models/market-filters.model';
import {getProfile} from "@src/core/cms/endpoints/profile";
import UserContractService from "@src/core/contractService";
import {ERC20} from "@src/Contracts/Abis";
import FortunePresale from "@src/Contracts/FortunePresale.json";
import Fortune from "@src/Contracts/Fortune.json";
import Bank from "@src/Contracts/Bank.json";

const config = appConfig();

interface UserState {
  provider: any;
  address: string | null;
  web3modal: any;
  connectingWallet: boolean;
  gettingContractData: boolean;
  isMember: boolean;
  needsOnboard: boolean;
  isStaking: boolean;
  fee: number;
  authSignature: any;
  contractService: UserContractService | null;
  correctChain: boolean;
  showWrongChainModal: boolean;
  balance: number | null;
  marketBalance: number | null;
  withdrawingMarketBalance: boolean;
  stakingRewards: number | null;
  harvestingStakingRewards: boolean;
  usesEscrow: boolean;
  updatingEscrowStatus: boolean;
  fortuneBalance: number;
  loadedFortuneBalance: boolean;
  mitamaBalance: number;
  loadedMitamaBalance: boolean;
  myNftPageTransferDialog: any;
  myNftPageListDialog: any;
  myNftPageListDialogError: boolean;
  myNftPageCancelDialog: any;
  myNftPageListedOnly: boolean;
  myNftPageActiveFilterOption: MarketFilterCollection;
  mySoldNfts: any[];
  mySoldNftsCurPage: number;
  mySoldNftsTotalPages: number;
  hasOutstandingOffers: boolean;
  theme: 'light' | 'dark';
  profile: {[key: string]: any};
  tokenSale: {[key: string]: any};
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    // Wallet
    provider: null,
    address: null,
    web3modal: null,
    connectingWallet: false,
    gettingContractData: true,
    // code: '',
    isMember: false,
    // founderCount: 0,
    // vipCount: 0,
    // stakeCount: 0,
    needsOnboard: false,
    isStaking: false,
    fee: 3,

    // Signatures
    authSignature: null,

    // Contracts
    contractService: null,

    correctChain: false,
    showWrongChainModal: false,

    // Primary Balances
    balance: null,
    // rewards: null,
    marketBalance: null,
    withdrawingMarketBalance: false,
    stakingRewards: null,
    harvestingStakingRewards: false,
    usesEscrow: false,
    updatingEscrowStatus: false,
    fortuneBalance: 0,
    loadedFortuneBalance: false,
    mitamaBalance: 0,
    loadedMitamaBalance: false,

    // My NFTs
    nftsInitialized: false,
    nfts: [],
    myNftPageTransferDialog: null,
    myNftPageListDialog: null,
    myNftPageListDialogError: false,
    myNftPageCancelDialog: null,
    myNftPageListedOnly: false,
    myNftPageActiveFilterOption: MarketFilterCollection.default(),

    // My Sales
    mySoldNfts: [],
    mySoldNftsCurPage: 0,
    mySoldNftsTotalPages: 0,

    // Offers
    hasOutstandingOffers: false,

    // Theme
    theme: 'dark',

    profile: {},
    tokenSale: {
      usdc: 0,
      fortune: 0
    },
  } as UserState,
  reducers: {
    accountChanged(state, action) {
      state.balance = action.payload.balance;
      // state.code = action.payload.code;
      // state.rewards = action.payload.rewards;
      state.isMember = action.payload.isMember;
      // state.vipCount = action.payload.vipCount;
      // state.stakeCount = action.payload.stakeCount;
      state.marketBalance = action.payload.marketBalance;
      state.stakingRewards = action.payload.stakingRewards;
      state.gettingContractData = false;
      state.fee = action.payload.fee;
      state.usesEscrow = action.payload.usesEscrow;
    },

    setAuthSigner(state, action) {
      state.authSignature = action.payload;
    },

    onBasicAccountData(state, action) {
      state.address = action.payload.address;
      state.provider = action.payload.provider;
      state.web3modal = action.payload.web3modal;
      state.correctChain = action.payload.correctChain;
      state.needsOnboard = action.payload.needsOnboard;
    },

    onContractServiceInitialized(state, action) {
      state.contractService = action.payload;
    },
    setMyNftPageTransferDialog(state, action) {
      state.myNftPageTransferDialog = action.payload;
    },
    setMyNftPageListDialog(state, action) {
      state.myNftPageListDialog = action.payload;
    },
    setMyNftPageListDialogError(state, action) {
      state.myNftPageListDialogError = action.payload;
    },
    setMyNftPageCancelDialog(state, action) {
      state.myNftPageCancelDialog = action.payload;
    },
    setMyNftPageListedOnly(state, action) {
      state.myNftPageListedOnly = action.payload;
    },
    setMyNftPageActiveFilterOption(state, action) {
      state.myNftPageActiveFilterOption = action.payload;
    },
    connectingWallet(state, action) {
      state.connectingWallet = action.payload.connecting;
    },
    withdrawingMarketBalance(state) {
      state.withdrawingMarketBalance = true;
    },
    withdrewMarketBalance(state, action) {
      state.withdrawingMarketBalance = false;
      if (action.payload.success) {
        state.marketBalance = 0;
      }
    },
    harvestingStakingRewards(state) {
      state.harvestingStakingRewards = true;
    },
    harvestedStakingRewards(state, action) {
      state.harvestingStakingRewards = false;
      if (action.payload.success) {
        state.stakingRewards = 0;
      }
    },
    updatingEscrowStatus(state) {
      state.updatingEscrowStatus = true;
    },
    updatedEscrowStatus(state, action) {
      state.updatingEscrowStatus = false;
      if (action.payload !== undefined) state.usesEscrow = action.payload;
    },
    setShowWrongChainModal(state, action) {
      state.showWrongChainModal = action.payload;
    },
    onLogout(state) {
      state.connectingWallet = false;
      // const web3Modal = new Web3Modal({
      //   cacheProvider: false, // optional
      //   providerOptions: [] as any, // required
      // });
      // web3Modal.clearCachedProvider();
      if (state.web3modal != null) {
        state.web3modal.clearCachedProvider();
      }
      state.web3modal = null;
      localStorage.clear();
      state.address = '';
      state.provider = null;
      state.balance = null;
      state.marketBalance = null;
      state.stakingRewards = null;
      state.isMember = false;
      state.mySoldNfts = [];
      state.profile = {};
      state.authSignature = null;
      state.contractService = null;
      state.fee = 3;
      state.tokenSale = {
        usdc: 0,
        fortune: 0
      }
      state.fortuneBalance = 0;
      state.loadedFortuneBalance = false;
      state.mitamaBalance = 0;
      state.loadedMitamaBalance = false;
    },
    onThemeChanged(state, action) {
      state.theme = action.payload;
    },
    balanceUpdated(state, action) {
      if (action.payload.balance) {
        state.balance = action.payload.balance;
      }
      if (action.payload.marketBalance) {
        state.marketBalance = action.payload.marketBalance;
      }
      if (action.payload.stakingRewards) {
        state.stakingRewards = action.payload.stakingRewards;
      }
    },
    onOutstandingOffersFound(state, action) {
      state.hasOutstandingOffers = action.payload;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setTokenPresaleStats(state, action) {
      state.tokenSale.usdc = action.payload.usdc;
      state.tokenSale.fortune = action.payload.fortune;
    },
    setFortuneBalance(state, action: PayloadAction<number>) {
      state.fortuneBalance = action.payload;
      state.loadedFortuneBalance = true;
    },
    setMitamaBalance(state, action: PayloadAction<number>) {
      state.mitamaBalance = action.payload;
      state.loadedMitamaBalance = true;
    }
  },
});

export const {
  accountChanged,
  setAuthSigner,
  onContractServiceInitialized,
  connectingWallet,
  withdrawingMarketBalance,
  withdrewMarketBalance,
  harvestingStakingRewards,
  harvestedStakingRewards,
  updatingEscrowStatus,
  updatedEscrowStatus,
  setShowWrongChainModal,
  onBasicAccountData,
  onLogout,
  onThemeChanged,
  balanceUpdated,
  onOutstandingOffersFound,
  setProfile,
  setTokenPresaleStats,
  setFortuneBalance,
  setMitamaBalance
} = userSlice.actions;
export const user = userSlice.reducer;

export const updateBalance = () => async (dispatch: any, getState: any) => {
  const { user } = getState();
  const { address, provider } = user;
  const balance = ethers.utils.formatEther(await provider.getBalance(address));
  dispatch(userSlice.actions.balanceUpdated(balance));
};

export const updateFortuneBalance = () => async (dispatch: any, getState: any) => {
  const { user } = getState();
  const { provider } = user;

  const fortuneContract = new Contract(config.contracts.fortune, Fortune, provider.getSigner());
  const fortuneBalance = await fortuneContract.balanceOf(user.address?.toLowerCase());

  dispatch(setFortuneBalance(Number(ethers.utils.formatEther(fortuneBalance))));
};

export const retrieveProfile = () => async (dispatch: any, getState: any) => {
  const { user } = getState();
  const { address } = user;

  try {
    let profile = await getProfile(address);
    if (profile?.data?.pendingGdcItem) {
      try {
        const gdcCollection = config.collections.find((c: any) => c.slug === 'gdc-poa-nft');
        const nft = {
          nftAddress: gdcCollection.address,
          nftId: profile.data.pendingGdcItem.id,
          name: 'Ryoshi Tales - GDC 2023 Commemorative NFT',
          image: 'https://cdn.ltsglxy.network/ipfs/QmYQ1bB1UisN4YnW1WvRfbETweQGxrchkdyXQzJfYte5ck'
        }
        profile.data.pendingGdcItem = {...profile.data.pendingGdcItem, address: gdcCollection.address, nft}
      } catch {
        //throw away
      }
    }
    dispatch(setProfile(profile?.data ?? {}));
  } catch (e) {
    console.log('failed to retrieve profile', e);
    dispatch(setProfile({error: true}));
  }
};

export class AccountMenuActions {
  static withdrawMarketBalance = () => async (dispatch: any, getState: any) => {
    const { user } = getState();
    try {
      dispatch(withdrawingMarketBalance());
      const tx = await user.contractService.market.withdrawPayments(user.address);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      dispatch(withdrewMarketBalance({ success: true }));
      dispatch(updateBalance());
    } catch (error: any) {
      dispatch(withdrewMarketBalance({ success: false }));
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error('Unknown Error');
      }
    } finally {
    }
  };

  static harvestStakingRewards = () => async (dispatch: any, getState: any) => {
    const { user } = getState();
    try {
      dispatch(harvestingStakingRewards());
      const tx = await user.contractService.staking.harvest(user.address);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      dispatch(harvestedStakingRewards({ success: true }));
      dispatch(updateBalance());
    } catch (error: any) {
      dispatch(harvestedStakingRewards({ success: false }));
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error('Unknown Error');
      }
    }
  };
}

/**
 * Grouping related actions to clean up
 * @abstract use static methods
 * some of these actions don't need to be public.
 * after ts migration we can add private keyword.
 */
export class MyNftPageActions {
  static showMyNftPageTransferDialog = (nft: any) => async (dispatch: any) => {
    dispatch(userSlice.actions.setMyNftPageTransferDialog(nft));
  };

  static hideMyNftPageTransferDialog = () => async (dispatch: any) => {
    dispatch(userSlice.actions.setMyNftPageTransferDialog(null));
  };

  static showMyNftPageListDialog = (nft: any, listing: any) => async (dispatch: any) => {
    dispatch(userSlice.actions.setMyNftPageListDialog({ nft, listing }));
  };

  static hideMyNftPageListDialog = () => async (dispatch: any) => {
    dispatch(userSlice.actions.setMyNftPageListDialog(null));
  };

  static showMyNftPageCancelDialog = (nft: any) => async (dispatch: any) => {
    dispatch(userSlice.actions.setMyNftPageCancelDialog(nft));
  };

  static hideNftPageCancelDialog = () => async (dispatch: any) => {
    dispatch(userSlice.actions.setMyNftPageCancelDialog(null));
  };
}

export class MyListingsCollectionPageActions {
  static showMyNftPageCancelDialog = (nft: any) => async (dispatch: any) => {
    dispatch(userSlice.actions.setMyNftPageCancelDialog(nft));
  };

  static showMyNftPageListDialog = (nft: any, listing: any) => async (dispatch: any) => {
    dispatch(userSlice.actions.setMyNftPageListDialog({ nft, listing }));
  };
}

export class MyNftCancelDialogActions {
  static cancelListing = ({ listingId, address, id }: {listingId: string, address: string, id: any}) => async (dispatch: any, getState: any) => {
      const state = getState();
      const marketContract = state.user.contractService.market;
      try {
        let tx = await marketContract.cancelListing(listingId);

        const receipt = await tx.wait();

        dispatch(MyNftPageActions.hideNftPageCancelDialog());

        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      } catch (error: any) {
        dispatch(MyNftPageActions.hideNftPageCancelDialog());

        if (error.data) {
          toast.error(error.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          console.log(error);
          toast.error('Unknown Error');
        }
      }
    };
}
