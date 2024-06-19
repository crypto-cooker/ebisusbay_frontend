import { ChainId } from '@uniswap/sdk-core'
import { RPC_PROVIDERS } from '@dex/imported/constants/providers'
import useIsWindowVisible from '@dex/imported/hooks/useIsWindowVisible'
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {useUser} from "@src/components-v2/useUser";
import {useAccount} from "wagmi";

const MISSING_PROVIDER = Symbol()
export const BlockNumberContext = createContext<
  | {
      fastForward(block: number): void
      block?: number
      mainnetBlock?: number
    }
  | typeof MISSING_PROVIDER
>(MISSING_PROVIDER)

function useBlockNumberContext() {
  const blockNumber = useContext(BlockNumberContext)
  if (blockNumber === MISSING_PROVIDER) {
    throw new Error('BlockNumber hooks must be wrapped in a <BlockNumberProvider>')
  }
  return blockNumber
}

export function useFastForwardBlockNumber(): (block: number) => void {
  return useBlockNumberContext().fastForward
}

/** Requires that BlockUpdater be installed in the DOM tree. */
export default function useBlockNumber(): number | undefined {
  return useBlockNumberContext().block
}

export function useMainnetBlockNumber(): number | undefined {
  return useBlockNumberContext().mainnetBlock
}

export function BlockNumberProvider({ children }: PropsWithChildren) {
  const { chain } = useAccount()
  const { provider } = useUser();
  const activeChainId = chain?.id;
  const [{ chainId, block, mainnetBlock }, setChainBlock] = useState<{
    chainId?: number
    block?: number
    mainnetBlock?: number
  }>({})
  const activeBlock = chainId === activeChainId ? block : undefined

  const onChainBlock = useCallback((chainId: number, block: number) => {
    setChainBlock((chainBlock) => {
      if (chainBlock.chainId === chainId) {
        if (!chainBlock.block || chainBlock.block < block) {
          const mainnetBlock = chainId === ChainId.MAINNET ? block : chainBlock.mainnetBlock
          return { chainId, block, mainnetBlock }
        }
      } else if (chainId === ChainId.MAINNET) {
        if (!chainBlock.mainnetBlock || chainBlock.mainnetBlock < block) {
          return { ...chainBlock, mainnetBlock: block }
        }
      }
      return chainBlock
    })
  }, [])

  // Poll for block number on the active provider.
  const windowVisible = useIsWindowVisible()
  useEffect(() => {
    // if (provider && activeChainId && windowVisible) {
    //   setChainBlock((chainBlock) => {
    //     if (chainBlock.chainId !== activeChainId) {
    //       return { chainId: activeChainId, mainnetBlock: chainBlock.mainnetBlock }
    //     }
    //     // If chainId hasn't changed, don't invalidate the reference, as it will trigger re-fetching of still-valid data.
    //     return chainBlock
    //   })
    //
    //   const onBlock = (block: number) => onChainBlock(activeChainId, block)
    //   provider.on('block', onBlock)
    //   return () => {
    //     provider.removeListener('block', onBlock)
    //   }
    // }
    return
  }, [activeChainId, provider, windowVisible, onChainBlock])

  // Poll once for the mainnet block number using the network provider.
  useEffect(() => {
    RPC_PROVIDERS[ChainId.MAINNET]
      .getBlockNumber()
      .then((block) => onChainBlock(ChainId.MAINNET, block))
      // swallow errors - it's ok if this fails, as we'll try again if we activate mainnet
      .catch(() => undefined)
  }, [onChainBlock])

  const value = useMemo(
    () => ({
      fastForward: (update: number) => {
        if (activeChainId) {
          onChainBlock(activeChainId, update)
        }
      },
      block: activeBlock,
      mainnetBlock,
    }),
    [activeBlock, activeChainId, mainnetBlock, onChainBlock]
  )
  return <BlockNumberContext.Provider value={value}>{children}</BlockNumberContext.Provider>
}
