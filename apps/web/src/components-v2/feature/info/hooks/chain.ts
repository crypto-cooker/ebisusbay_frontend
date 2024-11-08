import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { chainIdByChainPath } from '../state/constants';
import { ChainId } from '@pancakeswap/chains';

export const useChainIdByQuery = () => {
  const { query } = useRouter();
  const chainId: any = useMemo(() => {
    if (query.chainName && typeof query.chainName == 'string') return chainIdByChainPath(query.chainName);
    else return ChainId.CRONOS;
  }, [query]);

  return chainId;
};

export const useChainNameByQuery = () => {
  const { query } = useRouter();
  const { chainName } = query;
  return chainName;
};

export const useChainPathByQuery = () => {
  const { query } = useRouter();
  const { chainName } = query;
  return chainName ? `/${chainName}` : '';
};
