import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
  Box,
  Button, Card, CardBody, CardFooter, Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid, GridItem, Heading,
  HStack,
  Icon,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid, Skeleton,
  Spacer,
  Spinner,
  Stack,
  Tab,
  TabList, TabPanel, TabPanels,
  Tabs,
  Text, UnorderedList,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {appConfig} from "@src/Config";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {toast} from "react-toastify";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/meeple/faq-page";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {
  RdModalAlert,
  RdModalBody,
  RdModalBox,
  RdModalFooter
} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import NextApiService from "@src/core/services/api-service/next";
import {MeepleMint, MeepleTradeInCards, MeepleUpkeep} from "@src/core/api/RyoshiDynastiesAPICalls";
import {Contract, ethers} from "ethers";
import Resources from "@src/Contracts/Resources.json";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {parseErrorMessage} from "@src/helpers/validator";
import ImageService from "@src/core/services/image";
import {createSuccessfulTransactionToastContent, millisecondTimestamp, timeSince} from '@src/utils';
import {ApiService} from "@src/core/services/api-service";
import {commify} from "ethers/lib/utils";
import WalletNft from "@src/core/models/wallet-nft";

const config = appConfig();

interface LocationCard {
  name: string;
  image: string;
  tier: number;
  id: number;
}

interface UserLocationCard extends LocationCard {
  quantity: number;
}

interface MeepleProps {
  isOpen: boolean;
  onClose: () => void;
}

