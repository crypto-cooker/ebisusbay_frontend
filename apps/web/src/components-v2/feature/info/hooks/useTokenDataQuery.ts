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

      let final: TokenData = {
        id: data_.id,
        name: data_.name,
        symbol: data_.symbol,
        priceUSD: +data_.derivedUSD,
        decimals: +data_.decimals,
        totalLiquidity: +data_.totalLiquidity,
        tradeVolume:+ data_.tradeVolume,
        tradeVolumeUSD: +data_.tradeVolumeUSD,
        totalLiquidityUSD: 0,
        volume24h: 0,
        volumeUSD24h: 0,
        priceUSD24h: 0,
        totalLiquidity24h: 0,
        priceChange: 0,
        txCount: 0,
      }
      if (data_.tokenDayData[0]) {
        final = {
          ...final,
          totalLiquidityUSD: +data_.tokenDayData[0].totalLiquidityUSD,
          volume24h: +data_.tokenDayData[0].dailyVolumeToken0,
          volumeUSD24h: +data_.tokenDayData[0].dailyVolumeUSD / +data_.tradeVolumeUSD * 100,
          priceUSD24h: +data_.tokenDayData[0].priceUSD,
          priceChange: +data_.derivedUSD - +data_.tokenDayData[0].priceUSD,
          txCount: +data_.tokenDayData[0].dailyTxns,
        };
      }
      if (data_.tokenDayData[0] && data_.tokenDayData[1]) {
        final = {
          ...final,
          totalLiquidity24h: (+data_.tokenDayData[0].totalLiquidityUSD - +data_.tokenDayData[1].totalLiquidityUSD) / +data_.tokenDayData[1].totalLiquidityUSD * 100,
        }
      }

      return final;
    },
  });

  return useMemo(() => {
    return data;
  }, [data, chainId]);
};
