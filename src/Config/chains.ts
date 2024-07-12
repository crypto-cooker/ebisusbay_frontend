import { ChainId, chainNames } from '@pancakeswap/chains'
import memoize from 'lodash/memoize'
import {
  Chain,
  cronosTestnet as cronosTestnet_,
  cronos as cronos_,
} from 'wagmi/chains'
import {defineChain} from "viem";

export const CHAIN_QUERY_NAME = chainNames

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})

const cronos = {
  ...cronos_,
  rpcUrls: {
    ...cronos_.rpcUrls,
    public: {
      ...cronos_.rpcUrls,
      http: ['https://rpc.ebisusbay.com'],
    },
    default: {
      ...cronos_.rpcUrls.default,
      http: ['https://rpc.ebisusbay.com'],
    },
  },
} satisfies Chain

const cronosTestnet = {
  ...cronosTestnet_,
  rpcUrls: {
    ...cronosTestnet_.rpcUrls,
    public: {
      ...cronosTestnet_.rpcUrls,
      http: ['https://rpc.ebisusbay.biz'],
    },
    default: {
      ...cronosTestnet_.rpcUrls.default,
      http: ['https://rpc.ebisusbay.biz'],
    },
  },
} satisfies Chain

export const cronosZkEVMTestnet  = /*#__PURE__*/ defineChain({
  id: 282,
  name: 'Cronos zkEVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'zkTCRO',
    symbol: 'zkTCRO',
  },
  rpcUrls: {
    default: { http: ['https://testnet.zkevm.cronos.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Cronos zkEVM (Testnet) Explorer',
      url: 'https://explorer.zkevm.cronos.org/testnet',
    },
  },
  contracts: {
    multicall3: {
      address: '0xA44d020A117C14645E3686Db0e539657236c289F',
      blockCreated: 157022,
    },
  },
  testnet: true,
})

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = [
  ChainId.CRONOS_ZKEVM_TESTNET
]

export const CHAINS: [Chain, ...Chain[]] = [
  cronos,
  cronosTestnet,
  cronosZkEVMTestnet,
]

