import {useEffect, useState} from "react";
import Exchange from "@src/core/services/api-service/graph/subgraphs/exchange";
import {Pair} from "@src/core/services/api-service/graph/types";
import {Address} from "viem";

export const useGetPairs = (addresses: Address[]) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState<Pair[]>([]);
  const exchange = new Exchange();

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
  }, [addresses]); // Dependency array ensures this effect runs only when addresses change

  return { loading, error, data };
};