import { ChainId } from './chainId'

export const chainNames: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: 'eth',
  [ChainId.CRONOS]: 'cronos',
  [ChainId.CRONOS_TESTNET]: 'cronosTestnet',
}

export const chainNamesInKebabCase = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.CRONOS]: 'cronos',
  [ChainId.CRONOS_TESTNET]: 'cronos-testnet',
} as const

export const mainnetChainNamesInKebabCase = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.CRONOS]: 'cronos',
  [ChainId.CRONOS_TESTNET]: 'cronos',
} as const

export const chainNameToChainId = Object.entries(chainNames).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

// @see https://github.com/DefiLlama/defillama-server/blob/master/common/chainToCoingeckoId.ts
// @see https://github.com/DefiLlama/chainlist/blob/main/constants/chainIds.json
export const defiLlamaChainNames: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.CRONOS]: '',
  [ChainId.CRONOS_TESTNET]: '',
}
