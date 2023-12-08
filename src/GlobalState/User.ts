import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BigNumber, Contract, ethers} from 'ethers';
import Web3Modal from 'web3modal';

import detectEthereumProvider from '@metamask/detect-provider';
import {DeFiWeb3Connector} from 'deficonnect';
import WalletConnectProvider from '@walletconnect/web3-provider';
import * as DefiWalletConnectProvider from '@deficonnect/web3-provider';
import {toast} from 'react-toastify';
import {createSuccessfulTransactionToastContent, isUserBlacklisted,} from '../utils';
import {appAuthInitFinished} from './InitSlice';
import {captureException} from '@sentry/react';
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
      const web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions: [] as any, // required
      });
      web3Modal.clearCachedProvider();
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

export const connectAccount =
  (firstRun = false, type = '') =>
  async (dispatch: any, getState: any) => {
    const state = getState();
    const providerOptions = {
      'custom-defiwallet': {
        display: {
          logo: '/img/logos/cdc_logo.svg',
          name: 'Crypto.com DeFi Wallet',
          description: 'Connect with the CDC DeFi Wallet',
        },
        options: {},
        package: DefiWalletConnectProvider,
        connector: async (ProviderPackage: any, options: any) => {
          const connector = new DeFiWeb3Connector({
            supportedChainIds: [25],
            rpc: { 25: 'https://rpc.ebisusbay.com' },
            pollingInterval: 15000,
          });

          await connector.activate();
          let provider = await connector.getProvider();
          return provider;
        },
      },
    } as any;

    if (type !== 'defi') {
      providerOptions.walletconnect = {
        package: WalletConnectProvider, // required
        options: {
          chainId: 25,
          rpc: {
            25: 'https://rpc.ebisusbay.com',
          },
          network: 'cronos',
          metadata: {
            icons: ['https://ebisusbay.com/vector%20-%20face.svg'],
            description: 'Cronos NFT Marketplace',
          },
        },
      };
    }

    const web3ModalWillShowUp = !localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER');

    if (process.env.NODE_ENV !== 'production') {
      console.log('web3ModalWillShowUp: ', web3ModalWillShowUp);
    }

    const web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
      theme: state.user.theme,
    });

    const web3provider = await web3Modal
      .connect()
      .then((web3provider) => web3provider)
      .catch((error) => {
        captureException(error, { extra: { firstRun } });
        console.log('Could not get a wallet connection', error);
        return null;
      });

    if (!web3provider) {
      dispatch(onLogout());
      return;
    }

    try {
      dispatch(connectingWallet({ connecting: true }));
      const provider = new ethers.providers.Web3Provider(web3provider);

      const cid = await web3provider.request({
        method: 'net_version',
      });

      const correctChain = cid === config.chain.id || cid === Number(config.chain.id);

      const accounts = await web3provider.request({
        method: 'eth_accounts',
        params: [{ chainId: cid }],
      });

      const address = accounts[0];
      const signer = provider.getSigner();

      if (isUserBlacklisted(address)) {
        const error = { err: 'Unable to connect' };
        throw error;
      }

      if (!correctChain) {
        if (firstRun) {
          dispatch(appAuthInitFinished());
        }
        await dispatch(setShowWrongChainModal(true));
      }

      //console.log(correctChain);
      await dispatch(
        onBasicAccountData({
          address: address,
          provider: provider,
          web3modal: web3Modal,
          needsOnboard: false,
          correctChain: correctChain,
        })
      );
      if (firstRun) {
        dispatch(appAuthInitFinished());
      }
      web3provider.on('DeFiConnectorDeactivate', (error: any) => {
        dispatch(onLogout());
      });

      web3provider.on('disconnect', (error: any) => {
        dispatch(onLogout());
      });

      web3provider.on('accountsChanged', (accounts: any) => {
        dispatch(onLogout());
        dispatch(connectAccount());
      });

      web3provider.on('DeFiConnectorUpdate', (accounts: any) => {
        window.location.reload();
      });

      // web3provider.on('chainChanged', (chainId: any) => {
      //   // Handle the new chain.
      //   // Correctly handling chain changes can be complicated.
      //   // We recommend reloading the page unless you have good reason not to.
      //
      //   window.location.reload();
      // });

      let balance;
      let sales;
      let stakingRewards: number | string = 0;
      let isMember = false;
      let fee = 3;
      let usesEscrow = false;

      dispatch(retrieveProfile());

      if (signer && correctChain) {
        const contractService = new UserContractService(signer);
        dispatch(onContractServiceInitialized(contractService));
        sales = ethers.utils.formatEther(await contractService.market.payments(address));
        stakingRewards = ethers.utils.formatEther(await contractService.staking.getReward(address));
        isMember = await contractService.market.isMember(address);
        usesEscrow = await contractService.market.useEscrow(address);

        try {
          balance = ethers.utils.formatEther(await provider.getBalance(address));

          fee = await contractService.market.fee(address);
          fee = (fee / 10000) * 100;
        } catch (error) {
          console.log('Error checking CRO balance', error);
        }
      }
      await dispatch(
        accountChanged({
          address: address,
          provider: provider,
          web3modal: web3Modal,
          needsOnboard: false,
          correctChain: correctChain,
          balance: balance,
          isMember,
          marketBalance: sales,
          stakingRewards: stakingRewards,
          fee,
          usesEscrow
        })
      );

      dispatch(updateFortuneBalance());
      dispatch(updateMitamaBalance());

    } catch (error) {
      captureException(error, {
        extra: {
          firstRun,
          WEB3_CONNECT_CACHED_PROVIDER: localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER'),
          DeFiLink_session_storage_extension: localStorage.getItem('DeFiLink_session_storage_extension'),
        },
      });
      if (firstRun) {
        dispatch(appAuthInitFinished());
      }
      console.log(error);
      console.log('Error connecting wallet!');
      await web3Modal.clearCachedProvider();
      dispatch(onLogout());
    }
    dispatch(connectingWallet({ connecting: false }));
  };

