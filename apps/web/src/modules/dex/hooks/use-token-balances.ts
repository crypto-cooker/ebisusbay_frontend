import useSupportedTokens from '@dex/hooks/use-supported-tokens';
import { useUser } from '@src/components-v2/useUser';
import { Address, ContractFunctionParameters, erc20Abi } from 'viem';
import { useBlockNumber, useContractReads } from 'wagmi';
import { isAddress } from '@market/helpers/utils';
import { CurrencyAmount, Token } from '@pancakeswap/sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppChainConfig } from '@src/config/hooks';
import { multicall } from '@wagmi/core';
import { utils } from 'ethers';
import { wagmiConfig } from '@src/wagmi';

export const useTokenBalanceOnCertainChain = (
  tokenAddress: string,
  chainId: 338 | 388 | 25 | 282 | undefined,
  account: string,
): { balance: string; isLoading: boolean } => {
  const { config } = useAppChainConfig(chainId);
  const [balance, setBalance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const execute = useCallback(async () => {
    setIsLoading(true);
    try {
      const [balance, decimals] = await multicall(wagmiConfig, {
        chainId,
        contracts: [
          {
            abi: erc20Abi,
            address: tokenAddress as Address,
            functionName: 'balanceOf',
            args: [account as Address],
          },
          {
            abi: erc20Abi,
            address: tokenAddress as Address,
            functionName: 'decimals',
            args: [],
          },
        ],
      });
      let formattedBalance;
      if (!balance.error) formattedBalance = utils.formatUnits(balance.result, decimals.result);
      if (formattedBalance) setBalance(formattedBalance);
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

export function useAllTokenBalances(): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  const user = useUser();
  const { supportedTokens } = useSupportedTokens();
  // const [balances, setBalances] = useState<Array<CurrencyAmount<Token>>>(supportedTokens.map(token => CurrencyAmount.fromRawAmount(token, 0)));

  // // We use useMemo to cache the fetchBalances function, ensuring it only changes if dependencies change
  // const fetchBalances = useMemo(() => {
  //   return async () => {
  //     if (!user.address) {
  //       setBalances(supportedTokens.map(token => CurrencyAmount.fromRawAmount(token, 0)));
  //       return;
  //     }
  //     const newBalances = await getTokenBalances(user.address, supportedTokens);
  //     setBalances(newBalances);
  //   };
  // }, [user.address]);
  //
  // useEffect(() => {
  //   fetchBalances(); // Call the memoized function
  // }, [fetchBalances]); // Effect runs only when fetchBalances changes

  // const allTokensArray = useMemo(() => Object.values(supportedTokens ?? {}), [supportedTokens]);
  const balances = useTokenBalances(user.address ?? undefined, supportedTokens);
  return balances ?? {};

  // return balances;
}

// This will be replaced with subgraph call
export function useTokenBalances(
  address?: string,
  tokens?: Token[],
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  // const [value, setValue] = useState<CurrencyAmount<Token>[]>([]);
  if (!address || !tokens) return {};
  const { data: blockNumber } = useBlockNumber();

  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens],
  );

  const contracts: ContractFunctionParameters[] = tokens.map((token: any) => {
    return {
      address: token.address as Address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    };
  });

  // const fetchBalances = useMemo(
  //   () =>
  //     address && validatedTokens.length > 0
  //       ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, token, i) => {
  //         const value = data?.[i]?.result as any;
  //         const amount = value ? JSBI.BigInt(value.toString()) : undefined;
  //         if (amount) {
  //           memo[token.address] = CurrencyAmount.fromRawAmount(token, amount);
  //         }
  //         return memo;
  //       }, {})
  //       : {},
  //   [address, validatedTokens, data]
  // );

  // const {data, isLoading} = useQuery({
  //   queryKey: ['useTokenBalances'],
  //   queryFn: async () => multicall(wagmiConfig as any, {
  //     contracts
  //   }),
  //   enabled: !!contracts
  // });

  const {
    data,
    isLoading: anyLoading,
    error,
  } = useContractReads({
    contracts,
  });

  return useMemo(
    () =>
      address && validatedTokens.length > 0
        ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, token, i) => {
            const value = data?.[i]?.result as any;
            const amount = value ? BigInt(value.toString()) : undefined;
            if (amount) {
              memo[token.address] = CurrencyAmount.fromRawAmount(token, amount);
            }
            return memo;
          }, {})
        : {},
    [address, validatedTokens, data],
  );

  // useEffect(() => {
  //   async function fetch() {
  //     const data = await multicall({
  //       contracts
  //     });
  //
  //     const asdf = address && validatedTokens.length > 0
  //         ? validatedTokens.reduce<CurrencyAmount<Token>[]>((acc, token, i) => {
  //           const value = data?.[i]?.result as any;
  //           const amount = value ? JSBI.BigInt(value.toString()) : undefined;
  //           if (amount) {
  //             acc.push(CurrencyAmount.fromRawAmount(token, amount));
  //           }
  //           return acc;
  //         }, [])
  //         : [];
  //     setValue(asdf);
  //   }
  //   fetch();
  // }, [address, validatedTokens, blockNumber]);
  //
  // return value;

  // return [
  //   useMemo(
  //     () =>
  //       address && validatedTokens.length > 0
  //         ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, token, i) => {
  //           const value = data?.[i]?.result as any;
  //           const amount = value ? JSBI.BigInt(value.toString()) : undefined;
  //           if (amount) {
  //             memo[token.address] = CurrencyAmount.fromRawAmount(token, amount);
  //           }
  //           return memo;
  //         }, {})
  //         : {},
  //     [address, validatedTokens, data]
  //   )
  // ];
}
