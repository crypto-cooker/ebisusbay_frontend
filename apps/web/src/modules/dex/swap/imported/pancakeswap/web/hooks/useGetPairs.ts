import {useEffect, useMemo, useState} from "react";
import Exchange from "@src/core/services/api-service/graph/subgraphs/exchange";
import {Pair} from "@src/core/services/api-service/graph/types";
import {Address} from "viem";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useQuery} from "@tanstack/react-query";

export const useGetPairs = (addresses: Address[]) => {
  const { chainId } = useActiveChainId();
  const exchange = useMemo(() => new Exchange(chainId), [chainId]);

  return useQuery({
    queryKey: ['useGetPairs', addresses],
    queryFn: async () => {
      const response = await exchange.getPairs(addresses);
      return response.data.pairs;
    }
  })
};