import { useCallback } from 'react'
import { Currency } from '@pancakeswap/sdk'
import {useSetAtom, WritableAtom} from 'jotai'
import {swapReducerAtom, SwapState} from './reducer'
import { Field, selectCurrency, switchCurrencies, typeInput, setRecipient } from './actions'
import { AnyAction } from '@reduxjs/toolkit'

type SwapActions =
  | ReturnType<typeof selectCurrency>
  | ReturnType<typeof switchCurrencies>
  | ReturnType<typeof typeInput>
  | ReturnType<typeof setRecipient>

type SwapReducerAtomType = WritableAtom<SwapState, [SwapActions], void>;

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
  dispatch: (action: SwapActions) => void;
} {
  const dispatch = useSetAtom(swapReducerAtom as SwapReducerAtomType);

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCurrencySelection = useCallback((field: Field, currency: Currency) => {
    dispatch(
      selectCurrency({
        field,
        currencyId: currency?.isToken ? currency.address : currency?.isNative ? currency.symbol : '',
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onUserInput = useCallback((field: Field, typedValue: string) => {
    dispatch(typeInput({ field, typedValue }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChangeRecipient = useCallback((recipient: string | null) => {
    dispatch(setRecipient({ recipient }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
    dispatch
  }
}
