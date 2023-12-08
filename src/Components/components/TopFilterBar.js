import React, {memo} from 'react';
import Select from 'react-select';

import {SortOption} from '../Models/sort-option.model';
import {getTheme} from '../../Theme/theme';
import styled from 'styled-components';
import Switch from './common/Switch';
import useFeatureFlag from '@src/hooks/useFeatureFlag';
import Constants from '@src/constants';
import {Input, InputGroup} from "@chakra-ui/react";
import {useUser} from "@src/components-v2/useUser";

const CollectionFilterBarContainer = styled.div`
  margin: 0 0 22px;
`;

const TopFilterBar = ({
  showFilter = true,
  showSort = true,
  showSearch = true,
  showSwitch = false,
  sortOptions = [],
  filterOptions = [],
  defaultSortValue = SortOption.default(),
  defaultFilterValue = { value: null, label: 'All' },
  defaultSearchValue = '',
  filterPlaceHolder = '',
  sortPlaceHolder = '',
  onFilterChange = (newValue) => { },
  onSortChange = (newValue) => { },
  onSearch = (newValue) => { },
  sortValue = undefined,
  filterValue = undefined,
  onlyVerified = false,
  setOnlyVerified = (onlyVerified) => { }
}) => {
  const {theme: userTheme} = useUser();
  const customStyles = {
    option: (base, state) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      borderRadius: state.isFocused ? '0' : 0,
      '&:hover': {
        background: '#eee',
        color: '#000',
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
    singleValue: (base, state) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3
    }),
    control: (base, state) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      padding: 2,
    }),
    input: (base, state) => ({
      ...base,
      color: getTheme(userTheme).colors.textColor3,
      padding: 2,
    }),
    noOptionsMessage: (base, state) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
    }),
  };

  const { Features } = Constants;
  const isSwitchEnabled = useFeatureFlag(Features.VERIFIED_SWITCH_MARKETPLACE);

  const Filter = () => {
    return (
      <Select
        styles={customStyles}
        placeholder={filterPlaceHolder}
        options={filterOptions}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        defaultValue={defaultFilterValue}
        value={filterValue}
        onChange={onFilterChange}
      />
    );
  };

  const Sort = () => {
    return (
      <Select
        styles={customStyles}
        placeholder={sortPlaceHolder}
        options={sortOptions}
        getOptionLabel={(option) => option.getOptionLabel}
        getOptionValue={(option) => option.getOptionValue}
        defaultValue={defaultSortValue}
        value={sortValue}
        onChange={onSortChange}
      />
    );
  };

  const Search = () => {
    return (
      <InputGroup flex='1'>
        <Input
          placeholder="Search by name"
          onChange={onSearch}
          defaultValue={defaultSearchValue}
          color="white"
          _placeholder={{ color: 'gray.300' }}
          style={{ marginBottom: 0, marginTop: 0 }}
        />
      </InputGroup>
    );
  };

  return (
    <CollectionFilterBarContainer className="row align-items-center">
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 px-2 mt-2">
        <div className="items_filter" style={{ marginBottom: 0, marginTop: 0 }}>
          <div className="dropdownSelect two w-100 mr-0 mb-0">{showFilter ? <Filter /> : <Sort />}</div>
        </div>
      </div>
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 px-2 mt-2">
        <div className="items_filter" style={{ marginBottom: 0, marginTop: 0 }}>
          <div className="dropdownSelect two w-100 mr-0 mb-0">
            {showSort && <>{showFilter ? <Sort /> : <Search />}</>}
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 px-2 mt-2">
        <div className="items_filter" style={{ marginBottom: 0, marginTop: 0 }}>
          <div className="dropdownSelect two w-100 mr-0 mb-0">{showSearch && showFilter && <Search />}</div>
        </div>
      </div>
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 px-2 mt-2">
        <div className="d-flex justify-content-end">
          {showSwitch && isSwitchEnabled && <Switch isChecked={onlyVerified} setIsChecked={setOnlyVerified} text={'Only Verified'} />}
        </div>
      </div>
    </CollectionFilterBarContainer>
  );
};

export default memo(TopFilterBar);
