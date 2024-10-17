import { createAction } from '@reduxjs/toolkit';
import { createTable } from '@tanstack/react-table';

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectChain = createAction<{ field: Field; chainId: number }>('brideg/selectChain');
export const switchChain = createAction<void>('bridge/switchChain');
export const selectCurrency = createAction<{ currencyId: string }>('bridge/selectCurrency');
export const replaceBridgeState = createAction<{
  typedValue?: string;
  fromChainId?: number;
  toChainId?: number;
  currencyId?: string;
  recipient: string | null;
}>('bridge/replaceBridgeState');
export const setRecipient = createAction<{ recipient: string }>('bridge/setRecipient');
export const typeInput = createAction<{ typedValue: string }>('bridge/typeInput');
export const changeOutput = createAction<{ outputValue: string }>('bridge/changeOutput');
