import {useInfiniteQuery} from "@tanstack/react-query";
import NextApiService from "@src/core/services/api-service/next";
import {OfferState, OfferType} from "@src/core/services/api-service/types";
import {Spinner} from "react-bootstrap";
import {Box} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import ResponsiveNftOffersTable from "@src/components-v2/shared/responsive-table/responsive-nft-offers-table";
import React, {useCallback, useState} from "react";
import {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";

interface OffersTabProps {
  nftAddress: string;
  nftId: string;
  type: OfferType
}

const OffersTab = ({nftAddress, nftId, type}: OffersTabProps) => {
  const [queryParams, setQueryParams] = useState<OffersQueryParams>({
    collection: [nftAddress],
    tokenId: nftId,
    type: type,
    state: OfferState.ACTIVE,
    sortBy: 'price',
    direction: 'desc'
  });

  const fetchProjects = async ({ pageParam = 0 }) => {
    return await NextApiService.getOffers({
      ...queryParams,
      page: pageParam + 1,
    });
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ['MadeOffers', queryParams],
    fetchProjects,
    {
      getNextPageParam: (lastPage, pages) => lastPage.hasNextPage,
    }
  )

  const loadMore = () => {
    fetchNextPage();
  };

  const handleSort = useCallback((field: string) => {
    let newSort = {
      sortBy: field,
      direction: 'desc'
    }
    if (queryParams.sortBy === newSort.sortBy) {
      newSort.direction = queryParams.direction === 'asc' ? 'desc' : 'asc'
    }
    console.log('handle sort', newSort)

    setQueryParams({
      ...queryParams,
      sortBy: newSort.sortBy as any,
      direction: newSort.direction as any
    });
  }, [queryParams]);

  return (

    <div className="listing-tab">
      {status === "loading" ? (
        <div className="col-lg-12 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : status === "error" ? (
        <p>Error: {(error as any).message}</p>
      ) : (
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
            <ResponsiveNftOffersTable
              data={data}
              onSort={handleSort}
            />
          </InfiniteScroll>
        </Box>
      )}
    </div>
  )
}


export default OffersTab;