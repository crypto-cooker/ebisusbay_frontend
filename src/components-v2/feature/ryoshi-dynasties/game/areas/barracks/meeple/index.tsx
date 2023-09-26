import {Box, Center, Flex, HStack, Icon, IconButton, Image, SimpleGrid, Spacer, Text, Wrap, WrapItem, Stack, useDisclosure, VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  FormControl,
  FormLabel,
  Checkbox,
  Grid,

  } from "@chakra-ui/react"
import React, {useCallback, useContext, useEffect, useState, useRef} from 'react';
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
import { getTimeDifference } from "@src/utils";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const gothamBook = localFont({ src: '../../../../../../../../src/fonts/Gotham-Book.woff2' });

interface MeepleProps {
  isOpen: boolean;
  onClose: () => void;
}

const Meeple = ({isOpen, onClose}: MeepleProps) => {
  const user = useAppSelector((state) => state.user);
  const { config: rdConfig, user:rdUser, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const fetcher = async () => {
    return await ApiService.withoutKey().ryoshiDynasties.getDailyRewards(user.address!)
  }
  const [page, setPage] = useState<string>();
  const [meepleOnDuty, setMeepleOnDuty] = useState<number>(0);
  const [meepleOffDuty, setMeepleOffDuty] = useState<number>(0);
  const [needsToPayUpkeep, setNeedsToPayUpkeep] = useState<boolean>(false);
  const [upkeepCost, setUpkeepCost] = useState<number>(0);
  const [upkeepModifirer, setUpkeepModifirer] = useState<number>(0);
  const [upkeepPaid, setUpkeepPaid] = useState<number>(200);
  const [upkeepPrice, setUpkeepPrice] = useState<number>(1);
  const [totalUpkeepRequired, setTotalUpkeepRequired] = useState<number>(0);
  const [upkeepRemaining, setUpkeepRemaining] = useState<number>(0);

  const { isOpen: isOpenUpkeepModal, onOpen: onOpenUpkeepModal, onClose: onCloseUpkeepModal } = useDisclosure();
  const { isOpen: isOpenTurnInCardsModal, onOpen: onOpenTurnInCardsModal, onClose: onCloseTurnInCardsModal } = useDisclosure();
  const { isOpen: isOpenWithdrawModal, onOpen: onOpenWithdrawModal, onClose: onCloseWithdrawModal } = useDisclosure();

  //withdraw meeple
  const [meepleToWithdraw, setMeepleToWithdraw] = useState(0);
  const handleQuantityChange = (stringValue: string, numValue: number) => setMeepleToWithdraw(numValue)

  //timer
  const Ref = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState('00:00:00');
  const getTimeRemaining = (e:any) => {
    const total = Date.parse(e) - Date.now();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
        total, days, hours, minutes, seconds
    };
  }
  const startTimer = (e:any) => {
      let { total, hours, days, minutes, seconds } = getTimeRemaining(e);
      if (total >= 0) {
          setTimer(
              ((days) > 0 ? (days + ' days ') : (
              (hours > 9 ? hours : '0' + hours) + ':' +
              (minutes > 9 ? minutes : '0' + minutes) + ':' +
              (seconds > 9 ? seconds : '0' + seconds)))
          )
      }
  }
  const clearTimer = (e:any) => {
    startTimer(e);
    if (Ref.current) clearInterval(Ref.current as any);
    const id = setInterval(() => { startTimer(e); }, 1000) 
    Ref.current = id;
  }

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
  const GetUpkeepDeadline = () => {
    if(!rdGameContext) return;
    clearTimer(rdGameContext.game.endAt)
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
  const SelectCard = (card:string) => {
    console.log(card);
  }
  const dummyCards = [
    "Ebisus Bay Tier 1",
    "Ebisus Bay Tier 2",
    "Ebisus Bay Tier 3",
    "Izanami's Cradle Tier 1",
    "Izanami's Cradle Tier 1",
    "Iron Reach Tier 1",
    "Iron Reach Tier 2",
    "Iron Reach Tier 2",
    "Iron Reach Tier 2",
    "Iron Reach Tier 2",
    "Iron Reach Tier 2",
    "Iron Reach Tier 2",
    "Iron Reach Tier 2",
  ]

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
    return cost;
  }
 
  useEffect(() => {
    GetMeepleCount();
    GetUpkeepPaymentStatus();
    GetUpkeepDeadline();
  }, [rdGameContext])

  useEffect(() => {
    GetUpkeepCost();
    const totalUpkeep = CalculateUpkeepCost(meepleOffDuty);
    setTotalUpkeepRequired(totalUpkeep);
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
      title='Meeple Barracks'
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
            {/* Withdraw */}
            <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' mt={4}>
              <Box textAlign='left' as="b" fontSize={18}>
                Meeple Management
              </Box>
              <Flex justifyContent={'space-between'} align={'center'}>
                <HStack spacing={1}>
                  <Text color={'#aaa'} alignContent={'baseline'} pt={2}> Meeple On Duty: </Text>
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
                    Warning: Should you hold more than the current limt (3000 Meeple) at the end of the week, they will be lost. Withdraw them from the platform <b> or </b> spend them in battles and resource gathering.
                  </Text>
                </Stack>
              )}
            </Box>
            
            {/* Upkeep */}
            <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' mt={4}>
              <Box textAlign='left' as="b" fontSize={18}>
                Weekly Upkeep
              </Box>
              <Text color={'#aaa'}>Deadline: {timer}</Text>

              <Flex justifyContent={'space-between'} align={'center'}>
                <HStack spacing={1}>
                  <Text color={'#aaa'} alignContent={'auto'} pt={2}> Meeple Off Duty: </Text>
                  <Text  as={'b'} fontSize='28' p={2}>{meepleOffDuty}</Text>
                </HStack>
                <VStack spacing={1} >
                  {needsToPayUpkeep ? (
                    <RdButton
                      h={12}
                      onClick={() => onOpenUpkeepModal()}
                      size='lg'
                      fontSize={{base: '12', sm: '18'}}
                      >
                      Pay Upkeep
                    </RdButton> 
                  ) : (
                    <Text color={'#aaa'}>Weekly Upkeep Paid</Text>
                  )}
                  </VStack>
              </Flex>
            </Box>

            {/* Cards */}
            <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' mt={4}>
              <Flex justifyContent={'space-between'} align={'center'}>
                <VStack spacing={1} align='left' mb={10}>
                  <Box textAlign='left' as="b" fontSize={18}>
                    Earn Additional Meeple
                  </Box>
                  <Text color={'#aaa'} as={'i'}>Card values can be found in FAQ</Text>
                </VStack>
                <RdButton
                  h={12}
                  mt={10}
                  onClick={() => onOpenTurnInCardsModal()}
                  size='lg'
                  fontSize={{base: '12', sm: '18'}}
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

          <RdModal isOpen={isOpenUpkeepModal} onClose={onCloseUpkeepModal} title={'Upkeep Cost Breakdown'} >
            <RdModalAlert>
              <Box bgColor='#292626' rounded='md' p={4} fontSize='sm'>
              <SimpleGrid columns={2} spacing={0} w={'100%'}>
                  <Text color={'#aaa'} textAlign={'left'} p={2}> Upkeep cost for {meepleOffDuty} Off Duty</Text>
                  <Text as={'b'} textAlign={'right'} p={2}> {totalUpkeepRequired} </Text>
                  <Text color={'#aaa'} textAlign={'left'} p={2}> Upkeep paid this week </Text>
                  <Text as={'b'} textAlign={'right'} p={2}> -{upkeepPaid} </Text>
                  <Text color={'#aaa'} pt={10} pl={2} textAlign={'left'} > Remaining Upkeep to be paid: </Text>
                  <Text as={'b'} textAlign={'right'} fontSize='28'pt={10} > {totalUpkeepRequired - upkeepPaid} </Text>
              </SimpleGrid>

            </Box>
            </RdModalAlert>
            <RdModalFooter>
              <Stack justifyContent={'space-between'} direction='row' spacing={6}>
                  <RdButton onClick={onCloseUpkeepModal} size='lg' fontSize={{base: '18', sm: '24'}}> Cancel </RdButton>
                  <RdButton onClick={() => PayUpkeep()} size='lg' fontSize={{base: '18', sm: '24'}}> Pay Upkeep </RdButton>
              </Stack>
            </RdModalFooter>
          </RdModal>


          <RdModal isOpen={isOpenTurnInCardsModal} onClose={onCloseTurnInCardsModal} title={'Turn In Cards'} >
            <RdModalAlert>
              <Box bgColor='#292626' rounded='md' p={4} fontSize='sm'>
              <Grid gridTemplateColumns={{sm: '225px 50px 225px 50px'}} w={'100%'}>
                {dummyCards.map((card, index) => (
                  <>
                  <Text color={'#aaa'} textAlign={'left'} p={2}> {card}</Text>
                  <Checkbox maxW={10} colorScheme="yellow" onClick={() => SelectCard(card)}/>
                  </>
                ))}
              </Grid>

            </Box>
            </RdModalAlert>
            <RdModalFooter>
              <Stack justifyContent={'space-between'} direction='row' spacing={6}>
                  <RdButton onClick={onCloseTurnInCardsModal} size='lg' fontSize={{base: '18', sm: '24'}}> Cancel </RdButton>
                  <RdButton onClick={() => TurnInCards()} size='lg' fontSize={{base: '18', sm: '24'}}>Turn In Selected Cards </RdButton>
              </Stack>
            </RdModalFooter>
          </RdModal>
          
          <RdModal isOpen={isOpenWithdrawModal} onClose={onCloseWithdrawModal} title={'Withdraw'} >
            <RdModalAlert>
              <Box bgColor='#292626' rounded='md' p={4} fontSize='sm'>
          
              <Text color={'#aaa'} w={'100%'} textAlign={'left'} p={2}> Select Meeple to Withdraw: </Text>
              <Flex justifyContent='center' w={'100%'}>
                <NumberInput 
                  defaultValue={0} 
                  min={0} 
                  max={meepleOnDuty} 
                  name="quantity"
                  onChange={handleQuantityChange}
                  value={meepleToWithdraw}
                  clampValueOnBlur={true}
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
              <Stack justifyContent={'space-between'} direction='row'>
                <RdButton onClick={onCloseWithdrawModal} size='lg' fontSize={{base: '18', sm: '24'}}> Cancel </RdButton>
                <RdButton onClick={() => WithdrawMeeple()} size='lg' fontSize={{base: '18', sm: '24'}}> Withdraw </RdButton>
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
