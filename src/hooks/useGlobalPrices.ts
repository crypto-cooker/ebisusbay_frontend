import {useQuery} from "@tanstack/react-query";
import {getPrice, getPrices, PriceProps} from "@src/core/api/endpoints/prices";
import {appConfig} from "@src/Config";
import {useContext, useEffect, useState} from "react";
import {ciEquals} from "@src/utils";
import {ExchangePricesContext, ExchangePricesContextProps} from "@src/components-v2/shared/contexts/exchange-prices";
import {ethers} from "ethers";

const config = appConfig();

export const useGlobalPrices = () => {
  return useQuery({
    queryKey: ['GlobalPrices'],
    queryFn: getPrices,
    staleTime: 1000 * 60 * 2
  })
};

export const useGlobalPrice = (chainId: number | string) => {
  return useQuery({
    queryKey: ['GlobalPrice', chainId],
    queryFn: () => getPrice(Number(chainId)),
    staleTime: 1000 * 60 * 2
  })
};

export const useFortunePrice = (chainId?: number | string) => {
  const address = config.contracts.fortune;
  return useQuery({
    queryKey: ['GlobalPrice', chainId, address],
    queryFn: () => getPrice(Number(chainId), address),
    staleTime: 1000 * 60 * 2
  })
};

export const useExchangeRate = (chainId: number = 25) => {
  const [croPrice, setCroPrice] = useState<PriceProps>();
  const globalPrices = useContext(ExchangePricesContext) as ExchangePricesContextProps;

  useEffect(() => {
    const price = globalPrices.prices.find((p) => ciEquals(p.currency, ethers.constants.AddressZero) && Number(p.chain) === 25);
    if (price) {
      setCroPrice(price);
    }
  }, [globalPrices]);

  const usdRateForToken = (token: string) => {
    const safeToken = token || ethers.constants.AddressZero;
    const price = globalPrices.prices.find((p) => ciEquals(p.currency, safeToken) && Number(p.chain) === Number(chainId));

    return price ? Number(price.usdPrice) : 0;
  }

  const croRateForToken = (token: string) => {
    const safeToken = token || ethers.constants.AddressZero;
    const tokenPrice = globalPrices.prices.find((p) => ciEquals(p.currency, safeToken) && Number(p.chain) === Number(chainId));

    return tokenPrice && croPrice ? Number(croPrice.usdPrice) / Number(tokenPrice.usdPrice) : 0;
  }

  const tokenToCroRate = (token: string) => {
    const safeToken = token || ethers.constants.AddressZero;
    const tokenPrice = globalPrices.prices.find((p) => ciEquals(p.currency, safeToken) && Number(p.chain) === Number(chainId));

    return tokenPrice && croPrice ? Number(tokenPrice.usdPrice) / Number(croPrice.usdPrice) : 0;
  }

  const usdValueForToken = (value: number, token?: string) => {
    const rate = usdRateForToken(token ?? ethers.constants.AddressZero);
    return value * rate;
  }

  const croValueForToken = (value: number, token?: string) => {
    if (token === ethers.constants.AddressZero) return value;

    const rate = croRateForToken(token ?? ethers.constants.AddressZero);
    return value * rate;
  }

  const tokenToCroValue = (value: number, token?: string) => {
    if (token === ethers.constants.AddressZero) return value;

    const rate = tokenToCroRate(token ?? ethers.constants.AddressZero);
    return value * rate;
  }

  return {usdRateForToken, croRateForToken, usdValueForToken, croValueForToken, tokenToCroValue};
}

export const useTokenExchangeRate = (token: string, chainId: number = 25) => {
  const [tokenPrice, setTokenPrice] = useState<PriceProps>();
  const [tokenUsdRate, setTokenUsdRate] = useState(0);
  const [tokenToCroRate, setTokenToCroRate] = useState(0);
  const [croToTokenRate, setCroToTokenRate] = useState(0);
  const globalPrices = useContext(ExchangePricesContext) as ExchangePricesContextProps;

  useEffect(() => {
    const safeToken = token || ethers.constants.AddressZero;
    const price = globalPrices.prices.find((p) => ciEquals(p.currency, safeToken) && Number(p.chain) === Number(chainId));
    const croPrice = globalPrices.prices.find((p) => ciEquals(p.currency, ethers.constants.AddressZero) && Number(p.chain) === 25);

    if (price) {
      setTokenPrice(price);
      setTokenUsdRate(Number(price.usdPrice));
      if (croPrice) {
        setTokenToCroRate(Number(price.usdPrice) / Number(croPrice.usdPrice));
        setCroToTokenRate(Number(croPrice.usdPrice) / Number(price.usdPrice));
      }
    } else {
      setTokenPrice({usdPrice: '0', chain: chainId, currency: safeToken});
      setTokenUsdRate(0);
      setTokenToCroRate(0);
    }
  }, [globalPrices, token, chainId]);

  const usdToTokenValue = (value: number) => (value ?? 1) / Number(tokenUsdRate);
  const tokenToUsdValue = (value: number) => (value ?? 1) * Number(tokenUsdRate);
  const croToTokenValue = (value: number) => (value ?? 1) * Number(croToTokenRate);
  const tokenToCroValue = (value: number) => (value ?? 1) * Number(tokenToCroRate);

  return {
    tokenPrice,
    tokenUsdRate,
    tokenToCroRate,
    croToTokenRate,
    usdToTokenValue,
    tokenToUsdValue,
    croToTokenValue,
    tokenToCroValue
  }
}