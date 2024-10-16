// TODO: aptos merge
import { ChainId, Currency, Token } from '@pancakeswap/sdk';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Box, Button, Center, Flex, HStack, Link, Text, VStack } from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';
import CronosIcon from '@src/components-v2/shared/icons/cronos';
import { appConfig } from '@src/config';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { DEX_COLORS } from '@dex/swap/constants/style';
import { PrimaryButton } from '@src/components-v2/foundation/button';
import { wrappedCurrency } from '@eb-pancakeswap-web/utils/wrappedCurrency';
import AddToWalletButton, { AddToWalletTextOptions } from '@dex/components/add-to-wallet-button';
import { getBlockExplorerLink } from '@dex/utils';

const Wrapper = styled.div`
  width: 100%;
`;
const Section = styled(Flex)`
  padding: 24px;
`;

const ConfirmedIcon = styled(Center)`
  padding: 24px 0;
`;

const config = appConfig();

export function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}: {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
  currencyToAdd?: Currency | undefined | null;
}) {
  const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId);

  const showAddToWalletButton = useMemo(() => {
    if (token && currencyToAdd) {
      return !currencyToAdd.isNative;
    }
    return false;
  }, [token, currencyToAdd]);

  return (
    <Box w="full" p={6}>
      <ConfirmedIcon>
        <ArrowUpIcon strokeWidth={0.5} color={DEX_COLORS.primary} boxSize={20} />
      </ConfirmedIcon>
      <VStack spacing={3} justify="center" fontWeight="bold">
        <Text fontSize="xl">Transaction Submitted</Text>
        {chainId && hash && (
          <Link href={`https://scan.vialabs.io/transaction/${hash}`} isExternal>
            <HStack color={DEX_COLORS.primary}>
              <Text fontSize="sm">View on Explorer</Text>
              <CronosIcon boxSize={5} />
            </HStack>
          </Link>
        )}
        {/* {showAddToWalletButton && (
          <AddToWalletButton
            mt="12px"
            width="fit-content"
            marginTextBetweenLogo="6px"
            textOptions={AddToWalletTextOptions.TEXT_WITH_ASSET}
            tokenAddress={token?.address}
            tokenSymbol={currencyToAdd!.symbol}
            tokenDecimals={token?.decimals}
          />
        )} */}
        <PrimaryButton onClick={onDismiss} mt="20px">
          Close
        </PrimaryButton>
      </VStack>
    </Box>
  );
}

interface ConfirmationModalProps {
  title: string;
  customOnDismiss?: () => void;
  hash: string | undefined;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
  currencyToAdd?: Currency | undefined;
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
