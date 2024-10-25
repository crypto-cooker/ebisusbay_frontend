
import { useMemo } from "react"
import { useAllTokenDataQuery } from "./useAllTokenDataQuery"

export const useTokenDatas = () => {

  // get all the pair datas that exist
  const allTokenData= useAllTokenDataQuery()

  // get all the pair datas that exist
  const TokenDatas = useMemo(() => {
    console.log({allTokenData},"HHHHHHHHH")
    return Object.values(allTokenData)
      .map((pair) => {
        return {
          ...pair.data,
        }
      })
      .filter((pair) => pair.token1.name !== 'unknown' && pair.token0.name !== 'unknown')
  }, [allTokenData])
  return { TokenDatas }
}