import React, {memo} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Spinner} from 'react-bootstrap';
import {useInfiniteQuery} from "@tanstack/react-query";
import {getListingsByCollection} from "@src/core/api/next/listings";
import {appConfig} from "@src/Config";
import {caseInsensitiveCompare} from "@src/utils";
import {Center, Text} from "@chakra-ui/react";
import ListingBundleCard from "@src/Components/components/ListingBundleCard";
import {ListingsQuery} from "@src/core/api/queries/listings";

const config = appConfig();

const CollectionBundlesGroup = ({collection}) => {

  const fetcher = async ({ pageParam = 1 }) => {
    const query = ListingsQuery.default();
    query.page = pageParam;

    const listings = await getListingsByCollection(config.contracts.bundle, query);
    listings.data.listings = listings.data.listings.filter((listing) => {
      return listing.nft.nfts.some((nft) => caseInsensitiveCompare(nft.address, collection.address));
    });
    return listings;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery(
    ['CollectionBundleListings', collection.address],
    fetcher,
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
  })

  const loadMore = () => {
    fetchNextPage();
  };
console.log('data', data);

  return (
    <InfiniteScroll
      dataLength={data?.pages ? data.pages.flat().length : 0}
      next={loadMore}
      hasMore={hasNextPage}
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
        <p>Error: {error.message}</p>
      ) : (
        <>
          {data.pages[0]?.data?.listings?.length > 0 ? (
            <div className="card-group">
              {data.pages.map((items, index) => (
                <React.Fragment key={index}>
                  {items.data.listings.map((listing, index) => {
                    return (
                      <div
                        className={`d-item col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4`}
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