const Meeple = ({isOpen, onClose}: MeepleProps) => {

  const user = useAppSelector((state) => state.user);
  const { config: rdConfig, user:rdUser, game: rdGameContext, refreshUser: rdRefreshUser} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const [page, setPage] = useState<string>();
  const collectionAddress = config.contracts.resources

  const {data: walletData, refetch: refetchWallet, isFetching: isFetchingWallet, isLoading: isLoadingWallet} = useQuery({
    queryKey: ['OnChainMeepleInfo', user.address],
    queryFn: async () => {
      const wallet = await NextApiService.getWallet(user.address!, {
        page: 1,
        pageSize: 100,
        collection: collectionAddress
      });
      const nftInfo = splitWalletData(wallet.data);

      const meeples = await ApiService.withoutKey().ryoshiDynasties.getUserMeeples(user.address!);

      let activeMeeple = parseInt(meeples?.activeAmount ?? 0);
      const lastUpkeep = parseInt(meeples?.lastUpkeep ?? 0);
      const nextUpkeep = lastUpkeep + (rdConfig.townHall.ryoshi.upkeepActiveDays * 86400);

      const now = new Date();
      const difference = (now.getTime() - lastUpkeep * 1000) / (1000 * 3600 * 24);
      const cutoff = rdConfig.townHall.ryoshi.upkeepActiveDays;
      if (difference > cutoff) activeMeeple = 0;
      const staleMeeple = nftInfo.offDutyAmount - activeMeeple;
      const maxUpkeepAmount = calculateUpkeepCost(staleMeeple, rdConfig.townHall.ryoshi.upkeepCosts);

      return {
        ...nftInfo,
        activeMeeple,
        staleMeeple,
        lastUpkeep,
        nextUpkeep,
        maxUpkeepAmount
      };
    },
    refetchOnWindowFocus: false,
    enabled: !!user.address && !!collectionAddress,
    initialData: {cards: [], offDutyAmount: 0, activeMeeple: 0, staleMeeple: 0, lastUpkeep: 0, nextUpkeep: 0, maxUpkeepAmount: 0}
  });

  const {data: onDutyMeepleData} = useQuery({
    queryKey: ['OffChainMeepleInfo', user.address],
    queryFn: async () => {

      return {
        onDutyUser: rdUser!.game.troops.user.available.owned,
        onDutyFaction: rdUser!.game.troops.faction?.available.owned ?? 0
      }
    },
    enabled: !!rdUser && !!user.address,
    initialData: {onDutyUser: 0, onDutyFaction: 0}
  })

  const splitWalletData = (data: WalletNft[]): {offDutyAmount: number, cards: UserLocationCard[]} => {
    return data.reduce((acc: any, card) => {
      if (card.nftId == "2") {
        acc.offDutyAmount = Number(card.balance);
      } else if (card.attributes !== undefined && card.attributes[1].trait_type === "Tier") {
        acc.cards.push({
          name: card.name,
          image: card.image,
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

  useEffect(() => {
    refetchWallet();
  }, [rdUser])

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
          <RdModalBody>
            { isFetchingWallet || isLoadingWallet ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <>
                <OnDutyRyoshi onDutyMeepleData={onDutyMeepleData} />
                <OffDutyRyoshi offDutyMeepleData={walletData} />
                <Upkeep offDutyMeepleData={walletData} />
                <CardTradeIn userLocationCards={walletData.cards} />
              </>
            )}
          </RdModalBody>
        )}
      </RdModal>
    </>
  )
}

export default Meeple;

const OnDutyRyoshi = ({onDutyMeepleData}: {onDutyMeepleData: OnDutyMeepleInfo}) => {
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <RdModalBox>
        <Box textAlign='left' as="b" fontSize={18}>
          Ryoshi On Duty
        </Box>
        <VStack spacing={0} alignItems='start' mt={2}>
          <Box h='28px'>
            <Text as={'b'} fontSize='28px' lineHeight="1">{!!onDutyMeepleData && commify(onDutyMeepleData.onDutyUser)}</Text>
          </Box>
          <Text color={'#aaa'}>The amount or Ryoshi that are ready to be used and have not been delegated or deployed</Text>
          {onDutyMeepleData.onDutyUser >= rdConfig.townHall.ryoshi.restockCutoff && (
            <Stack direction='row' align='center' bg='#f8a211' p={2} rounded='sm' mt={2}>
              <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} color='#333' boxSize={8}/>
              <Text fontSize='14' color='#333' fontWeight='bold'>
                Amounts equal or greater than {commify(rdConfig.townHall.ryoshi.restockCutoff)} Ryoshi by the end of the week will prevent receiving additional Ryoshi the following week. Take them off duty <b> or </b> use them for battles and resource gathering.
              </Text>
            </Stack>
          )}
          {onDutyMeepleData.onDutyUser > 0 ? (
            <RdButton
              h={12}
              onClick={onOpen}
              size='md'
              fontSize={{base: '16', sm: '18'}}
              w={{base: '160px', sm: '190px'}}
              my='auto'
              alignSelf='end'
              mt={2}
            >
              Take Off Duty
            </RdButton>
          ) : (
            <Text color='#aaa' mt={2}>No on-duty Ryoshi</Text>
          )}
        </VStack>
      </RdModalBox>
      <WithdrawRyoshiModal
        isOpen={isOpen}
        onClose={onClose}
        onComplete={onClose}
        onDutyAmount={onDutyMeepleData.onDutyUser}
      />
    </>
  )
}

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
        queryClient.setQueryData(['OnChainMeepleInfo', user.address], (old: any) => {
          old.offDutyAmount = old.offDutyAmount + meepleToMint;
          return old;
        });

        queryClient.setQueryData(['OffChainMeepleInfo', user.address], (old: any) => {
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

const OffDutyRyoshi = ({offDutyMeepleData}: {offDutyMeepleData: OffDutyMeepleInfo}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <RdModalBox mt={2}>
        <Box textAlign='left' as="b" fontSize={18}>
          Ryoshi Off Duty
        </Box>
        <VStack spacing={0} alignItems='start' mt={2}>
          <Box h='28px'>
            <Text as={'b'} fontSize='28px' lineHeight="1">
              {commify(offDutyMeepleData.offDutyAmount)}
              <Text as='span' fontSize='sm' color='#aaa' ms={2}>({commify(offDutyMeepleData.activeMeeple)} active)</Text>
            </Text>
          </Box>
          <Text color='#aaa'>The amount or Ryoshi that are stored away for later</Text>
          {offDutyMeepleData.activeMeeple > 0 ? (
            <RdButton
              h={12}
              onClick={onOpen}
              size='md'
              fontSize={{base: '16', sm: '18'}}
              w={{base: '150px', sm: '190px'}}
              my='auto'
              alignSelf='end'
              mt={2}
            >
              Put On Duty
            </RdButton>
          ) : offDutyMeepleData.offDutyAmount > 0 ? (
            <Text color='#aaa' mt={2}>Pay upkeep below to put some Ryoshi on duty</Text>
          ) : (
            <Text color='#aaa' mt={2}>No off-duty Ryoshi</Text>
          )}
        </VStack>
      </RdModalBox>
      <DepositRyoshiModal
        isOpen={isOpen}
        onClose={onClose}
        onComplete={onClose}
        offDutyActiveAmount={offDutyMeepleData.activeMeeple}
      />
    </>
  )
}

interface DepositRyoshiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  offDutyActiveAmount: number;
}

