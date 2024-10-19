import { useCallback } from 'react';
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
import { useSetAtom, WritableAtom } from 'jotai';
import { bridgeReducerAtom, BridgeState } from './reducer';
import { Currency } from '@pancakeswap/sdk';
type BridgeActions =
  | ReturnType<typeof selectChain>
  | ReturnType<typeof switchChain>
  | ReturnType<typeof selectCurrency>
  | ReturnType<typeof setRecipient>
  | ReturnType<typeof typeInput>
  | ReturnType<typeof changeOutput>
  | ReturnType<typeof replaceBridgeState>;

type BridgeReducerAtomType = WritableAtom<BridgeState, [BridgeActions], void>;

export function useBridgeActionHandlers(): {
  onSelectChain: (field: Field, chainId: number) => void;
  onSwitchChain: () => void;
  onChangeRecipient: (recipient: string) => void;
  onTypeInput: (typedValue: string) => void;
  onChangeOutput: (outputValue: string) => void;
  onSelectCurrency: (currency: Currency) => void;
  dispatch: (action: BridgeActions) => void;
} {
  const dispatch = useSetAtom(bridgeReducerAtom as BridgeReducerAtomType);

  const onSelectChain = useCallback((field: Field, chainId: number) => {
    dispatch(selectChain({ field, chainId }));
  }, []);

  const onSwitchChain = useCallback(() => {
    dispatch(switchChain());
  }, []);

  const onChangeRecipient = useCallback((recipient: string) => {
    dispatch(setRecipient({ recipient }));
  }, []);

  const onTypeInput = useCallback((typedValue: string) => {
    dispatch(typeInput({ typedValue }));
  }, []);

  const onChangeOutput = useCallback((outputValue: string) => {
    dispatch(changeOutput({ outputValue }));
  }, []);

  const onSelectCurrency = useCallback((currency: Currency) => {
    const currencyId = currency?.isToken ? currency.address : currency?.isNative ? currency.symbol : '';
    dispatch(selectCurrency({ currencyId }));
  }, []);

  return {
    onSelectChain,
    onSelectCurrency,
    onSwitchChain,
    onChangeRecipient,
    onTypeInput,
    onChangeOutput,
    dispatch,
  };
}
