import {
  Button as ChakraButton,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Input,
  Radio,
  RadioGroup,
  useBreakpointValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter, faSort} from "@fortawesome/free-solid-svg-icons";
import React, {useCallback, useEffect, useState} from "react";
import Filters from "@src/components-v2/feature/brand/tabs/listings/filters";
import {sortOptions} from "@src/Components/components/constants/sort-options";
import Button from "@src/Components/components/Button";
import useDebounce from "@src/core/hooks/useDebounce";
import {SortOption} from "@src/Components/Models/sort-option.model";
import {getTheme} from "@src/global/theme/theme";
import Select from "react-select";
import {useUser} from "@src/components-v2/useUser";

interface TaskBarProps {
  onFilterToggle: () => void;
  onSearch: (search: string) => void;
  onSort: (sort: SortOption) => void;
  collections: any[];
  onFilter: (filter: string[]) => void;
}

const TaskBar = ({onFilterToggle, onSearch, onSort, collections, onFilter}: TaskBarProps) => {
  const useMobileViews = useBreakpointValue(
    {base: true, lg: false},
    {fallback: 'lg'},
  );

  const { isOpen: isMobileFilterOpen, onOpen: onOpenMobileFilter, onClose: onCloseMobileFilter } = useDisclosure();
  const { isOpen: isMobileSortOpen, onOpen: onOpenMobileSort, onClose: onCloseMobileSort } = useDisclosure();

  return useMobileViews ? (
    <>
      <ButtonGroup>
        <ChakraButton onClick={onOpenMobileFilter}>
          <FontAwesomeIcon icon={faFilter} />
        </ChakraButton>
        <ChakraButton onClick={onOpenMobileSort}>
          <FontAwesomeIcon icon={faSort} />
        </ChakraButton>
        <SearchBar onSearch={onSearch} />
      </ButtonGroup>
      <MobileFilter
        collections={collections}
        isOpen={isMobileFilterOpen}
        onClose={onCloseMobileFilter}
        onFilter={onFilter}
      />
      <MobileSort
        isOpen={isMobileSortOpen}
        onClose={onCloseMobileSort}
        onSort={onSort}
      />
    </>
  ) : (
    <Grid templateColumns="auto 1fr 180px" gap={2}>
      <GridItem>
        <ChakraButton onClick={onFilterToggle}>
          <FontAwesomeIcon icon={faFilter} />
        </ChakraButton>
      </GridItem>
      <GridItem>
        <SearchBar onSearch={onSearch} />
      </GridItem>
      <GridItem>
        <SortDropdown onSort={onSort} />
      </GridItem>
    </Grid>
  )

}

export default TaskBar;

interface MobileFilterProps {
  collections: any[];
  isOpen: boolean;
  onClose: () => void;
  onFilter: (filter: string[]) => void;
}

const MobileFilter = ({collections, isOpen, onClose, onFilter}: MobileFilterProps) => {
  const [filters, setFilters] = useState<string[]>([]);

  const handleSaveFilter = () => {
    onFilter(filters);
    onClose();
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement='bottom'
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filter Listings</DrawerHeader>

        <DrawerBody>
          <Filters collections={collections} onChange={setFilters} />
        </DrawerBody>

        <DrawerFooter>
          <Flex w="full">
            <Button type="legacy-outlined" className="w-100" onClick={onClose}>
              Cancel
            </Button>
            <Button type="legacy" className="w-100 ms-4" onClick={handleSaveFilter}>
              Save
            </Button>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface MobileSortProps {
  isOpen: boolean;
  onClose: () => void;
  onSort: (sort: any) => void;
}

const MobileSort = ({isOpen, onClose, onSort}: MobileSortProps) => {
  const [selectedOption, setSelectedOption] = useState<any>();

  const handleChange = (value: string) => {
    setSelectedOption(sortOptions[Number(value)]);
  }

  const handleSaveFilter = () => {
    onSort(selectedOption);
    onClose();
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement='bottom'
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Sort Listings</DrawerHeader>

        <DrawerBody>
          <RadioGroup onChange={handleChange} value={sortOptions.findIndex((o) => o.id === selectedOption?.id).toString()}>
            <VStack align="start">
              {sortOptions.map((option, key) => (
                <Radio
                  key={`${option.key}-${option.direction}`}
                  value={key.toString()}
                >
                  {option.label}
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
        </DrawerBody>

        <DrawerFooter>
          <Flex w="full">
            <Button type="legacy-outlined" className="w-100" onClick={onClose}>
              Cancel
            </Button>
            <Button type="legacy" className="w-100 ms-4" onClick={handleSaveFilter}>
              Save
            </Button>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

}



interface SearchBarProps {
  onSearch: (value: string) => void;
}

export const SearchBar = ({onSearch}: SearchBarProps) => {
  const [value, setValue] = useState('');
  const debouncedSearch = useDebounce(value, 500);

  const handleSearch = useCallback((event: any) => {
    const newValue = event.target.value;
    setValue(newValue)
  }, [setValue]);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <Input
      id="collection-search"
      type="text"
      placeholder="Search by name"
      onChange={handleSearch}
      style={{ marginBottom: 0, marginTop: 0 }}
    />
  )
}

interface SortDropdownProps {
  onSort: (sortOption: any) => void;
}

export const SortDropdown = ({onSort}: SortDropdownProps) => {
  const {theme: userTheme} = useUser();
  const selectDefaultSortValue = SortOption.default();
  const selectCollectionSortOptions = sortOptions;

  const customStyles = {
    option: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      borderRadius: state.isFocused ? '0' : 0,
      '&:hover': {
        background: '#eee',
        color: '#000',
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
    }),
    singleValue: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3
    }),
    control: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      padding: 2,
    }),
  };

  const handleSortChange = useCallback((sortOption: any) => {
    onSort(sortOption);
  }, []);

  return (
    <div className="items_filter" style={{ marginBottom: 0, marginTop: 0, maxWidth: 200}}>
      <div className="dropdownSelect two w-100 mr-0 mb-0">
        <Select
          styles={customStyles}
          placeholder={'Sort Listings...'}
          options={[SortOption.default(), ...selectCollectionSortOptions]}
          getOptionLabel={(option) => option.getOptionLabel}
          getOptionValue={(option) => option.getOptionValue}
          defaultValue={selectDefaultSortValue}
          onChange={handleSortChange}
        />
      </div>
    </div>
  )
}