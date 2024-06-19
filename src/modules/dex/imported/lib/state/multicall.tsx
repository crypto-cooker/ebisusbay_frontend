import { createMulticall, ListenerOptions } from '@uniswap/redux-multicall'
import { ChainId } from '@uniswap/sdk-core'
import { getBlocksPerMainnetEpochForChainId } from '@dex/imported/constants/chainInfo'
import { useInterfaceMulticall, useMainnetInterfaceMulticall } from '@dex/imported/hooks/useContract'
import useBlockNumber, { useMainnetBlockNumber } from '@dex/imported/lib/hooks/useBlockNumber'
import { useMemo } from 'react'
import {useNetwork} from "wagmi";

const multicall = createMulticall()

export default multicall

const MAINNET_LISTENER_OPTIONS = { blocksPerFetch: 1 }

export function MulticallUpdater() {
  const { chain } = useNetwork()
  const latestBlockNumber = useBlockNumber()
  const contract = useInterfaceMulticall()
  const listenerOptions: ListenerOptions = useMemo(
    () => ({ blocksPerFetch: getBlocksPerMainnetEpochForChainId(chain?.id) }),
    [chain?.id]
  )

  const latestMainnetBlockNumber = useMainnetBlockNumber()
  const mainnetContract = useMainnetInterfaceMulticall()

  return (
    <>
      <multicall.Updater
        chainId={ChainId.MAINNET}
        latestBlockNumber={latestMainnetBlockNumber}
        contract={mainnetContract}
        listenerOptions={MAINNET_LISTENER_OPTIONS}
      />
      {chain?.id !== ChainId.MAINNET && (
        <multicall.Updater
          chainId={chain?.id}
          latestBlockNumber={latestBlockNumber}
          contract={contract}
          listenerOptions={listenerOptions}
        />
      )}
    </>
  )
}
