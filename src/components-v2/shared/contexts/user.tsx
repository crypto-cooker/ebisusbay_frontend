import {useAccount, useBalance, useDisconnect, useNetwork} from "wagmi";
import {createContext, ReactNode, useEffect} from "react";
import {appConfig} from "@src/Config";
import {getProfile} from "@src/core/cms/endpoints/profile";
import {useQuery} from "@tanstack/react-query";
import {multicall} from "@wagmi/core";
import {portABI, stakeABI} from "@src/Contracts/types";
import {ethers} from "ethers";
import {JotaiUser, UserActionType, userAtom} from "@src/jotai/atoms/user";
import {useAtom} from "jotai";
import {RESET} from "jotai/utils";
import {isUserBlacklisted} from "@src/utils";
import {setThemeInStorage} from "@src/helpers/storage";
import {useColorMode} from "@chakra-ui/react";
import {useWeb3ModalTheme} from "@web3modal/scaffold-react";
import {storageSignerAtom} from "@src/jotai/atoms/storage";
import * as Sentry from "@sentry/react";
import axios from "axios";

const config = appConfig();


interface UserContextType {
  user: JotaiUser;
  disconnect: () => void;
  toggleTheme: (theme: string) => void;
  onEscrowClaimed: () => void;
  onEscrowToggled: () => void;
  onStakingHarvested: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, dispatch] = useAtom(userAtom);
  const [_, setSigner] = useAtom(storageSignerAtom);

  // isConnected - true when explicitly connecting to wallet from dialog
  // isReconnecting - true when wallet is auto connecting after page refresh
  const {address, isConnecting, isConnected, isReconnecting, status,connector} = useAccount({
    onDisconnect() {
      clearUser();
    }
  });

  const { chain } = useNetwork();
  const { disconnect: disconnectWallet } = useDisconnect();
  const croBalance = useBalance({ address: address });
  const frtnBalance = useBalance({ address: address, token: config.tokens.frtn.address });
  const { setColorMode } = useColorMode();
  const { setThemeMode } = useWeb3ModalTheme();

  const { data: profile } = useQuery({
    queryKey: ['UserProfile', address],
    queryFn: () => getProfile(address),
    enabled: !!address,
  });

  const initialize = async () => {
    if (!address) return;
    try {
      dispatch({ type: UserActionType.SET_INITIALIZING, payload: { initializing: true, initialized: false } });

      if (isUserBlacklisted(address)) {
        disconnect();
        throw {err: 'Unable to connect'};
      }

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
          fee: data[3].result ? (Number(data[3].result) / 10000) * 100 : 3,
          isMember: data[0].result ?? false
        },
      });

      // const inscriptionBalance = await axios.get('api/inscriptions/balance', { params: { address}});
      // dispatch({type: UserActionType.SET_INSCRIPTION_BALANCES, payload: {inscriptions: [
      //   {id: 1, tick: 'cros', amount: inscriptionBalance.data},
      // ]}});
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ type: UserActionType.SET_INITIALIZING, payload: { initializing: false, initialized: true } });
    }
  };

  const disconnect = () => {
    disconnectWallet();
  }

  const clearUser = () => {
    localStorage.clear();
    setSigner(RESET);
    dispatch({ type: UserActionType.RESET_USER, payload: {} });
  }

  const toggleTheme = (theme: string) => {
    if (theme === 'light' || theme === 'dark') {
      setThemeMode(theme);
      setThemeInStorage(theme);
      setColorMode(theme);
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
      dispatch({ type: UserActionType.TOGGLE_THEME, payload: { theme } });
    }
  }

  const onEscrowClaimed = () => {
    dispatch({ type: UserActionType.SET_ESCROW, payload: {
      escrow: {
        enabled: true,
        balance: 0,
      }
    }});
  }

  const onEscrowToggled = () => {
    dispatch({ type: UserActionType.SET_ESCROW, payload: {
      escrow: {
        enabled: !user.escrow.enabled,
        balance: user.escrow.balance,
      }
    }});
  }

  const onStakingHarvested = () => {
    dispatch({ type: UserActionType.STAKING_HARVESTED, payload: {} });
  }

  // Set Wallet
  useEffect(() => {
    connector?.getProvider().then((p) => {
      let wallet = 'Unknown';
      if (p.isDeficonnectProvider) wallet = 'DeFi Wallet'; // isMetaMask also true, so make sure this is before
      else if (p.isMetaMask) wallet = 'MetaMask';
      else if (p.isBraveWallet) wallet = 'Brave';
      Sentry.setTag('wallet', wallet);
    });

    // Wallet states:
    // connected but locked = !!address, !connector, !!isReconnecting, !!chain
    // connected and ready = !!address, !!isConnected, !!connector, !!chain, status == connected
    // connected wrong chain = !!address, !!isConnected, !!connector, !!chain, status == connected, chain.id != config.chain.id
    // clean disconnect = !address, !isConnected, !connector, !chain, status == disconnected
    // switch address = status == reconnecting?

    dispatch({
      type: UserActionType.SET_WALLET,
      payload: {
        wallet: {
          address,
          isConnecting: isConnecting || isReconnecting,
          isConnected: isConnected && !!connector,
          correctChain: isConnected && !!chain && chain.id === parseInt(config.chain.id)
        }
      }
    });
  }, [address, isConnected, isConnecting, isReconnecting, chain?.id, status]);

  // Initialize if freshly connected or wallet switched
  useEffect(() => {
    const hasSwitchedUser = address !== user.wallet.address;
    if (isConnected && (!user.initializing && !user.initialized || hasSwitchedUser)) {
      initialize();
    }
  }, [address, isConnected, user.initializing, user.initialized]);

  // Set Profile
  useEffect(() => {
    const _profile = profile?.data;

    if (_profile) {
      Sentry.setUser({
        id: address,
        email: _profile.email,
        username: _profile.username,
        ip_address: '{{auto}}'
      });
    } else {
      Sentry.setUser(null);
    }

    dispatch({
      type: UserActionType.SET_PROFILE,
      payload: { profile: _profile ?? {} }
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

  return (
    <UserContext.Provider
      value={{
        user,
        disconnect,
        toggleTheme,
        onEscrowClaimed,
        onEscrowToggled,
        onStakingHarvested
      }}
    >
      {children}
    </UserContext.Provider>
  );
};