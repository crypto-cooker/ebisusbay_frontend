import {useQuery} from "@tanstack/react-query";
import {getPrices, getPrice} from "@src/core/api/endpoints/prices";

export const useGlobalPrices = () => {
  return useQuery(['GlobalPrices'], getPrices, {
    staleTime: 2
  })
};

export const useGlobalPrice = (chainId: number | string) => {
  return useQuery(['GlobalPrice', chainId], () => getPrice(Number(chainId)), {
    staleTime: 2
  })
};
