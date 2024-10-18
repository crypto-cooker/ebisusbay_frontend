import {
  Container,
  Box,
  VStack,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { Card } from '@src/components-v2/foundation/card';
import { PrimaryButton } from '@src/components-v2/foundation/button';
import AuthenticationGuard from '@src/components-v2/shared/authentication-guard';
import { useDisclosure } from '@chakra-ui/react';
import { useApproveCallback, ApprovalState } from '@dex/swap/imported/pancakeswap/web/hooks/useApproveCallback';
import { ToChainSelector } from './toChainSelector';
import { FromChainSelector } from './fromChainSelector';
import CurrencyInputPanel from '@dex/components/currency-input-panel';
import { useBridgeActionHandlers } from '@dex/bridge/state/useBridgeActionHandler';
import { useBridgeState, useDefaultCurrency } from '@dex/bridge/state/hooks';
import { Field } from '@dex/swap/constants';
import { useCurrency } from '@dex/swap/imported/pancakeswap/web/hooks/tokens';
import { useMemo, useCallback, useState } from 'react';
import { useBridgeContract } from '@src/config/hooks';
import { useDerivedBridgeInfo } from '@dex/bridge/state/hooks';
import { CommitButton } from '@dex/swap/components/tabs/swap/commit-button';
import ConfirmBridgeModal from '../bridge-modal/confirm-bridge-modal';
import { typeInput } from '@dex/bridge/state/actions';
import useWrapCallback from '@dex/swap/imported/pancakeswap/web/hooks/useWrapCallback';
import { useIsWrapping } from '@dex/swap/imported/pancakeswap/web/hooks/useIsWrapping';
import { WrapType } from '@dex/swap/imported/pancakeswap/web/hooks/useWrapCallback';
import { useBridgeCallback } from '@dex/bridge/hooks/useBridgeCallback';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { Currency, CurrencyAmount, Trade, TradeType } from '@pancakeswap/sdk';

export default function BridgeForm() {
  const { isOpen: isOpenConfirmBridge, onOpen: onOpenConfirmBridge, onClose: onCloseConfirmBridge } = useDisclosure();
  const {
    currencyId,
    typedValue,
    [Field.INPUT]: { chainId: fromChainId },
    [Field.OUTPUT]: { chainId: toChainId },
    recipient,
  } = useBridgeState();

  const { onSelectChain, onSelectCurrency, onSwitchChain, onTypeInput, dispatch } = useBridgeActionHandlers();
  const currency = useCurrency(currencyId);

  const handleSelectCurrency = (currency: any) => {
    onSelectCurrency(currency);
  };
  const bridgeContract = useBridgeContract(currencyId);

  const { bridge, inputError, currencyBalance, ...derivedBridgeInfo } = useDerivedBridgeInfo(
    fromChainId,
    toChainId,
    typedValue,
    currency,
  );

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(derivedBridgeInfo.currency, derivedBridgeInfo.currency, typedValue);

  const isWrapping = useIsWrapping();
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const trade = showWrap ? undefined : bridge;

  const [{ tradeToConfirm, bridgeErrorMessage, attemptingTxn, txHash }, setBridgeState] = useState<{
    tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined;
    attemptingTxn: boolean;
    bridgeErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    bridgeErrorMessage: undefined,
    txHash: undefined,
  });

  const defaultCurrency = useDefaultCurrency();

  const handleAcceptChanges = useCallback(() => {
    setBridgeState({ tradeToConfirm: trade ?? undefined, bridgeErrorMessage, txHash, attemptingTxn });
  }, [attemptingTxn, bridgeErrorMessage, trade, txHash, setBridgeState]);

  const handleConfirmDismiss = useCallback(() => {
    setBridgeState({ tradeToConfirm, attemptingTxn, bridgeErrorMessage, txHash });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      dispatch(typeInput({ typedValue: '' }));
    }
  }, [tradeToConfirm, attemptingTxn, bridgeErrorMessage, txHash, dispatch]);

  const parsedCurrency: CurrencyAmount = useMemo(
    () => derivedBridgeInfo.parsedAmount,
    [derivedBridgeInfo.parsedAmount],
  );

  const {
    approvalState: approval,
    approveCallback: approveACallback,
    revokeCallback: revokeACallback,
    currentAllowance: currentAllowanceA,
  } = useApproveCallback(parsedCurrency, currencyId ? bridgeContract?.address : undefined, { enablePaymaster: true });

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow = approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING;
  const isValid = !inputError && approval === ApprovalState.APPROVED;
  const { callback: bridgeCallback, executing: executingBridge } = useBridgeCallback(parsedCurrency);

  const handleBridge = useCallback(() => {
    // if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
    //   return;
    // }
    if (!bridgeCallback) {
      return;
    }
    setBridgeState({ attemptingTxn: true, tradeToConfirm, bridgeErrorMessage: undefined, txHash: undefined });
    bridgeCallback()
      .then((hash: any) => {
        setBridgeState({ attemptingTxn: false, tradeToConfirm, bridgeErrorMessage: undefined, txHash: hash });
      })
      .catch((error: any) => {
        setBridgeState({
          attemptingTxn: false,
          tradeToConfirm,
          bridgeErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [bridgeCallback, tradeToConfirm]);

  return (
    <>
      <Container mt={4}>
        <Card>
          <Flex justify="space-between" mb={4}>
            <Box fontSize="xl" fontWeight="bold">
              Bridge
            </Box>
          </Flex>
          <Card mb={4}>
            <HStack w="full" align="end" justify="space-between">
              <VStack flexGrow={2}>
                <label>From</label>
                <FromChainSelector
                  onSelectChain={onSelectChain}
                  onSwitchChain={onSwitchChain}
                  chainId={fromChainId}
                  field={Field.INPUT}
                />
              </VStack>
              <HStack align="end" pb={3}>
                <ArrowRightIcon />
              </HStack>
              <VStack flexGrow={2}>
                <label>To</label>
                <ToChainSelector
                  onSelectChain={onSelectChain}
                  onSwitchChain={onSwitchChain}
                  chainId={toChainId}
                  field={Field.OUTPUT}
                />
              </VStack>
            </HStack>
          </Card>
          <CurrencyInputPanel
            label="Token"
            currency={currency}
            value={typedValue}
            onCurrencySelect={handleSelectCurrency}
            onUserInput={onTypeInput}
            onMax={() => {}}
          />
          <Box mb={4}></Box>
          <AuthenticationGuard>
            {({ isConnected, connect }) => (
              <>
                {!isConnected ? (
                  <PrimaryButton w="full" size="lg" onClick={connect}>
                    Connect Wallet
                  </PrimaryButton>
                ) : (
                  <VStack align="stretch">
                    {showApproveFlow ? (
                      <PrimaryButton
                        onClick={approveACallback}
                        isDisabled={approval === ApprovalState.PENDING}
                        w="full"
                        loadingText={`Approving ${currency?.symbol}`}
                        isLoading={approval === ApprovalState.PENDING}
                      >
                        Approve {currency?.symbol}
                      </PrimaryButton>
                    ) : (
                      <CommitButton
                        width="100%"
                        colorScheme={!inputError ? 'red' : undefined}
                        variant={!inputError ? 'primary' : 'solid'}
                        isDisabled={!isValid}
                        onClick={() => {
                          if (trade) {
                            setBridgeState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              bridgeErrorMessage: undefined,
                              txHash: undefined,
                            });
                          }
                          onOpenConfirmBridge();
                        }}
                      >
                        {inputError || 'Bridge'}
                      </CommitButton>
                    )}
                  </VStack>
                )}
              </>
            )}
          </AuthenticationGuard>
        </Card>
      </Container>
      <ConfirmBridgeModal
        bridge={bridge}
        isOpen={isOpenConfirmBridge}
        onClose={onCloseConfirmBridge}
        currencyBalance={currencyBalance}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        onConfirm={handleBridge}
        bridgeErrorMessage={bridgeErrorMessage}
        customOnDismiss={handleConfirmDismiss}
      />
    </>
  );
}
