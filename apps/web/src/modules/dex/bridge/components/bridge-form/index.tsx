import { Container, Box, Card, IconButton, VStack, HStack, ButtonGroup, Flex, Wrap, Button, Text, Skeleton, Select } from "@chakra-ui/react";
import { PrimaryButton } from "@src/components-v2/foundation/button";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import { SettingsIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { useApproveCallback, ApprovalState } from "@dex/swap/imported/pancakeswap/web/hooks/useApproveCallback";
import useAccountActiveChain from "@dex/swap/imported/pancakeswap/web/hooks/useAccountActiveChain";
import chainConfigs, { BRIDGE, SUPPORTED_CHAIN_CONFIGS } from "@src/config/chains";
import { NetworkSelector } from "./networkSelector";

export default function BridgeForm() {
    const { isOpen: isOpenConfirmSwap, onOpen: onOpenConfirmSwap, onClose: onCloseConfirmSwap } = useDisclosure();
    const { isOpen: isOpenSettings, onOpen: onOpenSettings, onClose: onCloseSettings } = useDisclosure();
    const { account, chainId } = useAccountActiveChain();


    const {
        approvalState: approval,
        approveCallback: approveACallback,
        revokeCallback: revokeACallback,
        currentAllowance: currentAllowanceA,
    } = useApproveCallback(
        // parsedAmounts[Field.INPUT],
        100,
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
                    <HStack w='full' align='stretch'>
                        <NetworkSelector/>
                    </HStack>
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
                                ) : (<></>)
                                }
                            </>
                        )}
                    </AuthenticationGuard>
                </Card>
            </Container></>
    )
}