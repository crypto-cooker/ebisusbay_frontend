import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  VStack
} from "@chakra-ui/react"

import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useInfiniteQuery, useQuery, useQueryClient} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import InfiniteScroll from "react-infinite-scroll-component";
import StakingNftCard from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/staking-nft-card";
import {appConfig} from "@src/Config";
import {caseInsensitiveCompare} from "@src/utils";
import WalletNft from "@src/core/models/wallet-nft";
import ImageService from "@src/core/services/image";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import ShrineIcon from "@src/components-v2/shared/icons/shrine";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {Contract, ethers} from "ethers";
import {ERC1155, ERC721} from "@src/Contracts/Abis";
import useBankStakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-bank-stake-nfts";
import {getNft} from "@src/core/api/endpoints/nft";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAward} from "@fortawesome/free-solid-svg-icons";
import {BankStakeNftContext} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/context";
import {toast} from "react-toastify";
import {StakedTokenType} from "@src/core/services/api-service/types";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/faq-page";
import SeasonUnlocks from "@src/Contracts/SeasonUnlocks.json";
import Fortune from "@src/Contracts/Fortune.json";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

const tabs = {
  ryoshiVip: 'ryoshi-tales-vip',
  ryoshiHalloween: 'ryoshi-tales-halloween',
  ryoshiChristmas: 'ryoshi-tales-christmas',
  fortuneGuards: 'fortune-guards'
};

interface StakeNftsProps {
  isOpen: boolean;
  onClose: () => void;
}

