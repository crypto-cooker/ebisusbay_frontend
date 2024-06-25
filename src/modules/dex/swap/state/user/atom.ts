import { atomWithStorage } from 'jotai/utils';
import {SlippageTolerance} from "@dex/swap/state/user/types";
import {RouterPreference} from "@dex/imported/state/routing/types";

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}

interface SerializedPair {
  token0: SerializedToken;
  token1: SerializedToken;
  reserve0: number;
  reserve1: number;
}

interface UserState {
  lastUpdateVersionTimestamp?: number;
  userExpertMode: boolean;
  userSingleHopOnly: boolean;
  userSlippageTolerance: SlippageTolerance.Auto | number;
  userDeadline: number;
  tokens: { [chainId: number]: { [address: string]: SerializedToken } };
  pairs: { [chainId: number]: { [key: string]: SerializedPair } };
  timestamp: number;
  URLWarningVisible: boolean;
  routerPreference: RouterPreference;
}

// Default values for the entire state
const defaultUserState: UserState = {
  userExpertMode: false,
  userSingleHopOnly: false,
  userSlippageTolerance: 50,
  userDeadline: 20,
  tokens: {},
  pairs: {},
  timestamp: Date.now(),
  URLWarningVisible: false,
  routerPreference: RouterPreference.API
};

export const dexUserStateAtom = atomWithStorage<UserState>('eb.dex.user', defaultUserState);

