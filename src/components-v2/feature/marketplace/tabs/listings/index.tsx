import Taskbar from "@src/components-v2/feature/marketplace/tabs/listings/taskbar";
import {useBreakpointValue} from "@chakra-ui/react";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {pushQueryString} from "@src/helpers/query";
import styled from "styled-components";
import {MobileSort} from "@src/components-v2/shared/drawers/mobile-sort";
import {sortOptions} from "@src/Components/components/constants/sort-options";
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {MarketplacePageContext, MarketplacePageContextProps} from "@src/components-v2/feature/marketplace/context";
import ListingsGroup from "@src/components-v2/shared/listings-group";
import MarketplaceFilterContainer
  from "@src/components-v2/feature/marketplace/tabs/listings/marketplace-filter-container";


const ThemedBackground = styled.div`
  background: ${({ theme }) => theme.colors.bgColor1}
`;

// TODO fix
const hasRank = false;

const Listings = () => {
  const router = useRouter();
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [mobileSortVisible, setMobileSortVisible] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [viewType, setViewType] = useState('grid-sm');
  const { queryParams, setQueryParams  } = useContext(MarketplacePageContext) as MarketplacePageContextProps;

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

  const handleFilter = useCallback((filter: ListingsQueryParams) => {
    const newQueryParams = {...queryParams, ...filter}
    setQueryParams(newQueryParams);
    pushQueryString(router, {
      slug: router.query.slug,
      ...Object.keys(newQueryParams).length > 0 ? newQueryParams : undefined
    });
  }, [queryParams]);

  return (
    <>
      <ThemedBackground className="position-sticky pt-2 pb-1" style={{top: 74, zIndex: 5}}>
        <Taskbar
          onFilterToggle={() => setFiltersVisible(!filtersVisible)}
          onSortToggle={() => setMobileSortVisible(!mobileSortVisible)}
          initialSearch={queryParams.search}
          onSearch={(search: string) => handleSearch(search)}
          onSort={handleSort}
          filtersVisible={filtersVisible}
          onChangeViewType={(type: string) => setViewType(type)}
          viewType={viewType}
        />
      </ThemedBackground>
      <MarketplaceFilterContainer
        queryParams={queryParams}
        onFilter={handleFilter}
        filtersVisible={filtersVisible}
        useMobileMenu={!!useMobileMenu && mobileFirstRender}
        onMobileMenuClose={() => setFiltersVisible(false)}
        totalCount={totalCount}
      >
        <ListingsGroup
          queryParams={queryParams}
          fullWidth={!filtersVisible || (useMobileMenu ?? false)}
          viewType={viewType}
        />
      </MarketplaceFilterContainer>

      <MobileSort
        show={!!useMobileMenu && mobileSortVisible}
        sortOptions={sortOptions}
        currentSort={sortOptions.find((option) => option.key === queryParams.sortBy && option.direction === queryParams.direction)}
        onSort={handleSort}
        onHide={() => setMobileSortVisible(false)}
      />
    </>
  )
}

export default Listings;