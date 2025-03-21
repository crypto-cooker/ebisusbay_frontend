import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChainIdByQuery } from './chain';
import { Info } from '@src/core/services/api-service/graph/subgraphs/info';
import { ProtocolData } from '../state/types';

export const useProtocolDataQuery = () :ProtocolData | undefined => {
  const chainId: number = useChainIdByQuery();
  const info = useMemo(() => new Info(chainId), [chainId]);
  const { data } = useQuery({
    queryKey: ['useProtocolData', chainId],
    queryFn: async () => {
      try {
        const response = await info.getProtocolData();

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

      const final: ProtocolData = {
        volumeUSD: +data_[0].dailyVolumeUSD,
        volumeUSDChange: +data_[0].dailyVolumeUntracked - +data_[1].dailyVolumeUntracked,
        liquidityUSD: +data_[0].totalLiquidityUSD,
        liquidityUSDChange: +data_[0].totalLiquidityUSD - +data_[1].totalLiquidityUSD,
        txCount: +data_[0].totalTransactions,
        txCountChange: +data_[0].totalTransactions - +data_[1].totalTransactions,
      };

      return final;
    },
  });

  return useMemo(() => {
    return data;
  }, [data, chainId]);
};