import {
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Spacer,
  Text,
  Stack,
  useDisclosure,
  VStack,
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
  GridItem, FormControl, FormErrorMessage,
} from "@chakra-ui/react"
import React, {useContext, useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {appConfig} from "@src/Config";
import { RyoshiDynastiesContext, RyoshiDynastiesContextProps } from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {toast} from "react-toastify";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/meeple/faq-page";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {RdModalAlert, RdModalBody, RdModalBox, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import NextApiService from "@src/core/services/api-service/next";
import {MeepleUpkeep, MeepleMint, MeepleTradeInCards} from "@src/core/api/RyoshiDynastiesAPICalls";
import {BigNumber, Contract, ethers} from "ethers";
import Resources from "@src/Contracts/Resources.json";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {parseErrorMessage} from "@src/helpers/validator";
import ImageService from "@src/core/services/image";
import {createSuccessfulTransactionToastContent} from '@src/utils';
import { Spinner } from "@chakra-ui/react";
const config = appConfig();

import axios from "axios";
import {ApiService} from "@src/core/services/api-service";
import {commify} from "ethers/lib/utils";
import WalletNft from "@src/core/models/wallet-nft";
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
  const { config: rdConfig, user:rdUser, game: rdGameContext, refreshUser: rdRefreshUser} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [page, setPage] = useState<string>();
  const collectionAddress = config.contracts.resources
  const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

  //Ryoshi
  // const [meepleOnDuty, setMeepleOnDuty] = useState<number>(0);
  // const [meepleOffDuty, setMeepleOffDuty] = useState<number>(0);

  //upkeep
  // const [meeplePaidFor, setMeeplePaidFor] = useState<number>(0);
  const [upkeepDueText, setUpkeepDueText] = useState<string>("");
  // const [totalUpkeepRequired, setTotalUpkeepRequired] = useState<number>(0);
  // const [upkeepPaid, setUpkeepPaid] = useState<number>(0);
  // const needsToPayUpkeep = totalUpkeepRequired > upkeepPaid;

  //Turn in Cards
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [cardsInWallet, setCardsInWallet] = useState<LocationData[]>([]);

  //modals
  const { isOpen: isOpenUpkeepModal, onOpen: onOpenUpkeepModal, onClose: onCloseUpkeepModal } = useDisclosure();
  const { isOpen: isOpenTurnInCardsModal, onOpen: onOpenTurnInCardsModal, onClose: onCloseTurnInCardsModal } = useDisclosure();
  const { isOpen: isOpenMintModal, onOpen: onOpenMintModal, onClose: onCloseMintModal } = useDisclosure();
  const { isOpen: isOpenDepositModal, onOpen: onOpenDepositModal, onClose: onCloseDepositModal } = useDisclosure();

  const {data: walletData, refetch: refetchWallet, isFetching: isFetchingWallet, isLoading: isLoadingWallet} = useQuery({
    queryKey: ['MeepleManagementPage', user.address],
    queryFn: async () => {
      const wallet = await NextApiService.getWallet(user.address!, {
        page: 1,
        pageSize: 100,
        collection: collectionAddress
      });
      const nftInfo = splitWalletData(wallet.data)
      const upkeepAmount = calculateUpkeepCost(nftInfo.offDutyAmount);

      return {...nftInfo, upkeepAmount};
    },
    refetchOnWindowFocus: false,
    enabled: !!user.address && !!collectionAddress,
    initialData: {cards: [], offDutyAmount: 0, upkeepAmount: 0}
  });
console.log('sdfasdf', walletData);

  const {data: onDutyMeepleData} = useQuery({
    queryKey: ['GetMeepleOnDuty', user.address],
    queryFn: async () => {
      const meeples = await ApiService.withoutKey().ryoshiDynasties.getUserMeeples(user.address!);
      const activeMeeples = meeples ? meeples.activeAmount : 0;

      return {
        onDutyUser: rdUser!.game.troops.user.available.owned,
        onDutyFaction: rdUser!.game.troops.faction?.available.owned ?? 0,
        upkeepPaid: BigNumber.from(activeMeeples).toNumber(),
        meeplePaidFor: BigNumber.from(activeMeeples).toNumber()
      }
    },
    enabled: !!rdUser && !!user.address,
    initialData: {onDutyUser: 0, onDutyFaction: 0, upkeepPaid: 0, meeplePaidFor: 0}
  })

  const splitWalletData = (data: WalletNft[]) => {
    return data.reduce((acc: any, card: any) => {
      if (card.nftId == "2") {
        acc.offDutyAmount = card.balance!;
      } else if (card.attributes !== undefined && card.attributes[1].trait_type === "Tier") {
        acc.cards.push({
          location: card.name,
          tier: card.attributes[1].value,
          id: Number(card.nftId),
          playerCards: card.balance === undefined ? 0 : card.balance,
        })
      }
      return acc;
    }, {offDutyAmount: 0, cards: []});
  }

  const handleClose = () => {
    onClose();
  }

  const GetLastUpkeepPayment = async () => {
    if (!user.address) return;
    try {
      const resourcesContract = new Contract(collectionAddress, Resources, user.provider.getSigner());
      const tx = await resourcesContract.lastUpkeep(user.address);

      const date = new Date(BigNumber.from(tx).toNumber() * 1000);
      const nextUpkeepPayment = date.setDate(date.getDate() + 7);
      const days = Math.floor((nextUpkeepPayment - Date.now()) / (1000 * 60 * 60 * 24));
      const hours = Math.floor(((nextUpkeepPayment - Date.now()) / 1000 / 60 / 60) % 24);
      setUpkeepDueText(days + " days " + hours + " hours")

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } 
  }

  const GetMeepleOnDuty = async () => {
    if(!rdUser || !user.address) return;

    // setMeepleOnDuty(rdUser.season.troops.available.owned);
    const resourcesContract = new Contract(collectionAddress, Resources, readProvider);
    const balanceOf = await resourcesContract.balanceOf(user.address, 2);
    const meeples = await ApiService.withoutKey().ryoshiDynasties.getUserMeeples(user.address);
    const activeMeeples = meeples ? meeples.activeAmount : 0;

    // console.log("balanceOf ", BigNumber.from(balanceOf).toNumber());
    // console.log("activeMeeples ", BigNumber.from(activeMeeples).toNumber());
    //only works for first 800 will fix
    // setUpkeepPaid(BigNumber.from(activeMeeples).toNumber());
    // setMeeplePaidFor(BigNumber.from(activeMeeples).toNumber());
  }

  const calculateUpkeepCost = (offDutyAmount: number) => {
    //cost will be marginal, 0-200 free, 201-999 1x, 1000-4999 2x, 5000+ 3x
    let cost = 0;
    for(let i = 0; i < offDutyAmount; i++){
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
        cost += 3 * (offDutyAmount - 4999);
        break;
      }
    }
    console.log("Upkeep Cost for " + offDutyAmount + " is " + cost + "");
    // setTotalUpkeepRequired(cost);
    return cost;
  }
 
  // const GetMeepleOffDuty = () => {
  //   walletData.data.forEach((card) => {
  //     card.nftId == "2" ? setMeepleOffDuty(card.balance!) : <></>
  //   })
  // }
  //
  // const SetUpCardsInWallet = () => {
  //   let cards:LocationData[] = [];
  //   walletData.data.forEach((card) => {
  //     {
  //       card.attributes !== undefined && card.attributes[1].trait_type === "Tier" ?
  //       cards.push({
  //         location: card.name,
  //         tier: card.attributes[1].value,
  //         id: Number(card.nftId),
  //         playerCards: card.balance === undefined ? 0 : card.balance,
  //       })
  //       : <></>
  //     }
  //
  //   })
  //   setCardsInWallet(cards)
  // }

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
  const onCompleteTurnInCards = () => {
    // GetMeepleOffDuty();
  }

  useEffect(() => {
    // if(!walletData) return;
    //
    // if(walletData.data.length > 0){
    //   console.log("Wallet Data: ", walletData);
      // SetUpCardsInWallet();
      // GetMeepleOnDuty();
      // GetMeepleOffDuty();
      GetLastUpkeepPayment();
    // }

  }, [])

  useEffect(() => {
    refetchWallet();
  }, [rdUser])

  useEffect(() => {
    if(!rdGameContext) return;

    GetLocationData();
    // CalculateUpkeepCost();

  }, [rdConfig, rdGameContext])

  // useEffect(() => {
  //   GetMeepleOnDuty();
  //
  // }, [rdUser])

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
      title='Ryoshi Management'
      size='2xl'
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <>
          <RdModalBody>
            <RdModalBox>
              <Box textAlign='left' as="b" fontSize={18}>
                Ryoshi On Duty
              </Box>
              <VStack spacing={0} alignItems='start' mt={2}>
                <Box h='28px'>
                  { isFetchingWallet || isLoadingWallet ? (
                      <Spinner size='sm' ms={2} alignSelf="flex-end" />
                  ) : (
                    <Text as={'b'} fontSize='28px' lineHeight="1">{!!onDutyMeepleData && commify(onDutyMeepleData.onDutyUser)}</Text>
                  )}
                </Box>
                <Text color={'#aaa'}>The amount or Ryoshi that are ready to be used and have not been delegated or deployed</Text>
                {onDutyMeepleData.onDutyUser >= rdConfig.barracks.ryoshi.restockCutoff && (
                  <Stack direction='row' align='center' bg='#f8a211' p={2} rounded='sm' mt={2}>
                    <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} color='#333' boxSize={8}/>
                    <Text fontSize='14' color='#333' fontWeight='bold'>
                      Amounts equal or greater than {commify(rdConfig.barracks.ryoshi.restockCutoff)} Ryoshi by the end of the week will prevent receiving additional Ryoshi the following week. Take them off duty <b> or </b> use them for battles and resource gathering.
                    </Text>
                  </Stack>
                )}
                <RdButton
                    h={12}
                    onClick={() => onOpenMintModal()}
                    size='md'
                    fontSize={{base: '16', sm: '18'}}
                    w={{base: '160px', sm: '190px'}}
                    my='auto'
                    alignSelf='end'
                    mt={2}
                >
                  Take Off Duty
                </RdButton>
              </VStack>
            </RdModalBox>
            <RdModalBox mt={2}>
              <Box textAlign='left' as="b" fontSize={18}>
                Ryoshi Off Duty
              </Box>
              <VStack spacing={0} alignItems='start' mt={2}>
                <Box h='28px'>
                  { isFetchingWallet || isLoadingWallet ? (
                    <Spinner size='sm' ms={2} alignSelf="flex-end" />
                  ) : (
                    <Text as={'b'} fontSize='28px' lineHeight="1">{commify(walletData.offDutyAmount)}</Text>
                  )}
                </Box>
                <Text color={'#aaa'}>The amount or Ryoshi that are stored away</Text>
                <RdButton
                    h={12}
                    onClick={onOpenDepositModal}
                    size='md'
                    fontSize={{base: '16', sm: '18'}}
                    w={{base: '150px', sm: '190px'}}
                    my='auto'
                    alignSelf='end'
                    mt={2}
                >
                  Put On Duty
                </RdButton>
              </VStack>
            </RdModalBox>
            
            {/* Upkeep */}
            <RdModalBox mt={2}>
              <Flex justifyContent={'space-between'} align={'center'}>
                <VStack spacing={1} align={"left"} >
                  <Text textAlign='left' as="b" fontSize={18}> Weekly Upkeep </Text>
                  {walletData.offDutyAmount > 0 && (
                    <Text color={'#aaa'}>Upkeep due in <b>{upkeepDueText}</b></Text>
                  )}
                </VStack>

                <VStack spacing={1} >
                  {walletData.upkeepAmount > onDutyMeepleData.upkeepPaid ? (
                    <RdButton
                      h={12}
                      onClick={onOpenUpkeepModal}
                      size='lg'
                      fontSize={{base: '12', sm: '18'}}
                      w={{base: '150px', sm: '190px'}}
                      >
                      Pay Upkeep
                    </RdButton> 
                  ) : walletData.offDutyAmount > 0 ? (
                    <Text as={'i'} color={'#aaa'}>Weekly Upkeep Paid</Text>
                  ) : (
                    <Text as={'i'} color={'#aaa'}>No Upkeep Due</Text>
                  )}
                </VStack>
              </Flex>
            </RdModalBox>

            {/* Cards */}
            <RdModalBox mt={2}>
              <Flex justifyContent={'space-between'} align={'center'}>
                <VStack spacing={1} align='left' mb={10}>
                  <Box textAlign='left' as="b" fontSize={18}>
                    Earn Additional Ryoshi
                  </Box>
                  <Text color={'#aaa'} as={'i'}>Card values can be found in FAQ</Text>
                </VStack>
                <RdButton
                  h={12}
                  mt={10}
                  onClick={onOpenTurnInCardsModal}
                  size='lg'
                  fontSize={{base: '12', sm: '18'}}
                  w={{base: '150px', sm: '190px'}}
                  >
                  Turn in Cards
                </RdButton> 
              </Flex>
            </RdModalBox>
          </RdModalBody>

          <WithdrawRyoshiModal
            isOpen={isOpenMintModal}
            onClose={onCloseMintModal}
            onComplete={() => {
              // refetchWallet();
              // rdRefreshUser();
              onCloseMintModal();
            }}
            onDutyAmount={onDutyMeepleData.onDutyUser}
          />

          <UpkeepModal
            isOpen={isOpenUpkeepModal}
            onClose={onCloseUpkeepModal}
            onComplete={() => {
              refetchWallet();
              rdRefreshUser();
              onCloseUpkeepModal();
            }}
            meepleOffDuty={walletData.offDutyAmount}
            meeplePaidFor={onDutyMeepleData.meeplePaidFor}
            totalUpkeepRequired={walletData.upkeepAmount}
            upkeepPaid={onDutyMeepleData.upkeepPaid}
          />

          <TurnInCardsModal
            isOpen={isOpenTurnInCardsModal}
            onClose={onCloseTurnInCardsModal}
            onComplete={() => {
              rdRefreshUser();
              refetchWallet();
              onCompleteTurnInCards();
              onCloseTurnInCardsModal();
            }}
            cardsInWallet={cardsInWallet}
            locationData={locationData}
            setCardsInWallet={setCardsInWallet}
            ResetCardsInWallet={() => console.log('TODO SETUP')}
          />

          <DepositRyoshiModal
            isOpen={isOpenDepositModal}
            onClose={onCloseDepositModal}
            onComplete={() => {
              // rdRefreshUser();
              onCloseDepositModal();
            }}
            offDutyAmount={walletData.offDutyAmount}
          />
          
        </>
      )}
    </RdModal>
    </>
  )
}

