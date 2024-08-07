import { useAppDispatch } from "@market/state/redux/store/hooks"
import {useCallback} from "react";
import { ERC20Token, Pair } from '@pancakeswap/sdk'
import {addSerializedPair, SerializedPair} from "@eb-pancakeswap-web/state/user/actions";

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: pair.token0.serialize,
    token1: pair.token1.serialize,
  }
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
    },
    [dispatch],
  )
}