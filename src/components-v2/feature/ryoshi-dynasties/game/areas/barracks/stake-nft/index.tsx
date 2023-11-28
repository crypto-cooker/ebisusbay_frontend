import {
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
import StakingNftCard from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/staking-nft-card";
import {appConfig} from "@src/Config";
import {caseInsensitiveCompare, ciEquals} from "@src/utils";
import WalletNft from "@src/core/models/wallet-nft";
import ImageService from "@src/core/services/image";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import ShrineIcon from "@src/components-v2/shared/icons/shrine";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {BigNumber, Contract, ethers} from "ethers";
import {ERC1155, ERC721} from "@src/Contracts/Abis";
import useBarracksStakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-barracks-stake-nfts";
import {getNft} from "@src/core/api/endpoints/nft";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAward} from "@fortawesome/free-solid-svg-icons";
import {
  BarracksStakeNftContext
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/context";
import {toast} from "react-toastify";
import {StakedTokenType} from "@src/core/services/api-service/types";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/faq-page";
import Fortune from "@src/Contracts/Fortune.json";
import SeasonUnlocks from "@src/Contracts/SeasonUnlocks.json";
import {parseErrorMessage} from "@src/helpers/validator";
import localFont from "next/font/local";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const gothamBook = localFont({ src: '../../../../../../../../src/fonts/Gotham-Book.woff2' });

// Maps to collection slug
const tabs = {
  ryoshiVip: 'ryoshi-tales-vip',
  ryoshiTales: 'ryoshi-tales',
  ryoshiHalloween: 'ryoshi-tales-halloween',
  ryoshiChristmas: 'ryoshi-tales-christmas',
};

interface StakeNftsProps {
  isOpen: boolean;
  onClose: () => void;
}

const StakeNfts = ({isOpen, onClose}: StakeNftsProps) => {
  const user = useAppSelector((state) => state.user);
  const queryClient = useQueryClient();
  const { config: rdConfig, refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [currentTab, setCurrentTab] = useState(tabs.ryoshiVip);
  const [currentCollection, setCurrentCollection] = useState<any>();
  const [stakedNfts, setStakedNfts] = useState<StakedToken[]>([]);
  const [pendingNfts, setPendingNfts] = useState<PendingNft[]>([]);
  const [page, setPage] = useState<string>();

  const addressForTab = config.collections.find((c: any) => c.slug === currentTab)?.address;

  const handleBtnClick = (key: string) => (e: any) => {
    setCurrentTab(key);
  };

  const { data: slotUnlockContext, refetch: refetchSlotUnlockContext } = useQuery({
    queryKey: ['BarracksSlotUnlockContext', user.address],
    queryFn: async () => {
      const contract = new Contract(config.contracts.seasonUnlocks, SeasonUnlocks, readProvider);
      const unlocks = await contract.unlocks(2, user.address!);
      const recipes = await contract.getRecipesForType(2);
      return {
        unlocks,
        recipes
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!user.address,
    initialData: {
      unlocks: 0,
      recipes: []
    }
  });

  const handleAddNft = useCallback((nft: WalletNft) => {
    const pendingCount = pendingNfts.filter((sNft) => sNft.nftId === nft.nftId && caseInsensitiveCompare(sNft.nftAddress, nft.nftAddress)).length;
    const withinUnlockedRange = pendingNfts.length < (slotUnlockContext.unlocks + 1);
    const withinMaxSlotRange = pendingNfts.length < rdConfig.barracks.staking.nft.maxSlots;
    const stakedCount = stakedNfts.filter((sNft) => sNft.tokenId === nft.nftId && caseInsensitiveCompare(sNft.contractAddress, nft.nftAddress)).length;
    const hasRemainingBalance = (nft.balance ?? 1) - (pendingCount - stakedCount) > 0;

    if (hasRemainingBalance && withinUnlockedRange && withinMaxSlotRange) {
      const collectionSlug = config.collections.find((c: any) => caseInsensitiveCompare(c.address, nft.nftAddress))?.slug;
      const stakeConfigs = rdConfig.barracks.staking.nft.collections.filter((c) => c.slug === collectionSlug);
      const stakeConfig = stakeConfigs.length < 2
        ? stakeConfigs[0]
        : stakeConfigs.find(c =>  c.minId <= Number(nft.nftId) && c.maxId >= Number(nft.nftId));

      const maxSupply = stakeConfig!.maxId - stakeConfig!.minId + 1;
      const percentile = (nft.rank / maxSupply) * 100;
      const multiplier = stakeConfig!.multipliers
        .sort((a: any, b: any) => a.percentile - b.percentile)
        .find((m: any) => percentile <= m.percentile)?.value || 0;
      const idBonus = stakeConfig!.ids.find((i) => i.id.toString() === nft.nftId)?.bonus || 0;

      const bonusTroops = nft.attributes?.reduce((acc: number, attr: any) => {
        const traitType = attr.trait_type.toLowerCase();
        const value = attr.value.toString().toLowerCase();

        for (let bonusRule of stakeConfig!.bonus) {
          for (let traitRule of bonusRule.traits) {
            if (traitRule.inclusion === 'include' && traitRule.type === traitType && traitRule.values.includes(value)) {
              return bonusRule.value;
            }
          }
        }
        return acc;
      }, 0);

      setPendingNfts([...pendingNfts, {
        nftAddress: nft.nftAddress,
        nftId: nft.nftId,
        image: nft.image,
        rank: nft.rank,
        multiplier: multiplier + idBonus,
        bonusTroops,
        isAlreadyStaked: stakedCount > pendingCount,
        isActive: stakeConfig!.active,
        refBalance: nft.balance ?? 1,
      }]);
    }
  }, [pendingNfts, slotUnlockContext]);

  const handleRemoveNft = useCallback((nftAddress: string, nftId: string) => {
    let arrCopy = [...pendingNfts]; // Copy the original array

    let indexToRemove = arrCopy.slice().reverse().findIndex(nft => nft.nftId == nftId && caseInsensitiveCompare(nft.nftAddress, nftAddress));
    if (indexToRemove !== -1) {
      arrCopy.splice(arrCopy.length - 1 - indexToRemove, 1);
    }
    setPendingNfts(arrCopy);
  }, [pendingNfts]);

  const handleStakeSuccess = useCallback(() => {
    queryClient.invalidateQueries({queryKey: ['BarracksStakedNfts', user.address]});
    queryClient.invalidateQueries({queryKey: ['BarracksUnstakedNfts', user.address, currentCollection]});
    queryClient.setQueryData(['BarracksUnstakedNfts', user.address, currentCollection], (old: any) => {
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
      type: StakedTokenType.BARRACKS,
      user: user.address!
    }))]);
    setPendingNfts([...pendingNfts.map((nft) => ({...nft, isAlreadyStaked: true, isActive: true, refBalance: nft.refBalance - 1}))]);
    refreshUser();
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
    if (!isOpen || !user.address) return;

    queryClient.fetchQuery({
      queryKey: ['BarracksStakedNfts', user.address],
      queryFn: () => ApiService.withoutKey().ryoshiDynasties.getStakedTokens(user.address!, StakedTokenType.BARRACKS)
    }).then(async (data) => {
      setStakedNfts(data);

      const nfts: PendingNft[] = [];
      for (const token of data) {
        const nft = await getNft(token.contractAddress, token.tokenId);
        if (nft) {
          let stakeConfigs = rdConfig.barracks.staking.nft.collections.filter((c) => caseInsensitiveCompare(c.address, nft.collection.address));
          const stakeConfig = stakeConfigs.length < 2
            ? stakeConfigs[0]
            : stakeConfigs.find(c => c.minId <= Number(nft.nft.nftId) && c.maxId >= Number(nft.nft.nftId));

          const maxSupply = stakeConfig!.maxId - stakeConfig!.minId + 1;
          const percentile = (nft.nft.rank / maxSupply) * 100;
          const multiplier = stakeConfig!.multipliers
            .sort((a: any, b: any) => a.percentile - b.percentile)
            .find((m: any) => percentile <= m.percentile)?.value || 0;
          const idBonus = stakeConfig!.ids.find((i) => i.id.toString() === nft.nft.nftId)?.bonus || 0;

          const bonusTroops = nft.attributes?.reduce((acc: number, attr: any) => {
            const traitType = attr.trait_type.toLowerCase();
            const value = attr.value.toString().toLowerCase();

            for (let bonusRule of stakeConfig!.bonus) {
              for (let traitRule of bonusRule.traits) {
                if (traitRule.inclusion === 'include' && traitRule.type === traitType && traitRule.values.includes(value)) {
                  return bonusRule.value;
                }
              }
            }
            return acc;
          }, 0);

          for (let i = 0; i < Number(token.amount); i++) {
            nfts.push({
              nftAddress: token.contractAddress,
              nftId: token.tokenId,
              image: nft.nft.image,
              rank: nft.nft.rank,
              multiplier: multiplier + idBonus,
              bonusTroops,
              isAlreadyStaked: true,
              isActive: stakeConfig!.active,
              refBalance: 0,
            })
          }
        }
      }
      setPendingNfts(nfts);
    });
  }, [isOpen, user.address]);

  useEffect(() => {
    setCurrentCollection(addressForTab);
  }, [currentTab]);

  useEffect(() => {
    if (!user.address) {
      onClose();
    }
  }, [user.address]);

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
        <BarracksStakeNftContext.Provider value={{pendingNfts, stakedNfts}}>
          <Text align='center' p={2}>Ryoshi Tales NFTs can be staked to earn extra battle units per slot. Some NFTs may require a weapon trait. Staked NFTs remain staked for the duration of the game while troops have been deployed or delegated.</Text>
          <StakingBlock
            pendingNfts={pendingNfts}
            stakedNfts={stakedNfts}
            onRemove={handleRemoveNft}
            onStaked={handleStakeSuccess}
            slotUnlockContext={slotUnlockContext}
            refetchSlotUnlockContext={refetchSlotUnlockContext}
          />
          <Box p={4}>
            <Flex direction='row' justify='center' mb={2}>
              <SimpleGrid columns={{base: 2, sm: 3, md: 4}}>
                <RdTabButton isActive={currentTab === tabs.ryoshiVip} onClick={handleBtnClick(tabs.ryoshiVip)}>
                  VIP
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.ryoshiHalloween} onClick={handleBtnClick(tabs.ryoshiHalloween)}>
                  Halloween
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.ryoshiTales} onClick={handleBtnClick(tabs.ryoshiTales)}>
                  Ryoshi Tales
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
        </BarracksStakeNftContext.Provider>
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
  slotUnlockContext: { unlocks: number, recipes: any[] };
  refetchSlotUnlockContext: () => void;
}

