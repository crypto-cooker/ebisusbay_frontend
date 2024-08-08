import { useQuery } from '@tanstack/react-query'
import {useBlockNumber, useBlockNumber as useWagmiBlockNumber} from 'wagmi'
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {FAST_INTERVAL, SLOW_INTERVAL} from "@dex/swap/constants";
import {useBlockTimestamp, useInitialBlockNumber, useWatchBlock,
  useInitialBlockTimestamp as useInitBlockTimestamp} from "@pancakeswap/wagmi";

export const usePollBlockNumber = () => {
  const { chainId } = useActiveChainId()

  useWatchBlock({
    chainId,
    enabled: true,
  })

  const { data: blockNumber } = useBlockNumber({
    chainId,
    watch: true,
  })

  useQuery({
    queryKey: [FAST_INTERVAL, 'blockNumber', chainId],
    queryFn: async () => Number(blockNumber),
    enabled: Boolean(chainId),
    refetchInterval: FAST_INTERVAL,
  })

  useQuery({
    queryKey: [SLOW_INTERVAL, 'blockNumber', chainId],
    queryFn: async () => Number(blockNumber),
    enabled: Boolean(chainId),
    refetchInterval: SLOW_INTERVAL,
  })
}

export const useCurrentBlock = (): number => {
  const { chainId } = useActiveChainId()
  const { data: currentBlock = 0 } = useBlockNumber({
    chainId,
    watch: true,
  })
  return Number(currentBlock)
}

export function useCurrentBlockTimestamp() {
  const { chainId } = useActiveChainId()
  const { data: timestamp } = useBlockTimestamp({
    chainId,
  })
  return timestamp
}

export const useChainCurrentBlock = (chainId: number) => {
  const { chainId: activeChainId } = useActiveChainId()
  const activeChainBlockNumber = useCurrentBlock()
  const isTargetDifferent = Boolean(chainId && activeChainId !== chainId)
  const { data: targetChainBlockNumber } = useWagmiBlockNumber({
    chainId,
    watch: true,
    query: {
      enabled: isTargetDifferent,
      select: (data) => (data !== undefined ? Number(data) : undefined),
    },
  })

  return isTargetDifferent ? targetChainBlockNumber : activeChainBlockNumber
}

export const useInitialBlock = (): number => {
  const { chainId } = useActiveChainId()
  const { data: initialBlock = 0 } = useInitialBlockNumber({
    chainId,
  })
  return Number(initialBlock)
}

export const useInitialBlockTimestamp = (): number => {
  const { chainId } = useActiveChainId()
  const { data: initialBlockTimestamp = 0 } = useInitBlockTimestamp({
    chainId,
  })
  return Number(initialBlockTimestamp)
}
