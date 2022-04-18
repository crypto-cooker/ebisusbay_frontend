import React, { memo, useCallback } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';

import { sortOptions } from './constants/collection-sort-options';
import { CollectionSortOption } from '../Models/collection-sort-option.model';
import { listingFilterOptions } from './constants/filter-options';
import { sortListings, resetListings, searchListings, filterListingsByListed } from '../../GlobalState/collectionSlice';
import {ethers} from "ethers";

const CollectionFilterBarContainer = styled.div`
  margin: 0 0 22px;
`;

const CollectionFilterBar = ({ cacheName = null }) => {
  const dispatch = useDispatch();

  const collection = useSelector((state) => state.collection);

  const selectDefaultSortValue = collection.cachedSort[cacheName] ?? CollectionSortOption.default();

  const selectCollectionSortOptions = useSelector((state) => {
    if (state.collection.hasRank) {
      return sortOptions;
    }

    return sortOptions.filter((s) => s.key !== 'rank');
  });

  const onSortChange = useCallback(
    (sortOption) => {
      dispatch(sortListings(sortOption, cacheName));
    },
    [dispatch]
  );

  const handleCollectionFilter = useCallback(
    (filterOption) => {
      let option = '';
      if (filterOption.key === 'listed') {
        option = '1';
      } else if (filterOption.key === 'unlisted') {
        option = '0';
      }

      dispatch(filterListingsByListed(option));
    },
    [dispatch]
  );

  const handleSearch = debounce((event) => {
    const { value } = event.target;
    dispatch(searchListings(value));
  }, 300);

  // const handleClear = useCallback(() => {
  //   dispatch(resetListings());
  // }, [dispatch]);

  const customStyles = {
    option: (base, state) => ({
      ...base,
      background: '#fff',
      color: '#333',
      borderRadius: state.isFocused ? '0' : 0,
      '&:hover': {
        background: '#eee',
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    control: (base, state) => ({
      ...base,
      padding: 2,
    }),
  };

  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <CollectionFilterBarContainer className="row align-items-center">
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 px-2 mt-2">
        <div className="items_filter" style={{ marginBottom: 0, marginTop: 0 }}>
          <div className="dropdownSelect two w-100 mr-0 mb-0">
            <Select
              styles={customStyles}
              placeholder={'Sort Listings...'}
              options={[CollectionSortOption.default(), ...selectCollectionSortOptions]}
              getOptionLabel={(option) => option.getOptionLabel}
              getOptionValue={(option) => option.getOptionValue}
              defaultValue={selectDefaultSortValue}
              onChange={onSortChange}
            />
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 px-2 mt-2">
        <Form.Control
          type="text"
          placeholder="Search by name"
          onChange={handleSearch}
          style={{ marginBottom: 0, marginTop: 0 }}
        />
      </div>
      <div className="col-xl-3 px-2 mt-2 col-md-6 col-sm-12 d-sm-flex d-lg-none d-xl-flex">
        Total results ({ethers.utils.commify(collection?.totalCount || 0)})
      </div>
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 px-2 mt-2">
        <div className="items_filter" style={{ marginBottom: 0, marginTop: 0 }}>
          <div className="dropdownSelect two w-100 mr-0 mb-0">
            <Select
              styles={customStyles}
              placeholder={'Filter Listings...'}
              options={listingFilterOptions}
              defaultValue={listingFilterOptions[0]}
              onChange={handleCollectionFilter}
            />
          </div>
        </div>
      </div>
    </CollectionFilterBarContainer>
  );
};

export default memo(CollectionFilterBar);
