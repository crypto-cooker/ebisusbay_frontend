import {memo, useCallback, useMemo} from 'react'
import {Currency, CurrencyAmount, Trade, TradeType} from '@pancakeswap/sdk'
import {computeSlippageAdjustedAmounts} from "@eb-pancakeswap-web/utils/exchange";
import {Field} from "@eb-pancakeswap-web/state/swap/actions";
import {maxAmountSpend} from "@eb-pancakeswap-web/utils/maxAmountSpend";
import SwapModalHeader from "@dex/swap/components/tabs/swap/swap-modal/swap-modal-header";
import SwapModalFooter from "@dex/swap/components/tabs/swap/swap-modal/swap-modal-footer";
import {ConfirmationModalContent} from "@dex/components/transaction-confirmation-modal/confirmation-modal-content";

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(
  tradeA: Trade<Currency, Currency, TradeType>,
  tradeB: Trade<Currency, Currency, TradeType>,
): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

interface TransactionConfirmSwapContentProps {
  trade?: Trade<Currency, Currency, TradeType>
  originalTrade?: Trade<Currency, Currency, TradeType>
  onAcceptChanges: () => void
  allowedSlippage: number
  recipient: string | null
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  onConfirm: () => void
}

const TransactionConfirmSwapContent = ({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  recipient,
  currencyBalances,
}: TransactionConfirmSwapContentProps) => {

  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade],
  )

  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  )

  const isEnoughInputBalance = useMemo(() => {
    if (trade?.tradeType !== TradeType.EXACT_OUTPUT) return null

    const isInputBalanceExist = !!(currencyBalances && currencyBalances[Field.INPUT])
    const isInputBalanceBNB = isInputBalanceExist && currencyBalances[Field.INPUT]?.currency.isNative
    const inputCurrencyAmount = isInputBalanceExist
      ? isInputBalanceBNB
        ? maxAmountSpend(currencyBalances[Field.INPUT])
        : currencyBalances[Field.INPUT]
      : null
    return inputCurrencyAmount && slippageAdjustedAmounts && slippageAdjustedAmounts[Field.INPUT]
      ? inputCurrencyAmount.greaterThan(slippageAdjustedAmounts[Field.INPUT]) ||
          inputCurrencyAmount.equalTo(slippageAdjustedAmounts[Field.INPUT])
      : false
  }, [currencyBalances, trade, slippageAdjustedAmounts])

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
        isEnoughInputBalance={isEnoughInputBalance ?? false}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [
    allowedSlippage,
    onAcceptChanges,
    recipient,
    showAcceptChanges,
    trade,
    slippageAdjustedAmounts,
    isEnoughInputBalance,
  ])

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
        isEnoughInputBalance={isEnoughInputBalance ?? false}
      />
    ) : null
  }, [onConfirm, showAcceptChanges, trade, isEnoughInputBalance, slippageAdjustedAmounts])

  return <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
}

export default memo(TransactionConfirmSwapContent)
