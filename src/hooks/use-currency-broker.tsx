import {appConfig} from "@src/Config";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";
import {ethers} from "ethers";
import {ciEquals, isNativeCro} from "@src/utils";

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

const configCurrencies = Object.values(config.tokens) as ConfigCurrency[];
const knownCurrencies: BrokerCurrency[] = [
  {
    name: 'CRO',
    symbol: 'cro',
    address: ethers.constants.AddressZero,
    image: <DynamicCurrencyIcon address={ethers.constants.AddressZero} boxSize={6} />,
    decimals: 18
  },
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

  return {
    knownCurrencies,
    whitelistedDealCurrencies: knownCurrencies.filter((currency: BrokerCurrency) => isDealCurrency(currency.symbol)),
    whitelistedERC20DealCurrencies: knownCurrencies.filter((currency: BrokerCurrency) => isDealCurrency(currency.symbol) && !isNativeCro(currency.address)),
    getBySymbol,
    getByAddress,
  }
}

export default UseCurrencyBroker;