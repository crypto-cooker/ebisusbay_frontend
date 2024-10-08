import { Container, Box, IconButton, VStack, HStack, ButtonGroup, Flex, Wrap, Button, Text, Skeleton, Select, Input } from "@chakra-ui/react";
import { Card } from "@src/components-v2/foundation/card";
import { PrimaryButton } from "@src/components-v2/foundation/button";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import { SettingsIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { useApproveCallback, ApprovalState } from "@dex/swap/imported/pancakeswap/web/hooks/useApproveCallback";
import useAccountActiveChain from "@dex/swap/imported/pancakeswap/web/hooks/useAccountActiveChain";
import chainConfigs, { BRIDGE, SUPPORTED_CHAIN_CONFIGS } from "@src/config/chains";
import { NetworkSelector } from "./networkSelector";
import CurrencyInputPanel from "@dex/components/currency-input-panel";
import { useBridgeActionHandlers } from "@dex/bridge/state/useBridgeActionHandler";
import { useBridgeState } from "@dex/bridge/state/hooks";
import { Field } from "@dex/swap/constants";
import { useCurrency } from "@dex/swap/imported/pancakeswap/web/hooks/tokens";
import getCurrencyId from "@dex/swap/imported/pancakeswap/web/utils/currencyId";
import { useEffect } from "react";

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
        onChainSelection,
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

    useEffect(() => {
        console.log({typedValue})
        console.log({currencyId})
        console.log({currency})
    }, [typedValue, currency, currencyId])


    const {
        approvalState: approval,
        approveCallback: approveACallback,
        revokeCallback: revokeACallback,
        currentAllowance: currentAllowanceA,
    } = useApproveCallback(
        // parsedAmounts[Field.INPUT],
        typedValue,
        chainId ? BRIDGE[chainId].fortune : undefined,
        { enablePaymaster: true }
    )

    // show approve flow when: no error on inputs, not approved or pending, or approved in current session
    // never show if price impact is above threshold in non expert mode
    const showApproveFlow = (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)

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
                        <HStack w='full' align='stretch' justify="space-between">
                            <NetworkSelector />
                            <NetworkSelector />
                        </HStack>
                    </Card>
                    {/* <HStack>
                        <Box w="50%">
                            <Input />
                        </Box>
                        <Box w="50%">
                            <HStack>
                                <Input />
                                <Button>Max</Button>
                            </HStack>
                        </Box>
                    </HStack> */}
                    <CurrencyInputPanel
                        label='Token'
                        currency={currency}
                        value={typedValue}
                        onCurrencySelect={handleSelectCurrency}
                        onUserInput={onTypeInput}
                        onMax={() => { }}
                    />
                    <Box mb={4} />
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
                                ) : approval ? (
                                    <PrimaryButton
                                        onClick={approveACallback}
                                        isDisabled={approval === ApprovalState.PENDING}
                                        w='full'
                                        loadingText={`Approving ${currency?.symbol}`}
                                        isLoading={approval === ApprovalState.PENDING}
                                    >
                                        Approve {currency?.symbol}
                                    </PrimaryButton>) : <PrimaryButton
                                        w='full'
                                        size='lg'
                                        onClick={() => { }}>
                                    Approve
                                </PrimaryButton>
                                }
                            </>
                        )}
                    </AuthenticationGuard>
                </Card>
            </Container></>
    )
}