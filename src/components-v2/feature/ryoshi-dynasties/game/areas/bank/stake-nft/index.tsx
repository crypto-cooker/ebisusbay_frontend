import {Box, Flex, HStack, Icon, IconButton, SimpleGrid, Text, Wrap, WrapItem} from "@chakra-ui/react"

import React, {useCallback, useEffect, useState} from 'react';
import {useAppSelector} from "@src/Store/hooks";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {ApiService} from "@src/core/services/api-service";
import InfiniteScroll from "react-infinite-scroll-component";
import {Spinner} from "react-bootstrap";
import StakingNftCard from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/staking-nft-card";
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
import useBankStakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-bank-stake-nfts";
import {getNft} from "@src/core/api/endpoints/nft";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAward} from "@fortawesome/free-solid-svg-icons";
import {ryoshiConfig} from "@src/Config/ryoshi";
import {BankStakeNftContext} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/context";
import {toast} from "react-toastify";

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
  const queryClient = useQueryClient();

  const [currentTab, setCurrentTab] = useState(tabs.ryoshiVip);
  const [currentCollection, setCurrentCollection] = useState<any>();
  const [stakedNfts, setStakedNfts] = useState<StakedToken[]>([]);
  const [pendingNfts, setPendingNfts] = useState<PendingNft[]>([]);

  const handleBtnClick = (key: string) => (e: any) => {
    setCurrentTab(key);
  };

  const handleAddNft = useCallback((nft: WalletNft) => {
    const isInList = pendingNfts.some((sNft) => sNft.nftId === nft.nftId && caseInsensitiveCompare(sNft.nftAddress, nft.nftAddress));
    if (!isInList && pendingNfts.length < ryoshiConfig.staking.bank.maxSlots) {
      const collectionSlug = config.collections.find((c: any) => caseInsensitiveCompare(c.address, nft.nftAddress))?.slug;
      const stakeConfig = ryoshiConfig.staking.bank.collections.find((c) => c.slug === collectionSlug);

      const percentile = (nft.rank / stakeConfig!.maxSupply) * 100;
      const multiplier = stakeConfig!.multipliers
        .sort((a: any, b: any) => a.percentile - b.percentile)
        .find((m: any) => percentile <= m.percentile)?.value || 0;

      setPendingNfts([...pendingNfts, {
        nftAddress: nft.nftAddress,
        nftId: nft.nftId,
        image: nft.image,
        rank: nft.rank,
        multiplier: multiplier,
        isAlreadyStaked: false
      }]);
    }
  }, [pendingNfts]);

  const handleRemoveNft = useCallback((nftAddress: string, nftId: string) => {
    setPendingNfts(pendingNfts.filter((nft) => nft.nftId !== nftId || !caseInsensitiveCompare(nft.nftAddress, nftAddress)));
  }, [pendingNfts]);

  const handleClose = () => {
    setPendingNfts([]);
    setStakedNfts([]);
    setCurrentCollection(undefined);
    setCurrentTab(tabs.ryoshiVip);
    onClose();
  }

  useEffect(() => {
    if (!isOpen) return;

    queryClient.fetchQuery(
      ['BankStakedNfts', user.address],
      () => ApiService.withoutKey().getStakedTokens(user.address!)
    ).then(async (data) => {
      setStakedNfts(data);

      const nfts: PendingNft[] = [];
      for (const token of data) {
        const nft = await getNft(token.contractAddress, token.tokenId);
        if (nft) {
          const stakeConfig = ryoshiConfig.staking.bank.collections.find((c) => c.slug === nft.collection.slug);

          const percentile = (nft.nft.rank / stakeConfig!.maxSupply) * 100;
          const multiplier = stakeConfig!.multipliers
            .sort((a: any, b: any) => a.percentile - b.percentile)
            .find((m: any) => percentile <= m.percentile)?.value || 0;

          nfts.push({
            nftAddress: token.contractAddress,
            nftId: token.tokenId,
            image: nft.nft.image,
            rank: nft.nft.rank,
            multiplier: multiplier,
            isAlreadyStaked:  true
          })
        }
      }
      setPendingNfts(nfts);
    });
  }, [isOpen]);

  useEffect(() => {
    const collection = config.collections.find((c: any) => c.slug === currentTab);
    setCurrentCollection(collection.address);
  }, [currentTab]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Stake NFTs'
      size='5xl'
    >
      <BankStakeNftContext.Provider value={pendingNfts}>
        <Text align='center' p={2}>Ryoshi Tales NFTs can be staked to boost rewards for staked $Fortune. Receive larger boosts by staking higher ranked NFTs.</Text>
        <StakedNfts
          pendingNfts={pendingNfts}
          stakedNfts={stakedNfts}
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
              isReady={isOpen}
              collection={currentCollection}
              address={user.address ?? undefined}
              onAdd={handleAddNft}
              onRemove={handleRemoveNft}
            />
          </Box>
        </Box>
      </BankStakeNftContext.Provider>
    </RdModal>
  )
}

export default StakeNfts;

interface StakedNftsProps {
  pendingNfts: PendingNft[];
  stakedNfts: StakedToken[];
  onRemove: (nftAddress: string, nftId: string) => void;
}

interface PendingNft {
  nftAddress: string;
  nftId: string;
  image: string;
  rank: number;
  multiplier: number;
  isAlreadyStaked: boolean;
}

const StakedNfts = ({pendingNfts, stakedNfts, onRemove}: StakedNftsProps) => {
  const user = useAppSelector((state) => state.user);
  const [isExecutingStake, setIsExecutingStake] = useState(false);
  const [executingLabel, setExecutingLabel] = useState('');
  const [stakeNfts, response] = useBankStakeNfts();

  const handleStake = useCallback(async () => {
    if (pendingNfts.length === 0) return;

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
      await stakeNfts(
        pendingNfts.map((nft) => ({...nft, amount: 1})),
        stakedNfts
      );
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
    <Flex direction={{base: 'column', md: 'row'}} my={6} px={4}>
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
                      <img src={ImageService.translate(pendingNfts[index].image).fixedWidth(100, 100)}/>
                    </Box>
                    <Flex fontSize='xs' justify='space-between' mt={1}>
                      <HStack spacing={1}>
                        <Icon as={FontAwesomeIcon} icon={faAward} />
                        <Box as='span'>{pendingNfts[index].rank ?? ''}</Box>
                      </HStack>
                      <Box as='span' fontWeight='bold'>{pendingNfts[index].multiplier}x</Box>
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
            </WrapItem>
          )
        })}
      </Wrap>
      <Box ms={8} my={{base: 4, md: 'auto'}} textAlign='center'>
        <RdButton
          minW='150px'
          onClick={handleStake}
          isLoading={isExecutingStake}
          disabled={isExecutingStake}
          stickyIcon={true}
        >
          <>{isExecutingStake ? executingLabel : 'Stake'}</>
        </RdButton>
      </Box>
    </Flex>
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
      enabled: !!address && isReady
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