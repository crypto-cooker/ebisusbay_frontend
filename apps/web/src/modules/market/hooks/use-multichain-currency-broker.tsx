import {ciEquals, ciIncludes, isNativeCro} from '@market/helpers/utils';
import {useAppConfig} from "@src/config/hooks";
import {SupportedChainId} from "@src/config/chains";
import {SerializedToken} from "@pancakeswap/swap-sdk-core";
import { useSupportedApiTokens } from '@src/global/hooks/use-supported-tokens';
import { useMemo } from 'react';
import { ethers } from 'ethers';

export type MultichainBrokerCurrency = SerializedToken & {
  isToken: boolean;
  isNative: boolean;
}

type CollectionCurrencies = {
  [key: string]: string[];
}

const useMultichainCurrencyBroker = (chainId: SupportedChainId) => {
  const { config: appConfig } = useAppConfig();
  const supportedTokens = useSupportedApiTokens(chainId);


  const shimmedSupportedTokens = supportedTokens.map((token) => ({
    ...token,
    isNative: false,
    isToken: true,
    logoURI: token.logo
  }));

  // const nativeCurrency = useNativeCurrency(chainId);
  // const serializedNativeCurrency: MultichainBrokerCurrency = {
  //   chainId: nativeCurrency.chainId,
  //   address: ethers.constants.AddressZero,
  //   decimals: nativeCurrency.decimals,
  //   symbol: nativeCurrency.symbol,
  //   name: nativeCurrency.name,
  //   isNative: true,
  //   isToken: false
  // };
  const serializedNativeCurrency = useMemo(() => {
    const nativeToken = shimmedSupportedTokens.find((token) => token.address === ethers.constants.AddressZero)!;
    return  {
      ...nativeToken,
      isNative: true,
      isToken: false
    }
  }, [shimmedSupportedTokens]);

  const knownCurrencies = shimmedSupportedTokens;

  const listingCurrencies = knownCurrencies.filter((currency) => currency.marketDefault || currency.listings);

  const getBySymbol = (symbol: string) => {
    return knownCurrencies.find((currency) => ciEquals(currency.symbol, symbol));
  }

  const getByAddress = (address: string) => {
    return knownCurrencies.find((currency) => ciEquals(currency.address, address));
  }

  const isDealCurrency = (symbol: string) => {
    return !!knownCurrencies.find((currency) => ciEquals(symbol, currency.symbol) && currency.deals);
  }

  const getByCollection = (nftAddress: string) => {
    const chainCurrencies = appConfig.currencies?.[chainId];
    if (!chainCurrencies) return [];

    const nftCurrencies = chainCurrencies.marketplace.nft;

    const availableCurrencySymbols = Object.entries(nftCurrencies)
      .find(([key]) => ciEquals(key, nftAddress)) as CollectionCurrencies | undefined;

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