interface PendingNft {
  nftAddress: string;
  nftId: string;
  image: string;
  rank: number;
  multiplier: number;
  bonusTroops: number;
  isAlreadyStaked: boolean;
  isActive: boolean;
  refBalance: number;
}

const StakingBlock = ({pendingNfts, stakedNfts, onRemove, onStaked, slotUnlockContext, refetchSlotUnlockContext}: StakingBlockProps) => {
  const user = useAppSelector((state) => state.user);
  const [isExecutingStake, setIsExecutingStake] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('');
  const [stakeNfts, response] = useBarracksStakeNfts();
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
        const isApproved = await nftContract.isApprovedForAll(user.address!.toLowerCase(), config.contracts.barracks);

        if (!isApproved) {
          let tx = await nftContract.setApprovalForAll(config.contracts.barracks, true);
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

  }, [pendingNfts, executingLabel, isExecutingStake]);

  const checkForApproval = async () => {
    const fortuneContract = new Contract(config.contracts.fortune, Fortune, readProvider);
    const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), config.contracts.seasonUnlocks);

    const resourcesContract = new Contract(config.contracts.resources, ERC1155, readProvider);
    const isResourcesApproved = await resourcesContract.isApprovedForAll(user.address, config.contracts.seasonUnlocks);

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
      <VStack my={6} px={4} spacing={8}>
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
                                      <Box as='span'>{pendingNfts[index].rank}</Box>
                                    </HStack>
                                  )}
                                </Box>
                              </>
                            ): (
                              <>Inactive</>
                            )}
                            <VStack align='end' spacing={0} fontWeight='bold'>
                              {pendingNfts[index].multiplier && (
                                <Box>+ {pendingNfts[index].multiplier}</Box>
                              )}
                              {pendingNfts[index].bonusTroops && (
                                <Box>+ {pendingNfts[index].bonusTroops}</Box>
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
                        <PopoverBody>The Barracks no longer supports this collection for staking. Any benefits will be removed next game</PopoverBody>
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
      {selectedLockedSlot !== undefined && slotUnlockContext.recipes.length > 0 && (
        <SlotUnlockDialog
          isOpen={true}
          onClose={() => {
            setSelectedLockedSlot(undefined);
            refetchSlotUnlockContext();
          }}
          initialApprovalState={unlockApprovalState}
          slotUnlockContext={slotUnlockContext}
        />
      )}
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
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const { data, status, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['BarracksUnstakedNfts', address, collection],
    queryFn: () => nextApiService.getWallet(address!, {
      collection: [collection],
      sortBy: 'rank',
      direction: 'asc'
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    enabled: !!address && isReady && !!collection,
    select: (data) => {
      data.pages = data.pages.map((page) => {
        return {
          ...page,
          data: page.data.filter((item) => {
            return item.attributes?.some((attr: any) => {
              const stakeConfigs = rdContext.config.barracks.staking.nft.collections.filter((c) => ciEquals(c.address, item.nftAddress));
              const eligibility = stakeConfigs.length < 2
                ? stakeConfigs[0]
                : stakeConfigs.find(c => c.minId && c.maxId && c.minId <= Number(item.nftId) && c.maxId >= Number(item.nftId));

              if (!eligibility) return false;
              const traitType = attr.trait_type.toLowerCase();
              const value = attr.value.toString().toLowerCase();

              let found = eligibility.traits.length === 0;
              for (let traitRule of eligibility.traits) {
                if (traitRule.inclusion === 'include' && traitRule.type === traitType && traitRule.values.includes(value)) {
                  found = true;
                  break;
                } else if (traitRule.inclusion === 'exclude' && traitRule.type === traitType && !traitRule.values.includes(value)) {
                  found = true;
                  break;
                }
              }

              return found;
            })

          }),
        };
      });

      return data;
    }
  });

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
        {status === 'pending' ? (
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
            <Text>No NFTs available. <br />Can't find your NFT? Check the FAQ at the top left for eligibility requirements</Text>
          </Box>
        )}
      </InfiniteScroll>

    </>
  )
}


interface SlotUnlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialApprovalState: [BigNumber, boolean];
  slotUnlockContext: { unlocks: number, recipes: any[] };
}

