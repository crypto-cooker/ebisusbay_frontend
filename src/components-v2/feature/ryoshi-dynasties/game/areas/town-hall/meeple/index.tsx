import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack, Switch,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import React, {memo, useContext, useEffect, useMemo, useState} from 'react';
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {appConfig} from "@src/Config";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {toast} from "react-toastify";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
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
import {MeepleMint, MeepleUpkeep} from "@src/core/api/RyoshiDynastiesAPICalls";
import {Contract} from "ethers";
import Resources from "@src/Contracts/Resources.json";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {parseErrorMessage} from "@src/helpers/validator";
import ImageService from "@src/core/services/image";
import {createSuccessfulTransactionToastContent, millisecondTimestamp} from '@src/utils';
import {ApiService} from "@src/core/services/api-service";
import {commify} from "ethers/lib/utils";
import WalletNft from "@src/core/models/wallet-nft";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {useIsTouchDevice} from "@src/hooks/use-is-touch-device";
import moment from "moment";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();

interface LocationCard {
  name: string;
  image: string;
  tier: number;
  id: number;
  quantity?: number;
}

interface UserLocationCard extends LocationCard {
  quantity: number;
}

interface MeepleProps {
  isOpen: boolean;
  onClose: () => void;
}

const Meeple = ({isOpen, onClose}: MeepleProps) => {
  const user = useUser();
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
          quantity: card.balance === undefined ? 0 : card.balance,
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
            { isLoadingWallet ? (
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
          <Text color={'#aaa'}>The amount of Ryoshi that are ready to be used and have not been delegated or deployed</Text>
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
  const user = useUser();
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
            <Stack direction='row' align='center' bg='#f8a211' p={2} rounded='sm' mt={2}>
              <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} color='#333' boxSize={8}/>
              <Text fontSize='14' color='#333' fontWeight='bold'>
                Any Ryoshi taken off duty will be added to the existing upkeep period. Be sure this is what you wish to do if upkeep is due soon. Otherwise, upkeep costs may be higher than expected.
              </Text>
            </Stack>
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
          <Text color='#aaa'>The amount of Ryoshi that are off the clock, taking a much needed rest. Upkeep may be required to bring them back on duty.</Text>
          {offDutyMeepleData.activeMeeple > 0 ? (
            <RdButton
              h={12}
              onClick={onOpen}
              size={{base: 'sm', sm: 'md'}}
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
  const user = useUser();
  const collectionAddress = config.contracts.resources
  const [isExecuting, setIsExecuting] = useState(false);
  const queryClient = useQueryClient();
  const [hasAmountError, setHasAmountError] = useState(true);
  const minValue = offDutyActiveAmount > 0 ? 1 : 0;
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
            <Text color={'#aaa'} alignContent={'baseline'} p={2}>Remaining Ryoshi Off Duty:</Text>
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
          >
            Deposit
          </RdButton>
        </Stack>
      </RdModalFooter>
    </RdModal>
  )
}

const Upkeep = ({offDutyMeepleData}: {offDutyMeepleData: OffDutyMeepleInfo}) => {
  const { config: rdConfig} = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const nextUpkeep = formatTimeDifference(offDutyMeepleData.nextUpkeep);
  const upkeepActiveDays = rdConfig.townHall.ryoshi.upkeepActiveDays;

  return (
    <>
      <RdModalBox mt={2}>
        <Box textAlign='left' as="b" fontSize={18}>
          Weekly Upkeep
        </Box>
        <VStack spacing={0} alignItems='start' mt={2}>
          <Text color={'#aaa'}>Off Duty Ryoshi must be periodically paid upkeep to keep them loyal to you.</Text>
          <Stack direction={{base: 'column', sm: 'row'}} justify='space-between' w='full'>
            {millisecondTimestamp(offDutyMeepleData.nextUpkeep) > Date.now() ? (
              <Text color={'#aaa'}>Upkeep due: <b>{nextUpkeep}</b></Text>
            ) : offDutyMeepleData.lastUpkeep === 0 ? (
              <Text color={'#aaa'}>Take some Ryoshi off-duty first</Text>
            ) : (Date.now() > millisecondTimestamp(offDutyMeepleData.nextUpkeep) + upkeepActiveDays * 24 * 60 * 60 * 1000) ? (
              <HStack color='#f8a211'>
                <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} boxSize={6}/>
                <Text fontWeight='bold'>Upkeep overdue</Text>
              </HStack>
            ) : (
              <HStack color='yellow.400'>
                <Icon as={FontAwesomeIcon} icon={faExclamationTriangle} boxSize={6}/>
                <Text fontWeight='bold'>Upkeep due</Text>
              </HStack>
            )}
            {offDutyMeepleData.offDutyAmount > 0 && (
              <RdButton
                h={12}
                onClick={onOpen}
                size={{base: 'sm', sm: 'md'}}
                w={{base: '150px', sm: '190px'}}
                my='auto'
                alignSelf='end'
                mt={2}
              >
                Pay Upkeep
              </RdButton>
            )}
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
  const user = useUser();
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const {requestSignature} = useEnforceSignature();
  const collectionAddress = config.contracts.resources;
  const queryClient = useQueryClient();
  const [isExecuting, setIsExecuting] = useState(false);
  const [quantityToUpkeep, setQuantityToUpkeep] = useState(0);

  const targetMeeple = useMemo(() => {
    const totalOwnedMeeple = activeMeeple + staleMeeple;
    const now = new Date();
    const difference = (now.getTime() - lastUpkeep * 1000) / (1000 * 3600 * 24);
    const cutoff = rdConfig.townHall.ryoshi.upkeepActiveDays;
    const decay = rdConfig.townHall.ryoshi.upkeepDecay;
    const decayedIntervals = Math.floor(difference / cutoff);
    const upkeepDue = difference > cutoff;

    let upkeptMeeple = 0;
    let meepleToBurn = 0;
    if (upkeepDue) {
      let meepleRemaining = totalOwnedMeeple;
      let totalMeepleToBurn = 0;
      for(let i = 0; i < decayedIntervals - 1; i++) {
        meepleRemaining *= decay;
        totalMeepleToBurn += meepleRemaining;
      }
      meepleToBurn = Math.ceil(totalMeepleToBurn);
    } else {
      upkeptMeeple = activeMeeple;
    }
    if (meepleToBurn > totalOwnedMeeple) meepleToBurn = totalOwnedMeeple;

    return {
      meepleToBurn,
      upkeptMeeple
    };
  }, [activeMeeple, staleMeeple, lastUpkeep, rdConfig.townHall.ryoshi.upkeepActiveDays, rdConfig.townHall.ryoshi.upkeepDecay]);
  
  const paymentAmount = useMemo(() => {
    return calculateUpkeepCost(quantityToUpkeep + targetMeeple.upkeptMeeple, rdConfig.townHall.ryoshi.upkeepCosts);
  }, [quantityToUpkeep, rdConfig.townHall.ryoshi.upkeepCosts]);

  const payUpkeep = async () => {
    if (!user.address) return;
    const signature = await requestSignature();
    try {
      setIsExecuting(true);
      const cmsResponse = await MeepleUpkeep(user.address, signature, Number(quantityToUpkeep.toFixed()));
      const resourcesContract = new Contract(collectionAddress, Resources, user.provider.getSigner());
      const tx = await resourcesContract.upkeep(cmsResponse.request, cmsResponse.signature);
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
          // old.lastUpkeep = Math.floor(Date.now() / 1000);
          // old.nextUpkeep = old.lastUpkeep + (rdConfig.townHall.ryoshi.upkeepActiveDays * 86400);
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

  const nextUpkeep = lastUpkeep ? formatTimeDifference(lastUpkeep + (rdConfig.townHall.ryoshi.upkeepActiveDays * 86400)) : 0;

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
            <Text as={'b'} textAlign={'right'} p={2}>{commify(targetMeeple.meepleToBurn)} Ryoshi</Text>
            <Text color={'#aaa'} textAlign={'left'} p={2}>Upkeep resets</Text>
            <Text as={'b'} textAlign={'right'} p={2}>{nextUpkeep}</Text>
            {!!targetMeeple.meepleToBurn && (
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
          <Flex justify='space-between' pt={4}>
            <Text my='auto' fontSize={{base:'md', sm:'lg'}} fontWeight='bold'>Payment Amount</Text>
            <HStack spacing={0} justifyContent='end'>
              <Text as={'b'} textAlign={'right'} fontSize='28'>{commify(paymentAmount)}</Text>
              <Image  src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/>
            </HStack >
          </Flex>
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
                    <Box mt={2}>
                      {rdConfig.townHall.ryoshi.upkeepCosts.sort((a, b) => a.threshold - b.threshold).map((cost, index, array) => {
                        const nextCost = array[index + 1];
                        return (
                          <Flex key={index} justify='space-between'>
                            {!!nextCost ? (
                              <Box>{cost.threshold} - {nextCost.threshold - 1} Ryoshi</Box>
                            ) : (
                              <Box>{cost.threshold}+ Ryoshi</Box>
                            )}
                            <HStack spacing={0} justifyContent='end'>
                              <Text>{cost.multiplier}</Text>
                              <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={3}/>
                            </HStack>
                          </Flex>
                        );
                      })}
                    </Box>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          </Accordion>
        </RdModalBox>
      </Box>
      <RdModalFooter>
        <Box textAlign='center' mx={2}>
          <Box ps='20px'>
            <RdButton
              stickyIcon={true}
              onClick={handlePayUpkeep}
              fontSize={{base: 'xl', sm: '2xl'}}
              isLoading={isExecuting}
              isDisabled={isExecuting}
            >
              Pay Upkeep
            </RdButton>
          </Box>
        </Box>
      </RdModalFooter>
    </RdModal>
  )
}


const CardTradeIn = ({userLocationCards}: {userLocationCards: UserLocationCard[]}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <RdModalBox mt={2}>
        <Box textAlign='left' as="b" fontSize={18}>
          Earn Additional Ryoshi
        </Box>
        <VStack spacing={0} alignItems='start' mt={2}>
          <Text color={'#aaa'}>Exchange battle cards to increase your Ryoshi population. Card values can be found in FAQ</Text>
          <RdButton
            h={12}
            onClick={onOpen}
            size={{base: 'sm', sm: 'md'}}
            w={{base: '150px', sm: '190px'}}
            my='auto'
            alignSelf='end'
            mt={2}
          >
            Turn in Cards
          </RdButton>
        </VStack>
      </RdModalBox>
      <TurnInCardsModal
        isOpen={isOpen}
        onClose={onClose}
        onComplete={onClose}
        userLocationCards={userLocationCards}
      />
    </>
  )
}

interface TurnInCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userLocationCards: UserLocationCard[];
}

const TurnInCardsModal = ({isOpen, onClose, onComplete, userLocationCards}: TurnInCardsModalProps) => {
  const user = useUser();
  const { config: rdConfig, game: rdGameContext } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const {requestSignature} = useEnforceSignature();
  const collectionAddress = config.contracts.resources
  const [isExecuting, setIsExecuting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const [locationsWithUserQty, setLocationsWithUserQty] = useState<UserLocationCard[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [cardsToTurnIn, setCardsToTurnIn] = useState<{[key: number]: number}>({});
  const [showAll, setShowAll] = useState<boolean>(false);
  const [ryoshiToReceive, setRyoshiToReceive] = useState<number>(0);
  const [selectedCardsSum, setSelectedCardsSum] = useState<number>(0);
  const [manuallySelectedAll, setManuallySelectedAll] = useState<boolean>(false);
  const [ryoshiDestination, setRyoshiDestination] = useState('off-duty');

  const cardsPerSet = 3;

  const getLocationData = async () => {
    try {
      setIsInitializing(true);
      let data = await ApiService.withoutKey().getCollectionItems({
        address: collectionAddress,
        pageSize: 100
      });
      let locations:LocationCard[] = [];

      //filter out only locations
      for(let i = 0; i < data.data.length; i++){
        for(let j= 0; j < data.data[i].attributes?.length; j++){
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

      const locationsWithUserQuantity = locations.map((card) => {
        const ownedCard = userLocationCards.find((userCard) => userCard.id.toString() === card.id.toString());
        return {
          ...card,
          quantity: ownedCard ? ownedCard.quantity : 0,
        };
      });

      const sortedLocations = locationsWithUserQuantity.sort((a, b) => b.quantity - a.quantity);

      setLocationsWithUserQty(sortedLocations);
    } finally {
      setIsInitializing(false);
    }
  }

  const handleClose = () => {
    setSelectedTab(0);
    setCardsToTurnIn([]);
    onClose();
  }

  const handleTurnInCards = async () => {
    if (!user.address) return;
    const signature = await requestSignature();

    let ids = Object.keys(cardsToTurnIn);
    let amounts = Object.values(cardsToTurnIn);

    if (ids.length < 1) {
      toast.error('No cards selected');
      return;
    }

    const direct = ryoshiDestination === 'on-duty';

    try {
      setIsExecuting(true);
      const cmsResponse = await ApiService.withoutKey().ryoshiDynasties.requestCardTradeInAuthorization(
        ids,
        amounts,
        direct,
        user.address,
        signature,
      );
      const resourcesContract = new Contract(collectionAddress, Resources, user.provider.getSigner());
      const tx = await resourcesContract.craftItems(cmsResponse.request, cmsResponse.signature);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      onComplete();

    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const handleSelectCards = (nftId: number, quantity: number, resetSelectAllToggle: boolean = false) => {
    setCardsToTurnIn((prevState) => {
      const updatedState = { ...prevState };

      if (quantity === 0) {
        delete updatedState[nftId];
      } else {
        updatedState[nftId] = quantity;
      }

      return updatedState;
    });
    if (resetSelectAllToggle) setManuallySelectedAll(false);
  }

  const handleSelectAll = () => {
    if (manuallySelectedAll) {
      setCardsToTurnIn({});
      setManuallySelectedAll(false);
      return;
    }

    locationsWithUserQty.filter(card => card.quantity >= 3).forEach((card) => {
      handleSelectCards(card.id, Math.floor(card.quantity - (card.quantity % cardsPerSet)), true);
    });
    setManuallySelectedAll(true);
  }

  useEffect(() => {
    getLocationData();
  }, [user.address])

  useEffect(() => {
    let totalRyoshi = 0;
    Object.keys(cardsToTurnIn).forEach((key: any) => {
      const card = locationsWithUserQty.find((card) => card.id.toString() === key.toString());
      if (!card) return;
      const base = rdConfig.townHall.ryoshi.tradeIn.base[key];
      const multiplier = rdConfig.townHall.ryoshi.tradeIn.tierMultiplier[card.tier - 1];
      const sets = cardsToTurnIn[key] / cardsPerSet;
      totalRyoshi += base * sets * multiplier;
    });
    setRyoshiToReceive(totalRyoshi);

    const sum = Object.values(cardsToTurnIn).reduce((sum, value) => sum + value, 0);
    setSelectedCardsSum(sum);
  }, [cardsToTurnIn]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Turn In Cards'
      size='4xl'
      isCentered={false}
    >
      <Box textAlign='center' mt={2}>
        Select 3 of the same battle cards from any type below to add more Ryoshi to your population
      </Box>
      <Box px={2} mt={4}>
        <Flex direction='row' justify='center' mb={2}>
          <SimpleGrid columns={3}>
            <RdTabButton isActive={selectedTab === 0} onClick={() => setSelectedTab(0)}>
              Tier 1
            </RdTabButton>
            <RdTabButton isActive={selectedTab === 1} onClick={() => setSelectedTab(1)}>
              Tier 2
            </RdTabButton>
            <RdTabButton isActive={selectedTab === 2} onClick={() => setSelectedTab(2)}>
              Tier 3
            </RdTabButton>
          </SimpleGrid>
        </Flex>
        {!isInitializing ? (
          <>
            <Stack justify='space-between' align={{base: 'start', sm: 'center'}} direction={{base: 'column', sm: 'row'}}>
              <Box fontSize='sm'>This tier has a <Text as='span' fontWeight='bold' textDecoration='underline'>{rdConfig.townHall.ryoshi.tradeIn.tierMultiplier[selectedTab]}x</Text> multiplier</Box>
              <Stack direction='row' spacing={2} justify='space-between' w={{base: 'full', sm: 'auto'}}>
                <Button size='sm' variant='unstyled' onClick={() => setShowAll(!showAll)}>{showAll ? 'Hide Empty' : 'Show All'}</Button>
                <Button size='sm' variant='outline' onClick={handleSelectAll}>{manuallySelectedAll ? 'Unselect' : 'Select'} All</Button>
              </Stack>
            </Stack>
            <SimpleGrid columns={{base: 1, md: 2}} spacing={2} mt={1}>
              {locationsWithUserQty.filter((location) => location.tier == selectedTab+1).map((card) => (
                <>
                  {(showAll || card.quantity > 0) && (
                    <MemoizedLocationCardForm
                      key={card.id}
                      card={card}
                      bonus={rdConfig.townHall.ryoshi.tradeIn.base[card.id]}
                      quantitySelected={cardsToTurnIn[card.id] || 0}
                      onChange={(quantity) => handleSelectCards(card.id, quantity)}
                    />
                  )}
                </>
              ))}
            </SimpleGrid>
            <SimpleGrid columns={{base: 1, md: 2}} gap={2} mt={2}>
              <RdModalBox>
                <Box>
                  <Box fontWeight='bold'>Options</Box>
                  <Box mt={2}>
                    <Flex justify='space-between'>
                      <Box>Destination</Box>
                      <Switch onChange={() => {
                        if (ryoshiDestination === 'off-duty') {
                          setRyoshiDestination('on-duty');
                        } else {
                          setRyoshiDestination('off-duty');
                        }
                      }}/>
                    </Flex>
                    <Text color='#aaa' fontSize='xs'>Received Ryoshi will be {' '}
                      {ryoshiDestination === 'off-duty' ? (
                        <>taken <Text display='inline' color='orange' fontWeight='bold'>Off Duty</Text> for storage and can be used to take on-duty later or sell on the marketplace</>
                      ) : (
                        <>put <Text display='inline' color='orange' fontWeight='bold'>On Duty</Text> and can be immediately used on the battle map</>
                      )}
                    </Text>
                  </Box>
                </Box>
              </RdModalBox>
              <RdModalBox>
                <Flex justify='end' h='full' align='end'>
                  <SimpleGrid columns={5}>
                    <GridItem colSpan={3}><Box textAlign={{base: 'start', sm: 'end'}}>Total Cards:</Box></GridItem>
                    <GridItem colSpan={2}><Box textAlign='end'>{commify(selectedCardsSum)}</Box></GridItem>
                    <GridItem colSpan={3} alignSelf='end'><Box textAlign={{base: 'start', sm: 'end'}} fontSize='lg'>Ryoshi To Receive:</Box></GridItem>
                    <GridItem colSpan={2} alignSelf='end'><Box textAlign='end' fontSize='2xl' fontWeight='bold'>{commify(ryoshiToReceive)}</Box></GridItem>
                  </SimpleGrid>
                </Flex>
              </RdModalBox>
            </SimpleGrid>
          </>
        ) : (
          <Center>
            <Spinner />
          </Center>
        )}
      </Box>
      <RdModalFooter>
        <Box textAlign='center' mt={8} mx={2}>
          <Box ps='20px'>
            <RdButton
              fontSize={{base: 'xl', sm: '2xl'}}
              stickyIcon={true}
              onClick={handleTurnInCards}
              isLoading={isExecuting}
              isDisabled={isExecuting}
            >
              Turn In Cards
            </RdButton>
          </Box>
        </Box>
      </RdModalFooter>
    </RdModal>
  )
}

interface LocationCardFormProps {
  card: UserLocationCard;
  bonus: number;
  quantitySelected: number;
  onChange: (quantity: number) => void;
}
const LocationCardForm = ({card, bonus, quantitySelected, onChange}: LocationCardFormProps) => {
  const isTouchDevice = useIsTouchDevice();

  const hoverStyle = useMemo(() => ({
    borderStyle: isTouchDevice || (!isTouchDevice && quantitySelected > 0) ? 'solid' : 'dashed',
    borderColor: isTouchDevice ? undefined : '#F48F0C'
  }), [isTouchDevice, quantitySelected]);

  const handleSelectQuantity = () => {
    const step = 3;
    let newQuantity = 0;
    if (quantitySelected + step <= card.quantity && card.quantity >= step) {
      newQuantity = quantitySelected + step;
    }
    onChange(newQuantity);
  }

  return (
    <Box position='relative'>
      <RdModalBox
        w='full'
        p={2}
        bg={card.quantity >= 3 ? '#376dcf' : undefined}
        cursor='pointer'
        border={`2px solid ${quantitySelected > 0 ? '#F48F0C' : 'transparent'}`}
        _hover={hoverStyle}
        _active={{
          borderStyle: 'solid',
          bg: card.quantity >= 3 ? '#376dcfcc' : undefined
        }}
        onClick={handleSelectQuantity}
      >

        <Stack w='full' direction='row'>
          <Image
            objectFit='contain'
            w='25px'
            src={card.image}
            alt={card.name}
          />
          <VStack align='start' spacing={1} w='full'>
            <Heading size='sm'>{card.name} ({card.id})</Heading>
            <HStack w='full' justify='space-between'>
              <HStack spacing={1}>
                <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()}
                       alt="troopsIcon" boxSize={4}/>
                <Box>{bonus}</Box>
              </HStack>
              <Text fontSize='sm'>Selected: {quantitySelected} / {card.quantity}</Text>
            </HStack>
          </VStack>
        </Stack>
      </RdModalBox>

      {quantitySelected > 0 && (
        <Box
          position='absolute'
          top='-12px'
          right='-10px'
          pe='3px'
        >
          <IconButton
            icon={<CloseIcon boxSize={2} />}
            aria-label='Remove'
            bg='gray.800'
            _hover={{ bg: 'gray.600' }}
            size='xs'
            rounded='full'
            color='white'
            onClick={(e) => {
              e.stopPropagation(); // prevent popover
              onChange(0);
            }}
          />
        </Box>
      )}
    </Box>
  )
}
const MemoizedLocationCardForm = memo(LocationCardForm);

const calculateUpkeepCost = (requestedAmountPlusActive: number, upkeepCosts: Array<{ threshold: number, multiplier: number }>) => {
  let cost = 0;
  const sortedUpkeepCosts = upkeepCosts
    .sort((a, b) => b.threshold - a.threshold);

  for (let i = 1; i <= requestedAmountPlusActive; i++) {
    const rateIndex = sortedUpkeepCosts.findIndex(cost => i >= cost.threshold);
    if (rateIndex === -1) throw new Error('No upkeep cost found for amount');
    const rate = sortedUpkeepCosts[rateIndex];
    if (rateIndex === 0) {
      cost += rate.multiplier * (requestedAmountPlusActive - i);
      break;
    }
    cost += rate.multiplier;
  }

  return cost;
}

const formatTimeDifference = (timestamp: number) => {
  const now = moment();
  const givenTime = moment(millisecondTimestamp(timestamp));
  const isBefore = givenTime.isBefore(now);

  const diffInSeconds = Math.abs(now.diff(givenTime, 'seconds'));

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ${isBefore ? 'ago' : 'from now'}`;
  } else if (diffInSeconds < 86400) { // Less than 24 hours
    const diffInMinutes = Math.round(diffInSeconds / 60);
    return `${diffInMinutes} minutes ${isBefore ? 'ago' : 'from now'}`;
  } else { // More than 24 hours
    const diffInDays = Math.round(diffInSeconds / 86400);
    return `${diffInDays} days ${isBefore ? 'ago' : 'from now'}`;
  }
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