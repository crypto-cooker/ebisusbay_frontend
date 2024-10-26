
import { useMemo } from "react"
import { useAllTokenDataQuery } from "./useAllTokenDataQuery"

export const useTokenDatas = () => {

  // get all the token datas that exist
  const allTokenData= useAllTokenDataQuery()

  // get all the pair datas that exist
  const tokenDatas = useMemo(() => {
    return Object.values(allTokenData)
      .map((token) => {
        return {
          ...token.data,
        }
      })
      .filter((token) => token.name !== 'unknown')
  }, [allTokenData])
  return { tokenDatas }
}