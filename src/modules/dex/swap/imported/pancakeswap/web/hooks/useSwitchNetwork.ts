import { ChainId } from '@pancakeswap/chains'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { useCallback, useMemo } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { useSessionChainId } from './useSessionChainId'
import {useAppDispatch} from "@market/state/redux/store/hooks";
import {CHAIN_QUERY_NAME} from "@src/config/chains";
import {toast} from "react-toastify";
import {clearUserStates} from "@eb-pancakeswap-web/utils/clearUserStates";
import {useSwitchNetworkLoading} from "@eb-pancakeswap-web/hooks/useSwitchNetworkLoading";
import {ExtendEthereum} from "@root/types/global";

export function useSwitchNetworkLocal() {
  const [, setSessionChainId] = useSessionChainId()
  const dispatch = useAppDispatch()

  const isBloctoMobileApp = useMemo(() => {
    return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto)
  }, [])

  return useCallback(
    (chainId: ChainId) => {
      replaceBrowserHistory('chain', chainId === ChainId.CRONOS ? null : CHAIN_QUERY_NAME[chainId])
      setSessionChainId(chainId)
      // Blocto in-app browser throws change event when no account change which causes user state reset therefore
      // this event should not be handled to avoid unexpected behaviour.
      if (!isBloctoMobileApp) {
        clearUserStates(dispatch, { chainId, newChainId: chainId })
      }
    },
    [dispatch, isBloctoMobileApp, setSessionChainId],
  )
}

export function useSwitchNetwork() {
  const [loading, setLoading] = useSwitchNetworkLoading()
  const {
    status,
    switchChainAsync: _switchNetworkAsync,
    switchChain: _switchNetwork,
    ...switchNetworkArgs
  } = useSwitchChain()

  const _isLoading = status === 'pending'

  const { isConnected } = useAccount()

  const switchNetworkLocal = useSwitchNetworkLocal()

  const isLoading = _isLoading || loading

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      if (isConnected && typeof _switchNetworkAsync === 'function') {
        if (isLoading) return undefined
        setLoading(true)

        return _switchNetworkAsync({ chainId })
          .then((c) => {
            switchNetworkLocal(chainId)
            // well token pocket
            if (window.ethereum?.isTokenPocket === true) {
              window.location.reload()
            }
            return c
          })
          .catch((e) => {
            // TODO: review the error
            toast.error('Error connecting, please retry and confirm in wallet!')
          })
          .finally(() => setLoading(false))
      }
      return new Promise(() => {
        switchNetworkLocal(chainId)
      })
    },
    [isConnected, _switchNetworkAsync, isLoading, setLoading, switchNetworkLocal],
  )

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (isConnected && typeof _switchNetwork === 'function') {
        return _switchNetwork({ chainId })
      }
      return switchNetworkLocal(chainId)
    },
    [_switchNetwork, isConnected, switchNetworkLocal],
  )

  const canSwitch = useMemo(
    () =>
      isConnected
        ? !!_switchNetworkAsync &&
          !(
            typeof window !== 'undefined' &&
            // @ts-ignore // TODO: add type later
            window.ethereum?.isMathWallet
          )
        : true,
    [_switchNetworkAsync, isConnected],
  )

  return {
    ...switchNetworkArgs,
    switchNetwork,
    switchNetworkAsync,
    isLoading,
    canSwitch,
  }
}
