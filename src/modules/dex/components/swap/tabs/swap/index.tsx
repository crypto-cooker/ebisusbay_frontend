import {Box, Button, Container, Flex, IconButton, useDisclosure, VStack, Wrap} from "@chakra-ui/react";
import {Card} from "@src/components-v2/foundation/card";
import {ArrowDownIcon, SettingsIcon} from "@chakra-ui/icons";
import InputBox from "@dex/components/swap/input-box";
import {Field} from "@dex/constants";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import Settings from "@dex/components/swap/settings";
import React, {useCallback, useMemo} from "react";
import {useSwapActionHandlers, useSwapFormDerivedState, useSwapFormState} from "@dex/state/swap/hooks";
import SwapCurrencyInputPanel from "@dex/components/swap/tabs/swap/swap-currency-input-panel";
import {NumberType, useFormatter} from "@dex/imported/utils/formatNumbers";
import {Currency} from "@uniswap/sdk-core";

export default function SwapForm() {
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers();
  const [swapFormState, setSwapFormState] = useSwapFormState();
  const [swapFormDerivedState] = useSwapFormDerivedState();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const { typedValue, independentField } = swapFormState;
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  // const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const showWrap = false;

  const {
    trade: { state: tradeState, trade, swapQuoteLatency },
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    outputFeeFiatValue,
    inputTax,
    outputTax,
  } = swapFormDerivedState
console.log('DERIVED', swapFormDerivedState)
  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
          [Field.INPUT]: parsedAmount,
          [Field.OUTPUT]: parsedAmount,
        }
        : {
          [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
          [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
        },
    [independentField, parsedAmount, showWrap, trade]
  )

  const { formatCurrencyAmount } = useFormatter();
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : formatCurrencyAmount({
          amount: parsedAmounts[dependentField],
          type: NumberType.SwapTradeAmount,
          placeholder: '',
        }),
    }),
    [dependentField, formatCurrencyAmount, independentField, parsedAmounts, showWrap, typedValue]
  )

  console.log('FORMATTED', formattedAmounts)
  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency);
    },
    [onCurrencySelection]
  )

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  )

  return (
    <>
      <Container mt={4}>
        <Card>
          <Flex justify='space-between' mb={4}>
            <Box fontSize='xl' fontWeight='bold'>Swap</Box>
            <Box>
              <IconButton
                aria-label='Settings'
                variant='ghost'
                icon={<SettingsIcon />}
                onClick={onOpen}
              />
            </Box>
          </Flex>
          <VStack w='full' align='stretch'>
            <SwapCurrencyInputPanel
              label='You pay'
              currency={swapFormDerivedState.currencies[Field.INPUT]}
              otherCurrency={swapFormDerivedState.currencies[Field.OUTPUT]}
              value={formattedAmounts[Field.INPUT]}
              onCurrencySelect={handleInputSelect}
              onUserInput={handleTypeInput}
            />
            {/*<Wrap justify='center'>*/}
            {/*  <Button onClick={() => handleQuickChange(25)}>25%</Button>*/}
            {/*  <Button onClick={() => handleQuickChange(50)}>50%</Button>*/}
            {/*  <Button onClick={() => handleQuickChange(75)}>75%</Button>*/}
            {/*  <Button onClick={() => handleQuickChange(100)}>Max</Button>*/}
            {/*</Wrap>*/}
            <Box textAlign='center'>
              <IconButton aria-label='Swap to' icon={<ArrowDownIcon />} w='40px' />
            </Box>
            <SwapCurrencyInputPanel
              label='You receive'
              currency={swapFormDerivedState.currencies[Field.OUTPUT]}
              otherCurrency={swapFormDerivedState.currencies[Field.INPUT]}
              value={formattedAmounts[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              onUserInput={handleTypeOutput}
            />
            {/*<Box>*/}
            {/*  <Flex justify='space-between'>*/}
            {/*    <Box>Price</Box>*/}
            {/*    <Box>1 CRO = 10 FRTN</Box>*/}
            {/*  </Flex>*/}
            {/*  <Flex justify='space-between'>*/}
            {/*    <Box>Slippage Tolerance</Box>*/}
            {/*    <Box>{(userSlippageTolerance / 100).toFixed(2)}%</Box>*/}
            {/*  </Flex>*/}
            {/*</Box>*/}
            {/*<AuthenticationGuard>*/}
            {/*  {({isConnected, connect}) => (*/}
            {/*    <>*/}
            {/*      {isConnected ? (*/}
            {/*        <PrimaryButton*/}
            {/*          isDisabled={!tokenOut.amountEth && !tokenIn.amountEth}*/}
            {/*          size='lg'*/}
            {/*        >*/}
            {/*          Enter an amount*/}
            {/*        </PrimaryButton>*/}
            {/*      ) : (*/}
            {/*        <PrimaryButton onClick={connect}>*/}
            {/*          Connect Wallet*/}
            {/*        </PrimaryButton>*/}
            {/*      )}*/}
            {/*    </>*/}
            {/*  )}*/}
            {/*</AuthenticationGuard>*/}
          </VStack>
        </Card>
      </Container>
      {/*<Settings*/}
      {/*  isOpen={isOpen}*/}
      {/*  onClose={onClose}*/}
      {/*/>*/}
    </>
  )
}