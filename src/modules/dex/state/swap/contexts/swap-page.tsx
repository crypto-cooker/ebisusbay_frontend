import {PropsWithChildren, useEffect} from "react";
import {ChainId, Currency} from "@uniswap/sdk-core";
import {useSwapPageState} from "@dex/state/swap/hooks";

interface SwapPageContextProps {
  chainId?: ChainId
  initialInputCurrency?: Currency
  initialOutputCurrency?: Currency
}

export function SwapPageContext({children, chainId, initialInputCurrency, initialOutputCurrency}: PropsWithChildren<SwapPageContextProps>) {
  const [swapPageState, setSwapPageState] = useSwapPageState();

  console.log('===debug: SwapPageContext', swapPageState)
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