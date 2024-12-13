import {useQuery} from "@tanstack/react-query";
import {getPrice, getPrices, PriceProps} from "@src/core/api/endpoints/prices";
import {appConfig} from "@src/config";
import { useContext, useEffect, useMemo, useState } from 'react';
import {ciEquals} from "@market/helpers/utils";
import {ExchangePricesContext, ExchangePricesContextProps} from "@src/components-v2/shared/contexts/exchange-prices";
import {ethers} from "ethers";
import { Info } from '@src/core/services/api-service/graph/subgraphs/info';

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
  const globalPrices = useContext(ExchangePricesContext) as ExchangePricesContextProps;

  const info = useMemo(() => new Info(chainId), [chainId, token]);
  const fetchTokenPrice = async () => {
    try {
      const nativePrice = globalPrices.prices.find((p) => ciEquals(p.currency, ethers.constants.AddressZero) && Number(p.chain) === Number(chainId))!;

      if (token === ethers.constants.AddressZero)  {
        return {
          usd: Number(nativePrice.usdPrice),
          cro: 1
        }
      }

      const subgraphToken = await info.getTokenData(token);

      if (!subgraphToken?.data?.token) {
        throw new Error('Failed to fetch data');
      }

      let cro = subgraphToken.data.token.derivedCRO;
      let derivedUSD = Number(subgraphToken.data.token.derivedUSD);
      if (!cro) {
        cro = derivedUSD/ Number(nativePrice.usdPrice)
      }

      return {
        usd: derivedUSD,
        cro: cro
      };
    } catch (error) {
      console.error('Error fetching data', error);

      return {
        usd: 0,
        cro: 0,
      };
    }
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ['useTokenData', chainId, token],
    queryFn: fetchTokenPrice,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!chainId && !!token
  });


  const usdRate = data?.usd ?? 0;
  const croRate = data?.cro ?? 0;

  const usdInverseRate = useMemo(() => (usdRate ? 1 / usdRate : 0), [usdRate]);
  const croInverseRate = useMemo(() => (croRate ? 1 / croRate : 0), [croRate]);

  /**
   * Calculates total USD and CRO values based on the provided token quantity.
   *
   * @param quantity - The number of tokens.
   * @returns An object containing total USD and CRO values.
   */
  const calculateValuesFromToken = (quantity: number) => {
    const totalUSD = usdRate * quantity;
    const totalCRO = croRate * quantity;

    return {
      totalUSD,
      totalCRO,
    };
  };

  /**
   * Calculates the number of tokens and total USD value based on the provided CRO quantity.
   *
   * @param quantity - The amount in CRO.
   * @returns An object containing total tokens and total USD value.
   */
  const calculateValuesFromCro = (quantity: number) => {
    if (!croRate) return { totalTokens: 0, totalUSD: 0};

    const totalTokens = quantity / croRate;
    const totalUSD = usdRate * totalTokens;

    return {
      totalTokens,
      totalUSD,
    };
  };

  return {
    tokenUsdRate: usdRate,
    tokenCroRate: croRate,
    usdInverseRate,
    croInverseRate,
    calculateValuesFromToken,
    calculateValuesFromCro,
    isLoading,
    error,
  };
}