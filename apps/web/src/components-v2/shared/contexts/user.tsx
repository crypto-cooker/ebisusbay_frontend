import {useAccount, useAccountEffect, useBalance, useDisconnect} from "wagmi";
import {createContext, ReactNode, useEffect} from "react";
import {appConfig} from "@src/config";
import {getProfile} from "@src/core/cms/endpoints/profile";
import {useQuery} from "@tanstack/react-query";
import {portAbi} from "@src/global/contracts/types";
import {ethers} from "ethers";
import {JotaiUser, UserActionType, userAtom} from "@market/state/jotai/atoms/user";
import {useAtom} from "jotai";
import {RESET} from "jotai/utils";
import {isUserBlacklisted} from "@market/helpers/utils";
import {useColorMode} from "@chakra-ui/react";
import { useAppKitTheme } from '@reown/appkit/react'
import {storageSignerAtom} from "@market/state/jotai/atoms/storage";
import * as Sentry from "@sentry/react";
import {themeAtom} from "@market/state/jotai/atoms/theme";
import {wagmiConfig} from "@src/wagmi";
import { readContracts } from '@wagmi/core'

const config = appConfig();


interface UserContextType {
  user: JotaiUser;
  theme: string;
  disconnect: () => void;
  toggleTheme: (theme: string) => void;
  onEscrowClaimed: () => void;
  onEscrowToggled: () => void;
  onStakingHarvested: () => void;
  requestTelemetry: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, dispatch] = useAtom(userAtom);
  const [_, setSigner] = useAtom(storageSignerAtom);
  const [theme, setTheme] = useAtom(themeAtom);

  // isConnected - true when explicitly connecting to wallet from dialog
  // isReconnecting - true when wallet is auto connecting after page refresh
  const {address, isConnecting, isConnected, isReconnecting, status,connector, chain} = useAccount();

  useAccountEffect({
    onDisconnect() {
      // Sentry.captureMessage('disconnected captured from useAccountEffect')
      clearUser();
    }
  })

  // const listenToAccount = watchAccount(wagmiConfig as any, {
  //   onChange(data) {
  //     console.log('Account changed!', data)
  //     Sentry.captureEvent({ message: 'Account changed!', extra: data});
  //   },
  // });
  //
  // const listenToChainId = watchChainId(wagmiConfig as any, {
  //   onChange(chainId) {
  //     console.log('Chain ID changed!', chainId)
  //     Sentry.captureEvent({ message: 'Chain ID changed!', extra: chainId});
  //   },
  // })
  //
  // const listenToClient = watchClient(wagmiConfig as any, {
  //   onChange(client) {
  //     console.log('Client changed!', client)
  //     Sentry.captureEvent({ message: 'Client changed!', extra: client});
  //   },
  // })
  // const listenToConnections = watchConnections(wagmiConfig as any, {
  //   onChange(data) {
  //     console.log('Connections changed!', data)
  //     Sentry.captureEvent({ message: 'Connections changed!', extra: {data}});
  //   },
  // })
  // const listenToConnectors = watchConnectors(wagmiConfig as any, {
  //   onChange(connectors) {
  //     console.log('Connectors changed!', connectors)
  //     Sentry.captureEvent({ message: 'Connectors changed!', extra: { connectors }});
  //   },
  // })
  //
  // useEffect(() => {
  //   listenToAccount();
  //   listenToChainId();
  //   listenToClient();
  //   listenToConnections();
  //   listenToConnectors();
  // }, []);

  const { disconnectAsync: disconnectWallet } = useDisconnect();
  const croBalance = useBalance({ address: address });
  const frtnBalance = useBalance({ address: address, token: config.tokens.frtn.address });
  const { setColorMode: setChakraTheme } = useColorMode();
  const { setThemeMode: setWeb3ModalTheme } = useAppKitTheme();

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

      const data = await readContracts(wagmiConfig, {
        contracts: [
          {
            address: config.contracts.market,
            abi: portAbi,
            functionName: 'isMember',
            args: [address],
          },
          {
            address: config.contracts.market,
            abi: portAbi,
            functionName: 'useEscrow',
            args: [address],
          },
          {
            address: config.contracts.market,
            abi: portAbi,
            functionName: 'payments',
            args: [address],
          },
          {
            address: config.contracts.market,
            abi: portAbi,
            functionName: 'fee',
            args: [address],
          },
          {
            address: config.contracts.stake,
            abi: portAbi,
            functionName: 'getReward',
            args: [address],
          } as any // only way to fix error "Type instantiation is excessively deep and possibly infinite."
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
            staking: parseInt(ethers.utils.formatEther(data[4].result as any ?? 0)),
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

  const disconnect = async () => {
    // Sentry.captureMessage('Calling disconnect...');
    await disconnectWallet();
    // Sentry.captureMessage('Disconnect called. Clearing user...');
    clearUser();
    // Sentry.captureMessage('clearUser complete');
  }

  const clearUser = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('eb.') && !key.startsWith('eb.theme')) {
        localStorage.removeItem(key);
        i--;
      }
    }
    setSigner(RESET);
    dispatch({ type: UserActionType.RESET_USER, payload: {} });
  }

  const toggleTheme = (theme: string) => {
    if (theme === 'light' || theme === 'dark') {
      setWeb3ModalTheme(theme);
      setTheme(theme);
      setChakraTheme(theme);
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
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

  const requestTelemetry = () => {
    Sentry.captureEvent({ message: 'requestTelemetry--provider', extra: {
        user: user,
        address,
        isConnecting,
        isConnected,
        isReconnecting,
        status,
        connector,
        chain,
        configChain: config.chain.id
      } });
  }

  // Set Wallet
  useEffect(() => {
    // connector?.getProvider().then((p) => {
    //   let wallet = 'Unknown';
    //   if (p.isDeficonnectProvider) wallet = 'DeFi Wallet'; // isMetaMask also true, so make sure this is before
    //   else if (p.isMetaMask) wallet = 'MetaMask';
    //   else if (p.isBraveWallet) wallet = 'Brave';
    //   Sentry.setTag('wallet', wallet);
    // });

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
    if (hasSwitchedUser) {
      localStorage.removeItem('eb.auth-signature');
    }

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
        theme,
        disconnect,
        toggleTheme,
        onEscrowClaimed,
        onEscrowToggled,
        onStakingHarvested,
        requestTelemetry
      }}
    >
      {children}
    </UserContext.Provider>
  );
};