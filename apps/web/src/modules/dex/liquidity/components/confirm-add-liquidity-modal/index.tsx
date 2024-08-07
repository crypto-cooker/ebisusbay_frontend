import { Currency, CurrencyAmount, Fraction, Percent, Token } from '@pancakeswap/sdk'
import _toNumber from 'lodash/toNumber'
import React, { useCallback } from 'react'
import {Field} from "@eb-pancakeswap-web/state/mint/actions";
import {AddLiquidityModalHeader} from "@dex/liquidity/components/confirm-add-liquidity-modal/header";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import TransactionConfirmationModal from "@dex/components/transaction-confirmation-modal";
import {ConfirmationModalContent} from "@dex/components/transaction-confirmation-modal/confirmation-modal-content";

interface ConfirmAddLiquidityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  hash?: string
  pendingText: string
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  allowedSlippage: number
  liquidityErrorMessage?: string
  price?: Fraction | null
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  onAdd: () => void
  poolTokenPercentage?: Percent
  liquidityMinted?: CurrencyAmount<Token>
  currencyToAdd?: Token | null
  isStable?: boolean
}

const ConfirmAddLiquidityModal = ({
  isOpen,
  onClose,
  title,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  price,
  currencies,
  noLiquidity,
  allowedSlippage,
  parsedAmounts,
  liquidityErrorMessage,
  onAdd,
  poolTokenPercentage,
  liquidityMinted,
  currencyToAdd,
  isStable,
} : ConfirmAddLiquidityModalProps) => {

  let percent = 0.5

  // Calculate distribution percentage for display
  if ((isStable && parsedAmounts[Field.CURRENCY_A]) || parsedAmounts[Field.CURRENCY_B]) {
    const amountCurrencyA = parsedAmounts[Field.CURRENCY_A]
      ? _toNumber(parsedAmounts[Field.CURRENCY_A]?.toSignificant(6))
      : 0
    // If there is no price fallback to compare only amounts
    const currencyAToCurrencyB = (price && parseFloat(price?.toSignificant(4))) || 1
    const normalizedAmountCurrencyA = currencyAToCurrencyB * amountCurrencyA
    const amountCurrencyB = parsedAmounts[Field.CURRENCY_B]
      ? _toNumber(parsedAmounts[Field.CURRENCY_B]?.toSignificant(6))
      : 0

    percent = normalizedAmountCurrencyA / (normalizedAmountCurrencyA + amountCurrencyB)
  }

  const modalHeader = useCallback(() => {
    return (
      <AddLiquidityModalHeader
        allowedSlippage={allowedSlippage}
        currencies={currencies}
        liquidityMinted={liquidityMinted}
        poolTokenPercentage={poolTokenPercentage}
        price={price}
        noLiquidity={noLiquidity}
      />
    )
  }, [allowedSlippage, percent, currencies, liquidityMinted, noLiquidity, parsedAmounts, poolTokenPercentage, price])

  const modalBottom = useCallback(() => {
    return (
      <PrimaryButton w="full" onClick={onAdd} mt="20px">
        {noLiquidity ? 'Create Pair & Supply' : 'Confirm Supply'}
      </PrimaryButton>
    )
  }, [noLiquidity, onAdd])

  const confirmationContent = useCallback(
    () => <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />,
    [modalHeader, modalBottom],
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      currencyToAdd={currencyToAdd}
      errorMessage={liquidityErrorMessage}
      hash={hash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

export default ConfirmAddLiquidityModal