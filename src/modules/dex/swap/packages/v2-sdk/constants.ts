import { ChainId } from '@eb-pancakeswap/chains'
import type { Address, Hash } from 'viem'

export const FACTORY_ADDRESS = '0x5f1D751F447236f486F4268b883782897A902379'

const FACTORY_ADDRESS_ETH = '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362'

export const FACTORY_ADDRESS_MAP = {
  [ChainId.ETHEREUM]: FACTORY_ADDRESS_ETH,
  [ChainId.CRONOS]: FACTORY_ADDRESS,
  [ChainId.CRONOS_TESTNET]: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
} as const satisfies Record<ChainId, Address>

export const INIT_CODE_HASH = '0x347deace88ba101bfe81fb4a9b4306e0a67b3d6d354f8da19b7ed90cee4b7016'

const INIT_CODE_HASH_ETH = '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d'
export const INIT_CODE_HASH_MAP = {
  [ChainId.ETHEREUM]: INIT_CODE_HASH_ETH,
  [ChainId.CRONOS]: INIT_CODE_HASH,
  [ChainId.CRONOS_TESTNET]: INIT_CODE_HASH,
} as const satisfies Record<ChainId, Hash>
