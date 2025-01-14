import { useAtomValue } from 'jotai';
import { globalTokensAtom } from '@src/components-v2/global-data-fetcher';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@src/core/services/api-service';
import { ciEquals } from '@market/helpers/utils';

type MarketTokenFilterKeys = 'marketDefault' | 'dex' | 'listings' | 'offers' | 'deals'; // Extendable

export function useSupportedApiTokens(chainId?: number) {
  const tokens = useAtomValue(globalTokensAtom) ?? [];

  return chainId ? tokens.filter((token) => token.chainId === chainId) : tokens;
}

export function useMarketTokens(chainId?: number) {
  return useFilteredTokens(['marketDefault', 'listings', 'offers'], chainId);
}

export function useMarketDefaultTokens(chainId?: number) {
  return useFilteredTokens('marketDefault', chainId);
}

export function useListingsTokens(chainId?: number) {
  return useFilteredTokens('listings', chainId);
}

export function useOffersTokens(chainId?: number) {
  return useFilteredTokens('offers', chainId);
}

export function useDexTokens(chainId?: number) {
  return useFilteredTokens('dex', chainId);
}

export function useDealsTokens(chainId?: number) {
  return useFilteredTokens('deals', chainId);
}

export function useCollectionTokens(chainId?: number) {
  const supportedTokens = useSupportedApiTokens(chainId);

  return supportedTokens.filter(token => token.dex);
}

export function useCollectionListingTokens(address: string, chainId: number) {
  const { tokens: marketDefaultTokens } = useMarketDefaultTokens(chainId);

  const { data, isLoading, error } = useQuery({
    queryKey: ['CollectionMarketTokens', address, chainId],
    queryFn: async () => {
      const collectionMarketTokens = await ApiService.withoutKey().getCollectionMarketTokens(address, chainId);
      if (collectionMarketTokens.length > 0) {
        return collectionMarketTokens;
      }
      return marketDefaultTokens;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 11,
    enabled: !!address && !!chainId
  });

  return {
    tokens: data ?? [],
    isLoading,
    error
  };
}

export function useFilteredTokens(
  filterKeys: MarketTokenFilterKeys[] | MarketTokenFilterKeys,
  chainId?: number
) {
  const supportedTokens = useSupportedApiTokens(chainId);

  const keys = Array.isArray(filterKeys) ? filterKeys : [filterKeys];
  const tokens = supportedTokens.filter(token => keys.some(key => token[key]));
  const lookupActions = useLookupActions(tokens);

  return { tokens, ...lookupActions };
}

const useLookupActions = (tokenList: Array<{address: string}>) => {
  const search = (address: string) => {
    return tokenList.find(token => ciEquals(token.address, address));
  }

  const exists = (address: string) => {
    return !!search(address);
  }

  return {
    search,
    exists
  }
}