import {Box, Center, Flex, HStack, Icon, IconButton, Image, SimpleGrid, Spacer, Text, Wrap, WrapItem, Stack, useDisclosure, VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  FormControl,
  FormLabel,

  } from "@chakra-ui/react"
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {appConfig} from "@src/Config";
import { RyoshiDynastiesContext, RyoshiDynastiesContextProps } from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {toast} from "react-toastify";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";
import {ApiService} from "@src/core/services/api-service";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import {BigNumber, Contract, ethers} from "ethers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import localFont from "next/font/local";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/meeple/faq-page";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {RdModalAlert, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const gothamBook = localFont({ src: '../../../../../../../../src/fonts/Gotham-Book.woff2' });

interface MeepleProps {
  isOpen: boolean;
  onClose: () => void;
}

const Meeple = ({isOpen, onClose}: MeepleProps) => {
  const user = useAppSelector((state) => state.user);
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const fetcher = async () => {
    return await ApiService.withoutKey().ryoshiDynasties.getDailyRewards(user.address!)
  }
  const [page, setPage] = useState<string>();
  const [meepleOnDuty, setMeepleOnDuty] = useState<number>(0);
  const [meepleOffDuty, setMeepleOffDuty] = useState<number>(0);
  const [needsToPayUpkeep, setNeedsToPayUpkeep] = useState<boolean>(true);
  const [upkeepCost, setUpkeepCost] = useState<number>(0);
  const [upkeepModifirer, setUpkeepModifirer] = useState<number>(0);
  const [upkeepPrice, setUpkeepPrice] = useState<number>(1);

  // const { isOpen: isConfirmationOpen, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure();
  const { isOpen: isOpenUpkeepModal, onOpen: onOpenUpkeepModal, onClose: onCloseUpkeepModal } = useDisclosure();
  const { isOpen: isOpenTurnInCardsModal, onOpen: onOpenTurnInCardsModal, onClose: onCloseTurnInCardsModal } = useDisclosure();
  const { isOpen: isOpenWithdrawModal, onOpen: onOpenWithdrawModal, onClose: onCloseWithdrawModal } = useDisclosure();

  //withdraw meeple
  const [meepleToWithdraw, setMeepleToWithdraw] = useState(0);
  const handleQuantityChange = (stringValue: string, numValue: number) => setMeepleToWithdraw(numValue)

  const handleClose = () => {
    onClose();
  }

  const upKeepModifier = [
    { min: 0, value: 0},
    { min: 201, value: 1},
    { min: 1000, value: 2},
    { min: 5000, value: 3},
  ]

  const PayUpkeep = () => {
    //add function to play Upkeep
  }

  const TurnInCards = () => {
    //add function to turn in cards
  }

  const WithdrawMeeple = () => {
    //add function to withdraw Meeple
  }

  const GetMeepleCount = () => {
    //add function to get Meeple Count
    setMeepleOnDuty(3520);
    setMeepleOffDuty(9000);
  }

  const GetUpkeepCost = () => {
    //add function to get Upkeep Cost
    setUpkeepCost(50);
  }

  const GetUpkeepPaymentStatus = () => {
    //add function to get Upkeep Payment Status
    setNeedsToPayUpkeep(true);
  }
  
  const GetUpkeepModifier = () => {
    let cost = 0;
    upKeepModifier.forEach((item) => {
      if (meepleOnDuty >= item.min) {
        cost = item.value;
      }
    })

    setUpkeepModifirer(cost);
  }

  const CalculateUpkeepCost = (meepleAmount:number) => {
    //cost will be marginal, 0-200 free, 201-999 1x, 1000-4999 2x, 5000+ 3x
    let cost = 0;
    for(let i = 0; i < meepleAmount; i++){
      if(i < 200){
        cost += 0;
      }
      else if(i < 1000){
        cost += 1;
      }
      else if(i < 5000){
        cost += 2;
      }
      else{
        cost += 3* (meepleAmount - 5000);
        break;
      }
    }
    console.log("Upkeep Cost for " + meepleAmount + " is " + cost + "x");
  }
 
  useEffect(() => {
    GetMeepleCount();
    GetUpkeepPaymentStatus();
  }, [])

  useEffect(() => {
    GetUpkeepCost();
    CalculateUpkeepCost(meepleOffDuty);
    // CalculateUpkeepCost(1000);
    // CalculateUpkeepCost(9000);
    // CalculateUpkeepCost(200);
    // CalculateUpkeepCost(201);

  }, [meepleOnDuty])

  const handleBack = () => {
    if (!!page) {
      setPage(undefined);
    } else {
      setPage('faq');
    }
  };

  return (
    <>
  <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Meeple Management'
      size='2xl'
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <>
          <Box p={4}>
            <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' mt={4}>
              <Flex justifyContent={'space-between'} align={'center'}>
                <HStack spacing={1}>
                  <Text color={'#aaa'} alignContent={'baseline'} p={2}> Meeple On Duty: </Text>
                  <Text as={'b'} fontSize='28' p={2}>{meepleOnDuty}</Text>
                </HStack>
                <RdButton
                  h={12}
                  onClick={() => onOpenWithdrawModal()}
                  size='lg'
                  fontSize={{base: '12', sm: '18'}}
                  >
                  Withdraw Meeple
                </RdButton> 
              </Flex>
              {meepleOnDuty > 3000 && (
                <Stack direction='row' align='center' bg='#f8a211' p={2} rounded='sm' mt={4}>
                  <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} color='#333' boxSize={8}/>
                  <Text
                      fontSize='14'
                      color='#333'
                      fontWeight='bold'
                  >
                    Warning: Should you hold more than the current limt (3000 Meeple) at the end of the week, they will be lost. Withdraw them from the platform or to spend them in battles and resource gathering.
                  </Text>
                </Stack>
              )}
            </Box>

            <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' mt={4}>
              <Box textAlign='center'>
                  Weekly Upkeep
                </Box>
                <Flex justifyContent={'space-between'}>
                  <HStack marginTop={'auto'} spacing={1} mb={4} justifyContent={'center'}>
                    <Text marginTop={'auto'} align='center' color={'#aaa'} alignContent={'auto'}p={2}> Meeple Off Duty: </Text>
                    <Text marginTop={'auto'} align='center' as={'b'} fontSize='28' p={2}>{meepleOffDuty}</Text>
                    <VStack marginTop={'auto'}  >
                      <Text pb={0} color={'#aaa'}>Upkeep Cost:</Text>
                      <Text pt={0} mt={0} color={'#aaa'}>{upkeepCost}Koban x {upkeepModifirer}X = {upkeepCost * upkeepModifirer}</Text>
                    </VStack>
                  </HStack>
                  <Box justifyContent='space-between' alignItems='center'>
                    {needsToPayUpkeep ? (
                      <RdButton
                        h={12}
                        onClick={() => onOpenUpkeepModal()}
                        size='lg'
                        >
                        Pay Upkeep
                      </RdButton> 
                    ) : (
                      <Text color={'#aaa'}>Weekly Upkeep Paid</Text>
                    )}
                  </Box>
                </Flex>
              </Box>

              <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' mt={4}>
                <Box textAlign='center'>
                Earn Additional Meeple
                </Box>
                <Flex justifyContent={'space-between'}>
                  <RdButton
                      h={12}
                      onClick={() => onOpenTurnInCardsModal()}
                      size='lg'
                      >
                      Turn in Cards
                  </RdButton> 
               
                </Flex>
              </Box>

              <Box p={4}>
                <Flex direction='row' justify='center' mb={2}>
                  <SimpleGrid columns={{base: 2, sm: 4}}>
                  
                  </SimpleGrid>
                </Flex>
              </Box>
            </Box>

            <MeepleModal
              isOpenModal={isOpenUpkeepModal}
              onCloseModal={onCloseUpkeepModal}
              actionFunction={() => PayUpkeep()}
              title='Pay Upkeep'
              body='Pay Upkeep'
            />
            <MeepleModal
              isOpenModal={isOpenTurnInCardsModal}
              onCloseModal={onCloseTurnInCardsModal}
              actionFunction={() => TurnInCards()}
              title='Turn in Cards'
              body='Turn in Cards'
            />

            <RdModal isOpen={isOpenWithdrawModal} onClose={onCloseWithdrawModal} title={'Withdraw'} >
              <RdModalAlert>
                <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' mt={4}>
            
                <Text color={'#aaa'} w={'100%'} textAlign={'left'} p={2}> Select Meeple to Withdraw: </Text>
                <Flex justifyContent='center' w={'100%'}>
                  <NumberInput 
                    defaultValue={0} 
                    min={0} 
                    max={meepleOnDuty} 
                    name="quantity"
                    onChange={handleQuantityChange}
                    value={meepleToWithdraw}
                    w='85%'
                    >
                    <NumberInputField />
                    <NumberInputStepper >
                      <NumberIncrementStepper color='#ffffff'/>
                      <NumberDecrementStepper color='#ffffff'/>
                    </NumberInputStepper>
                  </NumberInput>

                  <Spacer />
                  <Button 
                    variant={'outline'}
                    onClick={() => setMeepleToWithdraw(meepleOnDuty)}
                    > Max </Button>
                </Flex>

                <Flex justifyContent={'space-between'} align={'center'} mt={'8'}>
                  <Text color={'#aaa'} alignContent={'baseline'} p={2}> Remaining Meeple On Duty: </Text>
                  <Text as={'b'} fontSize='28' p={2}>{meepleOnDuty - meepleToWithdraw}</Text>
                </Flex>

              </Box>
              </RdModalAlert>
              <RdModalFooter>
                <Stack justify='center' direction='row' spacing={6}>
                    <RdButton onClick={onCloseWithdrawModal} size='lg'> Cancel </RdButton>
                    <RdButton onClick={() => WithdrawMeeple()} size='lg'> Confirm </RdButton>
                </Stack>
              </RdModalFooter>
            </RdModal>
        </>
      )}
    </RdModal>
    </>
  )
}

