import {Box, Center, Flex, IconButton, SimpleGrid, Wrap, WrapItem} from "@chakra-ui/react"

import React, {useCallback, useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import InfiniteScroll from "react-infinite-scroll-component";
import {Spinner} from "react-bootstrap";
import StakingNftCard from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/staking-nft-card";
import {appConfig} from "@src/Config";
import {caseInsensitiveCompare} from "@src/utils";
import WalletNft from "@src/core/models/wallet-nft";
import {MultimediaImage} from "@src/components-v2/shared/media/any-media";
import ImageService from "@src/core/services/image";
import {StakedToken} from "@src/core/services/api-service/graph/types";
import ShrineIcon from "@src/components-v2/shared/icons/shrine";
import {CloseIcon} from "@chakra-ui/icons";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";

const config = appConfig();

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

  const [selectedCollection, setSelectedCollection] = useState<string>();
  const [currentTab, setCurrentTab] = useState(tabs.ryoshiVip);
  const [currentCollection, setCurrentCollection] = useState<any>();
  const [candidateNfts, setCandidateNfts] = useState<WalletNft[]>([]);

  const { data: stakedNfts, status, error } = useQuery(
    ['BankStakedNfts', user.address],
    () => ApiService.withoutKey().getStakedTokens(user.address!),
    {
      refetchOnWindowFocus: false,
      enabled: !!user.address
    }
  );

  const handleBtnClick = (key: string) => (e: any) => {
    setCurrentTab(key);
  };

  const handleAddNft = useCallback((nft: WalletNft) => {
    const isInList = candidateNfts.some((sNft) => sNft.nftId === nft.nftId && caseInsensitiveCompare(sNft.nftAddress, nft.nftAddress));
    if (!isInList) {
      setCandidateNfts([...candidateNfts, nft]);
    }
  }, [candidateNfts]);

  const handleRemoveNft = useCallback((nftAddress: string, nftId: string) => {
    setCandidateNfts(candidateNfts.filter((nft) => nft.nftId !== nftId || !caseInsensitiveCompare(nft.nftAddress, nftAddress)));
  }, [candidateNfts]);

  const handleClose = () => {
    setCandidateNfts([]);
    setCurrentCollection(undefined);
    setCurrentTab(tabs.ryoshiVip);
    onClose();
  }

  useEffect(() => {
    const collection = config.collections.find((c: any) => c.slug === currentTab);
    setCurrentCollection(collection.address);
  }, [currentTab]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Stake NFTs'
      size='full'
    >
      <StakedNfts
        currentStakedNfts={stakedNfts}
        candidateNfts={candidateNfts}
        onRemove={handleRemoveNft}
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
            collection={currentCollection}
            address={user.address ?? undefined}
            onAdd={handleAddNft}
            onRemove={handleRemoveNft}
          />
        </Box>
      </Box>
    </RdModal>
  )
}

export default StakeNfts;

interface StakedNftsProps {
  currentStakedNfts?: StakedToken[];
  candidateNfts: WalletNft[];
  onRemove: (nftAddress: string, nftId: string) => void;
}

interface PendingNft {
  nftAddress: string;
  nftId: string;
  image: string;
  isAlreadyStaked: boolean;
}

const StakedNfts = ({currentStakedNfts, candidateNfts, onRemove}: StakedNftsProps) => {
  const [pendingNfts, setPendingNfts] = useState<PendingNft[]>([]);

  const handleRemove = useCallback((nftAddress: string, nftId: string) => {
    setPendingNfts(pendingNfts.filter((nft) => {
      return nft.nftId !== nftId || !caseInsensitiveCompare(nft.nftAddress, nftAddress)
    }));
    onRemove(nftAddress, nftId);
  }, [pendingNfts]);

  const handleStake = useCallback(() => {
    console.log('handleStake')
    // ApiService.withoutKey().requestBankStakeAuthorization(candidateNfts);

  }, []);

  useEffect(() => {
    if (!currentStakedNfts) return;
    setPendingNfts(
      currentStakedNfts.map((stakedNft) => ({
        nftAddress: stakedNft.contractAddress,
        nftId: stakedNft.tokenId,
        image: '',
        isAlreadyStaked: true
      }))
    );
  }, []);

  useEffect(() => {
    const newList =
      pendingNfts.filter((pendingNft) => pendingNft.isAlreadyStaked);

    setPendingNfts(newList.concat(candidateNfts.map((candidateNft) => ({
      nftAddress: candidateNft.nftAddress,
      nftId: candidateNft.nftId,
      image: candidateNft.image,
      isAlreadyStaked: false
    }))));
  }, [candidateNfts]);

  return (
    <Center my={6} px={4}>
      <Wrap>
        {[...Array(5).fill(0)].map((_, index) => {
          return (
            <WrapItem key={index}>
              {!!pendingNfts[index] ? (
                <Box position='relative'>
                  <Box
                    bg='#376dcf'
                    p={2}
                    rounded='xl'
                    border={pendingNfts[index].isAlreadyStaked ? 'none' : '2px dashed #ffa71c'}
                  >
                    <Box
                      width={100}
                      height={100}
                    >
                      <MultimediaImage
                        source={ImageService.translate(pendingNfts[index].image).fixedWidth(100, 100)}
                        title={''}
                        className="img-rounded-8"
                      />
                    </Box>
                  </Box>

                  <Box
                    position='absolute'
                    top={0}
                    right={0}
                    pe={2}
                    pt={1}
                  >
                    <IconButton
                      icon={<CloseIcon boxSize={2} />}
                      aria-label='Remove'
                      bg='gray.800'
                      _hover={{ bg: 'gray.600' }}
                      size='xs'
                      rounded='full'
                      onClick={() => handleRemove(pendingNfts[index].nftAddress, pendingNfts[index].nftId)}
                    />
                  </Box>
                </Box>
              ) : (
                <Box
                  width={104}
                  height={104}
                  rounded='xl'
                  bgColor='#716A67'
                  p={2}
                  my={2}
                >
                  <ShrineIcon boxSize='100%' fill='#B1ADAC'/>
                </Box>
              )}
            </WrapItem>
          )
        })}
      </Wrap>
      <Box ms={8}>
        <RdButton w='150px'>
          Stake
        </RdButton>
      </Box>
    </Center>
  )
}


interface UnstakedNftsProps {
  address?: string;
  collection: string;
  onAdd: (nft: WalletNft) => void;
  onRemove: (nftAddress: string, nftId: string) => void;
}

const UnstakedNfts = ({address, collection, onAdd, onRemove}: UnstakedNftsProps) => {
  const { data, status, error, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['BankUnstakedNfts', address, collection],
    () => nextApiService.getWallet(address!, {
      collection: [collection],
      sortBy: 'rank',
      direction: 'desc'
    }),
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false,
      enabled: !!address
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
            columns={{base: 2, sm: 3, md: 4, lg: 5, xl: 6, '2xl': 7}}
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