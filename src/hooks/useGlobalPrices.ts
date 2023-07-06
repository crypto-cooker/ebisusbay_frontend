import {useQuery} from "@tanstack/react-query";
import {getPrices, getPrice} from "@src/core/api/endpoints/prices";
import {appConfig} from "@src/Config";

const config = appConfig();

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

export const useFortunePrice = (chainId?: number | string) => {
  const address = config.contracts.fortune;
  return useQuery(['GlobalPrice', chainId, address], () => getPrice(Number(chainId), address), {
    staleTime: 2
  })
};
