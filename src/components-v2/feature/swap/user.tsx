import {
  Box,
  ButtonGroup,
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
  Text,
  VStack
} from "@chakra-ui/react";
import React, {useState} from "react";
import {Step1ChooseItems} from "@src/components-v2/feature/swap/step-1-choose-items";
import {SwapPreview} from "@src/components-v2/feature/swap/swap-preview";
import {Step2ChooseItems} from "@src/components-v2/feature/swap/step-2-offer-items";
import {useUser} from "@src/components-v2/useUser";
import {ciEquals} from "@src/utils";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {DefaultContainer} from "@src/components-v2/shared/default-container";
import {Step3ReviewDetails} from "@src/components-v2/feature/swap/step-3-review-details";
import useCreateSwap from "@src/components-v2/feature/swap/use-create-swap";
import useBarterSwap from "@src/components-v2/feature/swap/use-barter-swap";
import {CheckCircleIcon} from "@chakra-ui/icons";
import {useRouter} from "next/router";

const sidebarWidth = '400px';

interface UserSwapViewProps {
  address: string;
}

export const UserSwapView = ({address}: UserSwapViewProps) => {
  const user = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [executing, setExecuting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [createSwap, _] = useCreateSwap();
  const { barterState } = useBarterSwap();

  const handleChangeStep = (step: number) => {
    setCurrentStep(step);
  }

  const handleConfirm = async () => {
    try {
      setExecuting(true);
      await createSwap(barterState);
      setIsComplete(true);
    } catch (e) {
      console.log(e);
    } finally {
      setExecuting(false);
    }
  }

  const handleExit = () => {
    setIsComplete(false);
    router.push('/swap');
  }

  return (
    <>
      <DefaultContainer>
        <Box minH='calc(100vh - 289px)'>
          {currentStep === 1 ? (
            <Step1ChooseItems address={address} />
          ) : (
            <>
              {!!user.address ? (
                <>
                  {ciEquals(address, user.address) ? (
                    <Box my={4} textAlign='center'>
                      Cannot swap with yourself. Try selecting another user or connecting a different wallet.
                    </Box>
                  ) : (
                    <>
                      {currentStep === 2 ? (
                        <Step2ChooseItems address={user.address} />
                      ) : currentStep === 3 && (
                        <Step3ReviewDetails
                          address={user.address}
                          onConfirm={handleConfirm}
                        />
                      )}
                    </>
                  )}
                </>
              ) : (
                <Box my={8} textAlign='center'>
                  <PrimaryButton onClick={() => user.connect()}>
                    Connect wallet
                  </PrimaryButton>
                </Box>
              )}
            </>
          )}
        </Box>
      </DefaultContainer>
      <SwapPreview
        onChangeStep={handleChangeStep}
        onConfirm={handleConfirm}
        isConfirming={executing}
      />
      <SuccessModal isOpen={isComplete} onClose={handleExit} />
    </>
  )
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal = ({isOpen, onClose}: SuccessModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>
            <HStack>
              <CheckCircleIcon color="green" bg="white" rounded="full" border="1px solid white"/>
              <Text>Swap Request Confirmed</Text>
            </HStack>
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          You have successfully initiated a swap with this user!
        </ModalBody>

        <ModalFooter alignContent="center">
          <VStack w="full">
            <Flex justify="center">
              <ButtonGroup>
                <PrimaryButton onClick={onClose}>
                  Close
                </PrimaryButton>
              </ButtonGroup>
            </Flex>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}