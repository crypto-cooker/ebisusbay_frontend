import {ChainId, Currency} from '@uniswap/sdk-core'
import {PropsWithChildren, useEffect} from 'react'

import {useAccount} from "wagmi";
import usePrevious from "@dex/imported/hooks/usePrevious";
import {useDerivedSwapInfo, useSwapFormDerivedState, useSwapFormState, useSwapPageState} from "@dex/swap/state/swap/hooks";

export function SwapPageContext({
  children,
  chainId,
  initialInputCurrency,
  initialOutputCurrency,
}: PropsWithChildren<{
  chainId?: ChainId
  initialInputCurrency?: Currency
  initialOutputCurrency?: Currency
}>) {
  const [swapPageState, setSwapPageState] = useSwapPageState();

  useEffect(() => {
    setSwapPageState((prev) => ({
      ...prev,
      prefilledState: {
        inputCurrency: initialInputCurrency,
        outputCurrency: initialOutputCurrency,
      },
    }));
  }, [initialInputCurrency]);

  useEffect(() => {
    setSwapPageState((prev) => ({
      ...prev,
      chainId: chainId,
    }));
  }, [chainId]);


  return <>{children}</>
}

export function SwapFormContext({ children }: { children: React.ReactNode }) {
  const [swapFormState, setSwapFormState] = useSwapFormState();
  const [swapFormDerivedState, setSwapFormDerivedState] = useSwapFormDerivedState();

  const derivedSwapInfo = useDerivedSwapInfo(swapFormState)

  const { chain: connectedChainId } = useAccount()
  const previousConnectedChainId = usePrevious(connectedChainId)

  useEffect(() => {
    const chainChanged = previousConnectedChainId && previousConnectedChainId !== connectedChainId
    if (chainChanged) {
      setSwapFormState((prev) => ({
        ...prev,
        typedValue: ''
      }));
    }
  }, [connectedChainId, previousConnectedChainId])

  useEffect(() => {
    setSwapFormDerivedState((prev) => ({ ...prev, ...derivedSwapInfo }))
  }, [swapFormState]);

  return <>{children}</>
}
