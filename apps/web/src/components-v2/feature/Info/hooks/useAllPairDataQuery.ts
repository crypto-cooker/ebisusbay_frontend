import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChainIdByQuery, useChainNameByQuery } from './chain';
import chainConfigs from '@src/config/chains';
import { Info } from '@src/core/services/api-service/graph/subgraphs/info';
import { PairData } from '../state/types';
import { LP_HOLDERS_FEE, TOTAL_FEE, DAYS_IN_YEAR } from '../state/constants';
import dayjs from 'dayjs';

export const useAllPairDataQuery = () => {
  const chainId: number = useChainIdByQuery();
  const info = useMemo(() => new Info(chainId), [chainId]);

  const { data } = useQuery({
    queryKey: ['useGetPairs'],
    queryFn: async () => {
      const response = await info.getPairs();
      return response.data.pairs;
    },
    select: useCallback((data_: any) => {
      if (!data_) {
        throw new Error('No data');
      }

      const final: {
        [address: string]: {
          data: PairData;
        };
      } = {};

      for (const d of data_) {
        const { totalFees24h, lpFees24h, lpApr24h } = getLpFeesAndApr(+d.volumeUSD24h, +d.volumeUSD);
        final[d.id] = {
          data: {
            pairAddres: d.pairAddress,
            token0: {
              address: d.token0.id,
              symbol: d.token0.symbol,
              name: d.token0.name,
              decimals: d.token0.decimals,
              totalLiquidity: d.token0.totalLiquidity,
            },
            token1: {
              address: d.token1.id,
              symbol: d.token1.symbol,
              name: d.token1.name,
              decimals: d.token1.decimals,
              totalLiquidity: d.token1.totalLiquidity,
            },
            volumeUSD: +d.volumeUSD24h,
            volumeUSDChange: 0,
            liquidityUSD: +d.tvlUSD,
            liquidityUSDChange: getPercentChange(+d.tvlUSD, d.tvlUSD24h ? +d.tvlUSD24h : 0),
            totalFees24h,
            lpFees24h,
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

const getLpFeesAndApr = (volumeUSD: number, liquidityUSD: number) => {
  const totalFees24h = volumeUSD * TOTAL_FEE;
  const lpFees24h = volumeUSD * LP_HOLDERS_FEE;

  const lpApr24h = liquidityUSD > 0 ? (totalFees24h * LP_HOLDERS_FEE * DAYS_IN_YEAR * 100) / liquidityUSD : 0;
  return {
    totalFees24h,
    lpFees24h,
    lpApr24h: lpApr24h !== Infinity ? lpApr24h : 0,
  };
};

const getPercentChange = (valueNow?: number, valueBefore?: number): number => {
  if (valueNow && valueBefore) {
    return ((valueNow - valueBefore) / valueBefore) * 100
  }
  return 0
}
