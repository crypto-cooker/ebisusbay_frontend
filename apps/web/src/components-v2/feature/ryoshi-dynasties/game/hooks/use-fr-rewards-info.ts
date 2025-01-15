import { ApiService } from "@src/core/services/api-service"
import { useQuery } from "@tanstack/react-query"

export const useFrRewardsInfo = () => {
  const {data, isLoading, error, refetch} = useQuery({
    queryKey:["FortuneRewardsInfo"],
    queryFn: async () => await ApiService.withoutKey().ryoshiDynasties.getFortuneRewardsInfo()
  });

  return {data, isLoading, error, refetch}
}