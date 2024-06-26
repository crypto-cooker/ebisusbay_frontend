import { ChainId } from '@eb-pancakeswap/chains'
import { Native, NativeCurrency } from '@eb-pancakeswap/sdk'
import { useMemo } from 'react'
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId'

export default function useNativeCurrency(overrideChainId?: ChainId): NativeCurrency {
  const { chainId } = useActiveChainId()
  return useMemo(() => {
    try {
      return Native.onChain(overrideChainId ?? chainId ?? ChainId.CRONOS)
    } catch (e) {
      return Native.onChain(ChainId.CRONOS)
    }
  }, [overrideChainId, chainId])
}