export default Meeple;

interface WithdrawRyoshiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onDutyAmount: number;
}

const WithdrawRyoshiModal = ({isOpen, onClose, onComplete, onDutyAmount}: WithdrawRyoshiModalProps) => {
  const user = useAppSelector((state) => state.user);
  const {requestSignature} = useEnforceSignature();
  const [meepleToMint, setMeepleToMint] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const queryClient = useQueryClient();
  const [hasAmountError, setHasAmountError] = useState(true);
  const minValue = onDutyAmount > 0 ? 1 : 0;

  const handleQuantityChange = (stringValue: string, numValue: number) => {
    if (isNaN(numValue)) numValue = minValue;
    if (numValue > onDutyAmount) numValue = onDutyAmount;
    setHasAmountError(numValue < 1 || meepleToMint > numValue);
    setMeepleToMint(numValue);
  }

  const mintMeeple = async () => {
    if (meepleToMint < 1 || meepleToMint > onDutyAmount) {
      setHasAmountError(true);
      return;
    }
    setHasAmountError(false);

    if (!user.address) return;
    const signature = await requestSignature();
    try {
      setIsExecuting(true);
      const cmsResponse = await MeepleMint(user.address, signature, meepleToMint);
      const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
      const tx = await resourcesContract.mintWithSig(cmsResponse.mintRequest, cmsResponse.signature);
      return await tx.wait();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const mutation = useMutation({
    mutationFn: mintMeeple,
    onSuccess: data => {
      try {
        queryClient.setQueryData(['MeepleManagementPage', user.address], (old: any) => {
          old.offDutyAmount = old.offDutyAmount + meepleToMint;
          return old;
        });

        queryClient.setQueryData(['GetMeepleOnDuty', user.address], (old: any) => {
          old.onDutyUser = old.onDutyUser - meepleToMint;
          if (old.onDutyUser < 0) old.onDutyUser = 0;
          return old;
          // return {
          //   ...old,
          //   onDutyUser: old.onDutyUser - meepleToMint,
          //   // upkeepPaid: BigNumber.from(activeMeeples).toNumber(),
          //   // meeplePaidFor: BigNumber.from(activeMeeples).toNumber()
          // }
        });
      } catch (e) {
        console.log(e);
      } finally {
        toast.success(createSuccessfulTransactionToastContent(data.transactionHash));
        setMeepleToMint(0);
        onComplete();
      }
    }
  });

  const handleMintMeeple = async () => {
    mutation.mutate();
  }

  return (
    <RdModal isOpen={isOpen} onClose={onClose} title='Withdraw Ryoshi'>
      <RdModalBody>
        <RdModalBox>
          <Text>
            Taking Ryoshi off-duty will store them on the blockchain for later use. They can be brought back on-duty at any time (upkeep costs may apply).
          </Text>
          <Box mt={2}>
            <Text color={'#aaa'} w='full' textAlign={'left'} py={2}> Select Ryoshi to Withdraw (Mint): </Text>
            <HStack align='top' w='full'>
              <FormControl isInvalid={hasAmountError}>
                <NumberInput
                  defaultValue={minValue}
                  min={minValue}
                  max={onDutyAmount}
                  name="quantity"
                  onChange={handleQuantityChange}
                  value={meepleToMint}
                  clampValueOnBlur={true}
                >
                  <NumberInputField />
                  <NumberInputStepper >
                    <NumberIncrementStepper color='#ffffff'/>
                    <NumberDecrementStepper color='#ffffff'/>
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>Invalid amount</FormErrorMessage>
              </FormControl>

              <Spacer />
              <Button
                variant={'outline'}
                onClick={() => setMeepleToMint(onDutyAmount)}
              >
                Max
              </Button>
            </HStack>

            <Flex justifyContent={'space-between'} align={'center'} mt={'8'}>
              <Text color={'#aaa'} alignContent={'baseline'} py={2}> Remaining Ryoshi On Duty: </Text>
              <Text as={'b'} fontSize='28' p={2}>{onDutyAmount - meepleToMint}</Text>
            </Flex>
          </Box>
        </RdModalBox>
      </RdModalBody>
      <RdModalFooter>
        <Stack justifyContent={'space-between'} direction='row'>
          <RdButton onClick={onClose} size='lg' fontSize={{base: '18', sm: '24'}}>Cancel</RdButton>
          <RdButton
            onClick={handleMintMeeple}
            size='lg'
            fontSize={{base: '18', sm: '24'}}
            isLoading={isExecuting}
          >
            Withdraw
          </RdButton>
        </Stack>
      </RdModalFooter>
    </RdModal>
  )
}

interface TurnInCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  cardsInWallet: LocationData[];
  locationData: LocationData[];
  setCardsInWallet: (cards:LocationData[]) => void;
  ResetCardsInWallet: () => void;
}

const TurnInCardsModal = ({isOpen, onClose, onComplete, cardsInWallet, locationData, setCardsInWallet, ResetCardsInWallet}: TurnInCardsModalProps) => {
  const user = useAppSelector((state) => state.user);
  const {requestSignature} = useEnforceSignature();
  const collectionAddress = config.contracts.resources
  const [isExecuting, setIsExecuting] = useState(false);

  //Turn in cards
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [filteredCards, setFilteredCards] = useState<LocationData[]>([]);
  const [cardsToTurnIn, setCardsToTurnIn] = useState<LocationData[]>([]);

  const RefreshFilteredCards = () => {
    const filtered = locationData.filter((location) => location.tier == selectedTab+1);
    setFilteredCards(filtered);
  }
  const handleClose = () => {
    setSelectedTab(0);
    setCardsToTurnIn([]);
    // SetUpCardsInWallet();
    onClose();
    ResetCardsInWallet();
    console.log("Closed");
  }

  const TurnInCards = async () => {
    if (!user.address) return;
    const signature = await requestSignature();

    let ids:number[] = [];
    let amounts:number[] = [];
    cardsToTurnIn.forEach((card) => {
      for(let i = 0; i < 3; i+=3){
        ids.push(card.id);
        amounts.push(3);
      }
    })
    try {
      setIsExecuting(true);
      const cmsResponse = await MeepleTradeInCards(user.address, signature, ids, amounts);
      const resourcesContract = new Contract(collectionAddress, Resources, user.provider.getSigner());
      const tx = await resourcesContract.craftItems(cmsResponse.request, cmsResponse.signature);
      toast.success(createSuccessfulTransactionToastContent(tx.transactionHash));
      onComplete();

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    } 
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
    RefreshFilteredCards();

  }, [selectedTab])
  
  return (
    <RdModal isOpen={isOpen} onClose={handleClose} title={'Turn In Cards'} >
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
            <RdButton onClick={handleClose} size='lg' fontSize={{base: '18', sm: '24'}}> Cancel </RdButton>
            <RdButton 
              onClick={TurnInCards} 
              size='lg' 
              fontSize={{base: '18', sm: '24'}}
              isLoading={isExecuting}
            >Turn In Selected Cards </RdButton>
        </Stack>
      </RdModalFooter>
    </RdModal>
  )
}

