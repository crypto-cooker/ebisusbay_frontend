import React, {memo, useCallback, useMemo} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Box, Center, Spinner, Text} from "@chakra-ui/react";
import {useInfiniteQuery} from "@tanstack/react-query";
import {ResponsiveValue} from "@chakra-ui/system";
import {DealListQueryParams} from "@src/core/services/api-service/mapi/queries/deallist";
import {ApiService} from "@src/core/services/api-service";
import ResponsiveDealsTable from "@src/components-v2/shared/responsive-table/responsive-deals-table";
import {OrderState} from "@src/core/services/api-service/types";
import Link from "next/link";

interface DealsDataContainerProps {
  filtersVisible: boolean;
  queryParams: DealListQueryParams;
  viewType: string;
  fullWidth: boolean;
  onSort: (sortOption: any) => void;
}

const DealsDataContainer = ({filtersVisible, queryParams, fullWidth, viewType, onSort}: DealsDataContainerProps) => {

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
    queryKey: ['Deals', queryParams],
    queryFn: ({ pageParam = 1 }) => {
      const params: DealListQueryParams = {
        sortBy: 'listingtime',
        direction: 'desc',
        page: pageParam,
        ...queryParams
      }
      return ApiService.withoutKey().getDeals(params)
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
      <Box textAlign='center'>
        Error: {(error as any).message}
      </Box>
    ) : data?.pages.map((page) => page.data).flat().length > 0 ? (
      <ResponsiveDealsTable
        data={data}
        state={queryParams.state ?? OrderState.ACTIVE}
        onUpdate={(offer) => {}}
        onCancel={(offer) => {}}
        onSort={onSort}
        breakpointValue={filtersVisible ? 'xl' : 'lg'}
      />
    ) : (
      <Box textAlign='center' mt={8}>
        <Text>No results found. <Link href='/deal/create' className='color fw-bold'>Create a deal</Link></Text>
      </Box>
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

export default memo(DealsDataContainer);
