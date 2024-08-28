import {Box, Button, Container, Flex, IconButton, Skeleton, Text, useDisclosure, VStack, Wrap} from "@chakra-ui/react";
import {Card} from "@src/components-v2/foundation/card";
import {ArrowDownIcon, SettingsIcon} from "@chakra-ui/icons";
import {Field, INITIAL_ALLOWED_SLIPPAGE} from "src/modules/dex/swap/constants";
import React, {useCallback, useMemo, useState} from "react";
import CurrencyInputPanel from "@dex/components/currency-input-panel";
import {Currency, Percent, Trade, TradeType} from "@pancakeswap/sdk";
import {useCurrency} from "@eb-pancakeswap-web/hooks/tokens";
// import {useIsWrapping} from "@eb-pancakeswap-web/hooks/useIsWrapping";
import replaceBrowserHistory from "@pancakeswap/utils/replaceBrowserHistory";
import {maxAmountSpend} from "@eb-pancakeswap-web/utils/maxAmountSpend";
import {useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapState} from "@eb-pancakeswap-web/state/swap/hooks";
import currencyId from "@eb-pancakeswap-web/utils/currencyId";
import {useSwapActionHandlers} from "@eb-pancakeswap-web/state/swap/useSwapActionHandlers";
import {useCurrencyBalance, useCurrencyBalances} from "@eb-pancakeswap-web/state/wallet/hooks";
import {AdvancedSwapDetails} from "@dex/swap/components/tabs/swap/swap-details";
import {useIsExpertMode, useUserSlippage} from "@pancakeswap/utils/user";
import {TradePrice} from "@dex/swap/components/tabs/swap/trade-price";
import {SwapInfo} from "@dex/swap/components/tabs/swap/swap-info";
import {CommitButton} from "@dex/swap/components/tabs/swap/commit-button";
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  warningSeverity
} from "@eb-pancakeswap-web/utils/exchange";
import ConfirmSwapModal from "@dex/swap/components/tabs/swap/swap-modal/confirm-swap-modal";
import {typeInput} from "@eb-pancakeswap-web/state/swap/actions";
import {useSwapCallback} from "@eb-pancakeswap-web/hooks/useSwapCallback";
import {useSwapCallArguments} from "@eb-pancakeswap-web/hooks/useSwapCallArguments";
import Settings from "@dex/components/swap/settings";
import {ApprovalState, useApproveCallback} from "@eb-pancakeswap-web/hooks/useApproveCallback";
import {V2_ROUTER_ADDRESS} from "@pancakeswap/smart-router";
import useAccountActiveChain from "@eb-pancakeswap-web/hooks/useAccountActiveChain";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import useWrapCallback, {WrapType} from "@eb-pancakeswap-web/hooks/useWrapCallback";
import {BIG_INT_ZERO} from "@dex/swap/constants/exchange";
import {useUserSingleHopOnly} from "@dex/swap/state/user/hooks";
import {useIsWrapping} from "@eb-pancakeswap-web/hooks/useIsWrapping";

// interface Props {
//   inputAmount?: CurrencyAmount<Currency>
//   outputAmount?: CurrencyAmount<Currency>
//   tradeLoading?: boolean
//   pricingAndSlippage?: ReactNode
//   swapCommitButton?: ReactNode
// }

