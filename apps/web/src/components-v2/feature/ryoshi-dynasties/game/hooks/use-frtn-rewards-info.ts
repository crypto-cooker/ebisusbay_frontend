import { ApiService } from "@src/core/services/api-service"
import { useQuery } from "@tanstack/react-query"

export const useFrtnRewardsInfo = () => {
  const {data, isLoading, error, refetch} = useQuery({
    queryKey:["FortuneRewardsInfo"],
    queryFn: async () => await ApiService.withoutKey().ryoshiDynasties.getFortuneRewardsInfo(),
    staleTime: 60 * 60 * 1000,
    gcTime: 12 * 60 * 60 * 1000,
  });

  return {data, isLoading, error, refetch}
}