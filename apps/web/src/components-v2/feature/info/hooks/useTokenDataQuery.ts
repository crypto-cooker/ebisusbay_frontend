import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChainIdByQuery } from './chain';
import { Info } from '@src/core/services/api-service/graph/subgraphs/info';
import { Transaction, TokenData } from '../state/types';

export const useTokenDataQuery = (address: string): TokenData | undefined => {
  const chainId: number = useChainIdByQuery();
  const info = useMemo(() => new Info(chainId), [chainId, address]);
  const { data } = useQuery({
    queryKey: ['useTokenData', chainId, address],
    queryFn: async () => {
      try {
        const response = await info.getTokenData(address);
        if (!response?.data?.token) {
          throw new Error('Failed to fetch data');
        }

        return response.data.token;
      } catch (error) {
        console.error('Error fetching data', error);
      }
    },
    select: (data_: any) => {
      if (!data_ || data_.length === 0) {
        throw new Error('No data');
      }

      let final: TokenData;

      final = {
        id: data_.id,
        name: data_.name,
        symbol: data_.symbol,
        priceUSD: +data_.derivedUSD,
        decimals: +data_.decimals,
        totalLiquidity: +data_.totalLiquidity,
        totalLiquidityUSD: +data_.tokenDayData[0].totalLiquidityUSD,
        tradeVolume:+ data_.tradeVolume,
        tradeVolumeUSD: +data_.tradeVolumeUSD,
        volume24h: +data_.tokenDayData[0].dailyVolumeToken,
        volumeUSD24h: +data_.tokenDayData[0].dailyVolumeUSD / +data_.tradeVolumeUSD * 100,
        priceUSD24h: +data_.tokenDayData[0].priceUSD,
        totalLiquidity24h: (+data_.tokenDayData[0].totalLiquidityUSD - +data_.tokenDayData[1].totalLiquidityUSD) / +data_.tokenDayData[1].totalLiquidityUSD * 100,
        priceChange: +data_.derivedUSD - +data_.tokenDayData[0].priceUSD,
        txCount: +data_.tokenDayData[0].dailyTxns,
      };

      return final;
    },
  });

  return useMemo(() => {
    return data;
  }, [data, chainId]);
};
