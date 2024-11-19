import { useQuery } from '@tanstack/react-query';
import { MINIMUM_SEARCH_CHARACTERS } from '../state/constants';
import { useChainIdByQuery } from './chain';
import { useMemo } from 'react';
import { Info } from '@src/core/services/api-service/graph/subgraphs/info';

const useFetchSearchResults = (searchString: string, enabled = true) => {
  const searchStringTooShort = searchString.length < MINIMUM_SEARCH_CHARACTERS;

  const chainId = useChainIdByQuery();
  const info = useMemo(() => new Info(chainId), [chainId]);
  const {
    data: searchResults,
    isPending,
    isError,
  } = useQuery({
    queryFn: async () => {
      try {
        const response = await info.search(searchString);
        if (!response?.data) {
          throw new Error('Failed to fetch data');
        }
        return response.data;
      } catch (error) {
        console.error('Error fetching data', error);
      }
    },
    queryKey: ['info-search', searchString, chainId],
    enabled: Boolean(chainId && !searchStringTooShort && enabled),
    select: (data_: any) => {
      const tokens =
        data_?.tokens.map(
          (t: { id: any; name: any; symbol: any; decimals: any; derivedUSD: string | number }) => ({
            address: t.id,
            name: t.name,
            symbol: t.symbol,
            decimals: +t.decimals,
            priceUSD: +t.derivedUSD,
          }),
        ) ?? [];
      const pairs =
        data_?.pairs.map(
          (p: {
            token0: { id: any; name: any; symbol: any; decimals: any };
            token1: { id: any; name: any; symbol: any; decimals: any };
            reserveUSD: string;
            name: string;
            feeTier: any;
            id: any;
            tvlUSD: string | number;
          }) => ({
            token0: {
              address: p.token0.id,
              name: p.token0.name,
              symbol: p.token0.symbol,
              decimals: +p.token0.decimals,
            },
            token1: {
              address: p.token1.id,
              name: p.token1.name,
              symbol: p.token1.symbol,
              decimals: +p.token1.decimals,
            },
            name: p.name,
            liquidity: +p.reserveUSD,
            address: p.id,
          }),
        ) ?? [];
      return { tokens, pairs };
    },
  });

  return {
    tokens: searchResults?.tokens ?? [],
    pairs: searchResults?.pairs ?? [],
    tokensLoading: isPending,
    pairsLoading: isPending,
    error: isError,
  };
};

export default useFetchSearchResults;
