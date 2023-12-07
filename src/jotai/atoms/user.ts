import {atom} from "jotai";
import {atomWithReducer} from "jotai/utils";

interface User {
  wallet: {
    address?: string;
    isConnecting: boolean;
    isConnected: boolean;
    correctChain: boolean;
  },
  profile: any;
  balances: {
    cro: number | string;
    frtn: number | string;
    staking: number;
  },
  escrow: {
    enabled: boolean;
    balance: number;
  },
  initializing: boolean;
  // disconnect: () => void;
  // address?: string;
  // provider?: any;
  // theme: string;
}

export enum UserActionType {
  SET_WALLET,
  SET_PROFILE,
  SET_TOKEN_BALANCES,
  SET_CONTRACT_BALANCES,
  SET_INITIALIZING,
  // SET_THEME,
  // SET_PROVIDER,
  RESET_USER // For disconnecting
}

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

type UserAction = {
  type: UserActionType;
  payload: RecursivePartial<User>;
};

function userReducer(state: User, action: UserAction): User {
  switch (action.type) {
    case UserActionType.SET_WALLET:
      return { ...state, wallet: { ...state.wallet, ...action.payload.wallet } };
    case UserActionType.SET_PROFILE:
      return { ...state, profile: action.payload.profile };
    case UserActionType.SET_CONTRACT_BALANCES:
      return {
        ...state,
        escrow: { ...state.escrow, ...action.payload.escrow },
        balances: { ...state.balances, ...action.payload.balances },
      };
    case UserActionType.SET_INITIALIZING:
      return { ...state, initializing: !!action.payload.initializing };
    // Add cases for other actions
    case UserActionType.RESET_USER:
      return initialUserState;
    // For other actions, do a deep merge if necessary
    default:
      return deepMerge(state, action.payload);
  }
}

function deepMerge(target: any, source: any) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }

  // Merge `target` and overwritten `source`
  Object.assign(target || {}, source);
  return target;
}
const initialUserState: User = {
  wallet: {
    address: undefined,
    isConnecting: false,
    isConnected: false,
    correctChain: false,
  },
  profile: null,
  balances: {
    cro: 0,
    frtn: 0,
    staking: 0
  },
  escrow: {
    enabled: false,
    balance: 0
  },
  initializing: false,
  // disconnect: () => null,

  // Legacy
  // address: undefined,
  // provider: undefined,
  // theme: 'dark'
};

export const userAtom = atomWithReducer<User, UserAction>(initialUserState, userReducer);