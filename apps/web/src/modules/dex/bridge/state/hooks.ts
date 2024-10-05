import { useAtomValue } from "jotai"
import { bridgeReducerAtom } from "./reducer"

export function useBridgeState() {
    return useAtomValue(bridgeReducerAtom)
  }