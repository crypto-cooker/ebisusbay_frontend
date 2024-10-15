import {BoxProps, ModalProps} from "@chakra-ui/react";
import React, {useCallback, useMemo} from "react";
import {Currency, CurrencyAmount, Trade, TradeType} from "@pancakeswap/sdk";
import {Field} from "@eb-pancakeswap-web/state/swap/actions";
import formatAmountDisplay from "@dex/swap/utils/formatAmountDisplay";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import TransactionConfirmBridgeContent from "@dex/swap/components/tabs/swap/swap-modal/swap-modal-content";
import TransactionConfirmationModal from "@dex/components/transaction-confirmation-modal";

interface ConfirmBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bridge?: Trade;
  originalTrade?: Trade<Currency, Currency, TradeType>
  currencyBalance: CurrencyAmount<Currnecy>
  attemptingTxn: boolean
  txHash?: string
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  bridgeErrorMessage?: string
  customOnDismiss?: () => void
  openSettingModal?: () => void
  isStable?: boolean
  modalProps?: Pick<ModalProps, 'size' | 'isCentered'>;
}

export default function ConfirmBridgeModal({
  isOpen,
  onClose,
  currencyBalance,
  onConfirm,
  recipient,
}: ConfirmBridgeModalProps & BoxProps) {
  const {chainId} = useActiveChainId();

  const confirmationContent = useCallback(() => (
      <TransactionConfirmBridgeContent
        currencyBalance={currencyBalance}
        onConfirm={onConfirm}
        recipient={recipient}
      />
    ),
    [
      onConfirm,
      recipient,
      currencyBalance,
    ],
  )

  if (!chainId ) return null

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      title='Confirm Bridge'
      attemptingTxn={attemptingTxn}
      currencyToAdd={trade?.inputAmount?.currency}
      errorMessage={bridgeErrorMessage}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}