import React, {useEffect, useMemo, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useInfiniteQuery} from '@tanstack/react-query';
import useGetCollections from './hooks/useGetCollections';
import {appConfig} from "@src/Config";
import ResponsiveCollectionsTable, {
  SortKeys
} from "@src/components-v2/shared/responsive-table/responsive-collections-table";
import {Box, Button as ChakraButton, ButtonGroup, Center, Collapse, Spinner} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";

const config = appConfig();

interface TableProps {
  timeFrame: string | null;
  searchTerms: string | null;
  onlyVerified: boolean;
  showMobileSort: boolean
}

const Table = ({ timeFrame, searchTerms, onlyVerified, showMobileSort }: TableProps) => {
  const [filters, getCollections, changeFilters] = useGetCollections();
  const [typeSort, setTypeSort] = useState({ sortBy: 'totalvolume', direction: 'desc' });

  const fetcher = async ({ pageParam = 1 }) => {
    const result = await getCollections(pageParam);
    const knownContracts = config.collections.map((c: any) => c.address.toLowerCase());
    return result.filter((collection: any) => knownContracts.includes(collection.collection.toLowerCase()));
  };

  const {data, error, fetchNextPage, hasNextPage, status} = useInfiniteQuery({
    queryKey: ['Collections', filters],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
    },
    staleTime: 1000 * 60
  });

  const loadMore = () => {
    fetchNextPage();
  };

  const sortCollections = (sortBy: string) => {

    let params = { ...typeSort, sortBy }

    if (filters.sortBy.includes(sortBy)) {
      if (filters.direction == 'desc') {
        params.direction = 'asc';
      } else {
        params.direction = 'desc';
      }
    }
    else {
      params.direction = 'desc';
    }
    setTypeSort({ ...params });
  }

  useEffect(() => {
    let param = { ...typeSort };
    if ((typeSort.sortBy == 'totalvolume' || typeSort.sortBy == 'totalsales') && timeFrame) {
      param.sortBy = `${param.sortBy}${timeFrame}`
    }

    changeFilters({
      ...filters,
      ...param
    })

  }, [timeFrame, typeSort])

  useEffect(() => {
    changeFilters({ ...filters, search: searchTerms })
  }, [searchTerms])

  useEffect(() => {
    changeFilters({ ...filters, verified: onlyVerified ? 1 : null })
  }, [onlyVerified]);

  const content = useMemo(() => {
    return status === 'pending' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === "error" ? (
      <p>Error: {(error as any).message}</p>
    ) : (
      <ResponsiveCollectionsTable
        data={data}
        timeFrame={timeFrame}
        onSort={sortCollections}
        primarySort={typeSort.sortBy as SortKeys}
      />
    )
  }, [data, timeFrame, typeSort, status]);

  return (
    <Box>
      <Collapse in={showMobileSort} animateOpacity>
        <Box mb={2} textAlign='center'>
          <ButtonGroup>
            <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => sortCollections('totalvolume')}>
              Volume
              {typeSort.sortBy === 'totalvolume' && (typeSort.direction === 'desc' ? <ChevronDownIcon ms={1} /> : <ChevronUpIcon ms={1} />)}
            </ChakraButton>
            <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => sortCollections('totalsales')}>
              Sales
              {typeSort.sortBy === 'totalsales' && (typeSort.direction === 'desc' ? <ChevronDownIcon ms={1} /> : <ChevronUpIcon ms={1} />)}
            </ChakraButton>
            <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => sortCollections('totalfloorprice')}>
              Floor
              {typeSort.sortBy === 'totalfloorprice' && (typeSort.direction === 'desc' ? <ChevronDownIcon ms={1} /> : <ChevronUpIcon ms={1} />)}
            </ChakraButton>
            <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => sortCollections('totalaveragesaleprice')}>
              Avg Price
              {typeSort.sortBy === 'totalaveragesaleprice' && (typeSort.direction === 'desc' ? <ChevronDownIcon ms={1} /> : <ChevronUpIcon ms={1} />)}
            </ChakraButton>
            <ChakraButton size={{base: 'xs', sm: 'sm'}} onClick={() => sortCollections('totalactive')}>
              Active
              {typeSort.sortBy === 'totalactive' && (typeSort.direction === 'desc' ? <ChevronDownIcon ms={1} /> : <ChevronUpIcon ms={1} />)}
            </ChakraButton>
          </ButtonGroup>
        </Box>
      </Collapse>
      <InfiniteScroll
        dataLength={data?.pages ? data.pages.flat().length : 0}
        next={loadMore}
        hasMore={hasNextPage ?? false}
        style={{ overflow: 'none' }}
        loader={
          <Center>
            <Spinner />
          </Center>
        }
      >
        {content}
      </InfiniteScroll>
    </Box>
  )
}

export default Table;