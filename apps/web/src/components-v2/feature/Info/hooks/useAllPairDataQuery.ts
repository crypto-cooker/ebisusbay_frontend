import { useQuery } from '@tanstack/react-query';
import { useChainIdByQuery, useChainNameByQuery } from './chain';
import chainConfigs from '@src/config/chains';
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";


export const useAllPoolDataQuery = () => {
  const chainId: number = useChainIdByQuery();
  const chain = chainConfigs[chainId as keyof typeof chainConfigs];
  const { data } = useQuery({
    queryKey: [`info/pairs/data`, chainId],
    queryFn: async () => {
      if (!chainId) {
        throw new Error('No chain');
      }
      return explorerApiClient
        .GET('/cached/pools/v2/{chainName}/list/top', {
          params: {
            path: {
              chainName,
            },
          },
        })
        .then((res) => res.data);
    },
    enabled: Boolean(chainName),
    ...QUERY_SETTINGS_IMMUTABLE,
    ...QUERY_SETTINGS_WITHOUT_INTERVAL_REFETCH,
    select: useCallback((data_) => {
      if (!data_) {
        throw new Error('No data');
      }

      const final: {
        [address: string]: {
          data: PoolData;
        };
      } = {};

      for (const d of data_) {
        const { totalFees24h, totalFees7d, lpFees24h, lpFees7d, lpApr7d } = getLpFeesAndApr(
          +d.volumeUSD24h,
          +d.volumeUSD7d,
          +d.tvlUSD,
        );
        final[d.id] = {
          data: {
            address: d.id,
            timestamp: dayjs(d.createdAtTimestamp as string).unix(),
            token0: {
              address: d.token0.id,
              symbol: d.token0.symbol,
              name: d.token0.name,
              decimals: d.token0.decimals,
            },
            token1: {
              address: d.token1.id,
              symbol: d.token1.symbol,
              name: d.token1.name,
              decimals: d.token1.decimals,
            },
            feeTier: d.feeTier,
            volumeUSD: +d.volumeUSD24h,
            volumeUSDChange: 0,
            volumeUSDWeek: +d.volumeUSD7d,
            liquidityUSD: +d.tvlUSD,
            liquidityUSDChange: getPercentChange(+d.tvlUSD, d.tvlUSD24h ? +d.tvlUSD24h : 0),
            totalFees24h,
            totalFees7d,
            lpFees24h,
            lpFees7d,
            lpApr7d,
            liquidityToken0: +d.tvlToken0,
            liquidityToken1: +d.tvlToken1,
            token0Price: +d.token0Price,
            token1Price: +d.token1Price,
            volumeUSDChangeWeek: 0,
          },
        };
      }

      return final;
    }, []),
  });
  return useMemo(() => {
    return data ?? {};
  }, [data]);
};
