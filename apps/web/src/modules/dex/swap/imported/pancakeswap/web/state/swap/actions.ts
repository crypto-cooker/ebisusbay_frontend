import { createAction } from '@reduxjs/toolkit'
import { DerivedPairDataNormalized, PairDataNormalized } from './types'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

enum PairDataTimeWindowEnum {
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('swap/selectCurrency')
export const switchCurrencies = createAction<void>('swap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}>('swap/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null }>('swap/setRecipient')
export const updatePairData = createAction<{
  pairData: PairDataNormalized
  pairId: string
  timeWindow: PairDataTimeWindowEnum
}>('swap/updatePairData')
export const updateDerivedPairData = createAction<{
  pairData: DerivedPairDataNormalized
  pairId: string
  timeWindow: PairDataTimeWindowEnum
}>('swap/updateDerivedPairData')
