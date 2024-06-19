import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { ParsedQs } from 'qs'
import { ReactNode, useCallback, useContext, useMemo } from 'react'
import {
  CurrencyState,
  SerializedCurrencyState,
  SwapAndLimitContext,
  SwapContext,
  SwapInfo,
  SwapState,
  parseIndependentFieldURLParameter,
} from './types'
import {Field} from "@dex/constants";
import {useAccount} from "wagmi";
import {useSwapTaxes} from "@dex/imported/hooks/useSwapTaxes";
import {useCurrencyBalances} from "@dex/imported/hooks/useCurrencyBalance";
import useAutoSlippageTolerance from '@dex/imported/hooks/useAutoSlippageTolerance';
import { useDebouncedTrade } from '@dex/imported/hooks/useDebouncedTrade';
import {isAddress} from "@market/helpers/utils";
import {TOKEN_SHORTHANDS} from "@dex/imported/constants/tokens";
import {useUSDPrice} from "@dex/imported/hooks/useUSDPrice";
import tryParseCurrencyAmount from "@dex/imported/utils/tryParseCurrencyAmount";
import {isClassicTrade, isSubmittableTrade, isUniswapXTrade} from "@dex/imported/state/routing/utils";
import {useUserSlippageToleranceWithDefault} from "@dex/swap/state/user/hooks";
import {useUser} from "@src/components-v2/useUser";
import {useSwapPageState, useSwapPageStateRead} from "@dex/swap/state/swap/hooks";

export function useSwapContext() {
  return useContext(SwapContext)
}

export function useSwapAndLimitContext() {
  return useContext(SwapAndLimitContext)
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: (options: { newOutputHasTax: boolean; previouslyEstimatedOutput: string }) => void
  onUserInput: (field: Field, typedValue: string) => void
} {
  const { swapState, setSwapState } = useSwapContext()
  const { currencyState, setCurrencyState } = useSwapAndLimitContext()

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      const [currentCurrencyKey, otherCurrencyKey]: (keyof CurrencyState)[] =
        field === Field.INPUT ? ['inputCurrency', 'outputCurrency'] : ['outputCurrency', 'inputCurrency']
      const otherCurrency = currencyState[otherCurrencyKey]
      // the case where we have to swap the order
      if (otherCurrency && currency.equals(otherCurrency)) {
        setCurrencyState({
          [currentCurrencyKey]: currency,
          [otherCurrencyKey]: currencyState[currentCurrencyKey],
        })
        setSwapState((swapState) => ({
          ...swapState,
          independentField: swapState.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        }))
      } else {
        setCurrencyState((state) => ({
          ...state,
          [currentCurrencyKey]: currency,
        }))
      }
    },
    [currencyState, setCurrencyState, setSwapState]
  )

  const onSwitchTokens = useCallback(
    ({
      newOutputHasTax,
      previouslyEstimatedOutput,
    }: {
      newOutputHasTax: boolean
      previouslyEstimatedOutput: string
    }) => {
      // To prevent swaps with FOT tokens as exact-outputs, we leave it as an exact-in swap and use the previously estimated output amount as the new exact-in amount.
      if (newOutputHasTax && swapState.independentField === Field.INPUT) {
        setSwapState((swapState) => ({
          ...swapState,
          typedValue: previouslyEstimatedOutput,
        }))
      } else {
        setSwapState((prev) => ({
          ...prev,
          independentField: prev.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        }))
      }

      setCurrencyState((prev) => ({
        inputCurrency: prev.outputCurrency,
        outputCurrency: prev.inputCurrency,
      }))
    },
    [setCurrencyState, setSwapState, swapState.independentField]
  )

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSwapState((state) => {
        return {
          ...state,
          independentField: field,
          typedValue,
        }
      })
    },
    [setSwapState]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
  }
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(state: SwapState): SwapInfo {
  const user = useUser();
  const { address: account } = useAccount()

  const {
    currencyState: { inputCurrency, outputCurrency },
  } = useSwapPageStateRead()
  const { independentField, typedValue } = state

  const { inputTax, outputTax } = useSwapTaxes(
    inputCurrency?.isToken ? inputCurrency.address : undefined,
    outputCurrency?.isToken ? outputCurrency.address : undefined
  )

  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency])
  )

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = useMemo(
    () => tryParseCurrencyAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined),
    [inputCurrency, isExactIn, outputCurrency, typedValue]
  )

  const trade = useDebouncedTrade(
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    parsedAmount,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
    undefined,
    account
  )

  const { data: outputFeeFiatValue } = useUSDPrice(
    isSubmittableTrade(trade.trade) && trade.trade.swapFee
      ? CurrencyAmount.fromRawAmount(trade.trade.outputAmount.currency, trade.trade.swapFee.amount)
      : undefined,
    trade.trade?.outputAmount.currency
  )

  const currencyBalances = useMemo(
    () => ({
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }),
    [relevantTokenBalances]
  )

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency,
      [Field.OUTPUT]: outputCurrency,
    }),
    [inputCurrency, outputCurrency]
  )

  // allowed slippage for classic trades is either auto slippage, or custom user defined slippage if auto slippage disabled
  const classicAutoSlippage = useAutoSlippageTolerance(isClassicTrade(trade.trade) ? trade.trade : undefined)

  // slippage for uniswapx trades is defined by the quote response
  const uniswapXAutoSlippage = isUniswapXTrade(trade.trade) ? trade.trade.slippageTolerance : undefined

  // Uniswap interface recommended slippage amount
  const autoSlippage = uniswapXAutoSlippage ?? classicAutoSlippage
  const classicAllowedSlippage = useUserSlippageToleranceWithDefault(autoSlippage)

  // slippage amount used to submit the trade
  const allowedSlippage = uniswapXAutoSlippage ?? classicAllowedSlippage

  const connectionReady = !!user.address;
  const inputError = useMemo(() => {
    let inputError: ReactNode | undefined

    if (!account) {
      inputError = connectionReady ? 'Connect wallet' : 'Connecting wallet...'
    }

    if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
      inputError = inputError ?? 'Select a token'
    }

    if (!parsedAmount) {
      inputError = inputError ?? 'Enter an amount'
    }

    // compare input balance to max input based on version
    const [balanceIn, maxAmountIn] = [currencyBalances[Field.INPUT], trade?.trade?.maximumAmountIn(allowedSlippage)]

    if (balanceIn && maxAmountIn && balanceIn.lessThan(maxAmountIn)) {
      inputError = `Insufficient ${balanceIn.currency.symbol} balance`
    }

    return inputError
  }, [account, currencies, parsedAmount, currencyBalances, trade?.trade, allowedSlippage, connectionReady])

  return useMemo(
    () => ({
      currencies,
      currencyBalances,
      parsedAmount,
      inputError,
      trade,
      autoSlippage,
      allowedSlippage,
      outputFeeFiatValue,
      inputTax,
      outputTax,
    }),
    [
      allowedSlippage,
      autoSlippage,
      currencies,
      currencyBalances,
      inputError,
      outputFeeFiatValue,
      parsedAmount,
      trade,
      inputTax,
      outputTax,
    ]
  )
}

function parseCurrencyFromURLParameter(urlParam: ParsedQs[string]): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    const upper = urlParam.toUpperCase()
    if (upper === 'ETH') return 'ETH'
    if (upper in TOKEN_SHORTHANDS) return upper
  }
  return ''
}

export function queryParametersToCurrencyState(parsedQs: ParsedQs): SerializedCurrencyState {return {
  inputCurrencyId: '',
  outputCurrencyId: '',
}
}
