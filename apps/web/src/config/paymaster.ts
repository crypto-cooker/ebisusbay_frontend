import { cronosZkEvmTokens } from '@pancakeswap/tokens'

import { ChainId } from '@pancakeswap/chains'
import { Currency, Native } from '@pancakeswap/sdk'
import { Address, Hex } from 'viem'

// export const DEFAULT_PAYMASTER_TOKEN = Native.onChain(ChainId.ZKSYNC)

export const paymasterTokens: Currency[] = [
  // DEFAULT_PAYMASTER_TOKEN,
  Native.onChain(ChainId.CRONOS_ZKEVM),
  cronosZkEvmTokens.wcro,
  cronosZkEvmTokens.frtn,
  cronosZkEvmTokens.vusd,
  cronosZkEvmTokens.veth,
]

export const DEFAULT_PAYMASTER_TOKEN = paymasterTokens[2]

export const paymasterInfo: {
  [gasTokenAddress: Address]: { discount: `-${number}%` | 'FREE'; discountLabel?: string }
} = {
  [cronosZkEvmTokens.wcro.address]: {
    discount: 'FREE', // Example: -20%, FREE
    discountLabel: 'FREE SWAP',
  },
  [cronosZkEvmTokens.frtn.address]: {
    discount: 'FREE',
    discountLabel: 'FREE SWAP',
  },
  [cronosZkEvmTokens.vusd.address]: {
    discount: 'FREE',
    discountLabel: 'FREE SWAP',
  },
  [cronosZkEvmTokens.veth.address]: {
    discount: 'FREE',
    discountLabel: 'FREE SWAP',
  },
}

/**
 * Contracts that the paymaster is allowed to interact with.
 * In addition, ERC20 Approve transactions are allowed.
 */
export const PAYMASTER_CONTRACT_WHITELIST = [
  // getUniversalRouterAddress(ChainId.ZKSYNC), // Universal Router on zkSync
].map((address) => address.toLowerCase())

// Zyfi
export const ZYFI_PAYMASTER_URL = 'https://api.zyfi.org/api/erc20_paymaster/v1'
export const ZYFI_SPONSORED_PAYMASTER_URL = 'https://api.zyfi.org/api/erc20_sponsored_paymaster/v1'

export const ZYFI_VAULT: Address = '0x32faBA244AB815A5cb3E09D55c941464DBe31496'
export const PCS_ACCOUNT_IN_ZYFI_VAULT: Address = '0xf8d936A86a3844084Eb82b57E2107B1fEDFb1DD7'

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