export const initProvider = () => async (dispatch: any) => {
  const ethereum = await detectEthereumProvider();

  if (ethereum == null || ethereum !== window.ethereum) {
    console.log('not metamask detected');
  } else {
    const provider = new ethers.providers.Web3Provider(ethereum);
    // const signer = provider.getSigner();
    // const cid = await ethereum.request({
    //   method: 'net_version',
    // });

    // const correctChain = cid === config.chain_id;

    // let mc;
    // if (signer && correctChain) {
    //   mc = new Contract(config.membership_contract, Membership.abi, signer);
    // }
    // const obj = {
    //   provider: provider,
    //   needsOnboard: false,
    //   membershipContract: mc,
    //   correctChain: correctChain,
    // };

    provider.on('accountsChanged', (accounts) => {
      dispatch(
        accountChanged({
          address: accounts[0],
        })
      );
    });

    provider.on('chainChanged', (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.

      window.location.reload();
    });
  }
};

export const chainConnect = () => async (dispatch: any) => {
  if (window.ethereum) {
    const cid = ethers.utils.hexValue(BigNumber.from(config.chain.id));
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: cid }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: config.chain.name,
                chainId: cid,
                rpcUrls: [config.rpc.write],
                blockExplorerUrls: null,
                nativeCurrency: {
                  name: config.chain.symbol,
                  symbol: config.chain.symbol,
                  decimals: 18,
                },
              },
            ],
          });
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: cid }],
          });
        } catch (addError) {
          console.error(addError);
          window.location.reload();
        }
      }
      console.log(error);
    }
  } else {
    new WalletConnectProvider({
      rpc: {
        25: 'https://evm.cronos.org',
      },
      chainId: 25,
    });
  }
};

export const setTheme = (theme: string) => async (dispatch: any) => {
  setThemeInStorage(theme);
  dispatch(onThemeChanged(theme));
};

export const updateBalance = () => async (dispatch: any, getState: any) => {
  const { user } = getState();
  const { address, provider } = user;
  const balance = ethers.utils.formatEther(await provider.getBalance(address));
  dispatch(userSlice.actions.balanceUpdated(balance));
};

export const updateFortunePresaleBalance = () => async (dispatch: any, getState: any) => {
  const { user } = getState();
  const { address, provider } = user;

  const usdcContract = new Contract(config.contracts.usdc, ERC20, provider.getSigner());
  const usdcBalance = await usdcContract.balanceOf(address);

  const fortuneContract = new Contract(config.contracts.purchaseFortune, FortunePresale, provider.getSigner());
  const fortuneBalance = await fortuneContract.purchases(address);

  dispatch(setTokenPresaleStats({
    usdc: usdcBalance.div(1000000).toNumber(),
    fortune: Number(fortuneBalance),
  }));
};


export const updateFortuneBalance = () => async (dispatch: any, getState: any) => {
  const { user } = getState();
  const { provider } = user;

  const fortuneContract = new Contract(config.contracts.fortune, Fortune, provider.getSigner());
  const fortuneBalance = await fortuneContract.balanceOf(user.address?.toLowerCase());

  dispatch(setFortuneBalance(Number(ethers.utils.formatEther(fortuneBalance))));
};

export const updateMitamaBalance = () => async (dispatch: any, getState: any) => {
  const { user } = getState();
  const { provider } = user;

  const bankContract = new Contract(config.contracts.bank, Bank, provider.getSigner());
  const mitamaBalance = await bankContract.getMitamaFor(user.address?.toLowerCase());

  dispatch(setMitamaBalance(Number(mitamaBalance)));
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
