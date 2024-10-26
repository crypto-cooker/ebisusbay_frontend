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
    queryKey: ['useGetTokens', chainId],
    queryFn: async () => {
      try{
      const response = await info.getTokens();
      if (!response?.data?.tokens) {
        throw new Error('Failed to fetch pairs data');
      }
      return response.data.tokens;
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
          data: TokenData;
        };
      } = {};
      for (const d of data_) {
        final[d.id] = {
          data: {
            id: d.id,
            name: d.name,
            symbol: d.symbol,
            priceUSD: +d.derivedUSD,
            decimals: +d.decimals,
            totalLiquidity:+ d.totalLiquidity,
            totalLiquidityUSD: d.totalLiquidity * d.derivedUSD,
            tradeVolumeUSD: +d.tradeVolumeUSD,
            tradeVolume: +d.tradeVolume,
            volume24h: +d?.tokenDayData[0]?.dailyVolumeToken,
            volumeUSD24h: +d?.tokenDayData[0]?.dailyVolumeUSD,
            priceUSD24h: +d?.tokenDayData[0]?.priceUSD,
            totalLiquidity24h: +d.tokenDayData[0]?.totalLiquidityToken,
            priceChange: getPercentChange(+d.derivedUSD, +d?.tokenDayData[0]?.priceUSD)
          },
        };
      }
      console.log(final,  "DFADFASDF")
  
      return final;
    },
  });
  
  return useMemo(() => {
    return data ?? {};
  }, [data, chainId]);
};


const getPercentChange = (valueNow?: number, valueBefore?: number): number => {
  if (valueNow && valueBefore) {
    return ((valueNow - valueBefore) / valueBefore) * 100
  }
  return 0
}