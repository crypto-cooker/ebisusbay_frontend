import { useAtomValue } from 'jotai';
import { globalTokensAtom } from '@src/components-v2/global-data-fetcher';

export function useSupportedApiTokens(chainId?: number) {
 const tokens = useAtomValue(globalTokensAtom) ?? [];

 return chainId ? tokens.filter((token) => token.chainId === chainId) : tokens;
}

export function useMarketTokens(chainId?: number) {
 const supportedTokens = useSupportedApiTokens(chainId);

 return supportedTokens.filter(token => token.marketDefault || token.listings || token.offers);
}

export function useMarketDefaultTokens(chainId?: number) {
 const supportedTokens = useSupportedApiTokens(chainId);

 return supportedTokens.filter(token => token.marketDefault);
}

export function useListingsTokens(chainId?: number) {
 const supportedTokens = useSupportedApiTokens(chainId);

 return supportedTokens.filter(token => token.listings);
}

export function useOffersTokens(chainId?: number) {
 const supportedTokens = useSupportedApiTokens(chainId);

 return supportedTokens.filter(token => token.offers);
}

export function useDexTokens(chainId?: number) {
 const supportedTokens = useSupportedApiTokens(chainId);

 return supportedTokens.filter(token => token.dex);
}

export function useCollectionTokens(chainId?: number) {
 const supportedTokens = useSupportedApiTokens(chainId);

 return supportedTokens.filter(token => token.dex);
}