import { getChainId } from '@src/config/chains'
import { atom, useAtomValue } from 'jotai'
import { useSearchParams } from 'next/navigation'
import { useDeferredValue, useMemo } from 'react'
import { isChainSupported } from '@src/wagmi'
import { useAccount } from 'wagmi'
import { useSessionChainId } from './useSessionChainId'
import {ChainId} from "@pancakeswap/sdk";

const queryChainIdAtom = atom(-1) // -1 unload, 0 no chainId on query

queryChainIdAtom.onMount = (set) => {
  const params = new URL(window.location.href).searchParams
  let chainId
  // chain has higher priority than chainId
  // keep chainId for backward compatible
  const c = params.get('chain')
  if (!c) {
    chainId = params.get('chainId')
  } else {
    chainId = getChainId(c)
  }
  if (chainId && isChainSupported(+chainId)) {
    set(+chainId)
  } else {
    set(0)
  }
}

export function useLocalNetworkChain() {
  const [sessionChainId] = useSessionChainId()
  // useRouter is kind of slow, we only get this query chainId once
  const queryChainId = useAtomValue(queryChainIdAtom)

  const searchParams = useSearchParams()

  const chainId = +(sessionChainId || getChainId(searchParams?.get('chain') as string) || queryChainId)

  if (isChainSupported(chainId)) {
    return chainId
  }

  return undefined
}

export const useActiveChainId = () => {
  const localChainId = useLocalNetworkChain()
  const queryChainId = useAtomValue(queryChainIdAtom)

  const { chainId: wagmiChainId } = useAccount()
  const chainId = localChainId ?? wagmiChainId ?? (queryChainId >= 0 ? ChainId.CRONOS : undefined)

  const isNotMatched = useDeferredValue(wagmiChainId && localChainId && wagmiChainId !== localChainId)
  const isWrongNetwork = useMemo(
    () => Boolean(((wagmiChainId && !isChainSupported(wagmiChainId)) ?? false) || isNotMatched),
    [wagmiChainId, isNotMatched],
  )

  return {
    chainId: chainId && isChainSupported(chainId) ? chainId as ChainId : ChainId.CRONOS,
    isWrongNetwork,
    isNotMatched,
  }
}
