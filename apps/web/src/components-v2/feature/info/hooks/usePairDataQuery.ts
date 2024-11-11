import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChainIdByQuery } from './chain';
import chainConfigs from '@src/config/chains';
import { Info } from '@src/core/services/api-service/graph/subgraphs/info';
import { PairData } from '../state/types';
import { LP_HOLDERS_FEE, TOTAL_FEE, DAYS_IN_YEAR } from '../state/constants';

export const usePairDataQuery = (address: string) => {
  const chainId: number = useChainIdByQuery();
  const info = useMemo(() => new Info(chainId), [chainId]);
  const { data } = useQuery({
    queryKey: ['useGetPair', chainId],
    queryFn: async () => {
      try {
        const response = await info.getPair(address);
        if (!response?.data?.pair) {
          throw new Error('Failed to fetch pairs data');
        }
        return response.data.pair;
      } catch (error) {
        console.error('Error fetching data', error);
      }
    },
    select: (data_: any) => {
      if (!data_ || data_.length === 0) {
        throw new Error('No data');
      }
      
      const liquidityUSDChange = getLiquidityUSDChange(+data_.reserveUSD, data_.pairHourData);
      const dailyVolumeUSD = getDailyVolumeFromHourlVolume(+data_.timestamp, data_.pairHourData);
      const { totalFees24h, lpFees24h, lpApr24h } = getLpFeesAndApr(dailyVolumeUSD, +data_.volumeUSD);
      const final: PairData = {
        id: data_.id,
        name: data_.name,
        volumeUSD: +data_.volumeUSD,
        liquidity: +data_.reservedUSD,
        token0: {
          name: data_.token0.name,
          symbol: data_.token0.symbol,
          address: data_.token0.id,
          decimals: data_.token0.decimals,
          derivedUSD: +data_.token0.derivedUSD,
          totalLiquidity: +data_.token0.totalLiquidity,
        },
        token1: {
          name: data_.token1.name,
          symbol: data_.token1.symbol,
          address: data_.token1.id,
          decimals: +data_.token1.decimals,
          derivedUSD: +data_.token1.derivedUSD,
          totalLiquidity: +data_.token1.totalLiquidity,
        },
        dailyVolumeUSD,
        liquidityUSD: +data_.reserveUSD,
        liquidityUSDChange,
        totalFees24h,
        lpFees24h,
        lpApr24h,
      };

      return final;
    },
  });

  return useMemo(() => {
    return data;
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
    return ((valueNow - valueBefore) / valueBefore) * 100;
  }
  return 0;
};

interface HourlyData {
  hourlyVolumeUSD: number;
  reserveUSD: number;
  hourStartUnix: number;
}

const getLiquidityUSDChange = (current: number, hourData: HourlyData[]): number => {
  console.log(current,  hourData[hourData.length - 1].reserveUSD, "HHHHHHH")
  const percentChange =  getPercentChange(current, +hourData[hourData.length - 1].reserveUSD);
  console.log(percentChange, "HHHHHHH")
  return percentChange
};

const getDailyVolumeFromHourlVolume = (timestamp: number, hourData: HourlyData[]): number => {
  const _24hago = timestamp - 24 * 3600;
  hourData.length;
  const dailyVolumeUSD = hourData.reduce((acc, cur, index) => {
    if (cur.hourStartUnix >= _24hago) {
      acc += +cur.hourlyVolumeUSD;
    }
    return acc;
  }, 0);
  return dailyVolumeUSD;
};
