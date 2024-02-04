import Taskbar from "@src/components-v2/feature/collection/taskbar";
import CollectionFilterContainer from "@src/components-v2/feature/collection/collection-filter-container";
import InfiniteScroll from "react-infinite-scroll-component";
import {Box, Center, Spinner, Text, useBreakpointValue, useDisclosure} from "@chakra-ui/react";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {CollectionNftsGroup} from "@src/components-v2/feature/collection/collection-groups";
import {useRouter} from "next/router";
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";
import {useInfiniteQuery} from "@tanstack/react-query";
import nextApiService from "@src/core/services/api-service/next";
import {pushQueryString} from "@src/helpers/query";
import styled from "styled-components";
import MakeCollectionOfferDialog from "@src/components-v2/shared/dialogs/make-collection-offer";
import {ResponsiveInstantSellDialog} from "@src/components-v2/shared/dialogs/instant-sell";
import SweepFloorDialog from "@src/Components/Collection/CollectionTaskBar/SweepFloorDialog";
import {CollectionPageContext, CollectionPageContextProps} from "@src/components-v2/feature/collection/context";
import {isFoundingMemberCollection} from "@src/utils";
import {MobileSort} from "@src/components-v2/shared/drawers/mobile-sort";
import {sortOptions} from "@src/Components/components/constants/collection-sort-options";

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

// TODO fix
const hasRank = false;

const Items = ({collection, initialQuery, traits, powertraits}: ItemsProps) => {
  const router = useRouter();
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [mobileSortVisible, setMobileSortVisible] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [viewType, setViewType] = useState('grid-sm');

  const { isOpen: isOpenCollectionOfferDialog, onOpen: onOpenCollectionOfferDialog, onClose: onCloseCollectionOfferDialog } = useDisclosure();
  const { isOpen: isOpenInstantSellDialog, onOpen: onOpenInstantSellDialog, onClose: onCloseInstantSellDialog } = useDisclosure();
  const { isOpen: isOpenSweepDialog, onOpen: onOpenSweepDialog, onClose: onCloseSweepDialog } = useDisclosure();

  const useMobileMenu = useBreakpointValue(
    { base: true, lg: false },
    { fallback: 'lg' },
  );

  const [mobileFirstRender, setMobileFirstRender] = useState(false);
  useEffect(() => {
    if (useMobileMenu && !mobileFirstRender) {
      setMobileFirstRender(true);
      setFiltersVisible(false);
    }
  }, [useMobileMenu]);

  const { queryParams, setQueryParams  } = useContext(CollectionPageContext) as CollectionPageContextProps;

  const { data: items, error, fetchNextPage, hasNextPage, status, refetch} = useInfiniteQuery({
    queryKey: ['Collection', collection.address, queryParams],
    queryFn: async ({ pageParam = 1 }) => {
      const fixedQueryParams = {...queryParams};
      delete (fixedQueryParams as any).slug;
      delete (fixedQueryParams as any).tab;

      const params: FullCollectionsQueryParams = {
        sortBy: 'price',
        direction: 'asc',
        page: pageParam,
        address: collection.address,
        ...fixedQueryParams
      }

      const data = await nextApiService.getCollectionItems(collection.address, params);
      setTotalCount(data.totalCount!);

      if (isFoundingMemberCollection(collection.address)) {
        data.data = data.data.filter((nft) => nft.id !== '3');
      }

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  });

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
    setQueryParams({...queryParams, sortBy: sort as any, direction: direction as any});
  }, [queryParams]);

  const handleFilter = useCallback((filter: FullCollectionsQueryParams) => {
    const newQueryParams = {...queryParams, ...filter}
    setQueryParams(newQueryParams);
    pushQueryString(router, {
      slug: router.query.slug,
      ...Object.keys(newQueryParams).length > 0 ? newQueryParams : undefined
    });
  }, [queryParams]);

  const content = useMemo(() => {
    return status === 'pending' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === 'error' ? (
      <Box textAlign='center'>
        Error: {(error as any).message}
      </Box>
    ) : items?.pages.map((page) => page.data).flat().length > 0 ? (
      <CollectionNftsGroup
        data={items}
        canLoadMore={hasNextPage ?? false}
        loadMore={fetchNextPage}
        fullWidth={!filtersVisible || (useMobileMenu ?? false)}
        listable={collection.listable}
        is1155={collection.is1155}
        viewType={viewType}
      />
    ) : (
      <Box textAlign='center' mt={8}>
        <Text>No results found</Text>
      </Box>
    );
  }, [items, error, status, collection, hasNextPage, filtersVisible, useMobileMenu, viewType]);

  return (
    <>
      <ThemedBackground className="position-sticky pt-2 pb-1" style={{top: 74, zIndex: 5}}>
        <Taskbar
          collection={collection}
          onFilterToggle={() => setFiltersVisible(!filtersVisible)}
          onSortToggle={() => setMobileSortVisible(!mobileSortVisible)}
          initialSearch={queryParams.search}
          onSearch={(search: string) => handleSearch(search)}
          onSort={handleSort}
          filtersVisible={filtersVisible}
          onChangeViewType={(type: string) => setViewType(type)}
          viewType={viewType}
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
        useMobileMenu={!!useMobileMenu && mobileFirstRender}
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

      <MobileSort
        show={!!useMobileMenu && mobileSortVisible}
        sortOptions={sortOptions}
        currentSort={sortOptions.find((option) => option.key === queryParams.sortBy && option.direction === queryParams.direction)}
        onSort={handleSort}
        onHide={() => setMobileSortVisible(false)}
      />

      {isOpenCollectionOfferDialog && (
        <MakeCollectionOfferDialog
          isOpen={isOpenCollectionOfferDialog}
          onClose={onCloseCollectionOfferDialog}
          collection={collection}
        />
      )}

      {isOpenInstantSellDialog && (
        <ResponsiveInstantSellDialog
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