const StakeNfts = ({isOpen, onClose}: StakeNftsProps) => {
  const user = useAppSelector((state) => state.user);
  const queryClient = useQueryClient();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [currentTab, setCurrentTab] = useState(tabs.ryoshiVip);
  const [currentCollection, setCurrentCollection] = useState<any>();
  const [stakedNfts, setStakedNfts] = useState<StakedToken[]>([]);
  const [pendingNfts, setPendingNfts] = useState<PendingNft[]>([]);
  const [page, setPage] = useState<string>();

  const addressForTab = config.collections.find((c: any) => c.slug === currentTab)?.address;

  const handleBtnClick = (key: string) => (e: any) => {
    setCurrentTab(key);
  };

  const handleAddNft = useCallback((nft: WalletNft) => {
    const isInList = pendingNfts.some((sNft) => sNft.nftId === nft.nftId && caseInsensitiveCompare(sNft.nftAddress, nft.nftAddress));
    if (!isInList && pendingNfts.length < rdContext.config.bank.staking.nft.maxSlots) {
      const collectionSlug = config.collections.find((c: any) => caseInsensitiveCompare(c.address, nft.nftAddress))?.slug;
      const stakeConfig = rdContext.config.bank.staking.nft.collections.find((c) => c.slug === collectionSlug);

      const percentile = (nft.rank / stakeConfig!.maxSupply) * 100;
      const multiplier = stakeConfig!.multipliers
        .sort((a: any, b: any) => a.percentile - b.percentile)
        .find((m: any) => percentile <= m.percentile)?.value || 0;
      const adder = stakeConfig!.adders
        .sort((a: any, b: any) => a.percentile - b.percentile)
        .find((m: any) => percentile <= m.percentile)?.value || 0;
      const idBonus = stakeConfig!.ids.find((i) => i.id.toString() === nft.nftId)?.bonus || 0;

      setPendingNfts([...pendingNfts, {
        nftAddress: nft.nftAddress,
        nftId: nft.nftId,
        image: nft.image,
        rank: nft.rank,
        multiplier,
        adder: adder + idBonus,
        isAlreadyStaked: false
      }]);
    }
  }, [pendingNfts]);

  const handleRemoveNft = useCallback((nftAddress: string, nftId: string) => {
    setPendingNfts(pendingNfts.filter((nft) => nft.nftId !== nftId || !caseInsensitiveCompare(nft.nftAddress, nftAddress)));
  }, [pendingNfts]);

  const handleStakeSuccess = useCallback(() => {
    queryClient.invalidateQueries(['BankStakedNfts', user.address]);
    queryClient.invalidateQueries(['BankUnstakedNfts', user.address, currentCollection]);
    queryClient.setQueryData(['BankUnstakedNfts', user.address, currentCollection], (old: any) => {
      if (!old) return [];
      old.pages = old.pages.map((page:  any) => {
        page.data = page.data.filter((nft: any) => !pendingNfts.some((pNft) => pNft.nftId === nft.nftId && caseInsensitiveCompare(pNft.nftAddress, nft.nftAddress)));
        return page;
      });
      return old;
    })
    setStakedNfts([...stakedNfts, ...pendingNfts.map((nft) => ({
      amount: '1',
      contractAddress: nft.nftAddress,
      id: '',
      tokenId: nft.nftId,
      type: StakedTokenType.BANK,
      user: user.address!
    }))]);
    setPendingNfts([...pendingNfts.map((nft) => ({...nft, isAlreadyStaked: true}))]);
  }, [queryClient, stakedNfts, pendingNfts, user.address]);

  const handleClose = () => {
    setPendingNfts([]);
    setStakedNfts([]);
    setCurrentCollection(addressForTab);
    setCurrentTab(tabs.ryoshiVip);
    onClose();
  }

  const handleBack = () => {
    if (!!page) {
      setPage(undefined);
    } else {
      setPage('faq');
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    queryClient.fetchQuery(
      ['BankStakedNfts', user.address],
      () => ApiService.withoutKey().ryoshiDynasties.getStakedTokens(user.address!, StakedTokenType.BANK)
    ).then(async (data) => {
      setStakedNfts(data);

      const nfts: PendingNft[] = [];
      for (const token of data) {
        const nft = await getNft(token.contractAddress, token.tokenId);
        if (nft) {
          const stakeConfig = rdContext.config.bank.staking.nft.collections.find((c) => caseInsensitiveCompare(c.address, nft.collection.address));

          const percentile = (nft.nft.rank / stakeConfig!.maxSupply) * 100;
          const multiplier = stakeConfig!.multipliers
            .sort((a: any, b: any) => a.percentile - b.percentile)
            .find((m: any) => percentile <= m.percentile)?.value || 0;
          const adder = stakeConfig!.adders
            .sort((a: any, b: any) => a.percentile - b.percentile)
            .find((m: any) => percentile <= m.percentile)?.value || 0;
          const idBonus = stakeConfig!.ids.find((i) => i.id.toString() === nft.nft.nftId)?.bonus || 0;

          nfts.push({
            nftAddress: token.contractAddress,
            nftId: token.tokenId,
            image: nft.nft.image,
            rank: nft.nft.rank,
            multiplier,
            adder: adder + idBonus,
            isAlreadyStaked:  true
          })
        }
      }
      setPendingNfts(nfts);
    });


  }, [isOpen]);

  useEffect(() => {
    setCurrentCollection(addressForTab);
  }, [currentTab]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Stake NFTs'
      size='5xl'
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <BankStakeNftContext.Provider value={pendingNfts}>
          <Text align='center' p={2}>Ryoshi Tales NFTs can be staked to boost rewards for staked $Fortune. Receive larger boosts by staking higher ranked NFTs.</Text>
          <StakingBlock
            pendingNfts={pendingNfts}
            stakedNfts={stakedNfts}
            onRemove={handleRemoveNft}
            onStaked={handleStakeSuccess}
          />
          <Box p={4}>
            <Flex direction='row' justify='center' mb={2}>
              <SimpleGrid columns={{base: 2, sm: 4}}>
                <RdTabButton isActive={currentTab === tabs.ryoshiVip} onClick={handleBtnClick(tabs.ryoshiVip)}>
                  VIP
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.fortuneGuards} onClick={handleBtnClick(tabs.fortuneGuards)}>
                  Guards
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.ryoshiHalloween} onClick={handleBtnClick(tabs.ryoshiHalloween)}>
                  Halloween
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.ryoshiChristmas} onClick={handleBtnClick(tabs.ryoshiChristmas)}>
                  Christmas
                </RdTabButton>
              </SimpleGrid>
            </Flex>
            <Box>
              <UnstakedNfts
                isReady={isOpen}
                collection={currentCollection}
                address={user.address ?? undefined}
                onAdd={handleAddNft}
                onRemove={handleRemoveNft}
              />
            </Box>
          </Box>
        </BankStakeNftContext.Provider>
      )}
    </RdModal>
  )
}

