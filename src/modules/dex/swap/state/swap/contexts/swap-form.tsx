// import {useSwapPageState} from "@dex/swap/state/swap/hooks";
// import {useAccount} from "wagmi";
// import {useEffect} from "react";
// import {usePrevious} from "@chakra-ui/hooks";
// import {useDerivedSwapInfo} from "@eb-pancakeswap-web/state/swap/hooks";
//
// export function SwapFormContext({ children }: { children: React.ReactNode }) {
//   console.log('===debug: SwapFormContext')
//   const [swapFormState, setSwapFormState] = useSwapFormState();
//   const [swapFormDerivedState, setSwapFormDerivedState] = useSwapFormDerivedState();
//   const [swapPageState, setSwapPageState] = useSwapPageState();
//
//   const derivedSwapInfo = useDerivedSwapInfo(swapFormState);
//
//   const { chain: connectedChainId } = useAccount()
//   const previousConnectedChainId = usePrevious(connectedChainId)
//
//   useEffect(() => {
//     const chainChanged = previousConnectedChainId && previousConnectedChainId !== connectedChainId
//     if (chainChanged) {
//       setSwapFormState((prev) => ({
//         ...prev,
//         typedValue: ''
//       }));
//     }
//   }, [connectedChainId, previousConnectedChainId])
//
//   useEffect(() => {
//     setSwapFormDerivedState((prev) => ({ ...prev, ...derivedSwapInfo }))
//   }, [swapPageState]);
//
//   return <>{children}</>
// }