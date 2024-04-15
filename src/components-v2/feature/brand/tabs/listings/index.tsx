import React, {useEffect, useState} from "react";
import {Center, Flex, Grid, GridItem, Spinner, useBreakpointValue} from "@chakra-ui/react";
import {motion} from "framer-motion";
import Filters from "@src/components-v2/feature/brand/tabs/listings/filters";
import {useInfiniteQuery} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import ListingCard from "@src/Components/components/ListingCard";
import {isMetapixelsCollection} from "@market/helpers/utils";
import ListingBundleCard from "@src/Components/components/ListingBundleCard";
import TaskBar from "@src/components-v2/feature/brand/tabs/listings/taskbar";
import NextApiService from "@src/core/services/api-service/next";
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";

const MotionGrid = motion(Grid)

interface ListingsTabProps {
  brand: any;
  collections: any[];
}

const ListingsTab = ({brand, collections}: ListingsTabProps) => {
  const useMobileViews = useBreakpointValue(
    {base: true, lg: false},
    {fallback: 'lg'},
  );
  const variants = {
    expand: { gridTemplateColumns: '275px 1fr' },
    collapse: { gridTemplateColumns: '0px 1fr' },
  }
  const [isFilterOpen, setIsFilterOpen] = useState(!useMobileViews);
  const [queryParams, setQueryParams] = useState<ListingsQueryParams>({
    collection: collections.map((c) => c.address)
  });

  const fetcher = async ({ pageParam = 1 }) => {
    return NextApiService.getListings({
      ...queryParams,
      page: pageParam,
    });
  };

  const {data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch,} = useInfiniteQuery({
    queryKey: ['BrandListings', brand.slug, queryParams],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    enabled: Array.isArray(queryParams.collection) && queryParams.collection.length > 0
  })

  const loadMore = () => {
    fetchNextPage();
  };

  const handleCollectionFilter = (collectionAddresses: string[]) => {
    if (collectionAddresses.length < 1) {
      collectionAddresses = collections.map((c) => c.address);
    }
    setQueryParams({ ...queryParams, collection: collectionAddresses });
  }

  const handleSort = (sortOption: any) => {
    setQueryParams({ ...queryParams, sortBy: sortOption.key, direction: sortOption.direction })
  }

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, search: value });
  }

  useEffect(() => {
    if (useMobileViews) {
      setIsFilterOpen(false);
    }
  }, [useMobileViews]);

  return (
    <Flex direction='column'>
      <TaskBar
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        onSearch={handleSearch}
        onSort={handleSort}
        collections={collections}
        onFilter={handleCollectionFilter}
      />
      <MotionGrid
        animate={isFilterOpen && !useMobileViews ? 'expand' : 'collapse'}
        variants={variants}
        gridTemplateColumns="0px 1fr"
        mt={2}
        gap={4}
      >
        <GridItem overflow='hidden'>
          <Filters collections={collections} onChange={handleCollectionFilter} />
        </GridItem>
        <GridItem >
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
            {status === 'pending' ? (
              <Center>
                <Spinner />
              </Center>
            ) : status === "error" ? (
              <p>Error: {(error as any).message}</p>
            ) : (
              <>
                {data.pages[0]?.data?.length > 0 ? (
                  <div className="card-group row g-3">
                    {data.pages.map((items, pageIndex) => (
                      <React.Fragment key={pageIndex}>
                        {items.data.map((listing, index) => {
                          return (
                            <div
                              className={`d-item col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4`}
                              key={listing.listingId}
                            >
                              {!listing.nft.nfts ? (
                                <ListingCard
                                  listing={listing}
                                  imgClass="marketplace"
                                  watermark={
                                    isMetapixelsCollection(listing.nftAddress) ? 'https://cdn-prod.ebisusbay.com/files/collection-images/metapixels/avatar.png' : null
                                  }
                                />
                              ):(
                                <ListingBundleCard
                                  listing={listing}
                                  imgClass="marketplace"
                                  watermark={
                                    isMetapixelsCollection(listing.nftAddress) ? 'https://cdn-prod.ebisusbay.com/files/collection-images/metapixels/avatar.png' : null
                                  }
                                />
                              )}
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <Center>
                    No listings found.
                  </Center>
                )}
              </>
            )}
          </InfiniteScroll>
        </GridItem>
      </MotionGrid>
    </Flex>
  )
}

export default ListingsTab;