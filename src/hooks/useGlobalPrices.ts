import {useQuery} from "@tanstack/react-query";
import {getPrice, getPrices, PriceProps} from "@src/core/api/endpoints/prices";
import {appConfig} from "@src/Config";
import {useContext, useEffect, useState} from "react";
import {ciEquals} from "@src/utils";
import {ExchangePricesContext, ExchangePricesContextProps} from "@src/components-v2/shared/contexts/exchange-prices";
import {ethers} from "ethers";

const config = appConfig();

export const useGlobalPrices = () => {
  return useQuery(['GlobalPrices'], getPrices, {
    staleTime: 2,
    initialData: []
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

export const useExchangeRate = (token: string, chainId: number = 25) => {
  const [price, setPrice] = useState<PriceProps>();
  const [usdRate, setUsdRate] = useState(0);
  const [croRate, setCroRate] = useState(0);
  const globalPrices = useContext(ExchangePricesContext) as ExchangePricesContextProps;

  useEffect(() => {
    const safeToken = token || ethers.constants.AddressZero;
    const price = globalPrices.prices.find((p) => ciEquals(p.currency, safeToken) && Number(p.chain) === Number(chainId));
    const nativePrice = globalPrices.prices.find((p) => ciEquals(p.currency, ethers.constants.AddressZero) && Number(p.chain) === 25);

    if (price) {
      setPrice(price);
      setUsdRate(Number(price.usdPrice));
      if (nativePrice) setCroRate(Number(nativePrice.usdPrice) / Number(price.usdPrice));
    } else {
      setPrice({usdPrice: '0', chain: chainId, currency: safeToken});
      setUsdRate(0);
      setCroRate(0);
    }
  }, [globalPrices, token, chainId]);

  return {price, usdRate, croRate}
}