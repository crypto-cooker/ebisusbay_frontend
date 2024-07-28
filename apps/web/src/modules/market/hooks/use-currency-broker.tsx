import { appConfig } from '@src/config';
import DynamicCurrencyIcon from '@src/components-v2/shared/dynamic-currency-icon';
import { ethers } from 'ethers';
import { ciEquals, ciIncludes, isNativeCro } from '@market/helpers/utils';

export type BrokerCurrency = {
  address: string;
  symbol: string;
  name: string;
  image: any;
  decimals: number;
}

const config = appConfig();

type ConfigCurrency = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
}

type CollectionCurrencies = {
  [key: string]: string[];
}

const configCurrencies = Object.values(config.tokens) as ConfigCurrency[];
const nativeCurrency: BrokerCurrency = {
  name: 'CRO',
  symbol: 'CRO',
  address: ethers.constants.AddressZero,
  image: <DynamicCurrencyIcon address={ethers.constants.AddressZero} boxSize={6} />,
  decimals: 18
}
const knownCurrencies: BrokerCurrency[] = [
  nativeCurrency,
  ...configCurrencies.map((token) => {
    return {
      ...token,
      image: <DynamicCurrencyIcon address={token.address} boxSize={6} />
    }
  }),
]

const UseCurrencyBroker = () => {
  const getBySymbol = (symbol: string) => {
    return knownCurrencies.find((currency: BrokerCurrency) => ciEquals(currency.symbol, symbol));
  }

  const getByAddress = (address: string) => {
    return knownCurrencies.find((currency: BrokerCurrency) => ciEquals(currency.address, address));
  }

  const isDealCurrency = (symbol: string) => {
    return config.deals.currencies.includes(symbol.toLowerCase());
  }

  const getByCollection = (nftAddress: string) => {
    const availableCurrencySymbols = Object.entries(config.listings.currencies.nft)
      .find(([key]) => ciEquals(key, nftAddress)) as CollectionCurrencies | undefined;

    return listingCurrencies.filter(({symbol}: { symbol: string }) => {
      if (availableCurrencySymbols) {
        return availableCurrencySymbols[1].includes(symbol.toLowerCase());
      } else {
        return config.listings.currencies.global.includes(symbol.toLowerCase())
      }
    });
  }

  const listingCurrencies = knownCurrencies.filter((currency: BrokerCurrency) => ciIncludes(config.listings.currencies.available, currency.symbol));

  return {
    knownCurrencies,
    whitelistedDealCurrencies: knownCurrencies.filter((currency: BrokerCurrency) => isDealCurrency(currency.symbol)),
    whitelistedERC20DealCurrencies: knownCurrencies.filter((currency: BrokerCurrency) => isDealCurrency(currency.symbol) && !isNativeCro(currency.address)),
    listingCurrencies,
    getBySymbol,
    getByAddress,
    getByCollection,
    nativeCurrency
  }
}

export default UseCurrencyBroker;