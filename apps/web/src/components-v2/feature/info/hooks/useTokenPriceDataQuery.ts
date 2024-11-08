import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChainIdByQuery } from './chain';
import { Info } from '@src/core/services/api-service/graph/subgraphs/info';
import { VolumeChartEntry } from '../state/types';

export const useTokenChartDataVolumeQuery = (address:string): VolumeChartEntry[]=> {
  const chainId: number = useChainIdByQuery();
  const info = useMemo(() => new Info(chainId), [chainId]);
  const { data } = useQuery({
    queryKey: ['useTokenChartDataVolumeQuery', chainId],
    queryFn: async () => {
      try {
        const response = await info.getTokenVolumeData(address);
        if (!response?.data?.overallDayDatas) {
          throw new Error('Failed to fetch data');
        }
        return response.data.overallDayDatas;
      } catch (error) {
        console.error('Error fetching data', error);
      }
    },
    select: (data_: any) => {
      if (!data_ || data_.length === 0) {
        throw new Error('No data');
      }

      const final: VolumeChartEntry[] = [];
      console.log({data_}, "chartData")

      for (const d of data_) {
        if (d.id == undefined) continue;
        final.push({
          date: +d.date,
          volumeUSD: +d.dailyVolumeUSD,
          liquidityUSD: +d.totalLiquidityUSD
        });
      }

      final.sort((a, b) => a.date - b.date)

      return final;
    },
  });

  return useMemo(() => {
    return data ?? [];
  }, [data, chainId]);
};