interface DepositRyoshiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  offDutyAmount: number;
}

const DepositRyoshiModal = ({isOpen, onClose, onComplete, offDutyAmount}: DepositRyoshiModalProps) => {
  const user = useAppSelector((state) => state.user);
  const collectionAddress = config.contracts.resources
  const [isExecuting, setIsExecuting] = useState(false);
  const queryClient = useQueryClient();
  const [hasAmountError, setHasAmountError] = useState(true);
  const minValue = offDutyAmount > 0 ? 1 : 0;

  //Deposit Ryoshi
  const [meepleToDeposit, setMeepleToDeposit] = useState(0);
  const handleQuantityChangeDeposit= (stringValue: string, numValue: number) => {
    if (isNaN(numValue)) numValue = minValue;
    if (numValue > offDutyAmount) numValue = offDutyAmount;
    setHasAmountError(numValue < 1 || meepleToDeposit > numValue);
    setMeepleToDeposit(numValue);
  }

  const depositMeeple = async () => {
    if (meepleToDeposit < 1 || meepleToDeposit > offDutyAmount) {
      setHasAmountError(true);
      return;
    }
    setHasAmountError(false);

    if (!user.address) return;
    try {
      setIsExecuting(true);
      const resourcesContract = new Contract(collectionAddress, Resources, user.provider.getSigner());
      const tx = await resourcesContract.deposit([2], [meepleToDeposit]);
      return await tx.wait();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const mutation = useMutation({
    mutationFn: depositMeeple,
    onSuccess: data => {
      try {
        queryClient.setQueryData(['MeepleManagementPage', user.address], (old: any) => {
          old.offDutyAmount = old.offDutyAmount - meepleToDeposit;
          if (old.offDutyAmount < 0) old.offDutyAmount = 0;
          return old;
        });

        queryClient.setQueryData(['GetMeepleOnDuty', user.address], (old: any) => {
          old.onDutyUser = old.onDutyUser + meepleToDeposit;
          return old;
        });
      } finally {
        toast.success(createSuccessfulTransactionToastContent(data.transactionHash));
        setMeepleToDeposit(0);
        onComplete();
      }
    }
  });

  const handleDepositMeeple = async () => {
    mutation.mutate();
  }

  return (
    <RdModal isOpen={isOpen} onClose={onClose} title='Deposit Ryoshi'>
      <RdModalAlert>
        <Box bgColor='#292626' rounded='md' p={4} fontSize='sm'>
        <Text color={'#aaa'} w='full' textAlign={'left'} py={2}>Select Ryoshi to put on duty:</Text>
        <HStack align='top' w='full'>
          <FormControl isInvalid={hasAmountError}>
            <NumberInput
              defaultValue={minValue}
              min={minValue}
              max={offDutyAmount}
              name="quantity"
              onChange={handleQuantityChangeDeposit}
              value={meepleToDeposit}
              clampValueOnBlur={true}
            >
              <NumberInputField />
              <NumberInputStepper >
                <NumberIncrementStepper color='#ffffff'/>
                <NumberDecrementStepper color='#ffffff'/>
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>Invalid amount</FormErrorMessage>
          </FormControl>

          <Spacer />
          <Button 
            variant={'outline'}
            onClick={() => setMeepleToDeposit(offDutyAmount)}
            > Max </Button>
        </HStack>

        <Flex justifyContent={'space-between'} align={'center'} mt={'8'}>
          <Text color={'#aaa'} alignContent={'baseline'} p={2}> Remaining Ryoshi Off Duty: </Text>
          <Text as={'b'} fontSize='28' p={2}>{offDutyAmount - meepleToDeposit}</Text>
        </Flex>

      </Box>
      </RdModalAlert>
      <RdModalFooter>
        <Stack justifyContent={'space-between'} direction='row'>
          <RdButton onClick={onClose} size='lg' fontSize={{base: '18', sm: '24'}}> Cancel </RdButton>
          <RdButton 
            onClick={handleDepositMeeple}
            size='lg' 
            fontSize={{base: '18', sm: '24'}}
            isLoading={isExecuting}
            > Deposit </RdButton>
        </Stack>
      </RdModalFooter>
    </RdModal>
  )
}

interface UpkeepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  meepleOffDuty: number;
  meeplePaidFor: number;
  totalUpkeepRequired: number;
  upkeepPaid: number;
}

const UpkeepModal = ({isOpen, onClose, onComplete, meepleOffDuty, meeplePaidFor, totalUpkeepRequired, upkeepPaid}: UpkeepModalProps) => {
  const user = useAppSelector((state) => state.user);
  const {requestSignature} = useEnforceSignature();
  const collectionAddress = config.contracts.resources
  const [isExecuting, setIsExecuting] = useState(false);

  const [sliderValue, setSliderValue] = useState(100)
  const upkeepDue = totalUpkeepRequired - upkeepPaid;
  const paymentAmount = upkeepDue * (sliderValue/100);
  const remainingMeepleYouNeedToPayFor = meepleOffDuty - meeplePaidFor - 200;
  const troopsBeingPaidFor = remainingMeepleYouNeedToPayFor * (sliderValue/100);

  const PayUpkeep = async () => {
    if (!user.address) return;
    const signature = await requestSignature();
    try {
      setIsExecuting(true);
      const cmsResponse = await MeepleUpkeep(user.address, signature, Number(troopsBeingPaidFor.toFixed()));
      // console.log("CMS Response: ", cmsResponse);
      const resourcesContract = new Contract(collectionAddress, Resources, user.provider.getSigner());
      const tx = await resourcesContract.upkeep(cmsResponse.upkeepRequest, cmsResponse.signature);
      toast.success(createSuccessfulTransactionToastContent(tx.transactionHash));
      onComplete();

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <RdModal isOpen={isOpen} onClose={onClose} title={'Upkeep Cost Breakdown'} >
      <RdModalAlert>
        <Box bgColor='#292626' rounded='md' p={4} fontSize='sm'>
          <SimpleGrid columns={2} spacing={0} w={'100%'}>
            <Text color={'#aaa'} textAlign={'left'} p={2}> Upkeep cost for {meepleOffDuty} Off Duty</Text>
            <Text as={'b'} textAlign={'right'} p={2}> {totalUpkeepRequired} </Text>
            <Text color={'#aaa'} textAlign={'left'} p={2}> Upkeep paid this week </Text>
            <Text as={'b'} textAlign={'right'} p={2}> - {upkeepPaid} </Text>
            <Text color={'#aaa'} textAlign={'left'} p={2}> Upkeep due</Text>
            <Text as={'b'} textAlign={'right'} p={2}> {upkeepDue} </Text>
            <Text color={'#aaa'} pt={12} pl={2} textAlign={'left'} > Payment Amount </Text>
            <HStack   pt={10} spacing={0} justifyContent={'right'} w={'100%'}>
              <Text as={'b'} textAlign={'right'} fontSize='28' > {paymentAmount.toFixed(0)} </Text>
              <Image  src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/> 
            </HStack >
            <HStack  pl={2}  spacing={0} justifyContent={'left'} w={'100%'}>
              <Text color={'#aaa'} textAlign={'left'} > Troops Being Paid For </Text>
              <Text as={'b'} textAlign={'left'} p={2}>  {troopsBeingPaidFor.toFixed()} </Text>
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
            <RdButton onClick={onClose} size='lg' fontSize={{base: '18', sm: '24'}}> Cancel </RdButton>
            <RdButton 
            onClick={PayUpkeep} 
            size='lg' 
            fontSize={{base: '18', sm: '24'}}
            isLoading={isExecuting}
            > Pay Upkeep </RdButton>
        </Stack>
      </RdModalFooter>
    </RdModal>
  )
}