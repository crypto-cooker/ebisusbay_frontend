import { useUser } from "@src/components-v2/useUser";
import { ApiService } from "@src/core/services/api-service";
import { useQuery } from "@tanstack/react-query"


export const useLootBoxList = () => {
  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ['GlobalLootBoxList'],
    queryFn: async () =>
      ApiService.withoutKey().ryoshiDynasties.getLootBoxList()
        .then((res) => res.data)
        .catch((error) => {
          console.log(error)
          return undefined
        })
  })

  return { data, refetch, isLoading, error }
}

export const useLootBoxBalance = () => {
  const user = useUser();
  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ['BoxBalance', user.address],
    queryFn: async () => ApiService.withoutKey().ryoshiDynasties.getLootBoxBalance(user.address as string).then((res) => res.data).catch((error) => { console.log(error); return undefined }),
    refetchOnWindowFocus: false
  })

  return { data, refetch, isLoading, error }
}


export const useLootBoxInfo = (id: number) => {
  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ['BoxInfo', id],
    queryFn: async () => ApiService.withoutKey().ryoshiDynasties.getLootBoxInfo(id).then((res) => res.data).catch((error) => { console.log(error); return undefined })
  })

  return { data, refetch, isLoading, error }
}

export const openLootBox = async (id: number, address:string, signature: string) => {
  try {
    const res = await ApiService.withoutKey().ryoshiDynasties.openLootBox(id, address, signature);
    return res;
  } catch (error) {
    console.log(error)
  }
}