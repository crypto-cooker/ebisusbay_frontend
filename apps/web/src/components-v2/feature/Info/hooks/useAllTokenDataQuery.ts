import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChainIdByQuery, useChainNameByQuery } from './chain';
import chainConfigs from '@src/config/chains';
import { Info } from '@src/core/services/api-service/graph/subgraphs/info';
import { TokenData } from '../state/types';
import { LP_HOLDERS_FEE, TOTAL_FEE, DAYS_IN_YEAR } from '../state/constants';

export const useAllTokenDataQuery = () => {
  const chainId: number = useChainIdByQuery();
  const info = useMemo(() => new Info(chainId), [chainId]);
  const { data } = useQuery({
    queryKey: ['useGetPairs', chainId],
    queryFn: async () => {
      try{
      const response = await info.getPairs();
      console.log({response}, "GGGGGG")
      if (!response?.data?.tokenDayDatas) {
        throw new Error('Failed to fetch pairs data');
      }
      return response.data.tokenDayDatas;
    }catch(error) {
      console.error("Error fetching data", error)
    }
    },
    select: (data_: any) => {
      if (!data_ || data_.length === 0) {
        throw new Error('No data');
      }
  
      const final: {
        [address: string]: {
          data: PairData;
        };
      } = {};
  
      for (const d of data_) {
        const { totalFees24h, lpFees24h, lpApr24h } = getLpFeesAndApr(+d.dailyVolumeUSD, +d.volumeUSD);
        final[d.pairAddress] = {
          data: {
            pairAddress: d.pairAddress,
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
            dailyVolumeUSD: +d.dailyVolumeUSD,
            volumeUSDChange: 0,
            liquidityUSD: +d.reserveUSD,
            liquidityUSDChange: 0,
            totalFees24h,
            lpFees24h,
            lpApr24h,
            reserveUSD: 0,
          },
        };
      }
  
      return final;
    },
  });
  
  return useMemo(() => {
    return data ?? {};
  }, [data, chainId]);
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
