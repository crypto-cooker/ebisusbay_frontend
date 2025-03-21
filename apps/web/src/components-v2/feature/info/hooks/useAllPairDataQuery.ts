import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChainIdByQuery } from './chain';
import chainConfigs from '@src/config/chains';
import { Info } from '@src/core/services/api-service/graph/subgraphs/info';
import { PairData } from '../state/types';
import { LP_HOLDERS_FEE, TOTAL_FEE, DAYS_IN_YEAR } from '../state/constants';

export const useAllPairDataQuery = () => {
  const chainId: number = useChainIdByQuery();
  const info = useMemo(() => new Info(chainId), [chainId]);
  const { data } = useQuery({
    queryKey: ['useGetPairs', chainId],
    queryFn: async () => {
      try{
      const response = await info.getPairs();
      if (!response?.data?.pairs) {
        throw new Error('Failed to fetch pairs data');
      }
      return response.data.pairs;
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
        const dailyVolumeUSD = getDailyVolumeFromHourlVolume(+d.timestamp, d.pairHourData)
        const { totalFees24h, lpFees24h, lpApr24h } = getLpFeesAndApr(dailyVolumeUSD, +d.volumeUSD);
        final[d.id] = {
          data: {
            id: d.id,
            name: d.name,
            volumeUSD: +d.volumeUSD,
            liquidity: +d.reservedUSD,
            token0: {
              name: d.token0.name,
              symbol: d.token0.symbol,
              address: d.token0.id,
              decimals: d.token0.decimals,
              derivedUSD: +d.token0.derivedUSD,
              totalLiquidity: +d.token0.totalLiquidity,
            },
            token1: {
              name: d.token1.name,
              symbol: d.token1.symbol,
              address: d.token1.id,
              decimals: +d.token1.decimals,
              derivedUSD: +d.token1.derivedUSD,
              totalLiquidity: +d.token1.totalLiquidity,
            },
            dailyVolumeUSD,
            liquidityUSD: +d.reserveUSD,
            liquidityUSDChange: 0,
            totalFees24h,
            lpFees24h,
            lpApr24h,
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

interface HourlyData {
  hourlyVolumeUSD: string, hourStartUnix:number
}

const getDailyVolumeFromHourlVolume = (timestamp:number, hourData: HourlyData[]):number => {
  const _24hago = timestamp - 24 * 3600;
  const dailyVolumeUSD = hourData.reduce((acc, cur, index) => {
    if(cur.hourStartUnix >= _24hago){
      acc += +cur.hourlyVolumeUSD;
    }
    return acc
  }, 0);
  return dailyVolumeUSD;
}
