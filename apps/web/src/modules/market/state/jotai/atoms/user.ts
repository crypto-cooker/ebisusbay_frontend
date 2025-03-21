import {atomWithReducer} from "jotai/utils";

export interface JotaiUser {
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
  inscriptions: UserInscription[];
  fee: number;
  initializing: boolean;
  initialized: boolean;
  isMember: boolean;
}

interface UserInscription {
  id: number;
  tick: string;
  amount: number;
}

export enum UserActionType {
  SET_WALLET,
  SET_PROFILE,
  SET_TOKEN_BALANCES,
  SET_CONTRACT_BALANCES,
  SET_INSCRIPTION_BALANCES,
  SET_INITIALIZING,
  SET_ESCROW,
  STAKING_HARVESTED,
  RESET_USER
}

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

type UserAction = {
  type: UserActionType;
  payload: RecursivePartial<JotaiUser>;
};

function userReducer(state: JotaiUser, action: UserAction): JotaiUser {
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
        fee: action.payload.fee ?? initialUserState.fee,
        isMember: action.payload.isMember ?? initialUserState.isMember
      };
    case UserActionType.SET_INSCRIPTION_BALANCES:
      return { ...state, inscriptions: action.payload.inscriptions as UserInscription[] };
    case UserActionType.SET_INITIALIZING:
      return { ...state, initializing: !!action.payload.initializing, initialized: !!action.payload.initialized };
    case UserActionType.SET_ESCROW:
      return { ...state, escrow: { ...state.escrow, ...action.payload.escrow }};
    case UserActionType.STAKING_HARVESTED:
      return { ...state, balances: { ...state.balances, staking: 0 }};
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
const initialUserState: JotaiUser = {
  wallet: {
    address: undefined,
    isConnecting: false,
    isConnected: false,
    correctChain: false,
  },
  profile: {},
  balances: {
    cro: 0,
    frtn: 0,
    staking: 0
  },
  escrow: {
    enabled: false,
    balance: 0
  },
  inscriptions: [],
  fee: 3,
  initializing: false,
  initialized: false,
  isMember: false
};

export const userAtom = atomWithReducer<JotaiUser, UserAction>(initialUserState, userReducer);