import {Box, Center, Flex, Image, SimpleGrid, Wrap, WrapItem} from "@chakra-ui/react"

import React, {useCallback, useEffect, useState} from 'react';
// import styles from './profile.module.scss';
import {useAppSelector} from "@src/Store/hooks";
import RdModal from "@src/components-v2/feature/ryoshi-dynasties/components/modal";
import {useInfiniteQuery} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import InfiniteScroll from "react-infinite-scroll-component";
import {Spinner} from "react-bootstrap";
import StakingNftCard from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/staking-nft-card";
import {appConfig} from "@src/Config";
import {caseInsensitiveCompare, isBundle} from "@src/utils";
import WalletNft from "@src/core/models/wallet-nft";
import {AnyMedia, MultimediaImage} from "@src/components-v2/shared/media/any-media";
import ImageService from "@src/core/services/image";
import {specialImageTransform} from "@src/hacks";

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

  const handleBtnClick = (key: string) => (e: any) => {
    setCurrentTab(key);
  };

  const handleAddNft = useCallback((nft: WalletNft) => {
    const isInList = candidateNfts.some((sNft) => sNft.nftId === nft.nftId && caseInsensitiveCompare(sNft.nftAddress, nft.nftAddress));
    if (!isInList) {
      setCandidateNfts([...candidateNfts, nft]);
    }
  }, [candidateNfts]);

  const handleRemoveNft = useCallback((nft: WalletNft) => {
    setCandidateNfts(candidateNfts.filter((sNft) => sNft.nftId !== nft.nftId && !caseInsensitiveCompare(sNft.nftAddress, nft.nftAddress)));
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
      <StakedNfts candidateNfts={candidateNfts} />
      <Box p={4}>
        <div className="de_tab">
          <ul className="de_nav mb-2">
            <li className={`tab ${currentTab === tabs.ryoshiVip ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.ryoshiVip)}>Ryoshi VIP</span>
            </li>
            <li className={`tab ${currentTab === tabs.ryoshiHalloween ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.ryoshiHalloween)}>Ryoshi Halloween</span>
            </li>
            <li className={`tab ${currentTab === tabs.ryoshiChristmas ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.ryoshiChristmas)}>Ryoshi Christmas</span>
            </li>
          </ul>
        </div>
        <div className="de_tab_content">
          <UnstakedNfts
            collection={currentCollection}
            address={user.address ?? undefined}
            onAdd={handleAddNft}
            onRemove={handleRemoveNft}
          />
        </div>
      </Box>
    </RdModal>
  )
}

export default StakeNfts;

interface StakedNftsProps {
  address?: string;
  candidateNfts: WalletNft[];
}

const StakedNfts = ({address, candidateNfts}: StakedNftsProps) => {

  const { data: stakedNfts, status, error, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['BankStakedNfts', address],
    () => ApiService.withoutKey().getStakedTokens(address!),
    {
      getNextPageParam: (lastPage, pages) => {
        return undefined;
      },
      refetchOnWindowFocus: false,
      enabled: !!address
    }
  );

  return (
    <Center my={6}>
      <Wrap>
        {["1", "2", "3", "4", "5"].map((stake, index) => {
          return (
            <WrapItem>
              {!!candidateNfts[index] ? (
                <Box
                  width={100}
                  height={100}
                  style={{borderRadius: '20px'}}
                >
                  <MultimediaImage
                    source={ImageService.translate(candidateNfts[index].image).fixedWidth(100, 100)}
                    title={candidateNfts[index].name}
                    className="img-rounded-8"
                  />
                </Box>
              ) : (
                <>
                  <Image
                    position='absolute'
                    src='/img/battle-bay/stakeNFT/slots.svg'
                    w='80px'
                    h='80px'
                    zIndex='1'
                  />
                  <Flex
                    position='relative'
                    zIndex='2'
                    opacity='0.9'
                    justifyContent='center' padding='2' borderRadius={'5px'} w='80px' h='80px' bg='linear-gradient(147.34deg, #967729 -13.87%, #482698 153.79%)' >
                    <Image zIndex='3' src='/img/battle-bay/stakeNFT/lock.svg' w='20px' h='20px' />
                    {/* <Image zIndex='1' src='/img/battle-bay/stakeNFT/slots.svg' w='80px' h='80px' /> */}
                  </Flex>
                </>
              )}
            </WrapItem>
          )
        })}
      </Wrap>
    </Center>
  )
}


interface UnstakedNftsProps {
  address?: string;
  collection: string;
  onAdd: (nft: WalletNft) => void;
  onRemove: (nft: WalletNft) => void;
}

const UnstakedNfts = ({address, collection, onAdd, onRemove}: UnstakedNftsProps) => {
  const { data, status, error, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['BankUnstakedNfts', address, collection],
    () => nextApiService.getWallet(address!, {
      collection: [collection],
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
            {data.pages.map((items, index) => (
              <React.Fragment key={index}>
                {items.data.map((nft, index) => (
                  <StakingNftCard
                    key={index}
                    nft={nft}
                    onAdd={() => onAdd(nft)}
                    onRemove={() => onRemove(nft)}
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