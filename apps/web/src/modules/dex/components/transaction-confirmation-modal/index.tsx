import {BoxProps} from "@chakra-ui/react";
import {useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import React, {ReactNode, useCallback} from "react";
import {Currency} from "@pancakeswap/sdk";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {ConfirmationPendingContent} from "@dex/components/transaction-confirmation-modal/confirmation-pending-content";
import {
  TransactionSubmittedContent
} from "@dex/components/transaction-confirmation-modal/transaction-submitted-content";
import {TransactionErrorContent} from "@dex/components/transaction-confirmation-modal/transaction-error-content";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string
  customOnDismiss?: () => void
  hash: string | undefined
  errorMessage?: string
  content: () => ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined | null
}

function TransactionConfirmationModal({
  title,
  isOpen,
  onClose,
  customOnDismiss,
  attemptingTxn,
  errorMessage,
  hash,
  pendingText,
  content,
  currencyToAdd,
  ...props
}: ConfirmationModalProps) {
  const {
    DialogComponent,
    DialogBasicHeader,
    DialogBody
  } = useResponsiveDialog();

  const { chainId } = useActiveChainId()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onClose?.()
  }, [customOnDismiss, onClose])

  if (!chainId) return null

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} {...props}>
      <DialogBasicHeader title={title} />
      <DialogBody>
        {attemptingTxn ? (
          <ConfirmationPendingContent pendingText={pendingText} />
        ) : hash ? (
          <TransactionSubmittedContent
            chainId={chainId}
            hash={hash}
            onDismiss={onClose}
            currencyToAdd={currencyToAdd}
          />
        ) : errorMessage ? (
          <TransactionErrorContent message={errorMessage} onDismiss={handleDismiss} />
        ) : (
          content()
        )}
      </DialogBody>
    </DialogComponent>
  )
}

export default TransactionConfirmationModal;