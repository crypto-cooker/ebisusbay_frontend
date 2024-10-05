import { createAction } from '@reduxjs/toolkit'
import { createTable } from '@tanstack/react-table';

export enum Field {
    FROM = 'INPUT',
    TO = 'OUTPUT',
}

export const selectChain = createAction<{ field: Field; chainId: number }>('brideg/selectChain')
export const switchChain = createAction<void>('bridge/switchChain');
export const selectCurrency = createAction<{ currencyId: number }>("bridge/selectCurrency")
export const replaceBridgeState = createAction<{
    field: Field
    typedValue: string
    currencyId?: string
    recipient: string | null
}>('bridge/replaceBridgeState')
export const setRecipient = createAction<{ recipient: string | null }>('bridge/setRecipient')
export const typeInput = createAction<{typedValue: string }>('bridge/typeInput')
