import {ChainId} from "@pancakeswap/chains";
import { CmsToken } from '@src/components-v2/global-data-fetcher';

export function isOffersEnabledForChain(chainId: number) {
  return chainId && [ChainId.CRONOS, ChainId.CRONOS_TESTNET].includes(chainId);
}

export function cmsTokenToDexCurrency(token: CmsToken) {
  return {
    ...token,
    address: token.address as `0x${string}`,
    isNative: false,
    isToken: true,
    logoURI: token.logo
  }
}