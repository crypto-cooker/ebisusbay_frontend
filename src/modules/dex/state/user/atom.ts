import { atomWithStorage } from 'jotai/utils';

interface SerializedToken {
  symbol: string;
  decimals: number;
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
  userMultihop: boolean;
  userSlippageTolerance: number;
  userDeadline: number;
  tokens: { [chainId: number]: { [address: string]: SerializedToken } };
  pairs: { [chainId: number]: { [key: string]: SerializedPair } };
  timestamp: number;
  URLWarningVisible: boolean;
}

// Default values for the entire state
const defaultUserState: UserState = {
  userExpertMode: false,
  userMultihop: false,
  userSlippageTolerance: 50,
  userDeadline: 20,
  tokens: {},
  pairs: {},
  timestamp: Date.now(),
  URLWarningVisible: false
};

export const dexUserStateAtom = atomWithStorage<UserState>('eb.dex.user', defaultUserState);

