import { useMemo } from 'react';
import { useAllPairDataQuery } from './useAllPairDataQuery';
import { useAllTokenDataQuery } from './useAllTokenDataQuery';
import { usePairsForTokenDataQuery } from './usePairsForTokenDataQuery';

export const useTokenDatas = () => {
  // get all the token datas that exist
  const {data: allTokenData, isLoading } = useAllTokenDataQuery();

  // get all the pair datas that exist
  const tokenDatas = useMemo(() => {
    return Object.values(allTokenData)
      .map((token) => {
        return {
          ...token.data,
        };
      })
      .filter((token) => token.name !== 'unknown');
  }, [allTokenData]);
  return { tokenDatas, isLoading };
};



export const usePairDatas = () => {
  // get all the pair datas that exist
  const allPairData = useAllPairDataQuery();

  // get all the pair datas that exist
  const pairDatas = useMemo(() => {
    return Object.values(allPairData)
      .map((pair) => {
        return {
          ...pair.data,
        };
      })
      .filter((pair) => pair.token1.name !== 'unknown' && pair.token0.name !== 'unknown');
  }, [allPairData]);
  return { pairDatas };
};

export const usePairDatasForToken = (address:string) => {
  // get all the pair datas that exist
  const allPairData = usePairsForTokenDataQuery(address);

  // get all the pair datas that exist
  const pairDatas = useMemo(() => {
    return Object.values(allPairData)
      .map((pair) => {
        return {
          ...pair.data,
        };
      })
      .filter((pair) => pair.token1.name !== 'unknown' && pair.token0.name !== 'unknown');
  }, [allPairData]);
  return { pairDatas };
};