export default function SwapForm(/*{ pricingAndSlippage, inputAmount, outputAmount, tradeLoading, swapCommitButton }: Props*/) {
  // const [swapFormState, setSwapFormState] = useSwapFormState();
  // const [swapFormDerivedState] = useSwapFormDerivedState();

  // const { typedValue, independentField } = swapFormState;
  // const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const { account, chainId } = useAccountActiveChain();
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
  const { onCurrencySelection, onSwitchTokens, onUserInput, dispatch } = useSwapActionHandlers()
  const [inputBalance] = useCurrencyBalances(account, [inputCurrency, outputCurrency])
  const maxAmountInput = useMemo(() => maxAmountSpend(inputBalance), [inputBalance])
  const loadedUrlParams = useDefaultsFromURLSearch()
  const isExpertMode = useIsExpertMode()
  const { isOpen: isOpenConfirmSwap, onOpen: onOpenConfirmSwap, onClose: onCloseConfirmSwap } = useDisclosure();
  const { isOpen: isOpenSettings, onOpen: onOpenSettings, onClose: onCloseSettings } = useDisclosure();

  const {v2Trade, ...derivedSwapInfo} = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrency!,
    outputCurrency!,
    account ?? ''
  );
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(derivedSwapInfo.currencies[Field.INPUT], derivedSwapInfo.currencies[Field.OUTPUT], typedValue);

  const isWrapping = useIsWrapping()
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const trade = showWrap ? undefined : v2Trade;

  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade ?? undefined, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash, setSwapState])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      dispatch(typeInput({ field: Field.INPUT, typedValue: '' }))
    }
  }, [tradeToConfirm, attemptingTxn, swapErrorMessage, txHash, dispatch])

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

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
          [Field.INPUT]: derivedSwapInfo.parsedAmount,
          [Field.OUTPUT]: derivedSwapInfo.parsedAmount,
        }
        : {
          [Field.INPUT]: independentField === Field.INPUT ? derivedSwapInfo.parsedAmount : trade?.inputAmount,
          [Field.OUTPUT]: independentField === Field.OUTPUT ? derivedSwapInfo.parsedAmount : trade?.outputAmount,
        },
    [independentField, derivedSwapInfo.parsedAmount, showWrap, trade]
  )

  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : parsedAmounts[dependentField]?.toExact() ?? '',
    }),
    [dependentField, independentField, parsedAmounts, showWrap, typedValue]
  )

  const route = trade?.route;
  const userHasSpecifiedInputOutput = Boolean(
    derivedSwapInfo.currencies[Field.INPUT] && derivedSwapInfo.currencies[Field.OUTPUT] && parsedAmounts[independentField]?.quotient > BIG_INT_ZERO
  );
  const noRoute = !route;

  const recipient = account ?? null;
  const currencyBalances = {
    [Field.INPUT]: useCurrencyBalance(account, inputCurrency),
    [Field.OUTPUT]: useCurrencyBalance(account, outputCurrency),
  }

  const [userAllowedSlippage] = useUserSlippage()

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)
  const [singleHopOnly] = useUserSingleHopOnly();
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  // const confirmPriceImpactWithoutFee = useAsyncConfirmPriceImpactWithoutFee(
  //   priceImpactWithoutFee,
  //   PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
  //   ALLOWED_PRICE_IMPACT_HIGH,
  // )

  const swapCalls = useSwapCallArguments(trade, INITIAL_ALLOWED_SLIPPAGE, null)
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, userAllowedSlippage, recipient, swapCalls);

  const handleSwap = useCallback(() => {
    // if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
    //   return;
    // }
    if (!swapCallback) {
      return;
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined });
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash });
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm]);

  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      handleCurrencySelect(inputCurrency, Field.INPUT, inputCurrencyId || '', outputCurrencyId || '')
    },
    [handleCurrencySelect, inputCurrency, outputCurrency]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) => {
      handleCurrencySelect(outputCurrency, Field.OUTPUT, inputCurrencyId || '', outputCurrencyId || '')
    },
    [handleCurrencySelect, inputCurrency, outputCurrency]
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

  let inputError: string | undefined
  if (!derivedSwapInfo.parsedAmount) {
    inputError = inputError ?? 'Enter an amount'
  }

  const slippageAdjustedAmounts = trade && userAllowedSlippage && computeSlippageAdjustedAmounts(trade, userAllowedSlippage)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ]

  // NOTE: balanceIn is undefined mean no balance in Aptos
  if (amountIn && (!balanceIn || balanceIn.lessThan(amountIn))) {
    inputError = `Insufficient ${ amountIn.currency.symbol } balance`
  }

  if (!inputCurrency || !outputCurrency) {
    inputError = inputError ?? 'Select a token'
  }

  const {
    approvalState: approvalA,
    approveCallback: approveACallback,
    revokeCallback: revokeACallback,
    currentAllowance: currentAllowanceA,
  } = useApproveCallback(
    parsedAmounts[Field.INPUT],
    chainId ? V2_ROUTER_ADDRESS[chainId] : undefined,
    { enablePaymaster: true }
  )

  const isValid = !inputError && approvalA === ApprovalState.APPROVED;

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !derivedSwapInfo.inputError &&
    (approvalA === ApprovalState.NOT_APPROVED ||
      approvalA === ApprovalState.PENDING) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

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
                onClick={onOpenSettings}
              />
            </Box>
          </Flex>
          <VStack w='full' align='stretch'>
            <CurrencyInputPanel
              label='You pay'
              currency={derivedSwapInfo.currencies[Field.INPUT]}
              otherCurrency={derivedSwapInfo.currencies[Field.OUTPUT]}
              value={formattedAmounts[Field.INPUT]}
              onCurrencySelect={handleInputSelect}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
            />
            {/*<Wrap justify='center'>*/}
            {/*  <Button onClick={() => handleQuickChange(25)}>25%</Button>*/}
            {/*  <Button onClick={() => handleQuickChange(50)}>50%</Button>*/}
            {/*  <Button onClick={() => handleQuickChange(75)}>75%</Button>*/}
            {/*  <Button onClick={() => handleQuickChange(100)}>Max</Button>*/}
            {/*</Wrap>*/}
            <Wrap justify='center'>
              <Button onClick={() => handlePercentInput(25)}>25%</Button>
              <Button onClick={() => handlePercentInput(50)}>50%</Button>
              <Button onClick={() => handlePercentInput(75)}>75%</Button>
              <Button onClick={handleMaxInput}>MAX</Button>
            </Wrap>
            <Box textAlign='center'>
              <IconButton aria-label='Swap to' icon={<ArrowDownIcon />} w='40px' onClick={onSwitchTokens}/>
            </Box>
            <CurrencyInputPanel
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

          <SwapInfo
            price={
              trade?.executionPrice?.greaterThan(0) ? (
                <Flex justify='space-between' align='center' fontSize='sm' fontWeight='bold'>
                  <Text>Price</Text>
                  {!trade ? <Skeleton ml="8px" height="24px" /> : <TradePrice price={trade?.executionPrice} />}
                </Flex>
              ) : null
            }
            allowedSlippage={userAllowedSlippage}
            onSlippageClick={onOpenSettings}
          />

          <AuthenticationGuard>
            {({isConnected, connect}) => (
              <>
                {!isConnected ? (
                  <PrimaryButton
                    w='full'
                    size='lg'
                    onClick={connect}
                  >
                    Connect Wallet
                  </PrimaryButton>
                ) : showWrap ? (
                  <PrimaryButton
                    size='lg'
                    isDisabled={Boolean(wrapInputError)}
                    onClick={onWrap}
                    w='full'
                  >
                    {wrapInputError ??
                      (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                  </PrimaryButton>
                ) : noRoute && userHasSpecifiedInputOutput ? (
                  <Card padding="45px 10px">
                    <VStack gap="sm" justify="center">
                      <Text textAlign="center">Insufficient liquidity for this trade. {noRoute ? 'No route found.' : ''}</Text>
                      {singleHopOnly && <Text textAlign="center">Try enabling multi-hop trades.</Text>}
                    </VStack>
                  </Card>
                ) : (
                  <VStack align='stretch'>
                    {showApproveFlow && (
                      <PrimaryButton
                        onClick={approveACallback}
                        isDisabled={approvalA === ApprovalState.PENDING}
                        w='full'
                        loadingText={`Approving ${inputCurrency?.symbol}`}
                        isLoading={approvalA === ApprovalState.PENDING}
                      >
                        Approve {inputCurrency?.symbol}
                      </PrimaryButton>
                    )}
                    <CommitButton
                      width="100%"
                      colorScheme={!inputError && priceImpactSeverity > 2 ? 'red' : undefined}
                      variant={!inputError && priceImpactSeverity > 2 ? 'solid' : 'primary'}
                      isDisabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode)}
                      onClick={() => {
                        if (trade) {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            txHash: undefined,
                          })
                        }
                        onOpenConfirmSwap();
                      }}
                    >
                      {inputError ||
                        (priceImpactSeverity > 3 && !isExpertMode
                          ? 'Price Impact High'
                          : priceImpactSeverity > 2
                            ? 'Swap Anyway'
                            : 'Swap')}
                    </CommitButton>
                  </VStack>
                )}
              </>
            )}
          </AuthenticationGuard>
        </Card>

        {trade && (
          <Card mt={2}>
            <AdvancedSwapDetails trade={trade} />
          </Card>
        )}
      </Container>
      <Settings
        isOpen={isOpenSettings}
        onClose={onCloseSettings}
      />
      <ConfirmSwapModal
        isOpen={isOpenConfirmSwap}
        onClose={onCloseConfirmSwap}
        trade={trade}
        originalTrade={tradeToConfirm}
        currencyBalances={currencyBalances}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        allowedSlippage={userAllowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
        customOnDismiss={handleConfirmDismiss}
      />
    </>
  )
}