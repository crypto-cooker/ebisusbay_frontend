import {Box, Center, Flex, HStack, Icon, IconButton, Image, SimpleGrid, Spinner, Text, VStack} from "@chakra-ui/react"

import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import InfiniteScroll from "react-infinite-scroll-component";
import StakingNftCard
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/staking-nft-card";
import {appConfig} from "@src/Config";
import {caseInsensitiveCompare} from "@src/utils";
import WalletNft from "@src/core/models/wallet-nft";
import ImageService from "@src/core/services/image";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import ShrineIcon from "@src/components-v2/shared/icons/shrine";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {Contract} from "ethers";
import {ERC721} from "@src/Contracts/Abis";
import {getNft} from "@src/core/api/endpoints/nft";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAward} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import {StakedTokenType} from "@src/core/services/api-service/types";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/faq-page";
import {parseErrorMessage} from "@src/helpers/validator";
import useTownHallStakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-town-hall-stake-nfts";
import {
  TownHallStakeNftContext
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/context";

const config = appConfig();

// Maps to collection slug
const tabs = {
  cowz: 'cowz',
  aikoLegends: 'aiko-legends',
  madMeerkat: 'mad-meerkat'
};

interface StakeNftsProps {
  isOpen: boolean;
  onClose: () => void;
}

const StakeNfts = ({isOpen, onClose}: StakeNftsProps) => {
  const user = useAppSelector((state) => state.user);
  const queryClient = useQueryClient();
  const { config: rdConfig, refreshUser } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const [currentTab, setCurrentTab] = useState(tabs.cowz);
  const [currentCollection, setCurrentCollection] = useState<any>();
  const [stakedNfts, setStakedNfts] = useState<StakedToken[]>([]);
  const [pendingNfts, setPendingNfts] = useState<PendingNft[]>([]);
  const [page, setPage] = useState<string>();

  const addressForTab = config.collections.find((c: any) => c.slug === currentTab)?.address;

  const handleBtnClick = (key: string) => (e: any) => {
    setCurrentTab(key);
  };

  const handleAddNft = useCallback((nft: WalletNft) => {
    const pendingCount = pendingNfts.filter((sNft) => sNft.nftId === nft.nftId && caseInsensitiveCompare(sNft.nftAddress, nft.nftAddress)).length;
    const withinMaxSlotRange = pendingNfts.length < rdConfig.townHall.staking.nft.maxSlots;
    const stakedCount = stakedNfts.filter((sNft) => sNft.tokenId === nft.nftId && caseInsensitiveCompare(sNft.contractAddress, nft.nftAddress)).length;
    const hasRemainingBalance = (nft.balance ?? 1) - (pendingCount - stakedCount) > 0;

    if (hasRemainingBalance && withinMaxSlotRange) {
      const collectionSlug = config.collections.find((c: any) => caseInsensitiveCompare(c.address, nft.nftAddress))?.slug;
      const stakeConfig = rdConfig.townHall.staking.nft.collections.find((c) => c.slug === collectionSlug);

      setPendingNfts([...pendingNfts, {
        nftAddress: nft.nftAddress,
        nftId: nft.nftId,
        name: nft.name,
        image: nft.image,
        rank: nft.rank,
        multiplier: stakeConfig?.fortune ?? 0,
        isAlreadyStaked: stakedCount > pendingCount,
        refBalance: nft.balance ?? 1,
      }]);
    }
  }, [pendingNfts]);

  const handleRemoveNft = useCallback((nftAddress: string, nftId: string) => {
    let arrCopy = [...pendingNfts]; // Copy the original array

    let indexToRemove = arrCopy.slice().reverse().findIndex(nft => nft.nftId == nftId && caseInsensitiveCompare(nft.nftAddress, nftAddress));
    if (indexToRemove !== -1) {
      arrCopy.splice(arrCopy.length - 1 - indexToRemove, 1);
    }
    setPendingNfts(arrCopy);
  }, [pendingNfts]);

  const handleStakeSuccess = useCallback(() => {
    queryClient.invalidateQueries({queryKey: ['TownHallStakedNfts', user.address]});
    queryClient.invalidateQueries({queryKey: ['TownHallUnstakedNfts', user.address, currentCollection]});
    queryClient.setQueryData(['TownHallUnstakedNfts', user.address, currentCollection], (old: any) => {
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
      type: StakedTokenType.TOWN_HALL,
      user: user.address!
    }))]);
    setPendingNfts([...pendingNfts.map((nft) => ({...nft, isAlreadyStaked: true, refBalance: nft.refBalance - 1}))]);
    refreshUser();
  }, [queryClient, stakedNfts, pendingNfts, user.address]);

  const handleClose = () => {
    setPendingNfts([]);
    setStakedNfts([]);
    setCurrentCollection(addressForTab);
    setCurrentTab(tabs.cowz);
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

    queryClient.fetchQuery({
      queryKey: ['TownHallStakedNfts', user.address],
      queryFn: () => ApiService.withoutKey().ryoshiDynasties.getStakedTokens(user.address!, StakedTokenType.TOWN_HALL)
    }).then(async (data) => {
      setStakedNfts(data);

      const nfts: PendingNft[] = [];
      for (const token of data) {
        const nft = await getNft(token.contractAddress, token.tokenId);
        if (nft) {
          const stakeConfig = rdConfig.townHall.staking.nft.collections.find((c) => caseInsensitiveCompare(c.address, nft.collection.address));

          for (let i = 0; i < Number(token.amount); i++) {
            nfts.push({
              nftAddress: token.contractAddress,
              nftId: token.tokenId,
              name: nft.nft.name,
              image: nft.nft.image,
              rank: nft.nft.rank,
              multiplier: stakeConfig?.fortune ?? 0,
              isAlreadyStaked: true,
              refBalance: 0,
            })
          }
        }
      }
      setPendingNfts(nfts);
    });
  }, [isOpen]);

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
        <TownHallStakeNftContext.Provider value={{pendingNfts, stakedNfts}}>
          <Text align='center' p={2}>Ryoshi Tales NFTs can be staked to earn extra battle units per slot. Some NFTs may require a weapon trait. Staked NFTs remain staked for the duration of the game while troops have been deployed or delegated.</Text>
          <StakingBlock
            pendingNfts={pendingNfts}
            stakedNfts={stakedNfts}
            onRemove={handleRemoveNft}
            onStaked={handleStakeSuccess}
          />
          <Box p={4}>
            <Flex direction='row' justify='center' mb={2}>
              <SimpleGrid columns={{base: 2, sm: 3}}>
                <RdTabButton isActive={currentTab === tabs.cowz} onClick={handleBtnClick(tabs.cowz)}>
                  Cowz
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.aikoLegends} onClick={handleBtnClick(tabs.aikoLegends)}>
                  Aiko Legends
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.madMeerkat} onClick={handleBtnClick(tabs.madMeerkat)}>
                  Mad Meerkat
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
        </TownHallStakeNftContext.Provider>
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
  name: string;
  image: string;
  rank: number;
  multiplier: number;
  isAlreadyStaked: boolean;
  refBalance: number;
}

