
import { useMemo } from "react"

export const usePairDatas = () => {

  // get all the pair datas that exist
  const allPairData= useAllPairDataQuery()

  // get all the pair datas that exist
  const pairDatas = useMemo(() => {
    return Object.values(allPairData)
      .map((pair) => {
        return {
          ...pair.data,
        }
      })
      .filter((pair) => pair.token1.name !== 'unknown' && pair.token0.name !== 'unknown')
  }, [allPairData])
  return { pairDatas }
}