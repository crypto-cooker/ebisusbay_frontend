import { useEffect, useMemo, useState } from 'react';
import { getTokenBalanceOnCertainChain } from '../utils/getTokenBalanceOnCertainChain';
import { useAppChainConfig } from '@src/config/hooks';

const useTokenBalanceOnCertainChain = (tokenAddress: string, chainId: number, account: string): string => {

  const {config} = useAppChainConfig(chainId);

  const rpcUrl = config.chain.rpcUrls.default.http[0];

  const [balance, setBalance] = useState('');
  useEffect(() => {
    const main = async () => {
      const balance = await getTokenBalanceOnCertainChain(tokenAddress, rpcUrl, account);
      if (balance) setBalance(balance);
      else setBalance('');
    };
    main();
  }, [tokenAddress, chainId, account]);
  return balance;
};

export default useTokenBalanceOnCertainChain;