const StakingBlock = ({pendingNfts, stakedNfts, onRemove, onStaked}: StakingBlockProps) => {
  const user = useAppSelector((state) => state.user);
  const [isExecutingStake, setIsExecutingStake] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('');
  const [stakeNfts, response] = useTownHallStakeNfts();

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
        const isApproved = await nftContract.isApprovedForAll(user.address!.toLowerCase(), config.contracts.townHall);

        if (!isApproved) {
          let tx = await nftContract.setApprovalForAll(config.contracts.townHall, true);
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

  return (
    <Box>
      <VStack my={6} px={4} spacing={8}>
        <SimpleGrid columns={{base: 2, sm: 3, md: 5}} gap={2}>
          {[...Array(5).fill(0)].map((_, index) => {
            return (
              <Box key={index} w='120px'>
                {!!pendingNfts[index] ? (
                  <Box position='relative' h='full'>
                    <Box
                      h='full'
                      bg='#376dcf'
                      p={2}
                      rounded='xl'
                      border='2px dashed'
                      borderColor={pendingNfts[index].isAlreadyStaked ? 'transparent' : '#ffa71c'}
                    >
                      <Box width={100} height={100}>
                        <Image src={ImageService.translate(pendingNfts[index].image).fixedWidth(100, 100)} rounded='lg'/>
                      </Box>
                      <Flex fontSize='xs' mt={1}>
                        <Box verticalAlign='top'>
                          {pendingNfts[index].name}
                        </Box>
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
                    >
                      <Box
                        width={100}
                        height={100}
                        bgColor='#716A67'
                        rounded='xl'
                        position='relative'
                      >
                        <ShrineIcon boxSize='100%' fill='#B1ADAC'/>
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
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['TownHallUnstakedNfts', address, collection],
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
    enabled: !!address && isReady && !!collection
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
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : isError ? (
          <p>Error: {(error as any).message}</p>
        ) : !!data && data.pages.map((page) => page.data).flat().length > 0 ? (
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