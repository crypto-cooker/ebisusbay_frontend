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
import useNativeCurrency from '@dex/swap/imported/pancakeswap/web/hooks/useNativeCurrency';
import { NativeCurrency } from '@pancakeswap/swap-sdk-core';
import { CurrencyLogo } from '@dex/components/logo';

export interface ParsedBridge {
  symbol: string,
  amount: string | undefined,
  fromChain: string | undefined,
  toChain: string | undefined,
  fee: string
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
  const nativeCurrency = useNativeCurrency(bridge?.fromChainId)
  let disabled = false;
  if (parsedBridge?.amount) disabled = true;
  return (
    <Box>
      <VStack>
        <HStack w={"full"} justify={"space-between"}>
          <Box>{parsedBridge?.symbol}</Box>
          <HStack>
            <Box>{parsedBridge?.amount}</Box>
            <Box>
              <CurrencyLogo currency={bridge?.currency} />
            </Box>
          </HStack>
        </HStack>
        <HStack w={"full"} justify={"space-between"}>
          <Box>Fee</Box>
          <Box>{`${parsedBridge.fee} ${nativeCurrency.symbol}`}</Box>
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
      <HStack justify={"center"} my={2}><Box>Click the button below</Box></HStack>
      <HStack justify={"center"}><PrimaryButton disabled={disabled} onClick={onConfirm}>Confirm Bridge</PrimaryButton></HStack>
    </Box>
  )
}

export default TransactionConfirmBridgeContent
