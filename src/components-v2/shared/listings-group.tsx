import React, {memo, useMemo} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import ListingCard from '@src/Components/components/ListingCard';
import {isMetapixelsCollection} from '@src/utils';
import ListingBundleCard from '@src/Components/components/ListingBundleCard';
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {Box, Center, SimpleGrid, Spinner} from "@chakra-ui/react";
import nextApiService from "@src/core/services/api-service/next";
import {useInfiniteQuery} from "@tanstack/react-query";
import {ResponsiveValue} from "@chakra-ui/system";

interface ListingsGroupProps {
  limitSize?: number;
  showLoadMore?: boolean;
  queryParams?: ListingsQueryParams;
  smallWindow?: boolean;
  viewType: string;
  fullWidth: boolean;
}

const ListingsGroup = ({limitSize, showLoadMore = true, queryParams, fullWidth, viewType}: ListingsGroupProps) => {

  const gridSizes: {[key: string]: ResponsiveValue<number>} = {
    'grid-sm': {base: 2, sm: 3, md: 4, lg: 5, xl: 6, '2xl': 8},
    'grid-lg': {base: 2, sm: 2, lg: 3, xl: 4, '2xl': 6}
  }

  const adjustedGridSize: ResponsiveValue<number> = Object.fromEntries(
    Object.entries(gridSizes[viewType]).map(
      ([key, value]) => [key, fullWidth ? value : Math.max(1, value - 1)]
    )
  );

  const { data, status, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['Listings', queryParams],
    queryFn: ({ pageParam = 1 }) => {
      const params: ListingsQueryParams = {
        sortBy: 'listingTime',
        direction: 'desc',
        page: pageParam,
        ...queryParams
      }
      return nextApiService.getListings(params)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  });

  const loadMore = () => {
    fetchNextPage();
  };

  const memoizedContent = useMemo(() => {
    return status === 'pending' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === "error" ? (
      <p>Error: {(error as any).message}</p>
    ) : (
      <>
        <SimpleGrid
          columns={adjustedGridSize}
          gap={3}
        >
          {data?.pages.map((items, index) => (
            <React.Fragment key={index}>
              {items.data.map((listing, index) => (
                <Box key={`${listing.nftAddress}-${listing.nftId}`}>
                  {listing.nft.nfts ? (
                    <ListingBundleCard
                      listing={listing}
                      imgClass="marketplace"
                      watermark={
                        isMetapixelsCollection(listing.nftAddress) ? '/img/collections/metapixels/avatar.png' : null
                      }
                    />
                  ) : (
                    <ListingCard
                      listing={listing}
                      imgClass="marketplace"
                      watermark={
                        isMetapixelsCollection(listing.nftAddress) ? '/img/collections/metapixels/avatar.png' : null
                      }
                    />
                  )}
                </Box>
              ))}

            </React.Fragment>
          ))}
        </SimpleGrid>
      </>
    );
  }, [data, error, status, adjustedGridSize]);

  return (
    <Box>
      <InfiniteScroll
        dataLength={data?.pages ? data.pages.flat().length : 0}
        next={loadMore}
        hasMore={hasNextPage ?? false}
        style={{ overflow: 'hidden' }}
        loader={
          <Center>
            <Spinner />
          </Center>
        }
      >
        {memoizedContent}
      </InfiniteScroll>
    </Box>
  )
};

export default memo(ListingsGroup);
