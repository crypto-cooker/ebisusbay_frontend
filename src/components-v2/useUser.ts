import {useAccount, useBalance, useDisconnect, useNetwork} from "wagmi";
import {useEffect, useState} from "react";
import {appConfig} from "@src/Config";
import {getProfile} from "@src/core/cms/endpoints/profile";
import {useQuery} from "@tanstack/react-query";
import {multicall} from "@wagmi/core";
import {portABI, stakeABI} from "@src/Contracts/types";
import {ethers} from "ethers";
import {useWeb3ModalProvider} from "@web3modal/ethers5/react";
import {getThemeInStorage} from "@src/helpers/storage";
import UserContractService from "@src/core/contractService";
import {UserActionType, userAtom} from "@src/jotai/atoms/user";
import {useAtom} from "jotai";

const config = appConfig();

export const useUser = () => {
  const [user, dispatch] = useAtom(userAtom);
  const { address, isConnecting, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const { disconnect: disconnectWallet } = useDisconnect();
  const croBalance = useBalance({
    address: address,
  });
  const frtnBalance = useBalance({
    address: address,
    token: config.tokens.frtn.address
  });

  const {data: profile} = useQuery({
    queryKey: ['UserProfile', address],
    queryFn: () => getProfile(address),
    enabled: !!address,
  });

  const initialize = async () => {
    if (!address) return;
    try {
      dispatch({ type: UserActionType.SET_INITIALIZING, payload: { initializing: true } });
      const data = await multicall({
        contracts: [
          {
            address: config.contracts.market,
            abi: portABI,
            functionName: 'isMember',
            args: [address],
          },
          {
            address: config.contracts.market,
            abi: portABI,
            functionName: 'useEscrow',
            args: [address],
          },
          {
            address: config.contracts.market,
            abi: portABI,
            functionName: 'payments',
            args: [address],
          },
          {
            address: config.contracts.market,
            abi: portABI,
            functionName: 'fee',
            args: [address],
          },
          {
            address: config.contracts.stake,
            abi: stakeABI,
            functionName: 'getReward',
            args: [address],
          },
        ],
      });

      dispatch({
        type: UserActionType.SET_CONTRACT_BALANCES,
        payload: {
          escrow: {
            enabled: data[1].result ?? false,
            balance: parseInt(ethers.utils.formatEther(data[2].result ?? 0)),
          },
          balances: {
            staking: parseInt(ethers.utils.formatEther(data[4].result ?? 0)),
          },
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ type: UserActionType.SET_INITIALIZING, payload: { initializing: false } });
    }
  }

  const disconnect = () => {
    disconnectWallet();
    localStorage.clear();
    dispatch({ type: UserActionType.RESET_USER, payload: {} });
    // TODO: reset all other state from User.ts
  }

  // Set Wallet
  useEffect(() => {
    dispatch({
      type: UserActionType.SET_WALLET,
      payload: {
        wallet: {
          address,
          isConnecting,
          isConnected,
          correctChain: isConnected && !!chain && chain.id === parseInt(config.chain.id)
        }
      }
    });

    if (isConnected) {
      initialize();
    }
  }, [address, isConnected, isConnected, chain]);

  // Set Profile
  useEffect(() => {
    dispatch({
      type: UserActionType.SET_PROFILE,
      payload: { profile: profile?.data ?? {} }
    });
  }, [profile]);

  // Set Token Balances
  useEffect(() => {
    dispatch({
      type: UserActionType.SET_TOKEN_BALANCES,
      payload: {
        balances: {
          cro: croBalance.data?.formatted ?? 0,
          frtn: frtnBalance.data?.formatted ?? 0,
        }
      }
    });
  }, [croBalance.data, frtnBalance.data]);

  return {
    ...user,

    // Non-atom values
    disconnect,

    // Legacy
    address: user.wallet.address,
    provider: useLegacyProviderFunctions(),
    theme: getThemeInStorage() ?? 'dark'
  };
}

const useLegacyProviderFunctions = () => {
  const { walletProvider } = useWeb3ModalProvider();

  const getSigner = () => {
    console.log('getSigner?', walletProvider)
    if (!walletProvider) return;

    return new ethers.providers.Web3Provider(walletProvider)
  }

  return {
    getSigner
  }
}

export const useContractService = () => {
  const user = useUser();
  const { walletProvider } = useWeb3ModalProvider()
  const [contractService, setContractService] = useState<UserContractService | null>(null);

  useEffect(() => {
    async function initSigner() {
      if (!walletProvider) {
        setContractService(null);
        return;
      }

      const ethersProvider = new ethers.providers.Web3Provider(walletProvider)
      const signer = await ethersProvider.getSigner()
      setContractService(new UserContractService(signer));
    }

    console.log('NULL CHECK?', user.wallet.isConnected, walletProvider)
    if (user.wallet.isConnected) {
      initSigner();
    } else {
      setContractService(null);
    }
  }, [user.wallet.address, user.wallet.isConnected, walletProvider]);

  return contractService;
}