export default StakeNfts;

interface StakingBlockProps {
  pendingNfts: PendingNft[];
  stakedNfts: StakedToken[];
  onRemove: (nftAddress: string, nftId: string) => void;
  onStaked: () => void;
}

interface PendingNft {
  nftAddress: string;
  nftId: string;
  image: string;
  rank: number;
  multiplier: number;
  adder: number;
  isAlreadyStaked: boolean;
}

const StakingBlock = ({pendingNfts, stakedNfts, onRemove, onStaked}: StakingBlockProps) => {
  const user = useAppSelector((state) => state.user);
  const [isExecutingStake, setIsExecutingStake] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('');
  const [stakeNfts, response] = useBankStakeNfts();
  // const { isOpen: isUnlockDialogOpen, onOpen: onOpenUnlockDialog, onClose: onCloseUnlockDialog } = useDisclosure();
  const [unlockApprovalState, setUnlockApprovalState] = useState<[number, boolean]>([0, false]);
  const [selectedLockedSlot, setSelectedLockedSlot] = useState<number>();

  const { data: slotUnlockContext } = useQuery({
    queryKey: ['BankSlotUnlockContext', user.address],
    queryFn: async () => {
      const contract = new Contract(config.contracts.seasonUnlocks, SeasonUnlocks, readProvider);
      const unlocks = await contract.unlocks(1, user.address!);
      const resources = await contract.resources();
      const fortune = await contract.fortune();
      const recipes = await contract.recipes(1, 0);
      return {
        unlocks,
        resources,
        fortune,
        recipes
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!user.address,
    initialData: {
      unlocks: 0,
      resources: 0,
      fortune: 0,
      recipes: []
    }
  });

  console.log('DAAATA', slotUnlockContext);
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
        const isApproved = await nftContract.isApprovedForAll(user.address!.toLowerCase(), config.contracts.bank);

        if (!isApproved) {
          let tx = await nftContract.setApprovalForAll(config.contracts.bank, true);
          await tx.wait();
          approvedCollections.push(nft.nftAddress);
        }
      }
      hasCompletedApproval = true;

      setExecutingLabel('Staking');
      console.log('stake', pendingNfts, stakedNfts);
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
        toast.error('Staking failed. Please try again.');
      }
    } finally {
      setIsExecutingStake(false);
      setExecutingLabel('');
    }

  }, [pendingNfts, executingLabel, isExecutingStake]);

  const checkForApproval = async () => {
    const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
    const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
    const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), config.contracts.seasonUnlocks);

    const resourcesContract = new Contract(config.contracts.resources, ERC1155, readProvider);
    const isResourcesApproved = await resourcesContract.isApprovedForAll(user.address, config.contracts.seasonUnlocks);

    setUnlockApprovalState([totalApproved, isResourcesApproved]);
  }

  useEffect(() => {
    checkForApproval();
  }, []);

  return (
    <Box>
      <VStack my={6} px={4} spacing={8}>
        <SimpleGrid columns={{base: 2, sm: 3, md: 5}} gap={2}>
          {[...Array(5).fill(0)].map((_, index) => {
            return (
              <Box key={index} w='120px'>
                {!!pendingNfts[index] ? (
                  <Box position='relative'>
                    <Box
                      bg='#376dcf'
                      p={2}
                      rounded='xl'
                      border='2px dashed'
                      borderColor={pendingNfts[index].isAlreadyStaked ? 'transparent' : '#ffa71c'}
                    >
                      <Box
                        width={100}
                        height={100}
                      >
                        <Image src={ImageService.translate(pendingNfts[index].image).fixedWidth(100, 100)} rounded='lg'/>
                      </Box>
                      <Flex fontSize='xs' justify='space-between' mt={1}>
                        <Box verticalAlign='top'>
                          {pendingNfts[index].rank && (
                            <HStack spacing={1}>
                              <Icon as={FontAwesomeIcon} icon={faAward} />
                              <Box as='span'>{pendingNfts[index].rank ?? ''}</Box>
                            </HStack>
                          )}
                        </Box>
                        <VStack align='end' spacing={0} fontWeight='bold'>
                          {pendingNfts[index].multiplier && (
                            <Box>x {pendingNfts[index].multiplier}%</Box>
                          )}
                          {pendingNfts[index].adder && (
                            <Box>+ {pendingNfts[index].adder}%</Box>
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
                        onClick={() => onRemove(pendingNfts[index].nftAddress, pendingNfts[index].nftId)}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box position='relative' overflow='hidden'>
                    <Box
                      p={2}
                      rounded='xl'
                      cursor='pointer'
                      onClick={() => setSelectedLockedSlot(index)}
                    >
                      <Box
                        width={100}
                        height={100}
                        bgColor='#716A67'
                        rounded='xl'
                        position='relative'
                      >
                        <ShrineIcon boxSize='100%' fill='#B1ADAC'/>
                        {index > slotUnlockContext.unlocks && (
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
                          >
                            <Center>
                              <Image
                                src={ImageService.translate('/img/ryoshi-dynasties/icons/lock.png').convert()}
                                alt="lockIcon"
                                boxSize={12}
                              />
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
        <Box ms={8} my={{base: 4, md: 'auto'}} textAlign='center'>
          <RdButton
            minW='150px'
            onClick={handleStake}
            isLoading={isExecutingStake}
            disabled={isExecutingStake}
            stickyIcon={true}
            loadingText={executingLabel}
          >
            Save
          </RdButton>
        </Box>
      </VStack>
      <SlotUnlockDialog
        isOpen={selectedLockedSlot !== undefined}
        onClose={() => setSelectedLockedSlot(undefined)}
        initialApprovalState={unlockApprovalState}
        index={selectedLockedSlot! - 1}
        slotUnlockContext={slotUnlockContext}
      />
    </Box>
  )
}


interface UnstakedNftsProps {
  isReady: boolean;
  address?: string;
  collection: string;
  onAdd: (nft: WalletNft) => void;
  onRemove: (nftAddress: string, nftId: string) => void;
}

const UnstakedNfts = ({isReady, address, collection, onAdd, onRemove}: UnstakedNftsProps) => {
  const { data, status, error, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['BankUnstakedNfts', address, collection],
    () => nextApiService.getWallet(address!, {
      collection: [collection],
      sortBy: 'rank',
      direction: 'asc'
    }),
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false,
      enabled: !!address && isReady && !!collection
    }
  );

  return (
    <>
      <InfiniteScroll
        dataLength={data?.pages ? data.pages.flat().length : 0}
        next={fetchNextPage}
        hasMore={hasNextPage ?? false}
        style={{ overflow: 'hidden' }}
        loader={
          <Center>
            <Spinner />
          </Center>
        }
      >
        {status === "loading" ? (
          <Center>
            <Spinner />
          </Center>
        ) : status === "error" ? (
          <p>Error: {(error as any).message}</p>
        ) : data?.pages.map((page) => page.data).flat().length > 0 ? (
          <SimpleGrid
            columns={{base: 2, sm: 3, md: 4}}
            gap={3}
          >
            {data.pages.map((items, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {items.data.map((nft, itemIndex) => (
                  <StakingNftCard
                    key={nft.name}
                    nft={nft}
                    onAdd={() => onAdd(nft)}
                    onRemove={() => onRemove(nft.nftAddress, nft.nftId)}
                  />
                ))}
              </React.Fragment>
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign='center' mt={8}>
            <Text>No NFTs available</Text>
          </Box>
        )}
      </InfiniteScroll>

    </>
  )
}


// interface LockedSlotProps {
//   onClick: () => void;
// }
// const LockedSlot = ({onClick}) => {
//
// }

interface SlotUnlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialApprovalState: [number, boolean];
  index: number;
  slotUnlockContext: { unlocks: number, fortune: number, resources: number };
}

const SlotUnlockDialog = ({isOpen, onClose, initialApprovalState, index, slotUnlockContext}: SlotUnlockDialogProps) => {
  const user = useAppSelector((state) => state.user);
  const [executingFortuneApproval, setExecutingFortuneApproval] = useState(false);
  const [executingResourcesApproval, setExecutingResourcesApproval] = useState(false);
  const [isExecutingUnlock, setIsExecutingUnlock] = useState(false);
  const [unlockApprovalState, setUnlockApprovalState] = useState(initialApprovalState);
  const [executingLabel, setExecutingLabel] = useState('Unlocking');

  const handleUnlock = async () => {
    // if (unlockApprovalState[0] > 0 && unlockApprovalState[1]) {
    //
    // } else if (unlockApprovalState[0] > 0 && !unlockApprovalState[1]) {
    //
    // } else if (unlockApprovalState[0] < 1 && unlockApprovalState[1]) {
    //
    // } else {
    //
    // }

    try {
      setIsExecutingUnlock(true);
      const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
      const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), config.contracts.seasonUnlocks);
      const fortuneSoftLimit = 10000;
      if (totalApproved.lt(ethers.utils.parseEther(fortuneSoftLimit.toString()))) {
        setExecutingLabel('Approving');
        const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
        const tx = await fortuneContract.approve(config.contracts.seasonUnlocks, ethers.utils.parseEther(fortuneSoftLimit.toString()));
        await tx.wait();
        setUnlockApprovalState([fortuneSoftLimit, unlockApprovalState[1]]);
      }

      console.log('unlock!!1', config.contracts.seasonUnlocks, user.address)
      const resourcesContract = new Contract(config.contracts.resources, ERC1155, user.provider.getSigner());
      const isResourcesApproved = await resourcesContract.isApprovedForAll(user.address, config.contracts.seasonUnlocks);
      console.log('unlock!!2', index)

      if (!isResourcesApproved) {
        setExecutingLabel('Approving');
        let tx = await resourcesContract.setApprovalForAll(config.contracts.seasonUnlocks, true);
        await tx.wait();
        setUnlockApprovalState([fortuneSoftLimit, true]);
      }

      setExecutingLabel('Unlocking2');
      const unlockContract = new Contract(config.contracts.seasonUnlocks, SeasonUnlocks, user.provider.getSigner());

      let tx = await unlockContract.unlock(1, index);
      await tx.wait();
    } catch (e) {
      console.log(e);
    } finally {
      setExecutingLabel('Unlocking');
      setExecutingFortuneApproval(false);
      setExecutingResourcesApproval(false);
      setIsExecutingUnlock(false);
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
      <ModalContent border='2px solid #CCC'>
        <ModalHeader>
          <Center>
            <HStack>
              <Text>Unlock Staking Slots</Text>
            </HStack>
          </Center>
        </ModalHeader>
        <ModalBody color='white' >
          <Text>Unlock staking slots to allow additional NFTs to be staked and earn more APR in the bank.</Text>
          <Box mt={4}>
            {unlockApprovalState[0] > 0 && unlockApprovalState[1] ? (
              <Text>Current cost for this slot is {slotUnlockContext.fortune} Fortune and {slotUnlockContext.unlocks} Koban</Text>
            ) : unlockApprovalState[0] > 0 && !unlockApprovalState[1] ? (
              <Text>Ryoshi Dynasties needs approval to transfer Koban on your behalf to complete this transaction. Please approve the contract to continue.</Text>
            ) : unlockApprovalState[0] < 1 && unlockApprovalState[1] ? (
              <Text>Ryoshi Dynasties needs approval to transfer $Fortune on your behalf to complete this transaction. Please approve the contract to continue.</Text>
            ) : (
              <Text>Please approve the following two transactions to allow Ryoshi Dynasties to transfer both $Fortune and Koban on your behalf to allow this slot to be unlocked.</Text>
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <HStack justify='end' spacing={4}>
            <Button variant='unstyled' onClick={onClose}>
              Cancel
            </Button>
            <Button
              size='md'
              bg='#F48F0C'
              rounded='full'
              className='rd-button'
              isLoading={isExecutingUnlock}
              loadingText={executingLabel}
              disabled={isExecutingUnlock}
              onClick={handleUnlock}
              _hover={{
                bg: '#C17109'
              }}
              _loading={{
                bg: '#C17109'
              }}
            >
              {unlockApprovalState[0] > 0 && unlockApprovalState[1] ? (
                <Text>Unlock</Text>
              ) : (
                <Text>Approve</Text>
              )}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}