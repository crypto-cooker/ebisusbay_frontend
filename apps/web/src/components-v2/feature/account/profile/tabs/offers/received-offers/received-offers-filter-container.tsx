import {Accordion} from "@chakra-ui/react";
import RangeFilter from "@src/components-v2/shared/filter-container/filters/range-filter";
import React, {ReactNode, useCallback, useMemo, useState} from "react";
import DesktopFilterContainer, {FilteredItem} from "@src/components-v2/shared/filter-container";
import {ciEquals} from "@market/helpers/utils";
import {MobileFilters} from "@src/components-v2/feature/account/profile/tabs/inventory/mobile-filters";
import {OfferState, ReceivedOfferType} from "@src/core/services/api-service/types";
import RadioFilter, {RadioItem} from "@src/components-v2/shared/filter-container/filters/radio-filter";
import {CollectionFilter} from "@src/components-v2/shared/filter-container/filters/collection-filter";
import {OffersV2QueryParams} from "@src/core/services/api-service/mapi/queries/offersV2";

interface ReceivedOffersFilterContainerProps {
  queryParams: OffersV2QueryParams;
  collections: any[];
  onFilter: (newParams: OffersV2QueryParams) => void;
  filtersVisible: boolean;
  useMobileMenu: boolean;
  onMobileMenuClose: () => void;
  children: ReactNode;
}

const ReceivedOffersFilterContainer = ({queryParams, collections, onFilter, filtersVisible, useMobileMenu, onMobileMenuClose, children}: ReceivedOffersFilterContainerProps) => {
  const [filteredItems, setFilteredItems] = useState<FilteredItem[]>([]);

  const handleRemoveFilters = useCallback((items: FilteredItem[]) => {
    const params = queryParams;
    for (const item of items) {
      if (item.key === 'status-active') params.state = OfferState.ACTIVE;
      if (item.key === 'status-accepted') params.state = OfferState.ACTIVE;
      if (item.key === 'status-rejected') params.state = OfferState.ACTIVE;
      if (item.key === 'type-direct') {
        params.type = ReceivedOfferType.ERC721;
        params.offertype = 'nft';
      }
      if (item.key === 'type-public') {
        params.type = ReceivedOfferType.ERC721;
        params.offertype = 'nft';
      }
      if (item.key === 'type-collection') {
        params.type = ReceivedOfferType.ERC721;
        params.offertype = 'nft';
      }
      if (item.key === 'range-max-rank') delete params.maxRank;
      if (item.key === 'range-min-price') delete params.minPrice;
      if (item.key === 'range-max-price') delete params.maxPrice;
      if (item.key.startsWith('collection')) {
        if (params.collection && params.collection.length > 1) {
          const address = item.key.split('-')[1];
          params.collection = params.collection.filter((a) => !ciEquals(a, address));
        } else {
          delete params.collection;
        }
      }
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
    if (item.key === 'type-direct') {
      params.type = ReceivedOfferType.ERC721;
      params.offertype = 'nft';
    }
    if (item.key === 'type-public') {
      params.type = ReceivedOfferType.ERC1155;
      params.offertype = undefined;
    }
    if (item.key === 'type-collection') {
      params.type = ReceivedOfferType.ERC721;
      params.offertype = 'collection';
    }
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

  const handleCollectionFilter = useCallback((collections: any) => {
    onFilter({...queryParams, collection: collections ? collections.map((c: any) => c.address) : []});

    const curFilters = filteredItems
      .filter(c => !c.key.startsWith('collection'))
      .concat(collections.map((c: any) => ({label: c.name, key: `collection-${c.address}`})));

    setFilteredItems([...curFilters]);
  }, [queryParams, filteredItems]);

  const FilterAccordion = useMemo(() => (
    <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
      <CollectionFilter
        collections={collections}
        filteredAddresses={queryParams.collection ?? []}
        onFilter={handleCollectionFilter}
      />
      <RadioFilter
        title='Status'
        items={[
          {label: 'Active', key: 'status-active', isSelected: filteredItems.some((fi) => fi.key === 'status-active')},
          {label: 'Accepted', key: 'status-accepted', isSelected: filteredItems.some((fi) => fi.key === 'status-accepted')},
          {label: 'Rejected', key: 'status-rejected', isSelected: filteredItems.some((fi) => fi.key === 'status-rejected')}
        ]}
        onSelect={handleStatusFilter}
      />
      <RadioFilter
        title='Type'
        items={[
          {label: 'Direct', key: 'type-direct', isSelected: filteredItems.some((fi) => fi.key === 'type-direct')},
          {label: 'Public', key: 'type-public', isSelected: filteredItems.some((fi) => fi.key === 'type-public')},
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
      {/*<RangeFilter*/}
      {/*  field='price'*/}
      {/*  label='Price'*/}
      {/*  currentMin={queryParams.minPrice}*/}
      {/*  currentMax={queryParams.maxPrice}*/}
      {/*  onChange={handlePriceFilter}*/}
      {/*/>*/}
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

export default ReceivedOffersFilterContainer;