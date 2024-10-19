import {Accordion} from "@chakra-ui/react";
import RangeFilter from "@src/components-v2/shared/filter-container/filters/range-filter";
import React, {ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import DesktopFilterContainer, {FilteredItem} from "@src/components-v2/shared/filter-container";
import {MobileFilters} from "@src/components-v2/feature/account/profile/tabs/inventory/mobile-filters";
import {appConfig} from '@src/config';
import {ethers} from "ethers";
import RadioFilter, {RadioItem} from "@src/components-v2/shared/filter-container/filters/radio-filter";
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {MarketplacePageContext, MarketplacePageContextProps} from "@src/components-v2/feature/marketplace/context";
import {CollectionFilter} from "@src/components-v2/shared/filter-container/filters/collection-filter";
import {ciEquals, isCollectionListable} from "@market/helpers/utils";
import {chains} from "@src/wagmi";
import {useUserShowTestnet} from "@eb-pancakeswap-web/state/user/hooks/useUserShowTestnet";
import useCurrencyBroker from '@market/hooks/use-currency-broker';
import {ChainLogo} from "@dex/components/logo";

const config = appConfig();

const collections = config.legacyCollections
  .filter((c: any) => isCollectionListable(c))
  .sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
  .map((x: any) => ({avatar: x.metadata.avatar, name: x.name, address: x.address}));

interface MarketplaceFilterContainerProps {
  queryParams: ListingsQueryParams;
  onFilter: (newParams: ListingsQueryParams) => void;
  filtersVisible: boolean;
  useMobileMenu: boolean;
  onMobileMenuClose: () => void;
  totalCount: number;
  children: ReactNode;
}

const MarketplaceFilterContainer = ({onFilter, filtersVisible, useMobileMenu, onMobileMenuClose, totalCount, children}: MarketplaceFilterContainerProps) => {
  const [filteredItems, setFilteredItems] = useState<FilteredItem[]>([]);
  const { queryParams, setQueryParams  } = useContext(MarketplacePageContext) as MarketplacePageContextProps;
  const { listingCurrencies } = useCurrencyBroker();
  const [showTestnet] = useUserShowTestnet()

  const handleRemoveFilters = useCallback((items: FilteredItem[]) => {
    const params = queryParams;

    for (const item of items) {
      // if (item.key === 'status-has-offers') delete params.offered;
      if (item.key === 'range-min-rank') delete params.minRank;
      if (item.key === 'range-max-rank') delete params.maxRank;
      if (item.key === 'range-min-price') delete params.minPrice;
      if (item.key === 'range-max-price') delete params.maxPrice;
      if (item.key === 'search') delete params.search;
      if (item.key.startsWith('currency')) delete params.currency;
      if (item.key.startsWith('collection')) {
        const [_, address] = item.key.split('-');
        if (params.collection) {
          const collections = Array.isArray(params.collection) ? params.collection : [params.collection];
          params.collection = collections.filter((c: string) => !ciEquals(c, address));
          if (params.collection.length === 0) delete params.collection;
        }
      }
    }

    onFilter({...queryParams, ...params});
    setFilteredItems(filteredItems.filter((fi) => !items.map(i => i.key).includes(fi.key)));
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

  const handleChainFilter = useCallback((item: RadioItem) => {
    const chainId = item.key.split('-')[1];

    onFilter({...queryParams, chain: +chainId});

    const i = filteredItems.findIndex((fi) => fi.key === item.key);
    if (i === -1) {
      setFilteredItems([
        ...filteredItems.filter((fi) => !fi.key.startsWith('chain')),
        {label: item.label, key: item.key}
      ])
    }

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


  // Fill the UI with the current filters when the page loads with a query string
  useEffect(() => {
    const ret: FilteredItem[] = [];

    if (queryParams.minPrice) ret.push({key: 'range-min-price', label: `Min ${queryParams.minPrice} CRO`});
    if (queryParams.maxPrice) ret.push({key: 'range-max-price', label: `Max ${queryParams.maxPrice} CRO`});
    if (queryParams.search) ret.push({key: 'search', label: queryParams.search});
    if (queryParams.currency) {
      if (queryParams.currency === ethers.constants.AddressZero) ret.push({key: 'currency-cro', label: 'CRO'});
      else {
        const currency: [string, any] | undefined = Object.entries(config.tokens).find((t: [string, any]) => t[1].address === queryParams.currency);
        if (currency) ret.push({key: `currency-${currency[0]}`, label: currency[1].symbol});
      }
    }
    if (queryParams.collection) {
      const collections = Array.isArray(queryParams.collection) ? queryParams.collection : [queryParams.collection];
      for (const collectionAddress of collections) {
        const collection = config.legacyCollections.find((c: any) => ciEquals(c.address, collectionAddress));
        if (collection) ret.push({key: `collection-${collection.address}`, label: collection.name});
      }
    }

    setFilteredItems(ret);
  }, [queryParams]);

  const handleCollectionFilter = useCallback((collections: any) => {
    onFilter({...queryParams, collection: collections ? collections.map((c: any) => c.address) : []});

    const curFilters = filteredItems
      .filter(c => !c.key.startsWith('collection'))
      .concat(collections.map((c: any) => ({label: c.name, key: `collection-${c.address}`})));

    setFilteredItems(curFilters);
  }, [queryParams, filteredItems]);

  const FilterAccordion = useMemo(() => (
    <Accordion defaultIndex={[0]} allowMultiple>
      <CollectionFilter
        collections={collections}
        filteredAddresses={queryParams.collection ? (Array.isArray(queryParams.collection) ? queryParams.collection : [queryParams.collection]) : []}
        onFilter={handleCollectionFilter}
        showBalance={false}
      />
      <RadioFilter
        title='Currency'
        items={listingCurrencies.map((c) => (
          {icon: c.image, label: c.symbol, key: `currency-${c.symbol.toLowerCase()}`, isSelected: filteredItems.some((fi) => fi.key === `currency-${c.symbol.toLowerCase()}`)}
        ))}
        onSelect={handleCurrencyFilter}
      />
      <RangeFilter
        field='price'
        label='Price'
        currentMin={queryParams.minPrice}
        currentMax={queryParams.maxPrice}
        onChange={handlePriceFilter}
      />
      <RadioFilter
        title='Chain'
        items={
          [
            ...chains
              .filter((chain) => {
                if ('testnet' in chain && chain.testnet) {
                  return showTestnet
                }
                return true
              })
              .map((c) => (
                {
                  label: c.name,
                  key: `chain-${c.id}`,
                  icon: <ChainLogo chainId={c.id} />,
                  isSelected: filteredItems.some((fi) => fi.key === `chain-${c.id}`)
                }
            )),
          ]}
        onSelect={handleChainFilter}
      />
    </Accordion>
  ), [queryParams, filteredItems, handleRankFilter, handlePriceFilter]);

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

export default MarketplaceFilterContainer;