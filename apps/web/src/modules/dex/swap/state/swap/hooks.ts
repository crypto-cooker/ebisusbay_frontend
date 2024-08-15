import {swapFormDerivedStateAtom, swapFormStateAtom, swapPageStateAtom} from "@dex/swap/state/swap/atom";
import {useAtom, useAtomValue} from "jotai";
import {swapReducerAtom} from "@eb-pancakeswap-web/state/swap/reducer";

// export function useSwapState() {
//   return useAtomValue(swapReducerAtom);
// }
//
export function useSwapPageState() {
  return useAtom(swapPageStateAtom);
}
//
// export function useSwapPageStateRead() {
//   return useAtomValue(swapPageStateAtom);
// }
//
// export function useSwapFormState() {
//   return useAtom(swapFormStateAtom);
// }
//
// export function useSwapFormDerivedState() {
//   return useAtom(swapFormDerivedStateAtom);
// }