import { useIsWrapping as useIsWrappingHook } from './useWrapCallback'
import { useCurrency } from './tokens'
import {Field} from "@eb-pancakeswap-web/state/swap/actions";
import {useSwapState} from "@eb-pancakeswap-web/state/swap/hooks";

export function useIsWrapping() {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const { typedValue } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  return useIsWrappingHook(inputCurrency, outputCurrency, typedValue)
}
