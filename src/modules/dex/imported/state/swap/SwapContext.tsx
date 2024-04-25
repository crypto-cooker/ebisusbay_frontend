import { ChainId, Currency } from '@uniswap/sdk-core'
import { PropsWithChildren, useEffect, useMemo, useState } from 'react'

import { useDerivedSwapInfo } from './hooks'
import { CurrencyState, SwapAndLimitContext, SwapContext, SwapState, initialSwapState } from './types'
import {useNetwork} from "wagmi";
import {SwapTab} from "@dex/constants";
import usePrevious from "@dex/imported/hooks/usePrevious";

export function SwapAndLimitContextProvider({
  children,
  chainId,
  initialInputCurrency,
  initialOutputCurrency,
}: PropsWithChildren<{
  chainId?: ChainId
  initialInputCurrency?: Currency
  initialOutputCurrency?: Currency
}>) {
  const { chain: connectedChainId } = useNetwork()
  const [currentTab, setCurrentTab] = useState<SwapTab>(SwapTab.Swap)

  const [currencyState, setCurrencyState] = useState<CurrencyState>({
    inputCurrency: initialInputCurrency,
    outputCurrency: initialOutputCurrency,
  })

  const prefilledState = useMemo(
    () => ({
      inputCurrency: initialInputCurrency,
      outputCurrency: initialOutputCurrency,
    }),
    [initialInputCurrency, initialOutputCurrency]
  )

  const previousConnectedChainId = usePrevious(connectedChainId)
  const previousPrefilledState = usePrevious(prefilledState)

  useEffect(() => {
    const combinedCurrencyState = { ...currencyState, ...prefilledState }
    const chainChanged = previousConnectedChainId && previousConnectedChainId !== connectedChainId
    const prefilledInputChanged = Boolean(
      previousPrefilledState?.inputCurrency
        ? !prefilledState.inputCurrency?.equals(previousPrefilledState.inputCurrency)
        : prefilledState.inputCurrency
    )
    const prefilledOutputChanged = Boolean(
      previousPrefilledState?.outputCurrency
        ? !prefilledState?.outputCurrency?.equals(previousPrefilledState.outputCurrency)
        : prefilledState.outputCurrency
    )

    if (chainChanged || prefilledInputChanged || prefilledOutputChanged) {
      setCurrencyState({
        inputCurrency: combinedCurrencyState.inputCurrency ?? undefined,
        outputCurrency: combinedCurrencyState.outputCurrency ?? undefined,
      })
    }
  }, [connectedChainId, currencyState, prefilledState, previousConnectedChainId, previousPrefilledState])

  const value = useMemo(() => {
    return {
      currencyState,
      setCurrencyState,
      currentTab,
      setCurrentTab,
      prefilledState,
      chainId,
    }
  }, [currencyState, setCurrencyState, currentTab, setCurrentTab, prefilledState, chainId])

  return <SwapAndLimitContext.Provider value={value}>{children}</SwapAndLimitContext.Provider>
}

export function SwapContextProvider({ children }: { children: React.ReactNode }) {
  const [swapState, setSwapState] = useState<SwapState>({
    ...initialSwapState,
  })
  const derivedSwapInfo = useDerivedSwapInfo(swapState)

  const { chain: connectedChainId } = useNetwork()
  const previousConnectedChainId = usePrevious(connectedChainId)

  useEffect(() => {
    const chainChanged = previousConnectedChainId && previousConnectedChainId !== connectedChainId
    if (chainChanged) {
      setSwapState((prev) => ({ ...prev, typedValue: '' }))
    }
  }, [connectedChainId, previousConnectedChainId])

  return <SwapContext.Provider value={{ swapState, setSwapState, derivedSwapInfo }}>{children}</SwapContext.Provider>
}
