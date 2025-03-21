import {Accordion} from "@chakra-ui/react";
import CheckboxFilter, {CheckboxItem} from "@src/components-v2/shared/filter-container/filters/checkbox-filter";
import RangeFilter from "@src/components-v2/shared/filter-container/filters/range-filter";
import {CollectionFilter} from "@src/components-v2/feature/account/profile/tabs/inventory/collection-filter";
import React, {ReactNode, useCallback, useMemo, useState} from "react";
import DesktopFilterContainer, {FilteredItem} from "@src/components-v2/shared/filter-container";
import {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import {ciEquals} from "@market/helpers/utils";
import {MobileFilters} from "@src/components-v2/feature/account/profile/tabs/inventory/mobile-filters";
import { appConfig } from '@src/config';
import RadioFilter, {RadioItem} from "@src/components-v2/shared/filter-container/filters/radio-filter";
import {ethers} from "ethers";
import {chains} from "@src/wagmi";
import {useUserShowTestnet} from "@eb-pancakeswap-web/state/user/hooks/useUserShowTestnet";
import {ChainLogo} from "@dex/components/logo";
import { useDealsTokens } from '@src/global/hooks/use-supported-tokens';
import { CmsToken } from '@src/components-v2/global-data-fetcher';
import { getChainById } from '@src/helpers';

const config = appConfig();

interface InventoryFilterContainerProps {
  queryParams: WalletsQueryParams;
  collections: any[];
  onFilter: (newParams: WalletsQueryParams) => void;
  filtersVisible: boolean;
  useMobileMenu: boolean;
  onMobileMenuClose: () => void;
  children: ReactNode;
}

const InventoryFilterContainer = ({queryParams, collections, onFilter, filtersVisible, useMobileMenu, onMobileMenuClose, children}: InventoryFilterContainerProps) => {
  const [filteredItems, setFilteredItems] = useState<FilteredItem[]>([]);
  const [showTestnet] = useUserShowTestnet()

  const { tokens: dealTokens } = useDealsTokens();
  const categorizedDealCurrencies = useMemo(() => {
    const map = new Map<string, { key: string; label: string; items: CmsToken[] }>();

    dealTokens.forEach(token => {
      const chain = getChainById(token.chainId);
      if (!map.has(chain.slug)) {
        map.set(chain.slug, { key: chain.slug, label: chain.name, items: [] });
      }
      map.get(chain.slug)!.items.push(token);
    });

    return { categories: Array.from(map.values()) };
  }, [dealTokens]);

  const handleRemoveFilters = useCallback((items: FilteredItem[]) => {
    const params = queryParams;
    for (const item of items) {
      if (item.key === 'status-buy-now') delete params.listed;
      if (item.key === 'status-has-offers') delete params.offered;
      if (item.key === 'status-show-hidden') params.blacklist = '0,1';
      if (item.key === 'range-min-rank') delete params.minRank;
      if (item.key === 'range-max-rank') delete params.maxRank;
      if (item.key === 'range-min-price') delete params.minPrice;
      if (item.key === 'range-max-price') delete params.maxPrice;
      if (item.key.startsWith('currency')) delete params.currency;
      if (item.key.startsWith('chain')) delete params.chain;
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

  const handleStatusFilter = useCallback((item: CheckboxItem, checked: boolean) => {
    const params = queryParams;
    if (item.key === 'status-buy-now') params.listed = checked ? 1 : undefined;
    if (item.key === 'status-has-offers') params.offered = checked ? 1 : undefined;
    if (item.key === 'status-show-hidden') params.blacklist = checked ? '4' : '0,1';
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

  const FilterAccordion = useMemo(() => (
    <Accordion defaultIndex={[0]} allowMultiple>
      <CollectionFilter
        collections={collections}
        filteredAddresses={queryParams.collection ?? []}
        onFilter={handleCollectionFilter}
      />
      <CheckboxFilter
        title='Status'
        items={[
          {label: 'Buy Now', key: 'status-buy-now', isChecked: filteredItems.some((fi) => fi.key === 'status-buy-now')},
          {label: 'Has Offers', key: 'status-has-offers', isChecked: filteredItems.some((fi) => fi.key === 'status-has-offers')},
          {label: 'Show Hidden', key: 'status-show-hidden', isChecked: filteredItems.some((fi) => fi.key === 'status-show-hidden')}
        ]}
        onCheck={handleStatusFilter}
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
      <RadioFilter
        title='Currency'
        items={{
          categories: categorizedDealCurrencies.categories.map((category) => ({
            key: category.key,
            label: category.label,
            items: category.items.map((c) => ({
              icon: c.logo,
              label: c.symbol,
              key: `currency-${c.symbol.toLowerCase()}`,
              isSelected: filteredItems.some((fi) => fi.key === `currency-${c.symbol.toLowerCase()}`)
            }))
          }))
        }}
        onSelect={handleCurrencyFilter}
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

export default InventoryFilterContainer;