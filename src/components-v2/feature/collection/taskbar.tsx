import {
  Box,
  ButtonGroup,
  CloseButton,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  useBreakpointValue
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faBoltLightning,
  faBroom,
  faFilter,
  faHand,
  faSort,
  faTableCells,
  faTableCellsLarge
} from "@fortawesome/free-solid-svg-icons";
import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import useDebounce from "@src/core/hooks/useDebounce";
import {sortOptions} from "@src/Components/components/constants/collection-sort-options";
import {getTheme} from "@src/global/theme/theme";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {isBundle} from "@market/helpers/utils";
import {useUser} from "@src/components-v2/useUser";

interface TaskbarProps {
  collection: any;
  onFilterToggle: () => void;
  onSortToggle: () => void;
  initialSearch?: string;
  onSearch: (search: string) => void;
  onSort: (sort: string, direction: string) => void;
  filtersVisible: boolean;
  onChangeViewType: (viewType: string) => void;
  viewType: string;
  onOpenCollectionOfferDialog: () => void;
  onOpenInstantSellDialog: () => void;
  onOpenSweepDialog: () => void;
}

const Taskbar = ({collection, onFilterToggle, onSortToggle, initialSearch, onSearch, onSort, filtersVisible, onChangeViewType, viewType, onOpenCollectionOfferDialog, onOpenInstantSellDialog, onOpenSweepDialog}: TaskbarProps) => {
  const [searchTerms, setSearchTerms] = useState<{ value: string, isManuallySet: boolean }>({
    value: initialSearch ?? '',
    isManuallySet: false
  });
  const debouncedSearch = useDebounce(searchTerms.value, 500);
  const {theme: userTheme} = useUser();
  const useMobileMenu = useBreakpointValue(
    {base: true, lg: false},
    {fallback: 'lg'},
  );

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms({
      value: e.target.value,
      isManuallySet: true
    });
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerms({
      value: '',
      isManuallySet: true
    });
  }, []);

  const handleSort = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const values = e.target.value.split('-');
    onSort(values[0], values[1]);
  }, [onSort]);

  useEffect(() => {
    if (searchTerms.isManuallySet) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  const FilterButton = useMemo(() => (
    <IconButton
      aria-label={'Toggle Filter'}
      onClick={onFilterToggle}
      variant='outline'
      icon={<Icon as={FontAwesomeIcon} icon={filtersVisible ? faAngleLeft : faFilter} className="py-1" />}
    />
  ), [filtersVisible]);

  const SearchBar = useMemo(() => (
    <InputGroup flex='1'>
      <Input
        placeholder="Search by name"
        onChange={handleSearch}
        value={searchTerms.value}
        color="white"
        _placeholder={{ color: 'gray.300' }}
      />
      {searchTerms.value.length && (
        <InputRightElement
          children={<CloseButton onClick={handleClearSearch} />}
        />
      )}
    </InputGroup>
  ), [searchTerms]);

  const SortDropdown = useMemo(() => (
    <>
      {useMobileMenu ? (
        <IconButton
          aria-label={'Sort'}
          onClick={onSortToggle}
          variant='outline'
          icon={<Icon as={FontAwesomeIcon} icon={faSort} className="py-1" />}
        />
      ) : (
        <Select w='225px' onChange={handleSort}>
          {sortOptions.map((option) => (
            <option key={`${option.key}-${option.direction}`} value={`${option.key}-${option.direction}`}>{option.label}</option>
          ))}
        </Select>
      )}
    </>
  ), [sortOptions, useMobileMenu, handleSort]);

  const ViewButtons = useMemo(() => (
    <ButtonGroup isAttached variant='outline'>
      {/*<IconButton*/}
      {/*  icon={<Icon as={FontAwesomeIcon} icon={faList} />}*/}
      {/*  aria-label='List View'*/}
      {/*  isActive={viewType === 'list'}*/}
      {/*  _active={{*/}
      {/*    bg: getTheme(userTheme).colors.textColor4,*/}
      {/*    color: 'white'*/}
      {/*  }}*/}
      {/*  onClick={() => onChangeViewType('list')}*/}
      {/*/>*/}
      <IconButton
        icon={<Icon as={FontAwesomeIcon} icon={faTableCells} />}
        aria-label='Grid View (Small)'
        isActive={viewType === 'grid-sm'}
        _active={{
          bg: getTheme(userTheme).colors.textColor4,
          color: 'white'
        }}
        onClick={() => onChangeViewType('grid-sm')}
      />
      <IconButton
        icon={<Icon as={FontAwesomeIcon} icon={faTableCellsLarge} />}
        aria-label='Grid View (Large)'
        isActive={viewType === 'grid-lg'}
        _active={{
          bg: getTheme(userTheme).colors.textColor4,
          color: 'white'
        }}
        onClick={() => onChangeViewType('grid-lg')}
      />
    </ButtonGroup>
  ), [userTheme, viewType]);

  const ActionButtons =  useMemo(() => (
    <ButtonGroup>
      {!isBundle(collection.address) && (
        <PrimaryButton onClick={onOpenCollectionOfferDialog}>
          <Icon as={FontAwesomeIcon} icon={faHand} />
          <Box as='span' ms={2}>Offer</Box>
        </PrimaryButton>
      )}
      <PrimaryButton onClick={onOpenInstantSellDialog}>
        <Icon as={FontAwesomeIcon} icon={faBoltLightning} />
        <Box as='span' ms={2}>Sell Instantly</Box>
      </PrimaryButton>
      <PrimaryButton onClick={onOpenSweepDialog}>
        <Icon as={FontAwesomeIcon} icon={faBroom} />
        <Box as='span' ms={2}>Sweep</Box>
      </PrimaryButton>
    </ButtonGroup>
  ), [collection]);

  return useMobileMenu ? (
    <Stack>
      <HStack>
        {FilterButton}
        {SearchBar}
        {SortDropdown}
      </HStack>
      <Box textAlign='center'>
        {ActionButtons}
      </Box>
    </Stack>
  ) : (
    <Stack direction='row' mb={2} align='center' justify='space-between'>
      {FilterButton}
      {SearchBar}
      {SortDropdown}
      {ViewButtons}
      {ActionButtons}
    </Stack>
  )
}

export default Taskbar;