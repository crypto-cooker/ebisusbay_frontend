import { cronosZkEvmTokens, cronosZkEvmTestnetTokens } from '@pancakeswap/tokens'

import { ChainId } from '@pancakeswap/chains'
import {Currency, ERC20Token, Native} from '@pancakeswap/sdk'
import { Address, Hex } from 'viem'
import {V2_ROUTER_ADDRESS} from "@dex/swap/constants/exchange";
import {SUPPORTED_CHAIN_IDS, SupportedChainId} from "@src/config/chains";

// export const DEFAULT_PAYMASTER_TOKEN = Native.onChain(ChainId.ZKSYNC)

// export const paymasterTokens: Currency[] = [
//   // DEFAULT_PAYMASTER_TOKEN,
//   Native.onChain(ChainId.CRONOS_ZKEVM),
//   new ERC20Token(
//     ChainId.CRONOS_ZKEVM,
//     '0xBCaA34FF9D5BFD0d948b18Cf6Bf39a882F4a1cBD',
//     8,
//     'CRO',
//     'Cronos',
//   ),
//   cronosZkEvmTokens.frtn,
//   cronosZkEvmTokens.vusd,
//   cronosZkEvmTokens.veth
// ]

export const SUPPORTED_PAYMASTER_CHAINS = [
  ChainId.CRONOS_ZKEVM,
  ChainId.CRONOS_ZKEVM_TESTNET
] as const

export type SupportedPaymasterChain = (typeof SUPPORTED_PAYMASTER_CHAINS)[number]

export const paymasterTokens: Record<SupportedPaymasterChain, Currency[]> = {
  [ChainId.CRONOS_ZKEVM]: [
    Native.onChain(ChainId.CRONOS_ZKEVM),
    cronosZkEvmTokens.frtn,
    cronosZkEvmTokens.cro,
    cronosZkEvmTokens.vusd,
    cronosZkEvmTokens.veth
  ],
  [ChainId.CRONOS_ZKEVM_TESTNET]: [
    Native.onChain(ChainId.CRONOS_ZKEVM_TESTNET),
    cronosZkEvmTestnetTokens.frtn,
    cronosZkEvmTestnetTokens.wcro,
    cronosZkEvmTestnetTokens.red,
    cronosZkEvmTestnetTokens.blue
  ]
}

export const DEFAULT_PAYMASTER_TOKEN: Record<SupportedPaymasterChain, Currency> = {
  [ChainId.CRONOS_ZKEVM]: paymasterTokens[ChainId.CRONOS_ZKEVM][0],
  [ChainId.CRONOS_ZKEVM_TESTNET]: paymasterTokens[ChainId.CRONOS_ZKEVM_TESTNET][1]
}

export const paymasterInfo: Record<SupportedPaymasterChain, { [gasTokenAddress: Address]: { discount: `-${number}%` | 'FREE'; discountLabel?: string } }> = {
  [ChainId.CRONOS_ZKEVM]: {
    // [cronosZkEvmTokens.wcro.address]: {
    //   discount: 'FREE', // Example: -20%, FREE
    //   discountLabel: 'FREE SWAP',
    // },
    [cronosZkEvmTokens.frtn.address]: {
      discount: 'FREE',
      discountLabel: 'FREE SWAP',
    },
    // [cronosZkEvmTokens.vusd.address]: {
    //   discount: 'FREE',
    //   discountLabel: 'FREE SWAP',
    // },
    // [cronosZkEvmTokens.veth.address]: {
    //   discount: 'FREE',
    //   discountLabel: 'FREE SWAP',
    // }
  },
  [ChainId.CRONOS_ZKEVM_TESTNET]: {
    [cronosZkEvmTestnetTokens.wcro.address]: {
      discount: 'FREE', // Example: -20%, FREE
      discountLabel: 'FREE SWAP',
    },
    [cronosZkEvmTestnetTokens.frtn.address]: {
      discount: 'FREE',
      discountLabel: 'FREE SWAP',
    },
    [cronosZkEvmTestnetTokens.vusd.address]: {
      discount: 'FREE',
      discountLabel: 'FREE SWAP',
    },
    [cronosZkEvmTestnetTokens.red.address]: {
      discount: 'FREE',
      discountLabel: 'FREE SWAP',
    },
    // [cronosZkEvmTestnetTokens.blue.address]: {
    //   discount: 'FREE',
    //   discountLabel: 'FREE SWAP',
    // }
  }
}

// export const paymasterInfo: {
//   [gasTokenAddress: Address]: { discount: `-${number}%` | 'FREE'; discountLabel?: string }
// } = {
//   [cronosZkEvmTokens.wcro.address]: {
//     discount: 'FREE', // Example: -20%, FREE
//     discountLabel: 'FREE SWAP',
//   },
//   [cronosZkEvmTokens.frtn.address]: {
//     discount: 'FREE',
//     discountLabel: 'FREE SWAP',
//   },
//   [cronosZkEvmTokens.vusd.address]: {
//     discount: 'FREE',
//     discountLabel: 'FREE SWAP',
//   },
//   [cronosZkEvmTokens.veth.address]: {
//     discount: 'FREE',
//     discountLabel: 'FREE SWAP',
//   },
// }

export function isSupportedPaymasterChainId(value?: number | string): value is SupportedPaymasterChain {
  return !!value && (SUPPORTED_PAYMASTER_CHAINS as readonly number[]).includes(Number(value));
}

/**
 * Contracts that the paymaster is allowed to interact with.
 * In addition, ERC20 Approve transactions are allowed.
 */
// export const PAYMASTER_CONTRACT_WHITELIST = [
//     V2_ROUTER_ADDRESS[ChainId.CRONOS_ZKEVM]
//   // getUniversalRouterAddress(ChainId.ZKSYNC), // Universal Router on zkSync
// ].map((address) => address.toLowerCase())
//
// Zyfi
// export const ZYFI_PAYMASTER_URL = 'https://api.zyfi.org/api/erc20_paymaster/v1'
// export const ZYFI_SPONSORED_PAYMASTER_URL = 'https://api.zyfi.org/api/erc20_sponsored_paymaster/v1'
//
// export const ZYFI_VAULT: Address = '0x32faBA244AB815A5cb3E09D55c941464DBe31496'
// export const PCS_ACCOUNT_IN_ZYFI_VAULT: Address = '0xf8d936A86a3844084Eb82b57E2107B1fEDFb1DD7'

export interface ZyfiResponse {
  txData: TxData
  gasLimit: string
  gasPrice: string
  tokenAddress: string
  tokenPrice: string
  feeTokenAmount: string
  feeTokendecimals: string
  feeUSD: string
  estimatedFinalFeeUSD: string
  estimatedFinalFeeTokenAmount: string
  markup: string
  expirationTime: string
  expiresIn: string
}

export interface TxData {
  chainId: number
  from: Address
  to: Address
  data: Hex
  value: Hex
  customData: CustomData
  maxFeePerGas: string
  gasLimit: number
}

export interface CustomData {
  paymasterParams: PaymasterParams
  gasPerPubdata: number
}

export interface PaymasterParams {
  paymaster: string
  paymasterInput: string
}
