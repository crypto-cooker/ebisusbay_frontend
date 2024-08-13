import {ciEquals, ciIncludes, isNativeCro} from '@market/helpers/utils';
import {supportedTokens} from "@src/config/tokens";
import {useAppConfig} from "@src/config/hooks";
import useNativeCurrency from "@eb-pancakeswap-web/hooks/useNativeCurrency";
import {SupportedChainId} from "@src/config/chains";
import {ethers} from "ethers";
import {SerializedToken} from "@pancakeswap/swap-sdk-core";

export type MultichainBrokerCurrency = SerializedToken & {
  isToken: boolean;
  isNative: boolean;
}

type CollectionCurrencies = {
  [key: string]: string[];
}

const useMultichainCurrencyBroker = (chainId: SupportedChainId) => {
  const { config: appConfig } = useAppConfig();

  const nativeCurrency = useNativeCurrency(chainId);
  const serializedNativeCurrency: MultichainBrokerCurrency = {
    chainId: nativeCurrency.chainId,
    address: ethers.constants.AddressZero,
    decimals: nativeCurrency.decimals,
    symbol: nativeCurrency.symbol,
    name: nativeCurrency.name,
    isNative: true,
    isToken: false
  };

  const knownCurrencies = [
    serializedNativeCurrency,
    ...Object.values(supportedTokens[chainId]).map((token) => ({...token.serialize, isToken: true, isNative: false}))
  ];

  const listingCurrencies = knownCurrencies.filter((currency) => ciIncludes(appConfig.currencies?.[chainId]?.marketplace.available, currency.symbol));


  const getBySymbol = (symbol: string) => {
    return knownCurrencies.find((currency) => ciEquals(currency.symbol, symbol));
  }

  const getByAddress = (address: string) => {
    return knownCurrencies.find((currency) => ciEquals(currency.address, address));
  }

  const isDealCurrency = (symbol: string) => {
    return appConfig.currencies?.[chainId]?.deals.includes(symbol.toLowerCase());
  }

  const getByCollection = (nftAddress: string) => {
    const chainCurrencies = appConfig.currencies?.[chainId];
    if (!chainCurrencies) return [];

    const nftCurrencies = chainCurrencies.marketplace.nft;

    const availableCurrencySymbols = Object.entries(nftCurrencies)
      .find(([key]) => ciEquals(key, nftAddress)) as CollectionCurrencies | undefined;

    console.log('GETBYCOLLECTION', listingCurrencies, chainCurrencies, availableCurrencySymbols, appConfig)
    return listingCurrencies.filter(({symbol}: { symbol: string }) => {
      if (availableCurrencySymbols) {
        return availableCurrencySymbols[1].includes(symbol.toLowerCase());
      } else {
        return appConfig.currencies?.[chainId]?.global.includes(symbol.toLowerCase())
      }
    });
  }


  return {
    knownCurrencies,
    whitelistedDealCurrencies: knownCurrencies.filter((currency) => isDealCurrency(currency.symbol)),
    whitelistedERC20DealCurrencies: knownCurrencies.filter((currency) => isDealCurrency(currency.symbol) && !isNativeCro(currency.address)),
    listingCurrencies,
    getBySymbol,
    getByAddress,
    getByCollection,
    nativeCurrency: serializedNativeCurrency
  }
}

export default useMultichainCurrencyBroker;