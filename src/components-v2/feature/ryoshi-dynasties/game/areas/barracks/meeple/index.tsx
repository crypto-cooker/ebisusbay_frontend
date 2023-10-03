import {Box, Center, Flex, HStack, Icon, IconButton, Image, SimpleGrid, Spacer, Text, Wrap, WrapItem, Stack, useDisclosure, VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Grid,
  Tabs,
  TabList,
  Tab,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  GridItem,
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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/meeple/faq-page";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {RdModalAlert, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {useQuery} from "@tanstack/react-query";
import NextApiService from "@src/core/services/api-service/next";
import {MeepleUpkeep, MeepleMint, MeepleTradeInCards} from "@src/core/api/RyoshiDynastiesAPICalls";
import {BigNumber, Contract, ethers} from "ethers";
import {commify, isAddress} from "ethers/lib/utils";
import Resources from "@src/Contracts/Resources.json";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {parseErrorMessage} from "@src/helpers/validator";
import ImageService from "@src/core/services/image";

const config = appConfig();

import axios from "axios";
const api = axios.create({
  baseURL: config.urls.api,
});

interface LocationData{
  location: string;
  tier: number;
  id: number;
  playerCards: number;
}

const upKeepModifier = [
  { min: 0, value: 0},
  { min: 201, value: 1},
  { min: 1000, value: 2},
  { min: 5000, value: 3},
]

interface MeepleProps {
  isOpen: boolean;
  onClose: () => void;
}

const Meeple = ({isOpen, onClose}: MeepleProps) => {

  const user = useAppSelector((state) => state.user);
  const { config: rdConfig, user:rdUser, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [page, setPage] = useState<string>();

  const collectionAddress = config.contracts.resources
  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
  const {requestSignature} = useEnforceSignature();

  //upkeep
  const [needsToPayUpkeep, setNeedsToPayUpkeep] = useState<boolean>(false);
  const [upkeepCost, setUpkeepCost] = useState<number>(0);
  const [upkeepModifirer, setUpkeepModifirer] = useState<number>(0);
  const [upkeepPaid, setUpkeepPaid] = useState<number>(200);
  const [upkeepPrice, setUpkeepPrice] = useState<number>(1);
  const [totalUpkeepRequired, setTotalUpkeepRequired] = useState<number>(0);
  const [upkeepRemaining, setUpkeepRemaining] = useState<number>(0);
  const [meepleOnDuty, setMeepleOnDuty] = useState<number>(0);
  const [meepleOffDuty, setMeepleOffDuty] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(100)
  const [upkeepPayment, setUpkeepPayment] = useState<number>(0);
  const upkeepDue = totalUpkeepRequired - upkeepPaid;
  const paymentAmount = upkeepDue * (sliderValue/100);

  //Mint meeple
  const [meepleToMint, setMeepleToMint] = useState(0);
  const handleQuantityChange = (stringValue: string, numValue: number) => setMeepleToMint(numValue)

  //turn in cards
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [filteredCards, setFilteredCards] = useState<LocationData[]>([]);
  const [cardsInWallet, setCardsInWallet] = useState<LocationData[]>([]);
  const [cardsToTurnIn, setCardsToTurnIn] = useState<LocationData[]>([]);

  //modals
  const { isOpen: isOpenUpkeepModal, onOpen: onOpenUpkeepModal, onClose: onCloseUpkeepModal } = useDisclosure();
  const { isOpen: isOpenTurnInCardsModal, onOpen: onOpenTurnInCardsModal, onClose: onCloseTurnInCardsModal } = useDisclosure();
  const { isOpen: isOpenMintModal, onOpen: onOpenMintModal, onClose: onCloseMintModal } = useDisclosure();

  const {data: walletData} = useQuery({
    queryKey: ['TJTest', user.address],
    queryFn: () => NextApiService.getWallet(user.address!, {
      page: 1,
      pageSize: 100,
      collection: collectionAddress
    }),
    refetchOnWindowFocus: false,
    enabled: !!user.address && !!collectionAddress,
    initialData: {data: [], hasNextPage: false, nextPage: 2, page: 1}
  });

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

  const PayUpkeep = async (upkeepPayment:number) => {
    if (!user.address) return;
    const signature = await requestSignature();
    try {
      // const signature = await admin._signTypedData(domain, typeUpkeepRequest, upkeepRequest);
      // const tx = await resources.connect(user1).upkeep(upkeepRequest, signature);

      const cmsResponse = await MeepleUpkeep(user.address, signature, Number(upkeepPayment.toFixed(0)));
      console.log("CMS Response: ", cmsResponse);
      //signarure, costamounts, exipires, nonce

      const resourcesContract = new Contract(collectionAddress, Resources, readProvider);
      // const tx = await resourcesContract.upkeep(user.address?.toLowerCase(), );
      // const receipt = await tx.wait();

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } 
  }
  const MintMeeple = async (amountToMint:number) => {
    if (!user.address) return;
    const signature = await requestSignature();
    try {

      const cmsResponse = await MeepleMint(user.address, signature, amountToMint);
      console.log("CMS Response: ", cmsResponse);

      const resourcesContract = new Contract(collectionAddress, Resources, readProvider);
      // resosources.connect(user1).deposit([2], [amount_to_deposit]);

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } 
  }
  const TurnInCards = async () => {
    if (!user.address) return;
    const signature = await requestSignature();

    // let ids:number[] = [];
    // let amounts:number[] = [];
    // cardsToTurnIn.forEach((card) => {
    //   for(let i = 0; i < 3; i++){
    //     ids.push(card.id);
    //     amounts.push(3);
    //   }
    // })
    let id;
    let amount = 0;
    cardsToTurnIn.forEach((card) => {
      for(let i = 0; i < 3; i+=3){
        id = card.id;
        amount+=3;
      }
    })

    try {
      console.log("Turn in cards: ", id, amount);
      const cmsResponse = await MeepleTradeInCards(user.address, signature, id, amount);
      console.log("CMS Response: ", cmsResponse);

      // const resourcesContract = new Contract(collectionAddress, Resources, readProvider);
      //const signature2 = await signer1._signTypedData(domain, typeCraftRequest, request2);
      // const tx = await resources.connect(user1).craftItems(request2, signature2);

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } 
  }

  const GetMeepleCount = async () => {
    //add function to get Meeple Count
    setMeepleOnDuty(3520);
    setMeepleOffDuty(9000);

    const resourcesContract = new Contract(collectionAddress, Resources, readProvider);
    const data = await resourcesContract.activeMeeples(user.address)
 
    console.log("Meeple Count: ", BigNumber.from(data).toNumber());
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
  const RefreshFilteredCards = () => {
    const filtered = locationData.filter((location) => location.tier == selectedTab+1);
    setFilteredCards(filtered);
  }
  const GetLocationData = async () => {
    let data = await api.get("fullcollections?address=" + collectionAddress);
    let locations:LocationData[] = [];
    // console.log("Location Data: ", data.data);

    //filter out only locations 
    for(let i = 0; i < data.data.nfts.length; i++){
      for(let j=0; j < data.data.nfts[i].attributes?.length; j++){
        if(data.data.nfts[i].attributes[j].trait_type == "Location"){
          locations.push({
            location: data.data.nfts[i].attributes[j].value,
            tier: data.data.nfts[i].attributes[1].value,
            id: data.data.nfts[i].id,
            playerCards: 0,
          })
        }
      }
    }
    setLocationData(locations);
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
    // console.log("Upkeep Cost for " + meepleAmount + " is " + cost + "x");
    return cost;
  }
  const SetUpCardsInWallet = () => {
    console.log("Wallet data");
    let cards:LocationData[] = [];
    walletData.data.forEach((card) => {
      {
        card.attributes !== undefined && card.attributes[1].trait_type === "Tier" ? 
        cards.push({
          location: card.name,
          tier: card.attributes[1].value,
          id: Number(card.nftId),
          playerCards: card.balance === undefined ? 0 : card.balance,
        })
        : <></>
      }
      
    })
    setCardsInWallet(cards)
    setCardsToTurnIn([])
  }
  const SelectCardsToTurnIn = (nftId:number) => {
    let cards:LocationData[] = [];
    cardsInWallet.forEach((card) => {
      if(card.id == nftId){
        console.log("Set " + card.location + " to be turned in");
        cards.push(card);
      }
    })
    //remove 3 of EACH CARD selected from player wallet
    let cardsInWalletCopy = [...cardsInWallet];
    cardsInWalletCopy.forEach((card) => {
      cards.forEach((selectedCard) => {
        if(card.id == selectedCard.id){
          card.playerCards -= 3;
        }
      })
    })
    setCardsInWallet(cardsInWalletCopy);
    setCardsToTurnIn([...cardsToTurnIn, ...cards]);
  }

  useEffect(() => {
    RefreshFilteredCards();

  }, [selectedTab])

  useEffect(() => {
    if(!walletData) return;

    // console.log("Wallet data: ", walletData);

    if(walletData.data.length > 0){
      SetUpCardsInWallet();
    }

  }, [walletData])

  useEffect(() => {
    locationData.forEach((location) => {
      cardsInWallet.forEach((card) => {
        if(Number(card.id) === Number(location.id)){
          locationData[locationData.indexOf(location)].playerCards = card.playerCards;
        }
      })
    })
    RefreshFilteredCards();
  } , [locationData, cardsInWallet])
 
  useEffect(() => {
    // GetMeepleCount();
    GetUpkeepPaymentStatus();
    GetUpkeepDeadline();
    GetLocationData();
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

  useEffect(() => {
    GetMeepleCount();
  }, [])


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
            {/* Mint */}
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
                  onClick={() => onOpenMintModal()}
                  size='lg'
                  fontSize={{base: '12', sm: '18'}}
                  >
                  Mint Meeple
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
                    Warning: Should you hold more than the current limt (3000 Meeple) at the end of the week, you will not recieve Meeple at the start of the next week. Turn them into tokens to take them off duty <b> or </b> spend them in battles and resource gathering.
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
                  <Text color={'#aaa'} textAlign={'left'} p={2}> Upkeep due</Text>
                  <Text as={'b'} textAlign={'right'} p={2}> {upkeepDue} </Text>
                  <Text color={'#aaa'} pt={12} pl={2} textAlign={'left'} > Payment Amount </Text>
                  <HStack   pt={10} spacing={0} justifyContent={'right'} w={'100%'}>
                    <Text as={'b'} textAlign={'right'} fontSize='28' > {paymentAmount.toFixed(0)} </Text>
                    <Image  src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/> 
                  </HStack>
                  
                  <GridItem colSpan={2} pl={4} pr={4} pt={10}>
                    <Slider aria-label='slider-ex-4' defaultValue={100} onChange={(val) => setSliderValue(val)}>
                      <SliderMark
                      value={sliderValue}
                      textAlign='center'
                      color='white'
                      mt='-10'
                      ml='-5'
                      w='12'
                    >
                      {sliderValue}%
                    </SliderMark>
                      <SliderTrack bg='red.100'>
                        <SliderFilledTrack bg='tomato' />
                      </SliderTrack>
                      <SliderThumb boxSize={6}>
                        {/* <Box color='tomato' as={'/img/ryoshi-dynasties/icons/koban.png'} /> */}
                        {/* <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/> */}
                      </SliderThumb>
                    </Slider>
                  </GridItem>

              </SimpleGrid>

            </Box>
            </RdModalAlert>
            <RdModalFooter>
              <Stack justifyContent={'space-between'} direction='row' spacing={6}>
                  <RdButton onClick={onCloseUpkeepModal} size='lg' fontSize={{base: '18', sm: '24'}}> Cancel </RdButton>
                  <RdButton onClick={() => PayUpkeep(paymentAmount)} size='lg' fontSize={{base: '18', sm: '24'}}> Pay Upkeep </RdButton>
              </Stack>
            </RdModalFooter>
          </RdModal>


          <RdModal isOpen={isOpenTurnInCardsModal} onClose={onCloseTurnInCardsModal} title={'Turn In Cards'} >
            <RdModalAlert>
              <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' minH={'300px'}>
              <Tabs isFitted variant='enclosed' onChange={(index) => setSelectedTab(index)}>
                  <TabList  mb='1em'>
                    <Tab>Tier 1</Tab>
                    <Tab>Tier 2</Tab>
                    <Tab>Tier 3</Tab>
                  </TabList>
                </Tabs>
              <Grid gridTemplateColumns={{base: '50px 225px', md: '50px 225px 50px 225px'}} w={'100%'} p={0}>
                {filteredCards.map((card) => (
                  <>
                  <HStack>
                    {card.playerCards >= 3 && (
                      <>
                      {/* <Checkbox p={0} maxW={10} colorScheme="yellow" onClick={() => SelectCard(card.id)}/> */}
                      <Button onClick={() => SelectCardsToTurnIn(card.id)} border={1} h={{base:8,md:4}}>+</Button>
                      {/* <Button w={4} h={4}>-</Button> */}
                      </>
                    )}
                  </HStack>
                  <HStack p={{base:2, md:0}}>
                    <Text p={0} 
                      color={card.playerCards >= 3 ? "#ffffff" : "#aaa"}
                      as={card.playerCards >= 3 ? 'b' :'a'} 
                      textAlign={'left'}> {card.location}</Text> 
                    <Text p={0} 
                      color={card.playerCards >= 3 ? "#ffffff" : "#aaa"}
                      as={card.playerCards >= 3 ? 'b' :'a'} 
                      >x {card.playerCards}</Text></HStack>
                  </>
                ))}
              </Grid>
            </Box>
            <Box bgColor='#292626' rounded='md' mt={4} p={4} fontSize='sm' minH={'100px'}>
              {cardsToTurnIn?.map((card) => (
                <HStack>
                  <Text p={0} color={'#aaa'} textAlign={'left'}> {card.location}</Text>
                  <Text p={0} color={'#aaa'}>x 3</Text>
                </HStack>
              ))}
            </Box>
            </RdModalAlert>
            <RdModalFooter>
              <Stack justifyContent={'space-between'} direction='row' spacing={6}>
                  <RdButton onClick={onCloseTurnInCardsModal} size='lg' fontSize={{base: '18', sm: '24'}}> Cancel </RdButton>
                  <RdButton onClick={() => TurnInCards()} size='lg' fontSize={{base: '18', sm: '24'}}>Turn In Selected Cards </RdButton>
              </Stack>
            </RdModalFooter>
          </RdModal>
          
          <RdModal isOpen={isOpenMintModal} onClose={onCloseMintModal} title={'Mint'} >
            <RdModalAlert>
              <Box bgColor='#292626' rounded='md' p={4} fontSize='sm'>
          
              <Text color={'#aaa'} w={'100%'} textAlign={'left'} p={2}> Select Meeple to Mint: </Text>
              <Flex justifyContent='center' w={'100%'}>
                <NumberInput 
                  defaultValue={0} 
                  min={0} 
                  max={meepleOnDuty} 
                  name="quantity"
                  onChange={handleQuantityChange}
                  value={meepleToMint}
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
                  onClick={() => setMeepleToMint(meepleOnDuty)}
                  > Max </Button>
              </Flex>

              <Flex justifyContent={'space-between'} align={'center'} mt={'8'}>
                <Text color={'#aaa'} alignContent={'baseline'} p={2}> Remaining Meeple On Duty: </Text>
                <Text as={'b'} fontSize='28' p={2}>{meepleOnDuty - meepleToMint}</Text>
              </Flex>

            </Box>
            </RdModalAlert>
            <RdModalFooter>
              <Stack justifyContent={'space-between'} direction='row'>
                <RdButton onClick={onCloseMintModal} size='lg' fontSize={{base: '18', sm: '24'}}> Cancel </RdButton>
                <RdButton onClick={() => MintMeeple(10)} size='lg' fontSize={{base: '18', sm: '24'}}> Mint </RdButton>
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
