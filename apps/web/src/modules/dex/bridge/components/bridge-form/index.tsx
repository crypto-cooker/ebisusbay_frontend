import { Container, Box, Card, IconButton, VStack, Flex, Wrap, Button, Text, Skeleton } from "@chakra-ui/react";
import { PrimaryButton } from "@src/components-v2/foundation/button";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import { SettingsIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { useApproveCallback } from "@dex/swap/imported/pancakeswap/web/hooks/useApproveCallback";
import useAccountActiveChain from "@dex/swap/imported/pancakeswap/web/hooks/useAccountActiveChain";
import { BRIDGE } from "@src/config/chains";


export default function BridgeForm() {
    const { isOpen: isOpenConfirmSwap, onOpen: onOpenConfirmSwap, onClose: onCloseConfirmSwap } = useDisclosure();
    const { isOpen: isOpenSettings, onOpen: onOpenSettings, onClose: onCloseSettings } = useDisclosure();
    const { account, chainId } = useAccountActiveChain();


    const {
        approvalState: approvalA,
        approveCallback: approveACallback,
        revokeCallback: revokeACallback,
        currentAllowance: currentAllowanceA,
    } = useApproveCallback(
        parsedAmounts[Field.INPUT],
        chainId ? BRIDGE[chainId].fortune : undefined,
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
                    <VStack w='full' align='stretch'>

                    </VStack>
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