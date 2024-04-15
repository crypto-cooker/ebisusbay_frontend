import {Accordion} from "@chakra-ui/react";
import CheckboxFilter, {CheckboxItem} from "@src/components-v2/shared/filter-container/filters/checkbox-filter";
import RangeFilter from "@src/components-v2/shared/filter-container/filters/range-filter";
import {CollectionFilter} from "@src/components-v2/feature/account/profile/tabs/inventory/collection-filter";
import React, {ReactNode, useCallback, useMemo, useState} from "react";
import DesktopFilterContainer, {FilteredItem} from "@src/components-v2/shared/filter-container";
import {caseInsensitiveCompare} from "@market/helpers/utils";
import {MobileFilters} from "@src/components-v2/feature/account/profile/tabs/inventory/mobile-filters";
import {appConfig} from '@src/Config';
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";

const config = appConfig();

interface ListingsFilterContainerProps {
  queryParams: ListingsQueryParams;
  collections: any[];
  onFilter: (newParams: ListingsQueryParams) => void;
  filtersVisible: boolean;
  useMobileMenu: boolean;
  onMobileMenuClose: () => void;
  children: ReactNode;
}

const ListingsFilterContainer = ({queryParams, collections, onFilter, filtersVisible, useMobileMenu, onMobileMenuClose, children}: ListingsFilterContainerProps) => {
  const [filteredItems, setFilteredItems] = useState<FilteredItem[]>([]);

  const handleRemoveFilters = useCallback((items: FilteredItem[]) => {
    const params = queryParams;
    for (const item of items) {
      if (item.key === 'range-min-rank') delete params.minRank;
      if (item.key === 'range-max-rank') delete params.maxRank;
      if (item.key === 'range-min-price') delete params.minPrice;
      if (item.key === 'range-max-price') delete params.maxPrice;
      if (item.key.startsWith('collection')) {
        if (params.collection && params.collection.length > 1) {
          const address = item.key.split('-')[1];
          params.collection = params.collection.filter((a) => !caseInsensitiveCompare(a, address));
        } else {
          delete params.collection;
        }
      }
    }
    onFilter({...queryParams, ...params});
    setFilteredItems(filteredItems.filter((fi) => !items.map(i => i.key).includes(fi.key)));
  }, [queryParams, filteredItems]);

  const handleStatusFilter = useCallback((item: CheckboxItem, checked: boolean) => {
    const params = queryParams;
    if (item.key === 'status-bundles') {
      if (checked) {
        handleCollectionFilter([{name: 'Bundles', address: config.contracts.bundle}]);
      } else {
        let tmpSelectedCollections = collections.filter(
          (c: any) => params.collection?.includes(c.address) && c.address !== config.contracts.bundle
        );
        handleCollectionFilter(tmpSelectedCollections);
      }
      return;
    }
    onFilter({...queryParams, ...params});

    const i = filteredItems.findIndex((fi) => fi.key === item.key)
    if (i !== -1) {
      setFilteredItems(filteredItems.filter((fi) => fi.key !== item.key))
    } else setFilteredItems([...filteredItems, item])

  }, [queryParams, filteredItems]);

  const handleRankFilter = useCallback((field: string, min: number | undefined, max: number | undefined) => {
    const params = queryParams;
    params.minRank = min;
    params.maxRank = max;
    onFilter({...queryParams, ...params});

    const curFilters = filteredItems.filter(i => !['range-min-rank', 'range-max-rank'].includes(i.key));
    if (!!params.minRank) curFilters.push({label: `Min Rank ${min}`, key: 'range-min-rank'});
    if (!!params.maxRank) curFilters.push({label: `Max Rank ${max}`, key: 'range-max-rank'});
    setFilteredItems(curFilters);

  }, [queryParams, filteredItems]);

  const handlePriceFilter = useCallback((field: string, min: number | undefined, max: number | undefined) => {
    const params = queryParams;
    params.minPrice = min;
    params.maxPrice = max;
    onFilter({...queryParams, ...params});

    const curFilters = filteredItems.filter(i => !['range-min-price', 'range-max-price'].includes(i.key));
    if (!!params.minPrice) curFilters.push({label: `Min ${min} CRO`, key: 'range-min-price'});
    if (!!params.maxPrice) curFilters.push({label: `Max ${max} CRO`, key: 'range-max-price'});
    setFilteredItems([...curFilters]);

  }, [queryParams, filteredItems]);

  const handleCollectionFilter = useCallback((collections: any) => {
    onFilter({...queryParams, collection: collections ? collections.map((c: any) => c.address) : []});

    const curFilters = filteredItems
      .filter(c => !c.key.startsWith('collection'))
      .concat(collections.map((c: any) => ({label: c.name, key: `collection-${c.address}`})));

    setFilteredItems([...curFilters]);
  }, [queryParams, filteredItems]);

  const FilterAccordion = useMemo(() => (
    <Accordion defaultIndex={[0]} allowMultiple>
      <CollectionFilter
        collections={collections}
        filteredAddresses={queryParams.collection ?? []}
        onFilter={handleCollectionFilter}
        showBalance={false}
      />
      <CheckboxFilter
        title='Quantity'
        items={[
          {label: 'Bundles', key: 'status-bundles', isChecked: filteredItems.some((fi) => fi.key === `collection-${config.contracts.bundle}`)}
        ]}
        onCheck={handleStatusFilter}
      />
      <RangeFilter
        field='rank'
        label='Rank'
        currentMin={queryParams.minRank}
        currentMax={queryParams.maxRank}
        onChange={handleRankFilter}
      />
      <RangeFilter
        field='price'
        label='Price'
        currentMin={queryParams.minPrice}
        currentMax={queryParams.maxPrice}
        onChange={handlePriceFilter}
      />
    </Accordion>
  ), [collections, queryParams, filteredItems, handleCollectionFilter, handleStatusFilter, handleRankFilter, handlePriceFilter]);

  return (
    <>
      <DesktopFilterContainer
        visible={!useMobileMenu && filtersVisible}
        filters={FilterAccordion}
        filteredItems={filteredItems}
        onRemoveFilters={handleRemoveFilters}
      >
        {children}
      </DesktopFilterContainer>
      <MobileFilters
        show={useMobileMenu && filtersVisible}
        onClearAll={() => handleRemoveFilters(filteredItems)}
        onHide={onMobileMenuClose}
        filters={FilterAccordion}
      />
    </>
  )
}

export default ListingsFilterContainer;