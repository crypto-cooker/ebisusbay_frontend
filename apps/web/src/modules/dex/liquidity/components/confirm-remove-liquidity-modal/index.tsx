import {Currency, CurrencyAmount, Pair, Percent, Token} from '@pancakeswap/sdk'
import React, {useCallback} from 'react'
import {Field} from "@eb-pancakeswap-web/state/burn/actions";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import TransactionConfirmationModal from "@dex/components/transaction-confirmation-modal";
import {ConfirmationModalContent} from "@dex/components/transaction-confirmation-modal/confirmation-modal-content";
import {Box, Flex, HStack, Text, VStack} from "@chakra-ui/react";
import {CurrencyLogo, DoubleCurrencyLogo} from "@dex/components/logo";
import {ApprovalState} from "@eb-pancakeswap-web/hooks/useApproveCallback";
import {AddIcon} from "@chakra-ui/icons";

interface ConfirmRemoveLiquidityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  pair?: Pair
  hash?: string
  pendingText: string
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount<Token>
    [Field.CURRENCY_A]?: CurrencyAmount<Currency>
    [Field.CURRENCY_B]?: CurrencyAmount<Currency>
  }
  allowedSlippage: number
  onRemove: () => void
  liquidityErrorMessage?: string
  approval: ApprovalState
  signatureData?: any
  tokenA?: Token
  tokenB?: Token
  currencyA?: Currency
  currencyB?: Currency
}

const ConfirmRemoveLiquidityModal = ({
  isOpen,
  onClose,
  title,
  customOnDismiss,
  attemptingTxn,
  pair,
  hash,
  approval,
  signatureData,
  pendingText,
  parsedAmounts,
  allowedSlippage,
  onRemove,
  liquidityErrorMessage,
  tokenA,
  tokenB,
  currencyA,
  currencyB,
} : ConfirmRemoveLiquidityModalProps) => {

  let percent = 0.5
  const symbolA = currencyA?.symbol ?? '';
  const symbolB = currencyB?.symbol ?? '';
  const slippagePct = allowedSlippage / 100;

  const modalHeader = useCallback(() => {
    return (
      <VStack align='stretch'>
        {parsedAmounts[Field.CURRENCY_A] && (
          <Flex justify="space-between">
            <Text fontSize="24px">{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</Text>
            <HStack>
              <CurrencyLogo currency={currencyA} size="24px" />
              <Text fontSize="24px" ml="10px">
                {currencyA?.symbol}
              </Text>
            </HStack>
          </Flex>
        )}
        {parsedAmounts[Field.CURRENCY_A] && parsedAmounts[Field.CURRENCY_B] && (
          <Box className='text-muted'>
            <AddIcon />
          </Box>
        )}
        {parsedAmounts[Field.CURRENCY_B] && (
          <Flex justify="space-between">
            <Text fontSize="24px">{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</Text>
            <HStack>
              <CurrencyLogo currency={currencyB} size="24px" />
              <Text fontSize="24px" ml="10px">
                {currencyB?.symbol}
              </Text>
            </HStack>
          </Flex>
        )}

        <Text fontSize='sm' textAlign="left" pt="12px">
          Output is estimated. If the price changes by more than {slippagePct}% your transaction will revert.
        </Text>
      </VStack>
    )
  }, [allowedSlippage, currencyA, currencyB, parsedAmounts])

  const modalBottom = useCallback(() => {
    return (
      <>
        <Flex justify='space-between'>
          <Text fontWeight='semibold'>
            {symbolA}/{symbolB} Burned
          </Text>
          <HStack>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin />
            <Text>{parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}</Text>
          </HStack>
        </Flex>
        {pair && (
          <>
            <Flex justify='space-between'>
              <Text>Price</Text>
              <Text>
                1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
              </Text>
            </Flex>
            <Flex justify='flex-end'>
              <Text>
                1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </Text>
            </Flex>
          </>
        )}
        <PrimaryButton
          width="100%"
          mt="20px"
          isDisabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
          onClick={onRemove}
        >
          Confirm
        </PrimaryButton>
      </>
    )
  }, [currencyA, currencyB, parsedAmounts, approval, onRemove, pair, tokenA, tokenB, signatureData])

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
      hash={hash}
      errorMessage={liquidityErrorMessage}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

export default ConfirmRemoveLiquidityModal