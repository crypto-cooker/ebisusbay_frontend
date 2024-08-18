import {BoxProps, ModalProps} from "@chakra-ui/react";
import React, {useCallback, useMemo} from "react";
import {Currency, CurrencyAmount, Trade, TradeType} from "@pancakeswap/sdk";
import {Field} from "@eb-pancakeswap-web/state/swap/actions";
import formatAmountDisplay from "@dex/swap/utils/formatAmountDisplay";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import TransactionConfirmSwapContent from "@dex/swap/components/tabs/swap/swap-modal/swap-modal-content";
import TransactionConfirmationModal from "@dex/components/transaction-confirmation-modal";

interface ConfirmSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade?: Trade<Currency, Currency, TradeType>
  originalTrade?: Trade<Currency, Currency, TradeType>
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  attemptingTxn: boolean
  txHash?: string
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage?: string
  customOnDismiss?: () => void
  openSettingModal?: () => void
  isStable?: boolean
  modalProps?: Pick<ModalProps, 'size' | 'isCentered'>;
}

export default function ConfirmSwapModal({
  isOpen,
  onClose,
  trade,
  originalTrade,
  currencyBalances,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  recipient,
  swapErrorMessage,
  attemptingTxn,
  txHash,
}: ConfirmSwapModalProps & BoxProps) {
  const {chainId} = useActiveChainId();

  const confirmationContent = useCallback(() => (
      <TransactionConfirmSwapContent
        trade={trade}
        currencyBalances={currencyBalances}
        originalTrade={originalTrade}
        onAcceptChanges={onAcceptChanges}
        allowedSlippage={allowedSlippage}
        onConfirm={onConfirm}
        recipient={recipient}
      />
    ),
    [
      trade,
      originalTrade,
      onAcceptChanges,
      allowedSlippage,
      onConfirm,
      recipient,
      currencyBalances,
    ],
  )

  const pendingText = useMemo(() => {
    const amountA = formatAmountDisplay(trade?.inputAmount);
    const symbolA = trade?.inputAmount?.currency?.symbol ?? '';
    const amountB = formatAmountDisplay(trade?.outputAmount);
    const symbolB = trade?.outputAmount?.currency?.symbol ?? '';

    return `Swapping ${amountA} ${symbolA} for ${amountB} ${symbolB}`
  }, [trade])

  if (!chainId || !trade) return null

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      title='Confirm Swap'
      attemptingTxn={attemptingTxn}
      currencyToAdd={trade?.inputAmount?.currency}
      errorMessage={swapErrorMessage}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}