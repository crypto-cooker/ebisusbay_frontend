import { FRTN, STABLE_COIN, USDC, USDT } from '@pancakeswap/tokens'
import { useRouter } from 'next/router'
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import useNativeCurrency from "@eb-pancakeswap-web/hooks/useNativeCurrency";

export function useCurrencyParams(): {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
} {
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] =
    router.isReady && chainId
      ? router.query.currency || [
          native.symbol,
          FRTN[chainId]?.address || STABLE_COIN[chainId]?.address || USDC[chainId]?.address || USDT[chainId]?.address,
        ]
      : [undefined, undefined]

  return { currencyIdA, currencyIdB }
}
