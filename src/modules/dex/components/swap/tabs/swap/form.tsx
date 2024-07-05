import {Box, Container, Flex, IconButton, useDisclosure, VStack} from "@chakra-ui/react";
import {Card} from "@src/components-v2/foundation/card";
import {ArrowDownIcon, SettingsIcon} from "@chakra-ui/icons";
import {Field} from "src/modules/dex/swap/constants";
import React, {ReactNode, useCallback, useMemo} from "react";
import SwapCurrencyInputPanel from "@dex/components/swap/tabs/swap/swap-currency-input-panel";
import {Currency, CurrencyAmount, Percent} from "@pancakeswap/sdk";
import {useCurrency} from "@eb-pancakeswap-web/hooks/tokens";
// import {useIsWrapping} from "@eb-pancakeswap-web/hooks/useIsWrapping";
import replaceBrowserHistory from "@pancakeswap/utils/replaceBrowserHistory";
import {useUser} from "@src/components-v2/useUser";
import {maxAmountSpend} from "@eb-pancakeswap-web/utils/maxAmountSpend";
import {useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapState} from "@eb-pancakeswap-web/state/swap/hooks";
import currencyId from "@eb-pancakeswap-web/utils/currencyId";
import {formatAmount} from "@pancakeswap/utils/formatFractions";
import {useSwapActionHandlers} from "@eb-pancakeswap-web/state/swap/useSwapActionHandlers";
import {useCurrencyBalances} from "@eb-pancakeswap-web/state/wallet/hooks";

// interface Props {
//   inputAmount?: CurrencyAmount<Currency>
//   outputAmount?: CurrencyAmount<Currency>
//   tradeLoading?: boolean
//   pricingAndSlippage?: ReactNode
//   swapCommitButton?: ReactNode
// }

export default function FormMain(/*{ pricingAndSlippage, inputAmount, outputAmount, tradeLoading, swapCommitButton }: Props*/) {
  // const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers();
  // const [swapFormState, setSwapFormState] = useSwapFormState();
  // const [swapFormDerivedState] = useSwapFormDerivedState();
  const {isOpen, onOpen, onClose} = useDisclosure();

  // const { typedValue, independentField } = swapFormState;
  // const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const {address: account} = useUser();
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  // const isWrapping = useIsWrapping()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const [inputBalance] = useCurrencyBalances(account, [inputCurrency, outputCurrency])
  const maxAmountInput = useMemo(() => maxAmountSpend(inputBalance), [inputBalance])
  const loadedUrlParams = useDefaultsFromURLSearch()
  // const handleTypeInput = useCallback((value: string) => onUserInput(Field.INPUT, value), [onUserInput])
  // const handleTypeOutput = useCallback((value: string) => onUserInput(Field.OUTPUT, value), [onUserInput])

  const handlePercentInput = useCallback(
    (percent: number) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleCurrencySelect = useCallback(
    (
      newCurrency: Currency,
      field: Field,
      currentInputCurrencyId: string | undefined,
      currentOutputCurrencyId: string | undefined,
    ) => {
      onCurrencySelection(field, newCurrency)

      // warningSwapHandler(newCurrency)

      const isInput = field === Field.INPUT
      const oldCurrencyId = isInput ? currentInputCurrencyId : currentOutputCurrencyId
      const otherCurrencyId = isInput ? currentOutputCurrencyId : currentInputCurrencyId
      const newCurrencyId = currencyId(newCurrency)
      if (newCurrencyId === otherCurrencyId) {
        replaceBrowserHistory(isInput ? 'outputCurrency' : 'inputCurrency', oldCurrencyId)
      }
      replaceBrowserHistory(isInput ? 'inputCurrency' : 'outputCurrency', newCurrencyId)
    },
    // [onCurrencySelection, warningSwapHandler],
    [onCurrencySelection],
  )
  // const handleInputSelect = useCallback(
  //   (newCurrency: Currency) =>
  //     handleCurrencySelect(newCurrency, Field.INPUT, inputCurrencyId || '', outputCurrencyId || ''),
  //   [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  // )
  // const handleOutputSelect = useCallback(
  //   (newCurrency: Currency) =>
  //     handleCurrencySelect(newCurrency, Field.OUTPUT, inputCurrencyId || '', outputCurrencyId || ''),
  //   [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  // )
  //
  // const isTypingInput = independentField === Field.INPUT
  // const inputValue = useMemo(
  //   () => typedValue && (isTypingInput ? typedValue : formatAmount(inputAmount) || ''),
  //   [typedValue, isTypingInput, inputAmount],
  // )
  // const outputValue = useMemo(
  //   () => typedValue && (isTypingInput ? formatAmount(outputAmount) || '' : typedValue),
  //   [typedValue, isTypingInput, outputAmount],
  // )
  // const inputLoading = typedValue ? !isTypingInput && tradeLoading : false
  // const outputLoading = typedValue ? isTypingInput && tradeLoading : false


  const showWrap = false;

  const derivedSwapInfo = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrency,
    outputCurrency,
    account ?? ''
  );

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
          [Field.INPUT]: derivedSwapInfo.parsedAmount,
          [Field.OUTPUT]: derivedSwapInfo.parsedAmount,
        }
        : {
          [Field.INPUT]: independentField === Field.INPUT ? derivedSwapInfo.parsedAmount : derivedSwapInfo.v2Trade?.inputAmount,
          [Field.OUTPUT]: independentField === Field.OUTPUT ? derivedSwapInfo.parsedAmount : derivedSwapInfo.v2Trade?.outputAmount,
        },
    [independentField, derivedSwapInfo.parsedAmount, showWrap, derivedSwapInfo.v2Trade]
  )

  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : '1000',
    }),
    [dependentField, independentField, parsedAmounts, showWrap, typedValue]
  )

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
              currency={derivedSwapInfo.currencies[Field.INPUT]}
              otherCurrency={derivedSwapInfo.currencies[Field.OUTPUT]}
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
              currency={derivedSwapInfo.currencies[Field.OUTPUT]}
              otherCurrency={derivedSwapInfo.currencies[Field.INPUT]}
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