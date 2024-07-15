import React, {memo} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useInfiniteQuery} from "@tanstack/react-query";
import {appConfig} from "@src/config";
import {ciEquals} from "@market/helpers/utils";
import {Center, Spinner, Text} from "@chakra-ui/react";
import ListingBundleCard from "@src/Components/components/ListingBundleCard";
import NextApiService from "@src/core/services/api-service/next";
import {ListingsQuery} from "@src/core/services/api-service/mapi/queries/listings";

const config = appConfig();

const CollectionBundlesGroup = ({collection}) => {

  const fetcher = async ({ pageParam = 1 }) => {
    // @todo remove pageSize and fix paging when entire first page is filtered out
    const listings = await NextApiService.getListingsByCollection(config.contracts.bundle, {
      page: pageParam,
      pageSize: 1000
    });

    return listings.data.filter((listing) => {
      return !!listing.nft.nfts && listing.nft.nfts.some((nft) => ciEquals(nft.address, collection.address));
    });
  };

  const {data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch} = useInfiniteQuery({
    queryKey: ['CollectionBundleListings', collection.address],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  });

  const loadMore = () => {
    fetchNextPage();
  };

  return (
    <InfiniteScroll
      dataLength={data?.pages ? data.pages.flat().length : 0}
      next={loadMore}
      hasMore={hasNextPage}
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
        <p>Error: {error.message}</p>
      ) : (
        <>
          {data.pages[0]?.length > 0 ? (
            <div className="card-group">
              {data.pages.map((items, index) => (
                <React.Fragment key={index}>
                  {items.map((listing, index) => {
                    return (
                      <div
                        className="d-item col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-4 col-6 mb-4 px-2"
                        key={`${listing.address}-${listing.id}-${index}`}
                      >
                        <ListingBundleCard
                          listing={listing}
                          imgClass="collection"
                        />
                      </div>
                    )
                  })}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <Center>
              <Text align="center">No bundles found.</Text>
            </Center>
          )}
        </>
      )}
    </InfiniteScroll>
  );
};

export default memo(CollectionBundlesGroup);
