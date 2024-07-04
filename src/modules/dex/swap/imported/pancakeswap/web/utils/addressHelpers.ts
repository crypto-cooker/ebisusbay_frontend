import { ChainId } from '@eb-pancakeswap/chains'
import { Address } from 'viem'
import addresses from '@eb-pancakeswap-web/config/constants/contracts'

export type Addresses = {
  [chainId in ChainId]?: Address
}

export const getAddressFromMap = (address: Addresses, chainId?: number): `0x${string}` => {
  const chainAddress = address[chainId as ChainId];
  return chainId && chainAddress ? chainAddress : address[ChainId.CRONOS]!
}

export const getAddressFromMapNoFallback = (address: Addresses, chainId?: number): `0x${string}` | null => {
  return chainId ? address[chainId as ChainId] ?? null : null;
}

export const getMulticallAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.multiCall, chainId)
}