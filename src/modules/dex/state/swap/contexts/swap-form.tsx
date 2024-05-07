import {useDerivedSwapInfo, useSwapFormDerivedState, useSwapFormState} from "@dex/state/swap/hooks";
import {useNetwork} from "wagmi";
import usePrevious from "@dex/imported/hooks/usePrevious";
import {useEffect} from "react";

export function SwapFormContext({ children }: { children: React.ReactNode }) {
  console.log('===debug: SwapFormContext')
  const [swapFormState, setSwapFormState] = useSwapFormState();
  const [swapFormDerivedState, setSwapFormDerivedState] = useSwapFormDerivedState();

  const derivedSwapInfo = useDerivedSwapInfo(swapFormState)

  const { chain: connectedChainId } = useNetwork()
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
    console.log('SET DERIVED STATE')
    setSwapFormDerivedState((prev) => ({ ...prev, ...derivedSwapInfo }))
  }, [swapFormState]);

  return <>{children}</>
}