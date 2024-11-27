import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { atom, useSetAtom } from 'jotai';
import { ApiService } from "@src/core/services/api-service";

export const globalDataAtom = atom<null | any>(null);

const GlobalDataFetcher = () => {
  const setGlobalData = useSetAtom(globalDataAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: ['GlobalData'],
    queryFn: async () => {
      return await ApiService.withoutKey().getSupportedTokens()
    },

  });

  useEffect(() => {
    if (data) {
      setGlobalData(data);
    }
  }, [data, setGlobalData]);

  if (isLoading || error) {
    // Optionally handle loading and error states here
    return null; // Ensure this component doesn't render anything visually
  }

  return null; // This is purely a side-effect component
};

export default GlobalDataFetcher;