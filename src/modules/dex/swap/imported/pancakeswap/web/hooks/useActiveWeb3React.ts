import { ChainId } from '@pancakeswap/chains'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { useActiveChainId } from './useActiveChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'
import {Chain} from "viem";
import {Connector, useAccount} from "wagmi";
import {isChainSupported} from "@src/wagmi";
import {EXCHANGE_PAGE_PATHS} from "@dex/swap/constants/exchange";
import {CHAIN_QUERY_NAME, getChainId} from "@src/Config/chains";
import {getHashFromRouter} from "@eb-pancakeswap-web/utils/getHashFromRouter";

export function useNetworkConnectorUpdater() {
  const { chainId } = useActiveChainId()
  const previousChainIdRef = useRef(chainId)
  const [loading] = useSwitchNetworkLoading()
  const router = useRouter()

  useEffect(() => {
    const setPrevChainId = () => {
      previousChainIdRef.current = chainId
    }
    if (loading || !router.isReady) return setPrevChainId()
    const parsedQueryChainId = getChainId(router.query.chain as string)

    if (!parsedQueryChainId && chainId === ChainId.CRONOS) return setPrevChainId()
    if (parsedQueryChainId !== chainId && chainId && isChainSupported(chainId)) {
      const removeQueriesFromPath =
        previousChainIdRef.current !== chainId &&
        EXCHANGE_PAGE_PATHS.some((item) => {
          return router.pathname.startsWith(item)
        })
      const uriHash = getHashFromRouter(router)?.[0]
      const { chainId: _chainId, ...omittedQuery } = router.query
      router.replace(
        {
          query: {
            ...(!removeQueriesFromPath && omittedQuery),
            chain: CHAIN_QUERY_NAME[chainId],
          },
          ...(uriHash && { hash: uriHash }),
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      )
    }
    return setPrevChainId()
  }, [chainId, loading, router])
}

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const web3React = useWeb3React()
  const { chainId, isWrongNetwork } = useActiveChainId()

  return {
    ...web3React,
    chainId,
    isWrongNetwork,
  }
}

export function useWeb3React(): {
  chainId: number | undefined
  account: `0x${string}` | null | undefined
  isConnected: boolean
  isConnecting: boolean
  chain: (Chain & { unsupported?: boolean | undefined }) | undefined
  connector: Connector | undefined
} {
  const { chain, address, connector, isConnected, isConnecting } = useAccount()

  return {
    chainId: chain?.id,
    account: isConnected ? address : null, // TODO: migrate using `isConnected` instead of account to check wallet auth
    isConnected,
    isConnecting,
    chain,
    connector,
  }
}

export default useActiveWeb3React
