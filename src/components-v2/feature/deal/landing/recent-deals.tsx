import {useInfiniteQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import React, {useCallback, useMemo, useState} from "react";
import {DealListQueryParams} from "@src/core/services/api-service/mapi/queries/deallist";
import {Center, Heading, Spinner} from "@chakra-ui/react";
import ResponsiveCollectionsTable, {
  SortKeys
} from "@src/components-v2/shared/responsive-table/responsive-collections-table";
import ResponsiveDealsTable from "@src/components-v2/shared/responsive-table/responsive-deals-table";
import InfiniteScroll from "react-infinite-scroll-component";
import {OrderState} from "@src/core/services/api-service/types";

export const RecentDeals = () => {
  const [queryParams, setQueryParams] = useState<DealListQueryParams>({
    pageSize: 50,
    direction: 'desc',
    sortBy: 'saletime',
    state: OrderState.COMPLETED
  });

  const fetcher = async ({ pageParam = 1 }) => {
    return ApiService.withoutKey().getDeals({
      ...queryParams,
      page: pageParam
    });
  };

  const {data, error, fetchNextPage, hasNextPage, status} = useInfiniteQuery({
    queryKey: ['RecentDeals', queryParams],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
    },
    staleTime: 1000 * 60
  });

  const handleSort = useCallback((sortOption: any) => {
    let newSort = {
      sortBy: sortOption,
      direction: 'desc'
    }
    if (queryParams.sortBy === newSort.sortBy) {
      newSort.direction = queryParams.direction === 'asc' ? 'desc' : 'asc'
    }
    setQueryParams({
      ...queryParams,
      sortBy: newSort.sortBy as any,
      direction: newSort.direction as any
    });
  }, [queryParams]);

  const content = useMemo(() => {
    return status === 'pending' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === "error" ? (
      <p>Error: {(error as any).message}</p>
    ) : (
      <ResponsiveDealsTable
        data={data}
        state={queryParams.state ?? OrderState.ACTIVE}
        onSort={handleSort}
        breakpointValue='lg'
      />
    )
  }, [data, queryParams, status]);

  return (
    <>
      <Heading textAlign='center' mb={2}>Recent Deals</Heading>
      <InfiniteScroll
        dataLength={data?.pages ? data.pages.flat().length : 0}
        next={fetchNextPage}
        hasMore={hasNextPage ?? false}
        style={{ overflow: 'none'}}
        loader={
          <Center>
            <Spinner />
          </Center>
        }
      >
        {content}
      </InfiniteScroll>
    </>
  )
}