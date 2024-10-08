import { createReducer } from '@reduxjs/toolkit'
import { atomWithReducer } from 'jotai/utils'
import { Field, selectChain, switchChain, selectCurrency, setRecipient, typeInput, replaceBridgeState } from './actions'

export interface BridgeState {
    readonly currencyId: string | undefined
    readonly typedValue: string
    readonly [Field.INPUT]: {
        readonly chainId: number | null
    }
    readonly [Field.OUTPUT]: {
        readonly chainId: number | null
    }
    readonly recipient: string | null
}

const initialState: BridgeState = {
    currencyId: '',
    typedValue: '',
    [Field.INPUT]: {
        chainId: null
    },
    [Field.OUTPUT]: {
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
                    [Field.INPUT]: { chainId: state[Field.OUTPUT].chainId },
                    [Field.OUTPUT]: { chainId: state[Field.INPUT].chainId }
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