import {Accordion} from "@chakra-ui/react";
import React, {ReactNode, useCallback, useMemo, useState} from "react";
import DesktopFilterContainer, {FilteredItem} from "@src/components-v2/shared/filter-container";
import {MobileFilters} from "@src/components-v2/feature/account/profile/tabs/inventory/mobile-filters";
import {appConfig} from '@src/config';
import {DealListQueryParams} from "@src/core/services/api-service/mapi/queries/deallist";
import RadioFilter, {RadioItem} from "@src/components-v2/shared/filter-container/filters/radio-filter";
import {OfferState, OrderState} from "@src/core/services/api-service/types";

const config = appConfig();

interface DealsFilterContainerProps {
  queryParams: DealListQueryParams;
  onFilter: (newParams: DealListQueryParams) => void;
  filtersVisible: boolean;
  useMobileMenu: boolean;
  onMobileMenuClose: () => void;
  children: ReactNode;
}

const DealsFilterContainer = ({queryParams, onFilter, filtersVisible, useMobileMenu, onMobileMenuClose, children}: DealsFilterContainerProps) => {
  const [filteredItems, setFilteredItems] = useState<FilteredItem[]>([]);

  const handleRemoveFilters = useCallback((items: FilteredItem[]) => {
    const params = queryParams;
    for (const item of items) {
      if (item.key.startsWith('status-')) params.state = OrderState.ACTIVE;
    }
    onFilter({...queryParams, ...params});
    setFilteredItems(filteredItems.filter((fi) => !items.map(i => i.key).includes(fi.key)));
  }, [queryParams, filteredItems]);

  const handleStatusFilter = useCallback((item: RadioItem) => {
    const params = queryParams;
    if (item.key === 'status-active') params.state = OrderState.ACTIVE;
    if (item.key === 'status-accepted') params.state = OrderState.COMPLETED;
    if (item.key === 'status-rejected') params.state = OrderState.REJECTED;
    if (item.key === 'status-cancelled') params.state = OrderState.CANCELLED;
    if (item.key === 'status-expired') params.state = OrderState.EXPIRED;
    onFilter({...queryParams, ...params});

    const i = filteredItems.findIndex((fi) => fi.key === item.key)
    if (i === -1) {
      setFilteredItems([
        ...filteredItems.filter((fi) => !fi.key.startsWith('status')),
        {label: item.label, key: item.key}
      ])
    }

  }, [queryParams, filteredItems]);

  const FilterAccordion = useMemo(() => (
    <Accordion defaultIndex={[0]} allowMultiple>
      <RadioFilter
        title='Status'
        items={[
          {label: 'Active', key: 'status-active', isSelected: filteredItems.some((fi) => fi.key === 'status-active') || !filteredItems.some((fi) => fi.key.startsWith('status-'))},
          {label: 'Accepted', key: 'status-accepted', isSelected: filteredItems.some((fi) => fi.key === 'status-accepted')},
          {label: 'Rejected', key: 'status-rejected', isSelected: filteredItems.some((fi) => fi.key === 'status-rejected')},
          {label: 'Cancelled', key: 'status-cancelled', isSelected: filteredItems.some((fi) => fi.key === 'status-cancelled')},
          {label: 'Expired', key: 'status-expired', isSelected: filteredItems.some((fi) => fi.key === 'status-expired')}
        ]}
        onSelect={handleStatusFilter}
      />
    </Accordion>
  ), [queryParams, filteredItems, handleStatusFilter]);

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

export default DealsFilterContainer;