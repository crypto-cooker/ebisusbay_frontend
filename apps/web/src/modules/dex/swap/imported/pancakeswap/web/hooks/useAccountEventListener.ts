import { useCallback, useEffect } from 'react'
import { useAccount, useAccountEffect, useConfig } from 'wagmi'
import { useSwitchNetworkLocal } from './useSwitchNetwork'
import {useAppDispatch} from "@market/state/redux/store/hooks";
import {watchAccount} from "@wagmi/core";
import {clearUserStates} from "@eb-pancakeswap-web/utils/clearUserStates";

export const useChainIdListener = () => {
  const switchNetworkCallback = useSwitchNetworkLocal()
  const onChainChanged = useCallback(
    ({ chainId }: { chainId?: number }) => {
      if (chainId === undefined) return
      switchNetworkCallback(chainId)
    },
    [switchNetworkCallback],
  )
  const { connector } = useAccount()

  useEffect(() => {
    connector?.emitter?.on('change', onChainChanged)

    return () => {
      connector?.emitter?.off('change', onChainChanged)
    }
  })
}

const useAddressListener = () => {
  const config = useConfig()
  const dispatch = useAppDispatch()
  const { chainId } = useAccount()

  useEffect(() => {
    return watchAccount(config as any, {
      onChange(data, prevData) {
        if (prevData.status === 'connected' && data.status === 'connected' && prevData.chainId === data.chainId) {
          clearUserStates(dispatch, { chainId })
        }
      },
    })
  }, [config, dispatch, chainId])
}

export const useAccountEventListener = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useAccount()
  useChainIdListener()
  useAddressListener()

  useAccountEffect({
    onDisconnect() {
      clearUserStates(dispatch, { chainId })
    },
  })
}
