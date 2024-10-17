import { BoxProps, ModalProps, Box } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo } from "react";
import { Currency, CurrencyAmount, Trade, TradeType } from "@pancakeswap/sdk";
import { Field } from "@eb-pancakeswap-web/state/swap/actions";
import formatAmountDisplay from "@dex/swap/utils/formatAmountDisplay";
import { useActiveChainId } from "@eb-pancakeswap-web/hooks/useActiveChainId";
import TransactionConfirmBridgeContent, { ParsedBridge } from "@dex/bridge/components/transaction-confirmation-modal/confirmation-modal-content"
import TransactionConfirmationModal from "@dex/bridge/components/transaction-confirmation-modal/index";
import { Bridge } from "@dex/bridge/constants/types";
import { chains } from "@src/wagmi";
import { formatEther } from "ethers/lib/utils";

interface ConfirmBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bridge: Bridge;
  currencyBalance: CurrencyAmount<Currnecy>
  attemptingTxn: boolean
  txHash?: string
  recipient: string | null
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
  bridge,
  currencyBalance,
  onAcceptChanges,
  onConfirm,
  recipient,
  bridgeErrorMessage,
  attemptingTxn,
  txHash,
}: ConfirmBridgeModalProps & BoxProps) {
  const { chainId } = useActiveChainId();
  
  const parsedBridge:ParsedBridge = useMemo(() => {
    const symbol = bridge?.currency?.symbol;
    const amount = formatAmountDisplay(bridge?.amount)
    const fromChain = formatChainDisplay(bridge?.fromChainId)
    const toChain = formatChainDisplay(bridge?.toChainId)
    let fee;
    if(bridge.fee) fee = formatEther(bridge?.fee);
    else fee = ""
    return {symbol, amount, fromChain, toChain, fee}
  }, [bridge, chainId])

  const confirmationContent = useCallback(() => (
    <TransactionConfirmBridgeContent
      bridge={bridge}
      parsedBridge={parsedBridge}
      onAcceptChanges={onAcceptChanges}
      onConfirm={onConfirm}
    />
  ),
    [
      onConfirm,
      recipient,
      currencyBalance,
    ],
  )

  if (!chainId || !bridge) return null

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      title='Confirm Bridge'
      attemptingTxn={attemptingTxn}
      currencyToAdd={bridge?.currency}
      errorMessage={bridgeErrorMessage}
      hash={txHash}
      content={confirmationContent}
      pendingText={`Bridging ${parsedBridge.amount} ${parsedBridge.symbol} from ${parsedBridge.fromChain} to ${parsedBridge.toChain}`}
    />
  )
}

export const formatChainDisplay = (chainId: number) => {
  const chain = chains.find((chain) => chain.id?.toLocaleString().includes(chainId?.toLocaleString()));
  return chain?.name;
}