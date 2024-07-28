import React, {ChangeEvent, memo, useCallback, useEffect, useState} from 'react';
import {
  Box,
  CloseButton,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useBreakpointValue
} from "@chakra-ui/react";
import ListingsFilterContainer
  from "@src/components-v2/feature/account/profile/tabs/listings/listings-filter-container";
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {getWalletOverview} from "@src/core/api/endpoints/walletoverview";
import {ciEquals, findCollectionByAddress} from "@market/helpers/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter, faSort} from "@fortawesome/free-solid-svg-icons";
import useDebounce from "@src/core/hooks/useDebounce";
import ListingsGroup from "@src/components-v2/shared/listings-group";
import Select from "react-select";
import {SortOption, sortOptions} from "@src/components-v2/feature/account/profile/tabs/listings/sort-options";
import {getTheme} from "@src/global/theme/theme";
import {MobileSort} from "@src/components-v2/shared/drawers/mobile-sort";
import {useUser} from "@src/components-v2/useUser";

interface UserPrivateListingsProps {
  walletAddress: string
}

const UserPublicListings = ({ walletAddress }: UserPrivateListingsProps) => {
  const [collections, setCollections] = useState([]);
  const [searchTerms, setSearchTerms] = useState<string>();
  const debouncedSearch = useDebounce(searchTerms, 500);
  const [queryParams, setQueryParams] = useState<ListingsQueryParams>({
    sortBy: 'listingTime',
    direction: 'desc'
  });
  const [sortVisible, setSortVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const useMobileMenu = useBreakpointValue(
    { base: true, lg: false },
    { fallback: 'lg' },
  );

  const toggleFilterVisibility = () => {
    setFiltersVisible(!filtersVisible)
  };

  const toggleSortVisibility = () => {
    setSortVisible(!sortVisible)
  };

  const handleSort = useCallback((sort: string, direction: string) => {
    setQueryParams({...queryParams, sortBy: sort as any, direction: direction as any});
  }, [queryParams]);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerms('');
  }, []);

  useEffect(() => {
    setQueryParams({...queryParams, search: debouncedSearch});
  }, [debouncedSearch]);

  useEffect(() => {
    async function func() {
      const result = await getWalletOverview(walletAddress);
      setCollections(result.data
        .reduce((arr: any, item: any) => {
          const coll = findCollectionByAddress(item.nftAddress, item.nftId);
          if (!coll) return arr;
          const existingIndex = arr.findIndex((c: any) => ciEquals(coll.address, c.address));
          if (existingIndex >= 0) {
            arr[existingIndex].balance += Number(item.balance);
          } else {
            coll.balance = Number(item.balance);
            arr.push(coll);
          }
          return arr;
        }, [])
        .sort((a: any, b: any) => a.name > b.name ? 1 : -1)
      );
    }

    func();
  }, [walletAddress]);

  const {theme: userTheme} = useUser();
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

  return (
    <>
      <Stack direction="row" mb={2} align="center">
        <HStack w='full'>
          <Box>
            <IconButton
              aria-label={'Toggle Filter'}
              onClick={toggleFilterVisibility}
              variant='outline'
              icon={<Icon as={FontAwesomeIcon} icon={filtersVisible ? faAngleLeft : faFilter} />}
           />
          </Box>
          <InputGroup>
            <Input
              placeholder="Search by name"
              w="100%"
              onChange={handleSearch}
              value={searchTerms}
              color="white"
              _placeholder={{ color: 'gray.300' }}
            />
            {searchTerms?.length && (
              <InputRightElement
                children={<CloseButton onClick={handleClearSearch} />}
              />
            )}
          </InputGroup>
          {useMobileMenu ? (
            <IconButton
              aria-label={'Toggle Sort'}
              onClick={toggleSortVisibility}
              variant='outline'
              icon={<Icon as={FontAwesomeIcon} icon={faSort} />}
            />
          ) : (
            <Box>
              <Box className="items_filter" style={{ marginBottom: 0, marginTop: 0, minWidth: 200}}>
                <Box className="dropdownSelect mr-0 mb-0">
                  <Select
                    styles={customStyles}
                    placeholder={'Sort Listings...'}
                    options={sortOptions}
                    getOptionLabel={(option: SortOption) => option.label}
                    getOptionValue={(option: SortOption) => option.id}
                    defaultValue={sortOptions[0]}
                    onChange={(sortOption) => handleSort(sortOption!.key, sortOption!.direction)}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </HStack>
      </Stack>

      <Box>
        <ListingsFilterContainer
          queryParams={queryParams}
          collections={collections}
          onFilter={(newParams) => setQueryParams(newParams)}
          filtersVisible={filtersVisible}
          useMobileMenu={!!useMobileMenu}
          onMobileMenuClose={() => setFiltersVisible(false)}
        >
          <ListingsGroup
            queryParams={{...queryParams, seller: walletAddress}}
            fullWidth={!filtersVisible || (useMobileMenu ?? false)}
            viewType='grid-sm'
          />
        </ListingsFilterContainer>
      </Box>

      <MobileSort
        show={!!useMobileMenu && sortVisible}
        sortOptions={sortOptions}
        currentSort={sortOptions.find((option) => option.key === queryParams.sortBy && option.direction === queryParams.direction)}
        onSort={handleSort}
        onHide={() => setSortVisible(false)}
      />
    </>
  );
};

export default memo(UserPublicListings);
