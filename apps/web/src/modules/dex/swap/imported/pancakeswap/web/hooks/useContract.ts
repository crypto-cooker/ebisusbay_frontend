import {Abi, Address, erc20Abi} from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'
import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/chains'
import { WNATIVE, pancakePairV2ABI } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {getMulticallAddress} from "@eb-pancakeswap-web/utils/addressHelpers";
import {multicallABI} from "@eb-pancakeswap-web/config/abi/Multicall";
import {getContract} from "@eb-pancakeswap-web/utils/contractHelpers";
import {wethABI} from "@eb-pancakeswap-web/config/abi/weth";
/**
 * Helper hooks to get specific contracts (by ABI)
 */


// Code below migrated from Exchange useContract.ts

type UseContractOptions = {
  chainId?: ChainId
}

// returns null on errors
export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: UseContractOptions,
) {
  const { chainId: currentChainId } = useActiveChainId()
  const chainId = options?.chainId || currentChainId
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export function usePairContract(pairAddress?: Address, options?: UseContractOptions) {
  return useContract(pairAddress, pancakePairV2ABI, options)
}

export function useTokenContract(tokenAddress?: Address, chainId?: number) {
  return useContract(tokenAddress, erc20Abi, {chainId})
}

export function useWNativeContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId ? WNATIVE[chainId]?.address : undefined, wethABI)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}