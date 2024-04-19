import useSupportedTokens from "@dex/hooks/use-supported-tokens";
import {useUser} from "@src/components-v2/useUser";
import {DexToken, DexTokenBalance} from "@dex/types";
import {multicall} from "@wagmi/core";
import {ContractFunctionConfig} from "viem";
import {Address, erc20ABI} from "wagmi";
import {useEffect, useMemo, useState} from "react";

export function useAllTokenBalances(): Array<DexTokenBalance> {
  const user = useUser();
  const { supportedTokens } = useSupportedTokens();
  const [balances, setBalances] = useState<Array<DexTokenBalance>>(supportedTokens.map(token => ({...token, balance: BigInt(0)})));

  // We use useMemo to cache the fetchBalances function, ensuring it only changes if dependencies change
  const fetchBalances = useMemo(() => {
    return async () => {
      if (!user.address) {
        setBalances(supportedTokens.map(token => ({...token, balance: BigInt(0)})));
        return;
      }
      const newBalances = await getTokenBalances(user.address, supportedTokens);
      setBalances(newBalances);
    };
  }, [user.address]);

  useEffect(() => {
    fetchBalances(); // Call the memoized function
  }, [fetchBalances]); // Effect runs only when fetchBalances changes

  return balances;
}


export async function getTokenBalances(address: string, tokens: DexToken[]) {

  const contracts: ContractFunctionConfig[] = tokens.map((token: any) => {
    return {
      address: token.address as Address,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [address],
    };
  });


  const data = await multicall({
    contracts
  });

  return tokens.map((token, i) => {
    const call = data[i];
    return {
      ...token,
      balance: call?.status === 'success' ? call.result as bigint : BigInt(0)
    };
  });
}