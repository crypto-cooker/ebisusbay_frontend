import {useInfiniteQuery} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {useUser} from "@src/components-v2/useUser";
import InfiniteScroll from "react-infinite-scroll-component";
import {Box, Center, SimpleGrid, Spinner, Stack, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import StakingNftCard
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/staking-nft-card";
import WalletNft from "@src/core/models/wallet-nft";
import {TownHallStakeNftContext} from "./context";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {pluralize} from "@market/helpers/utils";
import {appConfig} from "@src/Config";
import {toast} from "react-toastify";
import useTownHallStakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-town-hall-stake-nfts";

const config = appConfig();

interface UnstakedNftsProps {
  collectionAddress: string;
}

export const UnstakedNfts = ({collectionAddress}: UnstakedNftsProps) => {
  const user = useUser();
  const {stakeNfts} = useTownHallStakeNfts();

  const [selectedNfts, setSelectedNfts] = React.useState<WalletNft[]>([]);
  const [isExecutingStake, setIsExecutingStake] = useState(false);
  const [isExecutingStakeAll, setIsExecutingStakeAll] = useState(false);

  const { data, status, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['TownHallUserUnstakedNfts', user.address, collectionAddress],
    queryFn: () => nextApiService.getWallet(user.address!, {
      collection: [collectionAddress],
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    enabled: !!collectionAddress && !!user.address
  });
  const hasResults = data?.pages.some(page => page.data.length > 0) ?? false;

  const onAdd = (nft: WalletNft) => {
    if (!selectedNfts.find((selectedNft) => selectedNft.nftAddress === nft.nftAddress && selectedNft.nftId === nft.nftId)) {
      setSelectedNfts([...selectedNfts, nft]);
    }
  }

  const onRemove = (nftAddress: string, nftId: string) => {
    if (selectedNfts.find((selectedNft) => selectedNft.nftAddress === nftAddress && selectedNft.nftId === nftId)) {
      setSelectedNfts(selectedNfts.filter((selectedNft) => selectedNft.nftAddress !== nftAddress && selectedNft.nftId !== nftId));
    }
  }

  const validate = () => {
    const hasData = !!data?.pages && data.pages.flat().length > 0;
    if (!hasData) {
      toast.error('There are no available NFTs to stake');
      return false;
    }

    return true;
  }

  const handleStake = () => {
    if (!validate()) return;
    if (selectedNfts.length < 1) {
      toast.error('Please select at least one NFT to stake');
      return;
    }

    stake(false);
  }

  const handleStakeAll = () => {
    if (!validate()) return;

    stake(true);
  }

  const stake = async (isAll: boolean) => {
    if (!user.address) return;

    try {
      if (isAll) setIsExecutingStakeAll(true);
      else setIsExecutingStake(true);

      const nfts = selectedNfts.map((nft) => ({
        nftAddress: nft.nftAddress,
        nftId: nft.nftId,
        amount: 1,
      }));
      await stakeNfts({
        nfts,
        collectionAddress,
        isAll
      });

      toast.success('Staking successful!');
    } catch (e) {
      console.error(e);
      toast.error('Staking failed');
    } finally {
      setIsExecutingStakeAll(false);
      setIsExecutingStake(false);
    }
  }

  return (
    <TownHallStakeNftContext.Provider value={{selectedNfts}}>
      <Box position='relative'>
        {hasResults && (
          <RdModalBox
            position="sticky"
            top={-2}
            zIndex="sticky"
          >
            <Stack direction={{base: 'column', sm: 'row'}} justify='space-between' align='center' spacing={4} minH='56px'>
              <Box my='auto'>There {pluralize(selectedNfts.length, 'is', 'are')} <strong>{selectedNfts.length}</strong> {pluralize(selectedNfts.length, 'item')} selected</Box>
              <Stack direction='row' flexShrink={0} flexGrow={0}>
                {selectedNfts.length > 0 && !isExecutingStakeAll && (
                  <RdButton
                    size='sm'
                    stickyIcon={isExecutingStake}
                    onClick={handleStake}
                    isLoading={isExecutingStake}
                    isDisabled={isExecutingStake}
                  >
                    Stake
                  </RdButton>
                )}
                {!isExecutingStake && (
                  <RdButton
                    size='sm'
                    stickyIcon={isExecutingStakeAll}
                    onClick={handleStakeAll}
                    isLoading={isExecutingStakeAll}
                    isDisabled={isExecutingStakeAll}
                  >
                    Stake All
                  </RdButton>
                )}
              </Stack>
            </Stack>
          </RdModalBox>
        )}
        <Box mt={2}>
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
                columns={{base: 2, sm: 3, md: 5}}
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
                <Text>No NFTs found</Text>
              </Box>
            )}
          </InfiniteScroll>
        </Box>
      </Box>
    </TownHallStakeNftContext.Provider>
  )
}