import { useCallback } from 'react'
import { Field, selectChain, switchChain, selectCurrency, setRecipient, typeInput, replaceBridgeState } from './actions'
import { useSetAtom, WritableAtom } from 'jotai'
import { bridgeReducerAtom, BridgeState } from './reducer'
import { Currency } from '@pancakeswap/sdk'
type BridgeActions =
    | ReturnType<typeof selectChain>
    | ReturnType<typeof switchChain>
    | ReturnType<typeof selectCurrency>
    | ReturnType<typeof setRecipient>
    | ReturnType<typeof typeInput>
    | ReturnType<typeof replaceBridgeState>


type BridgeReducerAtomType = WritableAtom<BridgeState, [BridgeActions], void>

export function useBridgeActionHandlers(): {
    onSelectChain: (field: Field, chainId: number) => void
    onSwitchChain: () => void
    onChangeRecipient: (recipient: string | null) => void
    onTypeInput: (typedValue: string) => void
    onSelectCurrency: (currency: Currency) => void
    dispatch: (action: BridgeActions) => void
} {
    const dispatch = useSetAtom(bridgeReducerAtom as BridgeReducerAtomType);

    const onSelectChain = useCallback((field: Field, chainId: number) => {
        dispatch(selectChain({ field, chainId }));
    }, [])

    const onSwitchChain = useCallback(() => {
        dispatch(switchChain());
    }, [])

    const onChangeRecipient = useCallback((recipient: string | null) => {
        dispatch(setRecipient({ recipient }));
    }, [])

    const onTypeInput = useCallback((typedValue: string) => {
        dispatch(typeInput({ typedValue }))
    }, [])

    const onSelectCurrency = useCallback((currency: Currency) => {
        dispatch(selectCurrency({currencyId: currency?.isToken ? currency.address : currency?.isNative ? currency.symbol : ''}))
    },[])


    return {
        onSelectChain,
        onSelectCurrency,
        onSwitchChain,
        onChangeRecipient,
        onTypeInput,
        dispatch
    }
}