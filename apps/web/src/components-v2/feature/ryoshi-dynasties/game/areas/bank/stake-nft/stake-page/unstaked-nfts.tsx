import {useInfiniteQuery} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import {Box, Center, SimpleGrid, Spinner, Text} from "@chakra-ui/react";
import React from "react";
import StakingNftCard
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page/staking-nft-card";
import {ApiService} from "@src/core/services/api-service";
import {
  useBankNftStakingHandlers
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page/hooks";
import {queryKeys} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-nft/stake-page/constants";

interface UnstakedNftsProps {
  isReady: boolean;
  address?: string;
  collection: string;
}

const UnstakedNfts = ({isReady, address, collection}: UnstakedNftsProps) => {
  const {addNft, removeNft} = useBankNftStakingHandlers();

  const { data, status, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: queryKeys.bankUnstakedNfts(address!, collection),
    queryFn: () => ApiService.withoutKey().getWallet(address!, {
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
                    onAdd={() => addNft(nft)}
                    onRemove={() => removeNft(nft.nftAddress, nft.nftId)}
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

export default UnstakedNfts;