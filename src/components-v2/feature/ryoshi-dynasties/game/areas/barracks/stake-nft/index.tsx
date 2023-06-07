import {Box, Flex, HStack, Icon, IconButton, Image, SimpleGrid, Text, VStack, Wrap, WrapItem} from "@chakra-ui/react"

import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import InfiniteScroll from "react-infinite-scroll-component";
import {Spinner} from "react-bootstrap";
import StakingNftCard from "@src/components-v2/feature/ryoshi-dynasties/game/areas/barracks/stake-nft/staking-nft-card";
import {appConfig} from "@src/Config";
import {caseInsensitiveCompare} from "@src/utils";
import WalletNft from "@src/core/models/wallet-nft";
import ImageService from "@src/core/services/image";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import ShrineIcon from "@src/components-v2/shared/icons/shrine";
import {CloseIcon} from "@chakra-ui/icons";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {Contract} from "ethers";
import {ERC721} from "@src/Contracts/Abis";
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

const config = appConfig();

// Maps to collection slug
const tabs = {
  ryoshiVip: 'ryoshi-tales-vip',
  ryoshiHalloween: 'ryoshi-tales-halloween',
  ryoshiChristmas: 'ryoshi-tales-christmas'
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

  const addressForTab = config.collections.find((c: any) => c.slug === currentTab)?.address;

  const handleBtnClick = (key: string) => (e: any) => {
    setCurrentTab(key);
  };

  const handleAddNft = useCallback((nft: WalletNft) => {
    const isInList = pendingNfts.some((sNft) => sNft.nftId === nft.nftId && caseInsensitiveCompare(sNft.nftAddress, nft.nftAddress));
    if (!isInList && pendingNfts.length < rdConfig.barracks.staking.nft.maxSlots) {
      setPendingNfts([...pendingNfts, {
        nftAddress: nft.nftAddress,
        nftId: nft.nftId,
        image: nft.image,
        rank: nft.rank,
        isAlreadyStaked: false
      }]);
    }
  }, [pendingNfts]);

  const handleRemoveNft = useCallback((nftAddress: string, nftId: string) => {
    setPendingNfts(pendingNfts.filter((nft) => nft.nftId !== nftId || !caseInsensitiveCompare(nft.nftAddress, nftAddress)));
  }, [pendingNfts]);

  const handleStakeSuccess = useCallback(() => {
    queryClient.invalidateQueries(['BarracksStakedNfts', user.address]);
    queryClient.invalidateQueries(['BarracksUnstakedNfts', user.address, currentCollection]);
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
    setPendingNfts([...pendingNfts.map((nft) => ({...nft, isAlreadyStaked: true}))]);
    refreshUser();
  }, [queryClient, stakedNfts, pendingNfts, user.address]);

  const handleClose = () => {
    setPendingNfts([]);
    setStakedNfts([]);
    setCurrentCollection(addressForTab);
    setCurrentTab(tabs.ryoshiVip);
    onClose();
  }

  useEffect(() => {
    if (!isOpen) return;

    queryClient.fetchQuery(
      ['BarracksStakedNfts', user.address],
      () => ApiService.withoutKey().ryoshiDynasties.getStakedTokens(user.address!, StakedTokenType.BARRACKS)
    ).then(async (data) => {
      setStakedNfts(data);

      const nfts: PendingNft[] = [];
      for (const token of data) {
        const nft = await getNft(token.contractAddress, token.tokenId);
        if (nft) {
          nfts.push({
            nftAddress: token.contractAddress,
            nftId: token.tokenId,
            image: nft.nft.image,
            rank: nft.nft.rank,
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
    >
      <BarracksStakeNftContext.Provider value={pendingNfts}>
        <Text align='center' p={2}>Ryoshi Tales NFTs can be staked to earn 2 extra battle units per slot.</Text>
        <StakingBlock
          pendingNfts={pendingNfts}
          stakedNfts={stakedNfts}
          onRemove={handleRemoveNft}
          onStaked={handleStakeSuccess}
        />
        <Box p={4}>
          <Flex direction='row' justify='center' mb={2}>
            <RdTabButton isActive={currentTab === tabs.ryoshiVip} onClick={handleBtnClick(tabs.ryoshiVip)}>
              VIP
            </RdTabButton>
            <RdTabButton isActive={currentTab === tabs.ryoshiHalloween} onClick={handleBtnClick(tabs.ryoshiHalloween)}>
              Halloween
            </RdTabButton>
            <RdTabButton isActive={currentTab === tabs.ryoshiChristmas} onClick={handleBtnClick(tabs.ryoshiChristmas)}>
              Christmas
            </RdTabButton>
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
  isAlreadyStaked: boolean;
}

const StakingBlock = ({pendingNfts, stakedNfts, onRemove, onStaked}: StakingBlockProps) => {
  const user = useAppSelector((state) => state.user);
  const [isExecutingStake, setIsExecutingStake] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('');
  const [stakeNfts, response] = useBarracksStakeNfts();
  const rdContext = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;

  const collections = rdContext.config.barracks.staking.nft.collections;

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
        toast.error('Staking failed. Please try again.');
      }
    } finally {
      setIsExecutingStake(false);
      setExecutingLabel('');
    }

  }, [pendingNfts, executingLabel, isExecutingStake]);

  return (
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
                      <HStack spacing={1}>
                        <Icon as={FontAwesomeIcon} icon={faAward} />
                        <Box as='span'>{pendingNfts[index].rank ?? ''}</Box>
                      </HStack>
                      <Box as='span' fontWeight='bold'>+ {collections.find(c => caseInsensitiveCompare(c.address, pendingNfts[index].nftAddress))?.multipliers[0].value}</Box>
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
                <Box position='relative'>
                  <Box
                    p={2}
                    rounded='xl'
                  >
                    <Box
                      width={100}
                      height={100}
                      bgColor='#716A67'
                      rounded='xl'
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
        >
          <>{isExecutingStake ? executingLabel : 'Save'}</>
        </RdButton>
      </Box>
    </VStack>
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

  const { data, status, error, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['BarracksUnstakedNfts', address, collection],
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
      enabled: !!address && isReady && !!collection,
      select: (data) => {
        data.pages = data.pages.map((page) => {
          return {
            ...page,
            data: page.data.filter((item) => {
              return item.attributes?.some((attr: any) => {
                const collection = config.collections.find((c: any) => caseInsensitiveCompare(c.address, item.nftAddress));
                const eligibility = rdContext.config.barracks.staking.nft.collections.find((e) => e.slug === collection.slug);
                if (!eligibility) return false;
                const traitType = attr.trait_type.toLowerCase();
                const value = attr.value.toString().toLowerCase();

                let found = false;
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
          <div className="row">
            <div className="col-lg-12 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
        }
      >
        {status === "loading" ? (
          <div className="col-lg-12 text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : status === "error" ? (
          <p>Error: {(error as any).message}</p>
        ) : (
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
        )}
      </InfiniteScroll>

    </>
  )
}