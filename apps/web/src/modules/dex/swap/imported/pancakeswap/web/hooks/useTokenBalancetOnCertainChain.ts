import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTokenBalanceOnCertainChain } from '../utils/getTokenBalanceOnCertainChain';
import { useAppChainConfig } from '@src/config/hooks';

const useTokenBalanceOnCertainChain = (
  tokenAddress: string,
  chainId: number,
  account: string,
): { balance: string; isLoading: boolean } => {
  const { config } = useAppChainConfig(chainId);
  const [balance, setBalance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const execute = useCallback(async () => {
    const rpcUrl = config.chain.rpcUrls.default.http[0];
    setIsLoading(true);
    try {
      const balance = await getTokenBalanceOnCertainChain(tokenAddress, rpcUrl, account);
      if (balance) setBalance(balance);
      else setBalance('');
    } catch (error) {
      console.log(error);
      setBalance('');
    } finally {
      setIsLoading(false);
    }
  }, [config, tokenAddress, chainId, account]);
  useEffect(() => {
    execute();
  }, [execute]);
  return { balance, isLoading };
};

export default useTokenBalanceOnCertainChain;
