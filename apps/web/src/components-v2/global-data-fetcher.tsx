import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { atom, useSetAtom } from 'jotai';
import { ApiService } from "@src/core/services/api-service";
import fallbackTokens from '@dex/config/tokens.json';
import { appConfig as legacyAppConfig } from '@src/config';
import { getAppConfig } from '@src/config/hooks';
import { ciEquals } from '@market/helpers/utils';

interface CmsToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  chainId: number;
  marketDefault: boolean;
  dex: boolean;
  listings: boolean;
  offers: boolean;
}

export const globalTokensAtom = atom<null | CmsToken[]>(null);

const GlobalDataFetcher = () => {
  const setGlobalTokens = useSetAtom(globalTokensAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: ['GlobalData'],
    queryFn: async () => {
      return await ApiService.withoutKey().getSupportedTokens()
    },
  });

  useEffect(() => {
    if (error) {
      setGlobalTokens(getFallbackTokens());
    } else if (data) {
      setGlobalTokens(data.data);
    }
  }, [data, setGlobalTokens]);

  if (isLoading || error) {
    // Optionally handle loading and error states here
    return null; // Ensure this component doesn't render anything visually
  }

  return null; // This is purely a side-effect component
};

function remapMarketTokens() {
  let frontendTokens: any[] = [];
  let collectionTokens: any[] = [];

  const { config: appConfig } = getAppConfig();

  const legacyFrontendConfig = legacyAppConfig();
  const knownAppConfigTokens = legacyFrontendConfig.tokens;
  for (const legacyToken of Object.values(knownAppConfigTokens) as any[]) {
    frontendTokens.push({
      address: legacyToken.address.toLowerCase(),
      name: legacyToken.name,
      symbol: legacyToken.symbol,
      decimals: legacyToken.decimals,
      chainId: appConfig.defaultChainId
    })
  }

  const frontendTokenWhitelists = appConfig.currencies;
  for (const [chainId, chainTokens] of Object.entries(frontendTokenWhitelists) as [number, any]) {
    for (const globalTokenSymbol of chainTokens.global) {
      frontendTokens.forEach(ft => {
        if (ciEquals(ft.symbol, globalTokenSymbol) && chainId.toString() === ft.chainId.toString()) {
          ft.marketDefault = true
        }
      });
    }
    for (const marketAvailableTokenSymbol of chainTokens.marketplace.available) {
      frontendTokens.forEach(ft => {
        if (ciEquals(ft.symbol, marketAvailableTokenSymbol) && chainId.toString() === ft.chainId.toString()) {
          ft.listings = true
        }
      });
    }
    for (const dealTokenSymbol of chainTokens.deals) {
      frontendTokens.forEach(ft => {
        if (ciEquals(ft.symbol, dealTokenSymbol) && chainId.toString() === ft.chainId.toString()) {
          ft.deals = true
        }
      });
    }

    for (const [collectionAddress, collectionTokenSymbols] of Object.entries(chainTokens.marketplace.nft)) {
      for (const collectionTokenSymbol of collectionTokenSymbols as string[]) {
        frontendTokens.forEach(ft => {
          if (ciEquals(ft.symbol, collectionTokenSymbol) && chainId.toString() === ft.chainId.toString()) {
            collectionTokens.push({
              collectionAddress: collectionAddress,
              chainId: Number(chainId),
              tokenSymbol: collectionTokenSymbol,
              tokenAddress: ft.address.toLowerCase()
            });
            return;
          }
        });
      }
    }
  }

  return [frontendTokens, collectionTokens];
}

function remapDexToken(token: any): Partial<CmsToken> {
  return {
    address: token.address.toLowerCase(),
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    chainId: token.chainId,
    logo: token.logoURI,
    dex: true
  };
}

function getFallbackTokens() {
  const [frontendTokens] = remapMarketTokens();
  const dexTokens = fallbackTokens.tokens.map(remapDexToken);

  return Array.from(
    [...frontendTokens, ...dexTokens].reduce((map, token) => {
      const key = `${token.address.toLowerCase()}-${token.chainId}`;
      if (!map.has(key)) {
        // Include only required and optional fields directly in the map
        map.set(key, {
          address: token.address.toLowerCase(),
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          chainId: token.chainId,
          logo: token.logo ?? token.logoURI ?? null,
          dex: token.dex ?? false,
          deals: token.deals ?? false,
          listings: token.listings ?? false,
          marketDefault: token.marketDefault ?? false
        });
      } else {
        let obj: any = {
          ...map.get(key),
          ...(token.logo && { logo: token.logo }),
          ...(token.logoURI && { logo: token.logoURI }),
          ...(token.dex && { dex: token.dex }),
          ...(token.deals && { deals: token.deals }),
          ...(token.listings && { listings: token.listings }),
          ...(token.marketDefault && { marketDefault: token.marketDefault }),
        };

        map.set(key, obj);
      }
      return map;
    }, new Map<string, CmsToken>()).values() // Convert map values to an array
  ) as CmsToken[];
}

export default GlobalDataFetcher;