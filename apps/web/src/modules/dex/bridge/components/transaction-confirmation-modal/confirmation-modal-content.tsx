import { memo, useCallback, useMemo } from 'react'
import { Currency, CurrencyAmount, Trade, TradeType } from '@pancakeswap/sdk'
import { computeSlippageAdjustedAmounts } from "@eb-pancakeswap-web/utils/exchange";
import { Field } from "@eb-pancakeswap-web/state/swap/actions";
import { maxAmountSpend } from "@eb-pancakeswap-web/utils/maxAmountSpend";
import SwapModalHeader from "@dex/swap/components/tabs/swap/swap-modal/swap-modal-header";
import SwapModalFooter from "@dex/swap/components/tabs/swap/swap-modal/swap-modal-footer";
import { ConfirmationModalContent } from "@dex/components/transaction-confirmation-modal/confirmation-modal-content";
import { Box, HStack, VStack } from '@chakra-ui/react';
import { Bridge } from '@dex/bridge/constants/types';
import { PrimaryButton } from '@src/components-v2/foundation/button';

export interface ParsedBridge {
  symbol: string,
  amount: string | undefined,
  fromChain: string | undefined,
  toChain: string | undefined
}

interface TransactionConfirmBridgeContentProps {
  bridge: Bridge | undefined
  parsedBridge: ParsedBridge
  onAcceptChanges: () => void
  onConfirm: () => void
}

const TransactionConfirmBridgeContent = ({
  bridge,
  parsedBridge,
  onAcceptChanges,
  onConfirm,
}: TransactionConfirmBridgeContentProps) => {
  return (
    <Box>
      <VStack>
        <HStack w={"full"} justify={"space-between"}>
          <Box>{parsedBridge?.symbol}</Box>
          <Box>{parsedBridge?.amount}</Box>
        </HStack>
        <HStack w={"full"} justify={"space-between"}>
          <Box>Current Chain</Box>
          <Box>{parsedBridge?.fromChain}</Box>
        </HStack>
        <HStack w={"full"} justify={"space-between"}>
          <Box>Destination Chain</Box>
          <Box>{parsedBridge?.toChain}</Box>
        </HStack>
      </VStack>
      <HStack justify={"center"} my={2}><Box>Click the botton below</Box></HStack>
      <HStack justify={"center"}><PrimaryButton onClick={onConfirm}>Confirm Bridge</PrimaryButton></HStack>
    </Box>
  )
}

export default TransactionConfirmBridgeContent
