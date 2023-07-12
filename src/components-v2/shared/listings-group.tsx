import React, {memo, useMemo} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Spinner} from 'react-bootstrap';

import ListingCard from '@src/Components/components/ListingCard';
import {isMetapixelsCollection} from '@src/utils';
import ListingBundleCard from '@src/Components/components/ListingBundleCard';
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {Box, SimpleGrid} from "@chakra-ui/react";
import nextApiService from "@src/core/services/api-service/next";
import {useInfiniteQuery} from "@tanstack/react-query";

interface ListingsGroupProps {
  limitSize?: number;
  showLoadMore?: boolean;
  queryParams?: ListingsQueryParams;
  smallWindow?: boolean;
}

const ListingsGroup = ({limitSize, showLoadMore = true, queryParams, smallWindow = false}: ListingsGroupProps) => {

  const { data, status, error, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['Listings', queryParams],
    ({ pageParam = 1 }) => {
      return nextApiService.getListings({...queryParams, page: pageParam})
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    }
  )

  const loadMore = () => {
    fetchNextPage();
  };

  const memoizedContent = useMemo(() => {
    return status === "loading" ? (
      <div className="col-lg-12 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : status === "error" ? (
      <p>Error: {(error as any).message}</p>
    ) : (
      <>
        <SimpleGrid
          columns={!smallWindow ? {base: 2, sm: 2, lg: 3, xl: 4} : {base: 2, sm: 3, md: 4, lg: 5, xl: 6, '2xl': 7}}
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
  }, [data, error, status]);

  return (
    <Box>
      <InfiniteScroll
        dataLength={data?.pages ? data.pages.flat().length : 0}
        next={loadMore}
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
        {memoizedContent}
      </InfiniteScroll>
    </Box>
  )
};

export default memo(ListingsGroup);
