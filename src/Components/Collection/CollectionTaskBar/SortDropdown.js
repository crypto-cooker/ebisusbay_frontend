import Select from "react-select";
import {CollectionSortOption} from "@src/Components/Models/collection-sort-option.model";
import React from "react";
import {getTheme} from "@src/Theme/theme";
import {useSelector} from "react-redux";
import {sortOptions} from "@src/Components/components/constants/sort-options";

export const SortDropdown = ({onSort}) => {
  const userTheme = useSelector((state) => state.user.theme);
  const selectDefaultSortValue = CollectionSortOption.default();
  const selectCollectionSortOptions = useSelector((state) => {
    if (state.collection.hasRank) {
      return sortOptions;
    }

    return sortOptions.filter((s) => s.key !== 'rank');
  });

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
  };

  return (
    <div className="items_filter" style={{ marginBottom: 0, marginTop: 0, minWidth: 200}}>
      <div className="dropdownSelect two w-100 mr-0 mb-0">
        <Select
          styles={customStyles}
          placeholder={'Sort Listings...'}
          options={[CollectionSortOption.default(), ...selectCollectionSortOptions]}
          getOptionLabel={(option) => option.getOptionLabel}
          getOptionValue={(option) => option.getOptionValue}
          defaultValue={selectDefaultSortValue}
          onChange={onSort}
        />
      </div>
    </div>
  )
}