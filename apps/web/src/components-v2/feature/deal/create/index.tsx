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
import {Step1ChooseItems} from "@src/components-v2/feature/deal/create/step-1-taker-items";
import {DealPreview} from "@src/components-v2/feature/deal/create/deal-preview";
import {Step2ChooseItems} from "@src/components-v2/feature/deal/create/step-2-maker-items";
import {useUser} from "@src/components-v2/useUser";
import {ciEquals} from "@market/helpers/utils";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {DefaultContainer} from "@src/components-v2/shared/containers";
import {Step3ReviewDetails} from "@src/components-v2/feature/deal/create/step-3-review-details";
import useCreateDeal from "@src/components-v2/feature/deal/use-create-deal";
import useBarterDeal from "@src/components-v2/feature/deal/use-barter-deal";
import {CheckCircleIcon} from "@chakra-ui/icons";
import {useRouter} from "next/router";
import { Step0ChooseChain } from '@src/components-v2/feature/deal/create/step-0-choose-chain';
import { CreateDealStep } from '@market/state/jotai/atoms/deal';

const sidebarWidth = '400px';

interface CreateDealProps {
  address: string;
}

export const CreateDeal = ({address}: CreateDealProps) => {
  const user = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(CreateDealStep.CHOOSE_CHAIN);
  const [executing, setExecuting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [createDeal, _] = useCreateDeal();
  const { barterState } = useBarterDeal();

  const handleChangeStep = (step: number) => {
    setCurrentStep(step);
  }

  const handleConfirm = async () => {
    try {
      setExecuting(true);
      await createDeal(barterState);
      setIsComplete(true);
    } catch (e) {
      console.log(e);
    } finally {
      setExecuting(false);
    }
  }

  const handleExit = () => {
    // setIsComplete(false);
    router.push(`/account/${user.address}?tab=deals`);
  }

  return (
    <>
      <DefaultContainer>
        <Box minH='calc(100vh - 289px)'>
          {currentStep === CreateDealStep.CHOOSE_CHAIN ? (
            <Step0ChooseChain address={address} />
          ) : currentStep === CreateDealStep.CHOOSE_TAKER ? (
            <Step1ChooseItems address={address} />
          ) : (
            <>
              {!!user.address ? (
                <>
                  {ciEquals(address, user.address) ? (
                    <Box my={4} textAlign='center' px={2}>
                      Cannot initiate a deal with yourself. Try selecting another user or connecting a different wallet.
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
      <DealPreview
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
              <Text>Deal Request Confirmed</Text>
            </HStack>
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          You have successfully initiated a deal with this user!
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