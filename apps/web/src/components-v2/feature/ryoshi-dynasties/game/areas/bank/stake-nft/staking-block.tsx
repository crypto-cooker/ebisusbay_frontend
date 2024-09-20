import {useUser} from "@src/components-v2/useUser";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {
  BankStakeNftContext,
  BankStakeNftContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/context";
import useBankStakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-bank-stake-nfts";
import {BigNumber, Contract, ethers} from "ethers";
import {ERC1155, ERC721} from "@src/global/contracts/Abis";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import Fortune from "@src/global/contracts/Fortune.json";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAward} from "@fortawesome/free-solid-svg-icons";
import {CloseIcon} from "@chakra-ui/icons";
import ShrineIcon from "@src/components-v2/shared/icons/shrine";
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import localFont from "next/font/local";
import {ApiService} from "@src/core/services/api-service";
import Resources from "@src/global/contracts/Resources.json";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useAppChainConfig} from "@src/config/hooks";
import {useJsonRpcProviderForChain} from "@src/global/hooks/use-ethers-provider-for-chain";


const gothamBook = localFont({ src: '../../../../../../../../src/global/assets/fonts/Gotham-Book.woff2' });

interface StakingBlockProps {
  onRemove: (nftAddress: string, nftId: string) => void;
  onStaked: () => void;
  refetchSlotUnlockContext: () => void;
}

