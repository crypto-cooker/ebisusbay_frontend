import {appConfig} from "@src/Config";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";
import {ethers} from "ethers";
import {ciEquals, isNativeCro} from "@src/utils";
import React from "react";

export type BrokerCurrency = {
  address: string;
  symbol: string;
  name: string;
  image: string;
  decimals: number;
}

type ConfigCurrency = {
  [key: string]: string[];
}

const config = appConfig();
const currencyOptions: BrokerCurrency[] = [
  {
    name: 'CRO',
    symbol: 'cro',
    address: ethers.constants.AddressZero,
    image: <DynamicCurrencyIcon address={ethers.constants.AddressZero} boxSize={6} />
  },
  ...config.listings.currencies.available
    .filter((symbol: string) => !!config.tokens[symbol.toLowerCase()])
    .map((symbol: string) => {
      const token = config.tokens[symbol.toLowerCase()];
      return {
        ...token,
        image: <DynamicCurrencyIcon address={token.address} boxSize={6} />
      }
    }),
];

const UseCurrencyBroker = (nftAddress?: string) => {
  const availableCurrencySymbols: ConfigCurrency | undefined = Object.entries(config.listings.currencies.nft)
    .find(([key]) => ciEquals(key, nftAddress)) as ConfigCurrency | undefined;

  const allowedCurrencies = currencyOptions.filter(({symbol}: { symbol: string }) => {
    if (availableCurrencySymbols) {
      return availableCurrencySymbols[1].includes(symbol.toLowerCase());
    } else {
      return config.listings.currencies.global.includes(symbol.toLowerCase())
    }
  });

  const getBySymbol = (symbol: string) => {
    return currencyOptions.find((currency: BrokerCurrency) => ciEquals(currency.symbol, symbol));
  }

  const getByAddress = (address: string) => {
    return currencyOptions.find((currency: BrokerCurrency) => ciEquals(currency.address, address));
  }

  return {
    allowedCurrencies,
    allCurrencies: currencyOptions,
    allERC20Currencies: currencyOptions.filter(({address}: { address: string }) => !isNativeCro(address)),
    getBySymbol,
    getByAddress
  }
}

export default UseCurrencyBroker;