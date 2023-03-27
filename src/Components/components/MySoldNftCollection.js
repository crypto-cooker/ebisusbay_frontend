import React, {memo, useCallback, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import {getNftSalesForAddress} from "@src/core/api";
import {useInfiniteQuery} from "@tanstack/react-query";
import ResponsiveSalesTable from "@src/components-v2/shared/responsive-table/responsive-sales-table";


const MySoldNftCollection = ({ walletAddress = null }) => {
  const [sort, setSort] = useState({
    sortBy: 'listingTime',
    direction: 'desc'
  });

  const fetcher = async ({ pageParam = 1 }) => {
    return await getNftSalesForAddress(walletAddress, pageParam, sort);
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
  } = useInfiniteQuery(['MySoldNftCollection', walletAddress, sort], fetcher, {
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  })

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
        <ResponsiveSalesTable
          data={data}
          onSort={handleSort}
        />
      )}
    </InfiniteScroll>
  );
};

export default memo(MySoldNftCollection);
