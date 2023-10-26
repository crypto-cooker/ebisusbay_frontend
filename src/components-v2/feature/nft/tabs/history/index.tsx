import React, {useMemo} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";
import {Center, Spinner} from "@chakra-ui/react";
import ResponsiveNftListingsTable, {
  SortKeys
} from "@src/components-v2/shared/responsive-table/responsive-nft-listings-table";
import InfiniteScroll from "react-infinite-scroll-component";
import useGetNftListings from "@src/components-v2/feature/nft/hooks/useGetNftListings";
import {ListingState} from "@src/core/services/api-service/types";

interface HistoryTabProps {
  address: string;
  tokenId: string;
}

const HistoryTab = ({address, tokenId}: HistoryTabProps) => {
  const [filters, getNftListings, changeFilters] = useGetNftListings({
    collection: [address],
    tokenId: [tokenId],
    state: ListingState.SOLD,
    sortBy: 'saleTime',
    direction: 'desc'
  });

  const fetcher = ({ pageParam = 1}) => {
    return getNftListings({
      state: ListingState.SOLD,
      page: pageParam
    });
  }

  const {data, error, fetchNextPage, hasNextPage, status,} = useInfiniteQuery({
    queryKey: ['NftHistory', filters],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  });

  const sortCollections = (sortBy: string) => {
    let direction = 'desc';

    if (filters.sortBy?.includes(sortBy) && filters.direction == 'desc') {
      direction = 'asc'
    }
    console.log('SORT', sortBy, direction, filters)
    changeFilters({ sortBy, direction });
  }

  const content = useMemo(() => {
    return status === 'pending' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === "error" ? (
      <p>Error: {(error as any).message}</p>
    ) : (
      <ResponsiveNftListingsTable
        data={data}
        onSort={sortCollections}
        primarySort={filters.sortBy as SortKeys}
      />
    )
  }, [data, status]);

  return (
    <div className="listing-tab tab-3 onStep fadeIn">
      {status === 'pending' || (data && data.pages[0]?.data.length > 0) ? (
        <InfiniteScroll
          dataLength={data?.pages ? data.pages.flat().length : 0}
          next={fetchNextPage}
          hasMore={hasNextPage ?? false}
          height={400}
          loader={
            <Center>
              <Spinner />
            </Center>
          }
        >
          {content}
        </InfiniteScroll>
      ) : (
        <>
          <span>No history found for this item</span>
        </>
      )}
    </div>
  )
}

export default HistoryTab;