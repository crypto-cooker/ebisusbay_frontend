import React, {} from 'react';
import {getTheme} from "@src/global/theme/theme";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Center,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack} from "@chakra-ui/react";
import {CheckCircleIcon, WarningIcon} from "@chakra-ui/icons";
import {useUser} from "@src/components-v2/useUser";
import { PrimaryButton, SecondaryButton } from '@src/components-v2/foundation/button';

type PurchaseUnverifiedConfirmationDialogProps = {
  onClose: () => void;
  isOpen: boolean;
  collections: any[];
  onConfirm: () => void;
};

export default function PurchaseUnverifiedConfirmationDialog({ onClose, isOpen, collections, onConfirm}: PurchaseUnverifiedConfirmationDialogProps) {
  const user = useUser();

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>
            <HStack>
              <WarningIcon />
              <Text>Unverified Collection</Text>
            </HStack>
          </Center>
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme)!.colors.textColor4} />
        <ModalBody>
          <Alert status="warning" mb={2}>
            <AlertIcon />
            <AlertDescription>
              {collections.length > 1 ? (
                <>There are several unverified collections detected. Please double check the contract addresses and confirm that these NFTs are the intended NFTs you wish to purchase before proceeding.</>
              ) : (
                <>This collection is unverified. Please double check the contract address and confirm that this NFT is the intended NFT you wish to purchase before proceeding.</>
              )}
            </AlertDescription>
          </Alert>
          <Box mb={2} mt={2}>
            <Text fontSize='lg' fontWeight='semibold'>Unverified Collections</Text>
            <hr />
          </Box>
          <VStack align='stretch'>
            {collections.map((collection) => (
              <Box fontSize={{base: 'sm', sm: 'md'}}>
                <Box fontWeight='bold'>{collection.name}</Box>
                <Box>{collection.address}</Box>
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter alignContent="center">
          <Stack align='stretch' direction='row'>
            <SecondaryButton
              onClick={onClose}
              className='flex-fill'
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={onConfirm}
              className='flex-fill'
            >
              I Understand
            </PrimaryButton>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}