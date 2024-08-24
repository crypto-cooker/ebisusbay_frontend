import {Accordion, Box} from "@chakra-ui/react";
import CheckboxFilter, {CheckboxItem} from "@src/components-v2/shared/filter-container/filters/checkbox-filter";
import RangeFilter from "@src/components-v2/shared/filter-container/filters/range-filter";
import React, {ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import DesktopFilterContainer, {FilteredItem} from "@src/components-v2/shared/filter-container";
import {MobileFilters} from "@src/components-v2/feature/account/profile/tabs/inventory/mobile-filters";
import {appConfig} from '@src/config';
import {FullCollectionsQueryParams} from "@src/core/services/api-service/mapi/queries/fullcollections";
import AttributeFilter from "@src/components-v2/shared/filter-container/filters/attribute-filter";
import {stripSpaces} from "@market/helpers/utils";
import {CollectionPageContext, CollectionPageContextProps} from "@src/components-v2/feature/collection/context";
import {ethers} from "ethers";
import RadioFilter, {RadioItem} from "@src/components-v2/shared/filter-container/filters/radio-filter";
import useCurrencyBroker from '@market/hooks/use-currency-broker';

const config = appConfig();

interface CollectionFilterContainerProps {
  queryParams: FullCollectionsQueryParams;
  collection: any;
  onFilter: (newParams: FullCollectionsQueryParams) => void;
  filtersVisible: boolean;
  useMobileMenu: boolean;
  onMobileMenuClose: () => void;
  totalCount: number;
  traits?: { [key: string]: { [key: string]: any } };
  powertraits?: { [key: string]: { [key: string]: any } };
  children: ReactNode;
}

const CollectionFilterContainer = ({collection, onFilter, filtersVisible, useMobileMenu, onMobileMenuClose, totalCount, traits, powertraits, children}: CollectionFilterContainerProps) => {
  const [filteredItems, setFilteredItems] = useState<FilteredItem[]>([]);
  const { queryParams, setQueryParams  } = useContext(CollectionPageContext) as CollectionPageContextProps;
  const { getByCollection: currencies } = useCurrencyBroker();

  const handleRemoveFilters = useCallback((items: FilteredItem[]) => {
    const params = queryParams;

    for (const item of items) {
      if (item.key === 'status-buy-now') delete params.listed;
      // if (item.key === 'status-has-offers') delete params.offered;
      if (item.key === 'range-min-rank') delete params.minRank;
      if (item.key === 'range-max-rank') delete params.maxRank;
      if (item.key === 'range-min-price') delete params.minPrice;
      if (item.key === 'range-max-price') delete params.maxPrice;
      if (item.key === 'search') delete params.search;
      if (item.key.startsWith('currency')) delete params.currency;
      if (item.key.startsWith('trait')) {
        const [_, category, value] = item.key.split('-');
        const categoryKey = stripSpaces(category);
        const valueKey = stripSpaces(value);
        if (params.traits) {
          let traits = JSON.parse(params.traits);
          traits[categoryKey] = traits[categoryKey]?.filter((v: string) => stripSpaces(v) !== valueKey) ?? [];

          if (traits[categoryKey].length === 0) delete traits[categoryKey];
          params.traits = JSON.stringify(traits);

          if (Object.keys(traits).length === 0) delete params.traits;
        }
      }
    }

    onFilter({...queryParams, ...params});
    setFilteredItems(filteredItems.filter((fi) => !items.map(i => i.key).includes(fi.key)));
  }, [queryParams, filteredItems]);

  const handleStatusFilter = useCallback((item: CheckboxItem, checked: boolean) => {
    const params = queryParams;
    if (item.key === 'status-buy-now') params.listed = checked ? 1 : 0;
    // if (item.key === 'status-has-offers') params.offered = checked ? 1 : undefined;
    onFilter({...queryParams, ...params});

    const i = filteredItems.findIndex((fi) => fi.key === item.key)
    if (i !== -1) {
      setFilteredItems(filteredItems.filter((fi) => fi.key !== item.key))
    } else setFilteredItems([...filteredItems, item])

  }, [queryParams, filteredItems]);

  const handleCurrencyFilter = useCallback((item: RadioItem) => {
    const params = queryParams;

    const symbol = item.key.split('-')[1];
    if (item.key === 'currency-cro') params.currency = ethers.constants.AddressZero;
    else if (config.tokens[symbol]) params.currency = config.tokens[symbol].address;

    onFilter({...queryParams, ...params});

    const i = filteredItems.findIndex((fi) => fi.key === item.key);
    if (i === -1) {
      setFilteredItems([
        ...filteredItems.filter((fi) => !fi.key.startsWith('currency')),
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

  const handleTraitsFilter = useCallback((attributeFilters: { [key: string]: string[] }, attributeFilteredItems: FilteredItem[]) => {
    let newQueryParams = queryParams;
    if (Object.keys(attributeFilters).length > 0) newQueryParams.traits = JSON.stringify(attributeFilters);
    else delete newQueryParams.traits;

    onFilter(newQueryParams);

    let newFilteredItems = filteredItems.filter((fi) => !fi.key.startsWith('trait-') || attributeFilteredItems.map(afi => afi.key).includes(fi.key));
    let addedFilterItems = attributeFilteredItems.filter((afi) => !filteredItems.some((fi) => fi.key === afi.key));
    setFilteredItems([...newFilteredItems, ...addedFilterItems]);

  }, [queryParams, filteredItems]);

  const handlePowertraitsFilter = useCallback((attributeFilters: { [key: string]: string[] }, attributeFilteredItems: FilteredItem[]) => {
    onFilter({...queryParams, powertraits: JSON.stringify(attributeFilters)});

    let newFilteredItems = filteredItems.filter((fi) => !fi.key.startsWith('trait-') || attributeFilteredItems.map(afi => afi.key).includes(fi.key));
    let addedFilterItems = attributeFilteredItems.filter((afi) => !filteredItems.some((fi) => fi.key === afi.key));
    setFilteredItems([...newFilteredItems, ...addedFilterItems]);

  }, [queryParams, filteredItems]);


  // Fill the UI with the current filters when the page loads with a query string
  useEffect(() => {
    const ret: FilteredItem[] = [];

    if (!!queryParams.traits && JSON.parse(queryParams.traits)) {
      const traits: { [key: string]: string[] } = JSON.parse(queryParams.traits);
      const traitFilters: FilteredItem[] = Object.entries(traits).reduce((p, c) => {
        p.push(...c[1].map((t) => {
          return {
            key: `trait-${c[0]}-${t}`,
            label: `${c[0]}: ${t}`
          }
        }));
        return p;
      }, [] as FilteredItem[]);
      ret.push(...traitFilters);
    }

    if (!!queryParams.powertraits && JSON.parse(queryParams.powertraits)) {
      const traits: { [key: string]: string[] } = JSON.parse(queryParams.powertraits);
      const powertraitFilters: FilteredItem[] = Object.entries(traits).reduce((p, c) => {
        p.push(...c[1].map((t) => {
          return {
            key: `trait-${c[0]}-${t}`,
            label: `${c[0]}: ${t}`
          }
        }));
        return p;
      }, [] as FilteredItem[]);
      ret.push(...powertraitFilters);
    }

    if (queryParams.minPrice) ret.push({key: 'range-min-price', label: `Min ${queryParams.minPrice} CRO`});
    if (queryParams.maxPrice) ret.push({key: 'range-max-price', label: `Max ${queryParams.maxPrice} CRO`});
    if (queryParams.search) ret.push({key: 'search', label: queryParams.search});
    if (queryParams.listed) ret.push({key: 'status-buy-now', label: 'Buy Now'});
    if (queryParams.currency) {
      if (queryParams.currency === ethers.constants.AddressZero) ret.push({key: 'currency-cro', label: 'CRO'});
      else {
        const currency: [string, any] | undefined = Object.entries(config.tokens).find((t: [string, any]) => t[1].address === queryParams.currency);
        if (currency) ret.push({key: `currency-${currency[0]}`, label: currency[1].symbol});
      }
    }

    setFilteredItems(ret);
  }, [queryParams]);

  const FilterAccordion = useMemo(() => (
    <Accordion defaultIndex={[0]} allowMultiple>
      <CheckboxFilter
        title='Status'
        items={[
          {label: 'Buy Now', key: 'status-buy-now', isChecked: filteredItems.some((fi) => fi.key === 'status-buy-now')},
          // {label: 'Has Offers', key: 'status-has-offers', isChecked: filteredItems.some((fi) => fi.key === 'status-has-offers')}
        ]}
        onCheck={handleStatusFilter}
      />
      {/*<CheckboxFilter*/}
      {/*  title='Quantity'*/}
      {/*  items={[*/}
      {/*    {label: 'Bundles', key: 'status-bundles', isChecked: filteredItems.some((fi) => fi.key === `collection-${config.contracts.bundle}`)}*/}
      {/*  ]}*/}
      {/*  onCheck={handleStatusFilter}*/}
      {/*/>*/}
      <RadioFilter
        title='Currency'
        items={currencies(collection.address).map((c) => (
          {icon: c.image, label: c.symbol, key: `currency-${c.symbol.toLowerCase()}`, isSelected: filteredItems.some((fi) => fi.key === `currency-${c.symbol.toLowerCase()}`)}
        ))}
        onSelect={handleCurrencyFilter}
      />
      {!collection.is_1155 && (
        <RangeFilter
          field='rank'
          label='Rank'
          currentMin={queryParams.minRank}
          currentMax={queryParams.maxRank}
          onChange={handleRankFilter}
        />
      )}
      <RangeFilter
        field='price'
        label='Price'
        currentMin={queryParams.minPrice}
        currentMax={queryParams.maxPrice}
        onChange={handlePriceFilter}
      />
      {!!traits && (
        <Box mt={6}>
          <AttributeFilter
            attributes={traits}
            currentFilters={queryParams.traits ? JSON.parse(queryParams.traits) : {}}
            onChange={handleTraitsFilter}
          />
        </Box>
      )}
      {!!powertraits && (
        <Box mt={6}>
          <AttributeFilter
            attributes={powertraits}
            currentFilters={queryParams.powertraits ? JSON.parse(queryParams.powertraits) : {}}
            onChange={handlePowertraitsFilter}
          />
        </Box>
      )}
    </Accordion>
  ), [queryParams, filteredItems, handleStatusFilter, handleRankFilter, handlePriceFilter, traits, powertraits]);

  return (
    <>
      <DesktopFilterContainer
        visible={!useMobileMenu && filtersVisible}
        filters={FilterAccordion}
        filteredItems={filteredItems}
        onRemoveFilters={handleRemoveFilters}
        totalCount={totalCount}
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

export default CollectionFilterContainer;