const DepositRyoshiModal = ({isOpen, onClose, onComplete, offDutyActiveAmount}: DepositRyoshiModalProps) => {
  const user = useAppSelector((state) => state.user);
  const collectionAddress = config.contracts.resources
  const [isExecuting, setIsExecuting] = useState(false);
  const queryClient = useQueryClient();
  const [hasAmountError, setHasAmountError] = useState(true);
  const minValue = offDutyActiveAmount > 0 ? 1 : 0;

  //Deposit Ryoshi
  const [meepleToDeposit, setMeepleToDeposit] = useState(0);
  const handleQuantityChangeDeposit= (stringValue: string, numValue: number) => {
    if (isNaN(numValue)) numValue = minValue;
    if (numValue > offDutyActiveAmount) numValue = offDutyActiveAmount;
    setHasAmountError(numValue < 1 || meepleToDeposit > numValue);
    setMeepleToDeposit(numValue);
  }

  const depositMeeple = async () => {
    if (meepleToDeposit < 1 || meepleToDeposit > offDutyActiveAmount) {
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
        queryClient.setQueryData(['OnChainMeepleInfo', user.address], (old: any) => {
          old.offDutyAmount = old.offDutyAmount - meepleToDeposit;
          if (old.offDutyAmount < 0) old.offDutyAmount = 0;
          return old;
        });

        queryClient.setQueryData(['OffChainMeepleInfo', user.address], (old: any) => {
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
                max={offDutyActiveAmount}
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
              onClick={() => setMeepleToDeposit(offDutyActiveAmount)}
            > Max </Button>
          </HStack>

          <Flex justifyContent={'space-between'} align={'center'} mt={'8'}>
            <Text color={'#aaa'} alignContent={'baseline'} p={2}> Remaining Ryoshi Off Duty: </Text>
            <Text as={'b'} fontSize='28' p={2}>{offDutyActiveAmount - meepleToDeposit}</Text>
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

const Upkeep = ({offDutyMeepleData}: {offDutyMeepleData: OffDutyMeepleInfo}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <RdModalBox mt={2}>
        <Box textAlign='left' as="b" fontSize={18}>
          Weekly Upkeep
        </Box>
        <VStack spacing={0} alignItems='start' mt={2}>
          <Text color={'#aaa'}>Off Duty Ryoshi must be periodically paid upkeep to keep them loyal to you</Text>
          <Stack direction={{base: 'column', sm: 'row'}} justify='space-between' w='full'>
            {millisecondTimestamp(offDutyMeepleData.nextUpkeep) > Date.now() ? (
              <Text color={'#aaa'}>Upkeep due in <b>{timeSince(offDutyMeepleData.nextUpkeep)} days</b></Text>
            ) : (
              <HStack color='#f8a211'>
                <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} boxSize={6}/>
                <Text fontWeight='bold'>Upkeep overdue</Text>
              </HStack>
            )}
            <RdButton
              h={12}
              onClick={onOpen}
              size='md'
              fontSize={{base: '12', sm: '18'}}
              w={{base: '150px', sm: '190px'}}
              my='auto'
              alignSelf='end'
              mt={2}
            >
              Pay Upkeep
            </RdButton>
          </Stack>
        </VStack>
      </RdModalBox>
      <UpkeepModal
        isOpen={isOpen}
        onClose={onClose}
        onComplete={onClose}
        maxUpkeepAmount={offDutyMeepleData.maxUpkeepAmount}
        staleMeeple={offDutyMeepleData.staleMeeple}
        activeMeeple={offDutyMeepleData.activeMeeple}
        lastUpkeep={offDutyMeepleData.lastUpkeep}
      />
    </>
  )
}

interface UpkeepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;

  maxUpkeepAmount: number;
  staleMeeple: number;
  activeMeeple: number;
  lastUpkeep: number;
}

const UpkeepModal = ({isOpen, onClose, onComplete, maxUpkeepAmount, staleMeeple, activeMeeple, lastUpkeep}: UpkeepModalProps) => {
  const user = useAppSelector((state) => state.user);
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const {requestSignature} = useEnforceSignature();
  const collectionAddress = config.contracts.resources;
  const queryClient = useQueryClient();
  const [isExecuting, setIsExecuting] = useState(false);
  const [quantityToUpkeep, setQuantityToUpkeep] = useState(0);

  const paymentAmount = useMemo(() => {
    return calculateUpkeepCost(quantityToUpkeep, rdConfig.townHall.ryoshi.upkeepCosts);
  }, [quantityToUpkeep, rdConfig.townHall.ryoshi.upkeepCosts]);

  const meepleToBurn = useMemo(() => {
    const totalOwnedMeeple = activeMeeple + staleMeeple;
    const now = new Date();
    const difference = (now.getTime() - lastUpkeep * 1000) / (1000 * 3600 * 24);
    const cutoff = rdConfig.townHall.ryoshi.upkeepActiveDays;
    const decay = rdConfig.townHall.ryoshi.upkeepDecay;
    const decayedIntervals = Math.floor(difference / cutoff);
    const staleMeepleToBurn = Math.ceil(staleMeeple * decay);
    let meepleRemaining = totalOwnedMeeple;
    let totalMeepleToBurn = 0;
    for(let i = 0; i < decayedIntervals; i++) {
      meepleRemaining *= decay;
      totalMeepleToBurn += meepleRemaining;
    }
    totalMeepleToBurn = Math.ceil(totalMeepleToBurn);
    let meepleToBurn = difference <= cutoff ? staleMeepleToBurn : totalMeepleToBurn;
    if (meepleToBurn > totalOwnedMeeple) meepleToBurn = totalOwnedMeeple;

    return meepleToBurn;
  }, [activeMeeple, staleMeeple, lastUpkeep, rdConfig.townHall.ryoshi.upkeepActiveDays, rdConfig.townHall.ryoshi.upkeepDecay]);

  const payUpkeep = async () => {
    if (!user.address) return;
    const signature = await requestSignature();
    try {
      setIsExecuting(true);
      const cmsResponse = await MeepleUpkeep(user.address, signature, Number(quantityToUpkeep.toFixed()));
      const resourcesContract = new Contract(collectionAddress, Resources, user.provider.getSigner());
      const tx = await resourcesContract.upkeep(cmsResponse.upkeepRequest, cmsResponse.signature);
      return await tx.wait();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const mutation = useMutation({
    mutationFn: payUpkeep,
    onSuccess: data => {
      try {
        queryClient.setQueryData(['OnChainMeepleInfo', user.address], (old: any) => {
          old.activeMeeple = old.activeMeeple + quantityToUpkeep;
          old.staleMeeple = old.staleMeeple - quantityToUpkeep;
          if (old.staleMeeple < 0) old.staleMeeple = 0;
          old.lastUpkeep = Math.floor(Date.now() / 1000);
          old.nextUpkeep = old.lastUpkeep + (rdConfig.townHall.ryoshi.upkeepActiveDays * 86400);
          return old;
        });
      } finally {
        toast.success(createSuccessfulTransactionToastContent(data.transactionHash));
        setQuantityToUpkeep(0);
        onComplete();
      }
    }
  });

  const handlePayUpkeep = async () => {
    mutation.mutate();
  }

  return (
    <RdModal isOpen={isOpen} onClose={onClose} title={'Upkeep Cost Breakdown'} >
      <Box p={4}>
        <RdModalBox>
          <Text align='center'>Pay upkeep to maintain the loyalty of your Ryoshi. If you do not pay upkeep, some of them may leave the next time upkeep is paid.</Text>
          <SimpleGrid columns={2} spacing={0} mt={2}>
            <Text color={'#aaa'} textAlign='left' p={2}>Ryoshi inactive</Text>
            <Text textAlign='end' p={2}>{commify(staleMeeple)}</Text>
            <Text color={'#aaa'} textAlign={'left'} p={2}>Ryoshi maintained</Text>
            <Text as={'b'} textAlign={'right'} p={2}>{commify(activeMeeple)} Ryoshi</Text>
            <Text color={'#aaa'} textAlign='left' p={2}>Max upkeep cost</Text>
            <HStack spacing={0} justifyContent='end'>
              <Text>{commify(maxUpkeepAmount)}</Text>
              <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={4} />
            </HStack>
            <Text color={'#aaa'} textAlign={'left'} p={2}>Mutiny cost</Text>
            <Text as={'b'} textAlign={'right'} p={2}>{commify(meepleToBurn)} Ryoshi</Text>
            {!!meepleToBurn && (
              <GridItem colSpan={2}>
                <Stack direction='row' align='center' bg='#f8a211' p={2} rounded='sm' mt={2}>
                  <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} color='#333' boxSize={8}/>
                  <Text fontSize='14' color='#333' fontWeight='bold'>
                    Every {rdConfig.townHall.ryoshi.upkeepActiveDays} days that upkeep is not paid, {rdConfig.townHall.ryoshi.upkeepDecay * 100}% of your Ryoshi will leave the next time you upkeep.
                  </Text>
                </Stack>
              </GridItem>
            )}
          </SimpleGrid>
        </RdModalBox>
        <RdModalBox mt={2}>
          <FormControl>
            <FormLabel>Upkeep Amount</FormLabel>
            <Stack direction='row'>
              <NumberInput
                w='full'
                defaultValue={0}
                min={0}
                max={staleMeeple}
                name="quantity"
                onChange={(valueString, valueNumber) => setQuantityToUpkeep(valueNumber)}
                value={quantityToUpkeep}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Button onClick={() => setQuantityToUpkeep(staleMeeple)}>
                Max
              </Button>
            </Stack>
            <FormHelperText>The amount of Ryoshi to upkeep</FormHelperText>
          </FormControl>
          <SimpleGrid columns={2} pt={4}>
            <Text my='auto' fontSize='lg' fontWeight='bold'>Payment Amount</Text>
            <HStack spacing={0} justifyContent='end'>
              <Text as={'b'} textAlign={'right'} fontSize='28'>{commify(paymentAmount)}</Text>
              <Image  src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/>
            </HStack >
          </SimpleGrid>
          <Accordion allowToggle>
            <AccordionItem border='none'>
              {({ isExpanded }) => (
                <>
                  <AccordionButton p={0}>
                    <Flex w='full' fontSize='sm'>
                      <Box>{isExpanded ? 'Hide' : 'Show'} payment tiers</Box>
                      <Box ms={4}>
                        <AccordionIcon/>
                      </Box>
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel fontSize='sm' px={0}>
                    Cost per Ryoshi is based on the following tiers:
                    <SimpleGrid columns={2}>
                      {rdConfig.townHall.ryoshi.upkeepCosts.sort((a, b) => a.threshold - b.threshold).map((cost, index, array) => {
                        const nextCost = array[index + 1];
                        return (
                          <React.Fragment key={index}>
                            {!!nextCost ? (
                              <Box>{cost.threshold} - {nextCost.threshold - 1} Ryoshi</Box>
                            ) : (
                              <Box>{cost.threshold}+ Ryoshi</Box>
                            )}
                            <HStack spacing={0} justifyContent='end'>
                              <Text>{cost.multiplier}</Text>
                              <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={3}/>
                            </HStack>
                          </React.Fragment>
                        );
                      })}
                    </SimpleGrid>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          </Accordion>
        </RdModalBox>
      </Box>
      <RdModalFooter>
        <Stack justifyContent='space-between' direction='row' spacing={6}>
          <RdButton onClick={onClose} size='lg' fontSize={{base: '18', sm: '24'}}>Cancel</RdButton>
          <RdButton
            onClick={handlePayUpkeep}
            size='lg'
            fontSize={{base: '18', sm: '24'}}
            isLoading={isExecuting}
          >
            Pay Upkeep
          </RdButton>
        </Stack>
      </RdModalFooter>
    </RdModal>
  )
}


const CardTradeIn = ({userLocationCards}: {userLocationCards: UserLocationCard[]}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
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
            onClick={onOpen}
            size='lg'
            fontSize={{base: '12', sm: '18'}}
            w={{base: '150px', sm: '190px'}}
          >
            Turn in Cards
          </RdButton>
        </Flex>
      </RdModalBox>
      <TurnInCardsModal
        isOpen={isOpen}
        onClose={onClose}
        onComplete={onClose}
        userLocationCards={userLocationCards}
        // locationData={locationData}
        // setCardsInWallet={setCardsInWallet}
        // ResetCardsInWallet={() => console.log('TODO SETUP')}
      />
    </>
  )
}

interface TurnInCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userLocationCards: UserLocationCard[];
  // locationData: LocationData[];
  // setCardsInWallet: (cards:LocationData[]) => void;
  ResetCardsInWallet: () => void;
}

const TurnInCardsModal = ({isOpen, onClose, onComplete, userLocationCards}: TurnInCardsModalProps) => {
  const user = useAppSelector((state) => state.user);
  const { config: rdConfig, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const {requestSignature} = useEnforceSignature();
  const collectionAddress = config.contracts.resources
  const [isExecuting, setIsExecuting] = useState(false);

  const [locationCards, setLocationCards] = useState<LocationCard[]>([]);
  // const [cardsInWallet, setCardsInWallet] = useState<LocationData[]>([]);

  //Turn in cards
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [filteredCards, setFilteredCards] = useState<LocationCard[]>([]);
  const [cardsToTurnIn, setCardsToTurnIn] = useState<LocationCard[]>([]);

  const getLocationData = async () => {
    let data = await ApiService.withoutKey().getCollectionItems({
      address: collectionAddress
    });
    let locations:LocationCard[] = [];

    //filter out only locations
    for(let i = 0; i < data.data.length; i++){
      for(let j=0; j < data.data[i].attributes?.length; j++){
        if(data.data[i].attributes[j].trait_type == "Location"){
          locations.push({
            name: data.data[i].attributes[j].value,
            image: data.data[i].image,
            tier: data.data[i].attributes[1].value,
            id: data.data[i].id
          })
        }
      }
    }

    const sortedLocations = locations.sort((a, b) => {
      // Find the quantity of card 'a' owned by the user (default to 0 if not found)
      const quantityA = userLocationCards.find((card) => card.id === a.id)?.quantity || 0;

      // Find the quantity of card 'b' owned by the user (default to 0 if not found)
      const quantityB = userLocationCards.find((card) => card.id === b.id)?.quantity || 0;

      // Sort in descending order based on the quantity
      return quantityB - quantityA;
    });

    setLocationCards(sortedLocations);
  }

  // const RefreshFilteredCards = () => {
  //   const filtered = locationData.filter((location) => location.tier == selectedTab+1);
  //   setFilteredCards(filtered);
  // }
  const handleClose = () => {
    setSelectedTab(0);
    setCardsToTurnIn([]);
    // SetUpCardsInWallet();
    onClose();
    // ResetCardsInWallet();
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
    // let cards:LocationData[] = [];
    // cardsInWallet.forEach((card) => {
    //   if(card.id == nftId){
    //     console.log("Set " + card.location + " to be turned in");
    //     cards.push(card);
    //   }
    // })
    // //remove 3 of EACH CARD selected from player wallet
    // let cardsInWalletCopy = [...cardsInWallet];
    // cardsInWalletCopy.forEach((card) => {
    //   cards.forEach((selectedCard) => {
    //     if(card.id == selectedCard.id){
    //       card.playerCards -= 3;
    //     }
    //   })
    // })
    // setCardsInWallet(cardsInWalletCopy);
    // setCardsToTurnIn([...cardsToTurnIn, ...cards]);
  }

  // useEffect(() => {
  //   locationData.forEach((location) => {
  //     cardsInWallet.forEach((card) => {
  //       if(Number(card.id) === Number(location.id)){
  //         locationData[locationData.indexOf(location)].playerCards = card.playerCards;
  //       }
  //     })
  //   })
  //   RefreshFilteredCards();
  // } , [locationData, cardsInWallet])

  // useEffect(() => {
  //   RefreshFilteredCards();
  //
  // }, [selectedTab, locationData])

  useEffect(() => {
    getLocationData();
  }, [])

  return (
    <RdModal isOpen={isOpen} onClose={handleClose} title='Turn In Cards' size='4xl'>
      <RdModalAlert>
        <Box bgColor='#292626' rounded='md' p={4} fontSize='sm' minH={'300px'}>
          <Tabs isFitted variant='enclosed' onChange={(index) => setSelectedTab(index)}>
            <TabList  mb='1em'>
              <Tab>Tier 1</Tab>
              <Tab>Tier 2</Tab>
              <Tab>Tier 3</Tab>
            </TabList>
          </Tabs>
          <SimpleGrid columns={2} spacing={2}>
            {locationCards.filter((location) => location.tier == selectedTab+1).map((card) => (
              <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
                px={4}
                py={2}
              >
                <Image
                  objectFit='contain'
                  maxW='50px'
                  src={card.image}
                  alt='Caffe Latte'
                />

                <Stack w='full'>
                  <CardBody textAlign='end' px={0}>
                    <Heading size='md'>{card.name}</Heading>
                      <Text py='2'>
                        Qty: {userLocationCards.find((userCard) => userCard.id === card.id)?.quantity || 0}
                      </Text>
                      <Text py='2'>
                        <NumberInput />
                      </Text>
                  </CardBody>

                  {/*<CardFooter>*/}
                  {/*  <Button>*/}
                  {/*    Buy Latte*/}
                  {/*  </Button>*/}
                  {/*</CardFooter>*/}
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
          {/*<Grid gridTemplateColumns={{base: '50px 225px', md: '50px 225px 50px 225px'}} w={'100%'} p={0}>*/}
          {/*  {locationCards.map((card) => (*/}
          {/*    <>*/}
          {/*      <HStack>*/}
          {/*        {card.playerCards >= 3 && (*/}
          {/*          <>*/}
          {/*            /!* <Checkbox p={0} maxW={10} colorScheme="yellow" onClick={() => SelectCard(card.id)}/> *!/*/}
          {/*            <Button onClick={() => SelectCardsToTurnIn(card.id)} border={1} h={{base:8,md:4}}>+</Button>*/}
          {/*            /!* <Button w={4} h={4}>-</Button> *!/*/}
          {/*          </>*/}
          {/*        )}*/}
          {/*      </HStack>*/}
          {/*      <HStack p={{base:2, md:0}}>*/}
          {/*        <Text p={0}*/}
          {/*              color={card.playerCards >= 3 ? "#ffffff" : "#aaa"}*/}
          {/*              as={card.playerCards >= 3 ? 'b' :'a'}*/}
          {/*              textAlign={'left'}> {card.name}</Text>*/}
          {/*        <Text p={0}*/}
          {/*              color={card.playerCards >= 3 ? "#ffffff" : "#aaa"}*/}
          {/*              as={card.playerCards >= 3 ? 'b' :'a'}*/}
          {/*        >x {card.playerCards}</Text></HStack>*/}
          {/*    </>*/}
          {/*  ))}*/}
          {/*</Grid>*/}
        </Box>
        <Box bgColor='#292626' rounded='md' mt={4} p={4} fontSize='sm' minH={'100px'}>
          {cardsToTurnIn?.map((card) => (
            <HStack>
              <Text p={0} color={'#aaa'} textAlign={'left'}> {card.name}</Text>
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


const calculateUpkeepCost = (offDutyAmount: number, upkeepCosts: Array<{ threshold: number, multiplier: number }>) => {
  let cost = 0;
  const sortedUpkeepCosts = upkeepCosts
    .sort((a, b) => b.threshold - a.threshold);

  for (let i = 1; i <= offDutyAmount; i++) {
    const rateIndex = sortedUpkeepCosts.findIndex(cost => i >= cost.threshold);
    if (rateIndex === -1) throw new Error('No upkeep cost found for amount');
    const rate = sortedUpkeepCosts[rateIndex];
    if (rateIndex === 0) {
      cost += rate.multiplier * (offDutyAmount - i);
      break;
    }
    cost += rate.multiplier;
  }

  return cost;
}

interface OnDutyMeepleInfo {
  onDutyUser: number;
  onDutyFaction: number;
}

interface OffDutyMeepleInfo {
  cards: UserLocationCard[],
  offDutyAmount: number;
  activeMeeple: number;
  staleMeeple: number;
  lastUpkeep: number;
  nextUpkeep: number;
  maxUpkeepAmount: number;
}