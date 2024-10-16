import { createReducer } from '@reduxjs/toolkit';
import { atomWithReducer } from 'jotai/utils';
import {
  Field,
  selectChain,
  switchChain,
  selectCurrency,
  setRecipient,
  typeInput,
  changeOutput,
  replaceBridgeState,
} from './actions';
import { toast } from 'react-toastify';

export interface BridgeState {
  readonly currencyId: string | undefined;
  readonly typedValue: string | undefined;
  readonly outputValue?: string;
  readonly [Field.INPUT]: {
    readonly chainId: number | undefined;
  };
  readonly [Field.OUTPUT]: {
    readonly chainId: number | undefined;
  };
  readonly recipient: string | null;
}

const initialState: BridgeState = {
  currencyId: '',
  typedValue: '',
  outputValue: '',
  [Field.INPUT]: {
    chainId: undefined,
  },
  [Field.OUTPUT]: {
    chainId: undefined,
  },
  recipient: '',
};

const reducer = createReducer<BridgeState>(initialState, (builder) =>
  builder
    .addCase(selectChain, (state, { payload: { field, chainId } }) => {
      if (field === Field.INPUT && chainId === state[Field.OUTPUT].chainId) {
        return {
          ...state,
          [field]: { chainId },
          [Field.OUTPUT]: { chainId: state[Field.INPUT].chainId },
        };
      } else if (field === Field.OUTPUT && chainId === state[Field.INPUT].chainId) {
        toast.error('Select other chain');
        return state;
      }
      return {
        ...state,
        [field]: { chainId },
      };
    })
    .addCase(switchChain, (state) => {
      return {
        ...state,
        [Field.INPUT]: { chainId: state[Field.OUTPUT].chainId },
        [Field.OUTPUT]: { chainId: state[Field.INPUT].chainId },
      };
    })
    .addCase(selectCurrency, (state, { payload: { currencyId } }) => {
      return {
        ...state,
        currencyId,
      };
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      return {
        ...state,
        recipient,
      };
    })
    .addCase(typeInput, (state, { payload: { typedValue } }) => {
      return {
        ...state,
        typedValue,
      };
    })
    .addCase(changeOutput, (state, { payload: { outputValue } }) => {
      return {
        ...state,
        outputValue,
      };
    })
    .addCase(
      replaceBridgeState,
      (state, { payload: { currencyId, typedValue, fromChainId, toChainId, recipient } }) => {
        return {
          ...state,
          currencyId,
          typedValue,
          [Field.INPUT]: { chainId: fromChainId },
          [Field.OUTPUT]: { chainId: toChainId },
          recipient,
        };
      },
    ),
);

export const bridgeReducerAtom = atomWithReducer(initialState, reducer);
