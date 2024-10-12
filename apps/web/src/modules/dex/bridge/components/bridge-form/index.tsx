import { Container, Box, IconButton, VStack, HStack, ButtonGroup, Flex, Wrap, Button, Text, Skeleton, Select, Input } from "@chakra-ui/react";
import { Card } from "@src/components-v2/foundation/card";
import { PrimaryButton } from "@src/components-v2/foundation/button";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import { ArrowLeftIcon, ArrowRightIcon, SettingsIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { useApproveCallback, ApprovalState } from "@dex/swap/imported/pancakeswap/web/hooks/useApproveCallback";
import useAccountActiveChain from "@dex/swap/imported/pancakeswap/web/hooks/useAccountActiveChain";
import chainConfigs, { SUPPORTED_CHAIN_CONFIGS } from "@src/config/chains";
import { ChainSelector } from "././chainSelector"
import CurrencyInputPanel from "@dex/components/currency-input-panel";
import { useBridgeActionHandlers } from "@dex/bridge/state/useBridgeActionHandler";
import { useBridgeState } from "@dex/bridge/state/hooks";
import { Field } from "@dex/swap/constants";
import { useCurrency } from "@dex/swap/imported/pancakeswap/web/hooks/tokens";
import getCurrencyId from "@dex/swap/imported/pancakeswap/web/utils/currencyId";
import { useEffect, useMemo } from "react";
import { useAppChainConfig, useBridgeContract } from "@src/config/hooks";
import { useDerivedBridgeInfo } from "@dex/bridge/state/hooks";
import { CommitButton } from "@dex/swap/components/tabs/swap/commit-button";

export default function BridgeForm() {
    const { isOpen: isOpenConfirmSwap, onOpen: onOpenConfirmSwap, onClose: onCloseConfirmSwap } = useDisclosure();
    const { isOpen: isOpenSettings, onOpen: onOpenSettings, onClose: onCloseSettings } = useDisclosure();
    const { account, chainId } = useAccountActiveChain();
    const {
        currencyId,
        typedValue,
        [Field.INPUT]: {
            chainId: fromChainId
        },
        [Field.OUTPUT]: {
            chainId: toChainId
        },
        recipient
    } = useBridgeState()

    const {
        onSelectChain,
        onSelectCurrency,
        onSwitchChain,
        onChangeRecipient,
        onTypeInput,
        dispatch
    } = useBridgeActionHandlers()
    const currency = useCurrency(currencyId);

    const handleSelectCurrency = (currency: any) => {
        onSelectCurrency(currency)
    }
    const bridge = useBridgeContract(currencyId);
    console.log(bridge?.address)
    const { inputError, ...derivedBridgeInfo } = useDerivedBridgeInfo(
        typedValue,
        currency,
        account ?? '',
    );

    const parsedCurrency = useMemo(() => derivedBridgeInfo.parsedAmount, [derivedBridgeInfo.parsedAmount])

    const {
        approvalState: approval,
        approveCallback: approveACallback,
        revokeCallback: revokeACallback,
        currentAllowance: currentAllowanceA,
    } = useApproveCallback(
        parsedCurrency,
        currencyId ? bridge?.address : undefined,
        { enablePaymaster: true }
    )

    useEffect(() => {
        console.log({ approval })
    }, [approval])

    // show approve flow when: no error on inputs, not approved or pending, or approved in current session
    // never show if price impact is above threshold in non expert mode
    const showApproveFlow = (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING);
    const isValid = !inputError && approval === ApprovalState.APPROVED;

    return (
        <>
            <Container mt={4}>
                <Card>
                    <Flex justify='space-between' mb={4}>
                        <Box fontSize='xl' fontWeight='bold'>Bridge</Box>
                        <Box>
                            <IconButton
                                aria-label='Settings'
                                variant='ghost'
                                icon={<SettingsIcon />}
                                onClick={onOpenSettings}
                            />
                        </Box>
                    </Flex>
                    <Card mb={4}>
                        <HStack w='full' align="end" justify="space-between">
                            <VStack flexGrow={2}>
                                <label>From</label>
                                <ChainSelector onSelectChain={onSelectChain} onSwitchChain={onSwitchChain} chainId={fromChainId} field={Field.INPUT} />
                            </VStack>
                            <HStack align="end" pb={3}><ArrowRightIcon /></HStack>
                            <VStack flexGrow={2}>
                                <label>To</label>
                                <ChainSelector onSelectChain={onSelectChain} onSwitchChain={onSwitchChain} chainId={toChainId} field={Field.OUTPUT} />
                            </VStack>
                        </HStack>
                    </Card>
                    <CurrencyInputPanel
                        label='Token'
                        currency={currency}
                        value={typedValue}
                        onCurrencySelect={handleSelectCurrency}
                        onUserInput={onTypeInput}
                        onMax={() => { }}
                    />
                    <Box mb={4}></Box>
                    <AuthenticationGuard>
                        {({ isConnected, connect }) => (
                            <>
                                {!isConnected ? (
                                    <PrimaryButton
                                        w='full'
                                        size='lg'
                                        onClick={connect}
                                    >
                                        Connect Wallet
                                    </PrimaryButton>
                                ) : (
                                    <VStack align='stretch'>
                                        {showApproveFlow && (
                                            <PrimaryButton
                                                onClick={approveACallback}
                                                isDisabled={approval === ApprovalState.PENDING}
                                                w='full'
                                                loadingText={`Approving ${currency?.symbol}`}
                                                isLoading={approval === ApprovalState.PENDING}
                                            >
                                                Approve {currency?.symbol}
                                            </PrimaryButton>
                                        )}
                                        <CommitButton
                                            width="100%"
                                            colorScheme={!inputError ? 'red' : undefined}
                                            variant={!inputError ? 'solid' : 'primary'}
                                            isDisabled={!isValid}
                                            onClick={() => { onOpenConfirmSwap() }}
                                        >
                                            Bridge
                                        </CommitButton>
                                    </VStack>
                                )
                                }
                            </>
                        )}
                    </AuthenticationGuard>
                </Card>
            </Container>
        </>
    )
}