const StakingBlock = ({onRemove, onStaked, refetchSlotUnlockContext}: StakingBlockProps) => {
  const user = useUser();
  const { config: appChainConfig } = useAppChainConfig();
  const readProvider = useJsonRpcProviderForChain(appChainConfig.chain.id);

  const { pendingNfts, stakedNfts, nextSlot } = useContext(BankStakeNftContext) as BankStakeNftContextProps;
  const [isExecutingStake, setIsExecutingStake] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('');
  const [stakeNfts, response] = useBankStakeNfts();
  const [unlockApprovalState, setUnlockApprovalState] = useState<[BigNumber, boolean]>([BigNumber.from(0), false]);
  const [selectedLockedSlot, setSelectedLockedSlot] = useState<number>();

  const handleStake = useCallback(async () => {
    if (pendingNfts.length === 0 && stakedNfts.length === 0) return;

    let hasCompletedApproval = false;

    try {
      setIsExecutingStake(true);
      setExecutingLabel('Approving');
      const approvedCollections: string[] = [];
      for (let nft of pendingNfts) {
        if (approvedCollections.includes(nft.nftAddress)) continue;

        const nftContract = new Contract(nft.nftAddress, ERC721, user.provider.getSigner());
        const isApproved = await nftContract.isApprovedForAll(user.address!.toLowerCase(), appChainConfig.contracts.bank);

        if (!isApproved) {
          let tx = await nftContract.setApprovalForAll(appChainConfig.contracts.bank, true);
          await tx.wait();
          approvedCollections.push(nft.nftAddress);
        }
      }
      hasCompletedApproval = true;

      setExecutingLabel('Staking');
      await stakeNfts(
        pendingNfts.map((nft) => ({...nft, amount: 1})),
        stakedNfts
      );
      onStaked();
      toast.success('Staking successful!');
    } catch (e: any) {
      console.log(e);
      if (!hasCompletedApproval) {
        toast.error('Approval failed. Please try again.');
      } else {
        toast.error(parseErrorMessage(e));
      }
    } finally {
      setIsExecutingStake(false);
      setExecutingLabel('');
    }

  }, [pendingNfts, executingLabel, isExecutingStake, user.provider.signer]);

  const checkForApproval = async () => {
    const fortuneContract = new Contract(appChainConfig.contracts.fortune, Fortune, readProvider);
    const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), appChainConfig.contracts.seasonUnlocks);

    const resourcesContract = new Contract(appChainConfig.contracts.resources, ERC1155, readProvider);
    const isResourcesApproved = await resourcesContract.isApprovedForAll(user.address, appChainConfig.contracts.seasonUnlocks);

    setUnlockApprovalState([totalApproved, isResourcesApproved]);
  }

  useEffect(() => {
    setSelectedLockedSlot(undefined);
    if (user.address) {
      checkForApproval();
    }
  }, [user.address]);

  return (
    <Box>
      <Flex justify='center'>
        <VStack my={6} px={4} spacing={8} justify='center'>
          <SimpleGrid columns={{base: 2, sm: 3, md: 5}} gap={2}>
            {[...Array(5).fill(0)].map((_, index) => {
              return (
                <Box key={index} w='120px'>
                  {!!pendingNfts[index] ? (
                    <Popover>
                      <PopoverTrigger>
                        <Box position='relative'>
                          <Box
                            bg={pendingNfts[index].isActive ? '#376dcf' : '#716A67'}
                            p={2}
                            rounded='xl'
                            border='2px dashed'
                            borderColor={pendingNfts[index].isAlreadyStaked ? 'transparent' : '#ffa71c'}
                            cursor={pendingNfts[index].isActive ? 'auto' : 'pointer'}
                          >
                            <Box
                              width={100}
                              height={100}
                              filter={pendingNfts[index].isActive ? 'auto' : 'grayscale(80%)'}
                              opacity={pendingNfts[index].isActive ? 'auto' : 0.8}
                            >
                              <Image src={ImageService.translate(pendingNfts[index].image).fixedWidth(100, 100)} rounded='lg'/>
                            </Box>
                            <Flex fontSize='xs' justify='space-between' mt={1}>
                              {pendingNfts[index].isActive ? (
                                <>
                                  <Box verticalAlign='top'>
                                    {pendingNfts[index].rank && (
                                      <HStack spacing={1}>
                                        <Icon as={FontAwesomeIcon} icon={faAward} />
                                        <Box as='span'>{pendingNfts[index].rank ?? ''}</Box>
                                      </HStack>
                                    )}
                                  </Box>
                                </>
                              ): (
                                <>Inactive</>
                              )}
                              <VStack align='end' spacing={0} fontWeight='bold'>
                                {pendingNfts[index].multiplier && (
                                  <Box>x {pendingNfts[index].multiplier}</Box>
                                )}
                                {pendingNfts[index].adder && (
                                  <Box>+ {pendingNfts[index].adder}%</Box>
                                )}
                                {pendingNfts[index].troops && (
                                  <HStack spacing={0}>
                                    <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()}alt="troopsIcon" boxSize={4}/>
                                    <Box>+ {pendingNfts[index].troops}</Box>
                                  </HStack>
                                )}
                              </VStack>
                            </Flex>
                          </Box>

                          <Box
                            position='absolute'
                            top={0}
                            right={0}
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
                                onRemove(pendingNfts[index].nftAddress, pendingNfts[index].nftId)
                              }}
                            />
                          </Box>
                        </Box>
                      </PopoverTrigger>

                      {!pendingNfts[index].isActive && (
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverBody>The Bank no longer supports this collection for staking. Any benefits will be removed next game</PopoverBody>
                        </PopoverContent>
                      )}
                    </Popover>
                  ) : (
                    <Box position='relative' overflow='hidden'>
                      <Box
                        p={2}
                        rounded='xl'
                        cursor='pointer'
                      >
                        <Box
                          width={100}
                          height={100}
                          bgColor='#716A67'
                          rounded='xl'
                          position='relative'
                        >
                          <ShrineIcon boxSize='100%' fill='#B1ADAC'/>
                          {!!nextSlot && index > nextSlot.index - 1 && (
                            <Flex
                              position='absolute'
                              top={0}
                              left={0}
                              w={100}
                              h={100}
                              fontSize='sm'
                              bg='#333333DD'
                              rounded='xl'
                              justify='center'
                              fontWeight='semibold'
                              textAlign='center'
                              onClick={() => setSelectedLockedSlot(index)}
                            >
                              <Center>
                                {selectedLockedSlot === index ? (
                                  <Image
                                    src={ImageService.translate('/img/ryoshi-dynasties/icons/unlock.png').convert()}
                                    alt="unlockIcon"
                                    boxSize={12}
                                  />
                                ) : (
                                  <Image
                                    src={ImageService.translate('/img/ryoshi-dynasties/icons/lock.png').convert()}
                                    alt="lockIcon"
                                    boxSize={12}
                                  />
                                )}
                              </Center>
                            </Flex>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              )
            })}
          </SimpleGrid>
          <Stack
            my={{base: 4, md: 'auto'}} px={4}
            direction={{base: 'column', sm: 'row'}}
            justify='end'
            w='full'
            maxW='664px'
            align='center'
          >
            <Alert status='warning' mb={1}>
              <AlertIcon />
              <AlertDescription fontSize='sm'>
                Changes from multiple chains detected. Starting with Cronos
              </AlertDescription>
            </Alert>
            <Box>
              <RdButton
                minW='150px'
                onClick={handleStake}
                isLoading={isExecutingStake}
                disabled={isExecutingStake}
                stickyIcon={true}
                loadingText={executingLabel}
                ms={8}
              >
                Save
              </RdButton>
            </Box>
          </Stack>
        </VStack>
      </Flex>
      {selectedLockedSlot !== undefined && !!nextSlot && (
        <SlotUnlockDialog
          isOpen={true}
          onClose={() => {
            setSelectedLockedSlot(undefined);
            refetchSlotUnlockContext();
          }}
          initialApprovalState={unlockApprovalState}
        />
      )}
    </Box>
  )
}

