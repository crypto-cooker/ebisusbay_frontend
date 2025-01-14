import { useAtomValue } from 'jotai';
import { globalTokensAtom } from '@src/components-v2/global-data-fetcher';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@src/core/services/api-service';
import { ciEquals } from '@market/helpers/utils';

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

export function useDealsTokens(chainId?: number) {
  const supportedTokens = useSupportedApiTokens(chainId);
  const lookupActions = useLookupActions(supportedTokens);

  return {
    tokens: supportedTokens.filter(token => token.deals),
    ...lookupActions
  };
}

export function useCollectionTokens(chainId?: number) {
  const supportedTokens = useSupportedApiTokens(chainId);

  return supportedTokens.filter(token => token.dex);
}

export function useCollectionListingTokens(address: string, chainId: number) {
  const marketDefaultTokens = useMarketDefaultTokens(chainId);

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