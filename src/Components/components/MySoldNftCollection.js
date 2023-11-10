import React, {memo, useCallback, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {getNftSalesForAddress} from "@src/core/api";
import {useInfiniteQuery} from "@tanstack/react-query";
import ResponsiveSalesTable from "@src/components-v2/shared/responsive-table/responsive-sales-table";
import {Center, Spinner} from "@chakra-ui/react";


const MySoldNftCollection = ({ walletAddress = null }) => {
  const [sort, setSort] = useState({
    sortBy: 'listingTime',
    direction: 'desc'
  });

  const fetcher = async ({ pageParam = 1 }) => {
    return await getNftSalesForAddress(walletAddress, pageParam, sort);
  };

  const {data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch} = useInfiniteQuery({
    queryKey: ['MySoldNftCollection', walletAddress, sort],
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

  const handleSort = useCallback((field) => {
    let newSort = {
      sortBy: field,
      direction: 'desc'
    }
    if (sort.sortBy === newSort.sortBy) {
      newSort.direction = sort.direction === 'asc' ? 'desc' : 'asc'
    }
    setSort(newSort)
  }, [sort]);

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
        <ResponsiveSalesTable
          data={data}
          onSort={handleSort}
        />
      )}
    </InfiniteScroll>
  );
};

export default memo(MySoldNftCollection);
