import { CHAINS } from '../config/chains'
import memoize from 'lodash/memoize'

export const chains = CHAINS

export const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId: number) => (CHAIN_IDS as number[]).includes(chainId))