interface SlotUnlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialApprovalState: [BigNumber, boolean];
}

const SlotUnlockDialog = ({isOpen, onClose, initialApprovalState}: SlotUnlockDialogProps) => {
  const user = useUser();
  const { config: appChainConfig } = useAppChainConfig();
  const { nextSlot } = useContext(BankStakeNftContext) as BankStakeNftContextProps;
  const [executingFortuneApproval, setExecutingFortuneApproval] = useState(false);
  const [executingResourcesApproval, setExecutingResourcesApproval] = useState(false);
  const [executingUnlock, setExecutingUnlock] = useState(false);
  const [unlockApprovalState, setUnlockApprovalState] = useState(initialApprovalState);
  const fortuneApprovalLimit = 10000;
  const fortuneTopUpThreshold = 5000;
  const {requestSignature} = useEnforceSignature();

  useEffect(() => {
    setUnlockApprovalState(initialApprovalState);
  }, [initialApprovalState]);

  const handleUnlock = async () => {
    try {
      setExecutingUnlock(true);
      if (!nextSlot) {
        throw new Error('No available slot to unlock');
      }

      const fortuneContract = new Contract(appChainConfig.contracts.fortune, Fortune, user.provider.getSigner());
      const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), appChainConfig.contracts.resources);
      if (totalApproved.lt(ethers.utils.parseEther(nextSlot.cost.frtn.toString()))) {
        toast.warning('Approving FRTN');
        await handleEnableFortune();
      }

      const resourcesContract = new Contract(appChainConfig.contracts.resources, Resources, user.provider.getSigner());
      const balance = await resourcesContract.balanceOf(user.address, 1);
      if (balance.lt(nextSlot.cost.koban)) {
        throw new Error('Not enough Koban')
      }

      const signature = await requestSignature();
      const authorization = await ApiService.withoutKey().ryoshiDynasties.requestSlotUnlockAuthorization(
        1,
        appChainConfig.chain.id,
        user.address!,
        signature
      );

      console.log('SPPROVAL',
        totalApproved.toString(),
        ethers.utils.parseEther(nextSlot.cost.frtn.toString()).toString(),
        authorization.approval,
        authorization.signature

      )

      const tx = await resourcesContract.craftItems(authorization.approval, authorization.signature);
      await tx.wait();

      toast.success('Slot has been unlocked!');
      onClose();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecutingFortuneApproval(false);
      setExecutingResourcesApproval(false);
      setExecutingUnlock(false);
    }
  }

  const handleEnableFortune = async () => {
    try {
      setExecutingFortuneApproval(true);
      const fortuneContract = new Contract(appChainConfig.contracts.fortune, Fortune, user.provider.getSigner());
      const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), appChainConfig.contracts.resources);
      const fortuneApprovalLimitWei = ethers.utils.parseEther(fortuneApprovalLimit.toString());
      const fortuneTopUpThresholdWei = ethers.utils.parseEther(fortuneTopUpThreshold.toString());
      if (totalApproved.lt(fortuneTopUpThresholdWei)) {
        const fortuneContract = new Contract(appChainConfig.contracts.fortune, Fortune, user.provider.getSigner());
        const tx = await fortuneContract.approve(appChainConfig.contracts.resources, fortuneApprovalLimitWei);
        await tx.wait();
        setUnlockApprovalState([fortuneApprovalLimitWei, unlockApprovalState[1]]);
      }
      toast.success('Fortune has been enabled!');
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecutingFortuneApproval(false);
    }
  }

  const handleEnableResources = async () => {
    try {
      setExecutingResourcesApproval(true);
      const resourcesContract = new Contract(appChainConfig.contracts.resources, ERC1155, user.provider.getSigner());
      const isResourcesApproved = await resourcesContract.isApprovedForAll(user.address, appChainConfig.contracts.resources);

      if (!isResourcesApproved) {
        let tx = await resourcesContract.setApprovalForAll(appChainConfig.contracts.resources, true);
        await tx.wait();
        setUnlockApprovalState([unlockApprovalState[0], true]);
      }
      toast.success('Koban has been enabled!');
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setExecutingResourcesApproval(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      isCentered={true}
      onClose={onClose}
      size='lg'
    >
      <ModalOverlay />
      <ModalContent border='2px solid #CCC' bg='#292626' color='white' className={gothamBook.className}>
        <ModalHeader>
          <Center>
            <HStack>
              <Text>Unlock Staking Slots</Text>
            </HStack>
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody color='white'>
          <Text>Unlock staking slots to allow additional NFTs to earn more APR in the bank.</Text>
          <Box
            bg='#453e3b'
            rounded='lg'
            p={2}
            mt={4}
          >
            <Text textAlign='center' mb={4}>Current slot cost</Text>
            <SimpleGrid columns={2}>
              <VStack spacing={0}>
                <HStack>
                  <FortuneIcon boxSize={6} />
                  <Text fontWeight='bold' fontSize='lg'>{nextSlot?.cost.frtn}</Text>
                </HStack>
                <Box fontSize='sm'>Fortune</Box>
              </VStack>
              <VStack spacing={0}>
                <HStack>
                  <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/>
                  <Text fontWeight='bold' fontSize='lg'>{nextSlot?.cost.koban}</Text>
                </HStack>
                <Box fontSize='sm'>Koban</Box>
              </VStack>
            </SimpleGrid>
          </Box>
        </ModalBody>
        <ModalFooter>
          <VStack w='full'>
            <ButtonGroup spacing={2} width="full">
              {unlockApprovalState[0].lt(ethers.utils.parseEther(fortuneTopUpThreshold.toString())) && (
                <Button
                  size='md'
                  isLoading={executingFortuneApproval}
                  isDisabled={executingFortuneApproval || executingResourcesApproval || executingUnlock}
                  onClick={handleEnableFortune}
                  variant='ryoshiDynasties'
                  flex={1}
                >
                  Enable FRTN
                </Button>
              )}
              {!unlockApprovalState[1] && (
                <Button
                  size='md'
                  isLoading={executingResourcesApproval}
                  isDisabled={executingFortuneApproval || executingResourcesApproval || executingUnlock}
                  onClick={handleEnableResources}
                  variant='ryoshiDynasties'
                  flex={1}
                >
                  Enable Koban
                </Button>
              )}
            </ButtonGroup>
            <Button
              w='full'
              size='md'
              isLoading={executingUnlock}
              isDisabled={executingUnlock || !unlockApprovalState[0].gte(ethers.utils.parseEther(fortuneTopUpThreshold.toString())) || !unlockApprovalState[1]}
              onClick={handleUnlock}
              variant='ryoshiDynasties'
            >
              Unlock
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default StakingBlock;