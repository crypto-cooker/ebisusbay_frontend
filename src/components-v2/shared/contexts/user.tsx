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
  const { address, isConnecting, isConnected, status, connector } = useAccount();
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
          fee: data[4].result ? (Number(data[4].result) / 10000) * 100 : 3,
          isMember: data[0].result ?? false
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ type: UserActionType.SET_INITIALIZING, payload: { initializing: false, initialized: true } });
    }
  };

  const disconnect = () => {
    disconnectWallet();
    localStorage.clear();
    setSigner(RESET);
    dispatch({ type: UserActionType.RESET_USER, payload: {} });
    // TODO: reset all other state from User.ts
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
    Sentry.captureMessage("DEBUG: WALLET STATE", {
      extra: {
        customData: {
          address,
          isConnecting,
          isConnected,
          chain: chain?.id,
          configChain: parseInt(config.chain.id),
          correctChain: isConnected && !!chain && chain.id === parseInt(config.chain.id),
          status,
          connector,
        }
      }
    });

    console.log('debug --- wallet state', address, isConnecting, isConnected, chain?.id, parseInt(config.chain.id), isConnected && !!chain && chain.id === parseInt(config.chain.id), status, connector)
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
  }, [address, isConnected, isConnecting, chain?.id]);

  // Initialize if freshly connected or wallet switched
  useEffect(() => {
    const hasSwitchedUser = address !== user.wallet.address;
    if (isConnected && (!user.initializing && !user.initialized || hasSwitchedUser)) {
      initialize();
    }
  }, [address, isConnected, user.initializing, user.initialized]);

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