import {useEffect, useMemo, useState} from "react";
import Exchange from "@src/core/services/api-service/graph/subgraphs/exchange";
import {Pair} from "@src/core/services/api-service/graph/types";
import {Address} from "viem";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";

export const useGetPairs = (addresses: Address[]) => {
  const { chainId } = useActiveChainId();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState<Pair[]>([]);
  const exchange = useMemo(() => new Exchange(chainId), [chainId]);

  useEffect(() => {
    setLoading(true);
    exchange.getPairs(addresses)
      .then(response => {
        setData(response.data.pairs);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [addresses]);

  return { loading, error, data };
};