const SlotUnlockDialog = ({isOpen, onClose, initialApprovalState, slotUnlockContext}: SlotUnlockDialogProps) => {
  const user = useAppSelector((state) => state.user);
  const [executingFortuneApproval, setExecutingFortuneApproval] = useState(false);
  const [executingResourcesApproval, setExecutingResourcesApproval] = useState(false);
  const [executingUnlock, setExecutingUnlock] = useState(false);
  const [unlockApprovalState, setUnlockApprovalState] = useState(initialApprovalState);
  const fortuneApprovalLimit = 10000;
  const fortuneTopUpThreshold = 5000;
  const currentRecipe = slotUnlockContext.recipes[slotUnlockContext.unlocks];

  useEffect(() => {
    setUnlockApprovalState(initialApprovalState);
  }, [initialApprovalState]);

  const handleUnlock = async () => {
    try {
      setExecutingUnlock(true);
      const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
      const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), config.contracts.seasonUnlocks);
      if (totalApproved.lt(currentRecipe.fortuneAmount)) {
        throw new Error('Not enough Fortune.');
      }

      const resourcesContract = new Contract(config.contracts.resources, ERC1155, readProvider);
      const balance = await resourcesContract.balanceOf(user.address, 1);
      if (balance.lt(currentRecipe.resourcesAmounts[0])) {
        throw new Error('Not enough Koban.');
      }

      const unlockContract = new Contract(config.contracts.seasonUnlocks, SeasonUnlocks, user.provider.getSigner());
      let tx = await unlockContract.unlock(2, slotUnlockContext.unlocks);
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
      const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
      const totalApproved = await fortuneContract.allowance(user.address?.toLowerCase(), config.contracts.seasonUnlocks);
      const fortuneApprovalLimitWei = ethers.utils.parseEther(fortuneApprovalLimit.toString());
      const fortuneTopUpThresholdWei = ethers.utils.parseEther(fortuneTopUpThreshold.toString());
      if (totalApproved.lt(fortuneTopUpThresholdWei)) {
        const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
        const tx = await fortuneContract.approve(config.contracts.seasonUnlocks, fortuneApprovalLimitWei);
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
      const resourcesContract = new Contract(config.contracts.resources, ERC1155, user.provider.getSigner());
      const isResourcesApproved = await resourcesContract.isApprovedForAll(user.address, config.contracts.seasonUnlocks);

      if (!isResourcesApproved) {
        let tx = await resourcesContract.setApprovalForAll(config.contracts.seasonUnlocks, true);
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
          <Text>Unlock staking slots to allow additional NFTs to earn more troops in the barracks.</Text>
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
                  <Text fontWeight='bold' fontSize='lg'>{ethers.utils.formatEther(currentRecipe.fortuneAmount)}</Text>
                </HStack>
                <Box fontSize='sm'>Fortune</Box>
              </VStack>
              <VStack spacing={0}>
                <HStack>
                  <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/koban.png').convert()} alt="kobanIcon" boxSize={6}/>
                  <Text fontWeight='bold' fontSize='lg'>{currentRecipe.resourcesAmounts[0].toString()}</Text>
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