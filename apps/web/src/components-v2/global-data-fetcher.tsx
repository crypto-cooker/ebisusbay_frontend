import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { atom, useSetAtom } from 'jotai';
import { ApiService } from "@src/core/services/api-service";

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
    if (data) {
      setGlobalTokens(data.data);
    }
  }, [data, setGlobalTokens]);

  if (isLoading || error) {
    // Optionally handle loading and error states here
    return null; // Ensure this component doesn't render anything visually
  }

  return null; // This is purely a side-effect component
};

export default GlobalDataFetcher;