export default Meeple;

interface MeepleModalProps {
  isOpenModal: boolean;
  onCloseModal: () => void;
  actionFunction: () => void;
  title: string;
  body: string
}

const MeepleModal = ({isOpenModal, onCloseModal, actionFunction, title, body}: MeepleModalProps) => {
  return (
    <RdModal isOpen={isOpenModal} onClose={onCloseModal} title={title} >
      <RdModalAlert>
        <Text>{body}</Text>
      </RdModalAlert>
      <RdModalFooter>
        <Stack justify='center' direction='row' spacing={6}>
            <RdButton onClick={onCloseModal} size='lg'> Cancel </RdButton>
            <RdButton onClick={() => actionFunction()} size='lg'> Confirm </RdButton>
        </Stack>
      </RdModalFooter>
    </RdModal>
  );
}

{/* <RdModal isOpen={isOpenUpkeepModal} onClose={onCloseUpkeepModal} title='Pay Upkeep' >
<RdModalAlert>
  <Text>Notes on Upkeep <Text as='span' color='#FDAB1A' fontWeight='bold'> FRTN</Text></Text>
</RdModalAlert>
<RdModalFooter>
  <Stack justify='center' direction='row' spacing={6}>
      <RdButton onClick={onCloseUpkeepModal} size='lg'> Cancel </RdButton>
      <RdButton onClick={() => PayUpkeep()} size='lg'> Pay </RdButton>
  </Stack>
</RdModalFooter>
</RdModal> */}