// TODO: aptos merge
import { ChainId, Currency } from '@pancakeswap/sdk'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import {Box, Button, Center, Flex, HStack, Link, Text, VStack} from "@chakra-ui/react";
import {ArrowUpIcon} from "@chakra-ui/icons";
import CronosIcon from "@src/components-v2/shared/icons/cronos";
import {appConfig} from "@src/config";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {DEX_COLORS} from "@dex/swap/constants/style";
import {PrimaryButton} from "@src/components-v2/foundation/button";

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(Flex)`
  padding: 24px;
`

const ConfirmedIcon = styled(Center)`
  padding: 24px 0;
`

const config = appConfig();

export function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
}) {

  return (
    <Box w='full' p={6}>
      <ConfirmedIcon>
        <ArrowUpIcon strokeWidth={0.5} color={DEX_COLORS.primary} boxSize={20} />
      </ConfirmedIcon>
      <VStack spacing={3} justify='center' fontWeight='bold'>
        <Text fontSize='xl'>Transaction Submitted</Text>
        {chainId && hash && (
          <Link href={`${config.urls.explorer}tx/${hash}`} isExternal>
            <HStack color={DEX_COLORS.primary}>
              <Text fontSize='sm'>View on Explorer</Text>
              <CronosIcon boxSize={5}/>
            </HStack>
          </Link>
        )}
        <PrimaryButton onClick={onDismiss} mt="20px">
          Close
        </PrimaryButton>
      </VStack>
    </Box>
  )
}

interface ConfirmationModalProps {
  title: string
  customOnDismiss?: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
}

// const TransactionConfirmationModal: React.FC<
//   React.PropsWithChildren<InjectedModalProps & ConfirmationModalProps & ModalProps>
// > = ({ title, onDismiss, customOnDismiss, attemptingTxn, hash, pendingText, content, ...props }) => {
//   const chainId = useActiveChainId()
//
//   const handleDismiss = useCallback(() => {
//     if (customOnDismiss) {
//       customOnDismiss()
//     }
//     onDismiss?.()
//   }, [customOnDismiss, onDismiss])
//
//   if (!chainId) return null
//
//   return (
//     <Modal title={title} headerBackground="gradientCardHeader" {...props} onDismiss={handleDismiss}>
//       {attemptingTxn ? (
//         <ConfirmationPendingContent pendingText={pendingText} />
//       ) : hash ? (
//         <TransactionSubmittedContent chainId={chainId} hash={hash} onDismiss={handleDismiss} />
//       ) : (
//         content()
//       )}
//     </Modal>
//   )
// }

// export default TransactionConfirmationModal
