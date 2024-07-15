import {Box, BoxProps, Button, Flex, IconButton, ModalProps} from "@chakra-ui/react";
import {useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import React, {useCallback, useMemo, useState} from "react";
import SelectToken from "@dex/swap/components/tabs/swap/select-token";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import {Currency, CurrencyAmount, Trade, TradeType} from "@pancakeswap/sdk";
import {Field} from "@eb-pancakeswap-web/state/swap/actions";
import formatAmountDisplay from "@dex/swap/utils/formatAmountDisplay";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {ConfirmationPendingContent} from "@dex/swap/components/tabs/swap/swap-modal/confirmation-pending-content";
import {TransactionSubmittedContent} from "@dex/swap/components/tabs/swap/swap-modal/transaction-submitted-content";
import {TransactionErrorContent} from "@dex/swap/components/tabs/swap/swap-modal/transaction-error-content";
import TransactionConfirmSwapContent from "@dex/swap/components/tabs/swap/swap-modal/transaction-confirm-swap-content";

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

export function ConfirmSwapModal(props: ConfirmSwapModalProps & BoxProps) {
  const ResponsiveDialog = useResponsiveDialog();
  const { isOpen, onClose, modalProps } = props;

  return (
    <ResponsiveDialog.DialogComponent modalProps={modalProps} {...props}>
      <DialogContent{...props}/>
    </ResponsiveDialog.DialogComponent>
  );
}

enum Pages {
  SELECT,
  MANAGE
}

function DialogContent({
   trade,
   originalTrade,
   currencyBalances,
   onAcceptChanges,
   allowedSlippage,
   onConfirm,
   onClose,
   recipient,
   swapErrorMessage,
   attemptingTxn,
   txHash,
   openSettingModal,
}: ConfirmSwapModalProps) {
  const {
    DialogBasicHeader,
    DialogBody
  } = useResponsiveDialog();

  const {chainId} = useActiveChainId();

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent message={swapErrorMessage} onDismiss={onClose} />
      ) : (
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
      swapErrorMessage,
      onClose,
      openSettingModal,
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
    <>
      <DialogBasicHeader title='Confirm Swap' />
      <DialogBody>
        {attemptingTxn ? (
          <ConfirmationPendingContent pendingText={pendingText} />
        ) : txHash ? (
          <TransactionSubmittedContent chainId={chainId} hash={txHash} onDismiss={onClose} />
        ) : (
          confirmationContent()
        )}
      </DialogBody>
    </>
  )
}