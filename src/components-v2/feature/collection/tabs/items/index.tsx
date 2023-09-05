import Taskbar from "@src/components-v2/feature/collection/taskbar";
import CollectionFilterContainer from "@src/components-v2/feature/collection/collection-filter-container";
import InfiniteScroll from "react-infinite-scroll-component";
import {Box, Center, Spinner, Text, useBreakpointValue, useDisclosure} from "@chakra-ui/react";
import React, {useCallback, useMemo, useState} from "react";
import CollectionListingsGroup from "@src/Components/components/CollectionListingsGroup";
import {CollectionNftsGroup} from "@src/components-v2/feature/collection/collection-groups";
import {useRouter} from "next/router";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";
import {useInfiniteQuery} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {pushQueryString} from "@src/helpers/query";
import styled from "styled-components";
import MakeCollectionOfferDialog from "@src/components-v2/shared/dialogs/make-collection-offer";
import InstantSellDialog from "@src/Components/Offer/Dialogs/InstantSellDialog";
import SweepFloorDialog from "@src/Components/Collection/CollectionTaskBar/SweepFloorDialog";

interface ItemsProps {
  collection: any;
  initialQuery: FullCollectionsQueryParams;
  traits?: { [key: string]: { [key: string]: any } };
  powertraits?: { [key: string]: { [key: string]: any } };
}

const NegativeMargin = styled.div`
  margin-left: -1.75rem !important;
  margin-right: -1.75rem !important;
`;

const ThemedBackground = styled.div`
  background: ${({ theme }) => theme.colors.bgColor1}
`;

const defaultQueryParams = {
  sortBy: 'price',
  direction: 'asc'
};

// TODO fix
const hasRank = false;
const isUsingListingsFallback = false;

const Items = ({collection, initialQuery, traits, powertraits}: ItemsProps) => {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<FullCollectionsQueryParams>(initialQuery ?? defaultQueryParams);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [mobileSortVisible, setMobileSortVisible] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const { isOpen: isOpenCollectionOfferDialog, onOpen: onOpenCollectionOfferDialog, onClose: onCloseCollectionOfferDialog } = useDisclosure();
  const { isOpen: isOpenInstantSellDialog, onOpen: onOpenInstantSellDialog, onClose: onCloseInstantSellDialog } = useDisclosure();
  const { isOpen: isOpenSweepDialog, onOpen: onOpenSweepDialog, onClose: onCloseSweepDialog } = useDisclosure();

  const useMobileMenu = useBreakpointValue(
    { base: true, lg: false },
    { fallback: 'lg' },
  );

  const { data: items, error, fetchNextPage, hasNextPage, status, refetch} = useInfiniteQuery(
    ['Collection', collection.address, queryParams],
    async ({ pageParam = 1 }) => {
      const fixedQueryParams = {...queryParams};
      delete (fixedQueryParams as any).slug;
      delete (fixedQueryParams as any).tab;

      const params: FullCollectionsQueryParams = {
        page: pageParam,
        address: collection.address,
        ...fixedQueryParams
      }

      const data = await nextApiService.getCollectionItems(collection.address, params);
      setTotalCount(data.totalCount!);

      return data;
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    }
  );

  const handleSearch = useCallback((value: string) => {
    const newQueryParams = {...queryParams, search: value};
    setQueryParams(newQueryParams);
    const { sortBy, direction, ...remainingQueryParams } = newQueryParams;
    pushQueryString(router, {
      slug: router.query.slug,
      ...remainingQueryParams
    });
  }, [queryParams, router]);

  const handleSort = useCallback((sort: string, direction: string) => {
    setQueryParams({...queryParams, sortBy: sort as any, direction: direction as any})
  }, [queryParams]);

  const handleFilter = useCallback((filter: FullCollectionsQueryParams) => {
    setQueryParams({...queryParams, ...filter});
  }, [queryParams]);

  const content = useMemo(() => {
    return status === 'loading' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === 'error' ? (
      <Box textAlign='center'>
        Error: {(error as any).message}
      </Box>
    ) : items?.pages.map((page) => page.data).flat().length > 0 ? (
      <>
        {isUsingListingsFallback ? (
          <CollectionListingsGroup
            listings={items}
            canLoadMore={hasNextPage ?? false}
            loadMore={fetchNextPage}
            showLoadMore={true}
            address={null}
            collectionMetadata={null}
          />
        ) : (
          <CollectionNftsGroup
            data={items}
            canLoadMore={hasNextPage ?? false}
            loadMore={fetchNextPage}
            fullWidth={!filtersVisible || (useMobileMenu ?? false)}
            listable={collection.listable}
            is1155={collection.is1155}
          />
        )}
      </>
    ) : (
      <Box textAlign='center' mt={8}>
        <Text>No results found</Text>
      </Box>
    );
  }, [items, error, status, collection, hasNextPage, filtersVisible, useMobileMenu]);

  return (
    <>
      <ThemedBackground className="row position-sticky pt-2" style={{top: 74, zIndex: 5}}>
        <Taskbar
          collection={collection}
          onFilterToggle={() => setFiltersVisible(!filtersVisible)}
          onSortToggle={() => setMobileSortVisible(!mobileSortVisible)}
          initialSearch={queryParams.search}
          onSearch={(search: string) => handleSearch(search)}
          onSort={handleSort}
          filtersVisible={filtersVisible}
          onChangeViewType={() => {}}
          viewType={'grid-sm'}
          onOpenCollectionOfferDialog={onOpenCollectionOfferDialog}
          onOpenInstantSellDialog={onOpenInstantSellDialog}
          onOpenSweepDialog={onOpenSweepDialog}
        />
      </ThemedBackground>
      <CollectionFilterContainer
        queryParams={queryParams}
        collection={collection}
        onFilter={handleFilter}
        filtersVisible={filtersVisible}
        useMobileMenu={useMobileMenu ?? false}
        onMobileMenuClose={() => setFiltersVisible(false)}
        totalCount={totalCount}
        traits={traits}
        powertraits={powertraits}
      >
        <InfiniteScroll
          dataLength={items?.pages ? items.pages.flat().length : 0}
          next={fetchNextPage}
          hasMore={hasNextPage ?? false}
          style={{ overflow: 'hidden' }}
          loader={
            <Center>
              <Spinner />
            </Center>
          }
        >
          {content}
        </InfiniteScroll>
      </CollectionFilterContainer>

      {isOpenCollectionOfferDialog && (
        <MakeCollectionOfferDialog
          isOpen={isOpenCollectionOfferDialog}
          onClose={onCloseCollectionOfferDialog}
          collection={collection}
        />
      )}

      {isOpenInstantSellDialog && (
        <InstantSellDialog
          isOpen={isOpenInstantSellDialog}
          onClose={onCloseInstantSellDialog}
          collection={collection}
        />
      )}

      {isOpenSweepDialog && (
        <SweepFloorDialog
          isOpen={isOpenSweepDialog}
          onClose={onCloseSweepDialog}
          collection={collection}
          activeFilters={queryParams}
          fullscreen={useMobileMenu}
        />
      )}
    </>
  )
}

export default Items;