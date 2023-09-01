import {Accordion} from "@chakra-ui/react";
import RangeFilter from "@src/components-v2/shared/filter-container/filters/range-filter";
import React, {ReactNode, useCallback, useMemo, useState} from "react";
import DesktopFilterContainer, {FilteredItem} from "@src/components-v2/shared/filter-container";
import {MobileFilters} from "@src/components-v2/feature/account/profile/tabs/inventory/mobile-filters";
import {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import {OfferState, OfferType} from "@src/core/services/api-service/types";
import RadioFilter, {RadioItem} from "@src/components-v2/shared/filter-container/filters/radio-filter";

interface MadeOffersFilterContainerProps {
  queryParams: OffersQueryParams;
  onFilter: (newParams: OffersQueryParams) => void;
  filtersVisible: boolean;
  useMobileMenu: boolean;
  onMobileMenuClose: () => void;
  children: ReactNode;
}

const MadeOffersFilterContainer = ({queryParams, onFilter, filtersVisible, useMobileMenu, onMobileMenuClose, children}: MadeOffersFilterContainerProps) => {
  const [filteredItems, setFilteredItems] = useState<FilteredItem[]>([]);

  const handleRemoveFilters = useCallback((items: FilteredItem[]) => {
    const params = queryParams;
    for (const item of items) {
      if (item.key === 'status-active') params.state = OfferState.ACTIVE;
      if (item.key === 'status-accepted') params.state = OfferState.ACTIVE;
      if (item.key === 'status-rejected') params.state = OfferState.ACTIVE;
      if (item.key === 'type-direct') params.type = OfferType.DIRECT;
      if (item.key === 'type-collection') params.type = OfferType.DIRECT;
      if (item.key === 'range-max-rank') delete params.maxRank;
      if (item.key === 'range-min-price') delete params.minPrice;
      if (item.key === 'range-max-price') delete params.maxPrice;
    }
    onFilter({...queryParams, ...params});
    setFilteredItems(filteredItems.filter((fi) => !items.map(i => i.key).includes(fi.key)));
  }, [queryParams, filteredItems]);

  const handleStatusFilter = useCallback((item: RadioItem) => {
    const params = queryParams;
    if (item.key === 'status-active') params.state = OfferState.ACTIVE;
    if (item.key === 'status-accepted') params.state = OfferState.ACCEPTED;
    if (item.key === 'status-rejected') params.state = OfferState.REJECTED;
    onFilter({...queryParams, ...params});

    const i = filteredItems.findIndex((fi) => fi.key === item.key)
    if (i === -1) {
      setFilteredItems([
        ...filteredItems.filter((fi) => !fi.key.startsWith('status')),
        {label: item.label, key: item.key}
      ])
    }

  }, [queryParams, filteredItems]);

  const handleTypeFilter = useCallback((item: RadioItem) => {
    const params = queryParams;
    if (item.key === 'type-direct') params.type = OfferType.DIRECT;
    if (item.key === 'type-collection') params.type = OfferType.COLLECTION;
    onFilter({...queryParams, ...params});

    const i = filteredItems.findIndex((fi) => fi.key === item.key)
    if (i === -1) {
      setFilteredItems([
        ...filteredItems.filter((fi) => !fi.key.startsWith('type')),
        {label: item.label, key: item.key}
      ])
    }

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

  const FilterAccordion = useMemo(() => (
    <Accordion defaultIndex={[0, 1]} allowMultiple>
      <RadioFilter
        title='Status'
        items={[
          {label: 'Active', key: 'status-active', isSelected: filteredItems.some((fi) => fi.key === 'status-active') || !filteredItems.some((fi) => fi.key.startsWith('status-'))},
          {label: 'Accepted', key: 'status-accepted', isSelected: filteredItems.some((fi) => fi.key === 'status-accepted')},
          {label: 'Rejected', key: 'status-rejected', isSelected: filteredItems.some((fi) => fi.key === 'status-rejected')}
        ]}
        onSelect={handleStatusFilter}
      />
      <RadioFilter
        title='Type'
        items={[
          {label: 'Direct', key: 'type-direct', isSelected: filteredItems.some((fi) => fi.key === 'type-direct') || !filteredItems.some((fi) => fi.key.startsWith('type-'))},
          {label: 'Collection', key: 'type-collection', isSelected: filteredItems.some((fi) => fi.key === 'type-collection')},
        ]}
        onSelect={handleTypeFilter}
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
  ), [queryParams, filteredItems, handleStatusFilter, handleRankFilter, handlePriceFilter]);

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

export default MadeOffersFilterContainer;