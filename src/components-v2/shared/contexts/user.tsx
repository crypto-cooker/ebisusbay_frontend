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

const config = appConfig();


interface UserContextType {
  user: JotaiUser;
  disconnect: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, dispatch] = useAtom(userAtom);
  const { address, isConnecting, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect: disconnectWallet } = useDisconnect();
  const croBalance = useBalance({ address: address });
  const frtnBalance = useBalance({ address: address, token: config.tokens.frtn.address });

  const { data: profile } = useQuery({
    queryKey: ['UserProfile', address],
    queryFn: () => getProfile(address),
    enabled: !!address,
  });

  const initialize = async () => {
    if (!address) return;
    try {
      dispatch({ type: UserActionType.SET_INITIALIZING, payload: { initializing: true, initialized: false } });
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
      dispatch({ type: UserActionType.SET_INITIALIZING, payload: { initializing: false, initialized: true } });
    }
  };

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
  }, [address, isConnected, isConnected, chain]);

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

  return <UserContext.Provider value={{ user, disconnect }}>{children}</UserContext.Provider>;
};