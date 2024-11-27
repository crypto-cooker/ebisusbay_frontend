import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useChainIdByQuery } from './chain';
import { Info } from '@src/core/services/api-service/graph/subgraphs/info';
import { Transaction, TransactionType } from '../state/types';

export const useTokenTransactionsQuery = (address:string): Transaction[] | undefined=> {
  const chainId: number = useChainIdByQuery();
  const info = useMemo(() => new Info(chainId), [chainId, address]);
  const { data } = useQuery({
    queryKey: ['useTransactionData', chainId, address],
    queryFn: async () => {
      try {
        const response = await info.getTransactionsForToken(address);
        if (!response?.data?.transactions) {
          throw new Error('Failed to fetch data');
        }
        return response.data.transactions;
      } catch (error) {
        console.error('Error fetching data', error);
      }
    },
    select: (data_: any) => {
      if (!data_ || data_.length === 0) {
        throw new Error('No data');
      }

      const final: Transaction[] = [];

      const types = ['swaps', 'mints', 'burns'];
      for (const d of data_) {
        for(const t of types) {
          const transactions = d[t];
          transactions.map((transaction:any) => {
            final.push({
              type: types.indexOf(t),
              hash: d.id,
              timestamp: d.timestamp,
              sender: transaction.sender,
              token0Symbol: transaction.token0?.symbol,
              token1Symbol: transaction.token1?.symbol,
              token0Address: transaction.token0?.id,
              token1Address: transaction.token1?.id,
              amountUSD: +transaction.amountUSD,
              amountToken0: t == 'swaps' ? +transaction.amount0Out ? +transaction.amount0Out : +transaction.amount0In :  +transaction.amount0,
              amountToken1: t == 'swaps' ? +transaction.amount1Out ? +transaction.amount1Out : +transaction.amount1In :  +transaction.amount1
            })
          })
        }
      }

      return final;
    },
  });

  return useMemo(() => {
    return data ?? undefined;
  }, [data, chainId]);
};

