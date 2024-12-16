import { useQuery } from '@tanstack/react-query';

interface PuushToken {
  name: string;
  ticker: string;
  address: string;
  decimals: number;
  logoURI: string;
  chainId: number;
  chain: string;
  graduationDex: string;
}

export function useGraduatedPuushTokens(chainId?: number) {
  const { data: tokens } = useQuery({
    queryKey: ['PuushGraduatedTokens'],
    queryFn: async () => {
      const asdf = await fetch('https://api.boomersquad.io/puush/graduated_coins_by_dex?dex=EB');
      if (!asdf.ok) return [];
      return await asdf.json() as PuushToken[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  if (!tokens) return [];

  return chainId ? tokens.filter((token) => token.chainId === chainId) : tokens;
}