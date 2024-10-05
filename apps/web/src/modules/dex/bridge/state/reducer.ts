import { createReducer } from '@reduxjs/toolkit'
import { atomWithReducer } from 'jotai/utils'
import { Field, selectChain, switchChain, selectCurrency, setRecipient, typeInput, replaceBridgeState } from './actions'

export interface BridgeState {
    readonly currencyId: number | null
    readonly typedValue: string
    readonly [Field.FROM]: {
        readonly chainId: number | null
    }
    readonly [Field.TO]: {
        readonly chainId: number | null
    }
    readonly recipient: string | null
}

const initialState: BridgeState = {
    currencyId: null,
    typedValue: '',
    [Field.FROM]: {
        chainId: null
    },
    [Field.TO]: {
        chainId: null
    },
    recipient: null
}

const reducer = createReducer<BridgeState>(initialState, (builder) =>
    builder
        .addCase(
            selectChain,
            (state, { payload: { field, chainId } }) => {
                return {
                    ...state,
                    [field]: { chainId }
                }
            }
        ).addCase(
            switchChain,
            (state) => {
                return {
                    ...state,
                    [Field.FROM]: { chainId: state[Field.TO].chainId },
                    [Field.TO]: { chainId: state[Field.FROM].chainId }
                }
            }
        ).addCase(
            selectCurrency,
            (state, { payload: { currencyId } }) => {
                return {
                    ...state,
                    currencyId
                }
            }
        ).addCase(
            setRecipient,
            (state, { payload: { recipient } }) => {
                return {
                    ...state,
                    recipient
                }
            }
        ).addCase(
            typeInput,
            (state, { payload: { typedValue } }) => {
                return {
                    ...state,
                    typedValue
                }
            }
        )
)

export const bridgeReducerAtom = atomWithReducer(initialState, reducer);