import {useUser} from "@src/components-v2/useUser";
import useBarterDeal from "@src/components-v2/feature/deal/use-barter-deal";
import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import useDebounce from "@src/core/hooks/useDebounce";
import {
  Box,
  Center,
  CloseButton,
  Collapse,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  SimpleGrid,
  Spinner,
  Stack,
  UnorderedList,
  useBreakpointValue,
  VStack
} from "@chakra-ui/react";
import {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import {ApiService} from "@src/core/services/api-service";
import { ciEquals, round } from '@market/helpers/utils';
import {useInfiniteQuery} from "@tanstack/react-query";
import {getTheme} from "@src/global/theme/theme";
import {DealNftCard} from "@src/components-v2/shared/nft-card2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter, faMagnifyingGlass, faSort} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import {SortOption, sortOptions} from "@src/components-v2/feature/account/profile/tabs/inventory/sort-options";
import InventoryFilterContainer
  from "@src/components-v2/feature/account/profile/tabs/inventory/inventory-filter-container";
import InfiniteScroll from "react-infinite-scroll-component";
import {MobileSort} from "@src/components-v2/shared/drawers/mobile-sort";
import {getWalletOverview} from "@src/core/api/endpoints/walletoverview";
import {toast} from 'react-toastify';

export const ChooseNftsTab = ({address}: {address: string}) => {
  const user = useUser();
  const { toggleOfferNFT, barterState } = useBarterDeal();
  const chainId = barterState.chainId;

  const [collections, setCollections] = useState([]);
  const [searchTerms, setSearchTerms] = useState<string>();
  const debouncedSearch = useDebounce(searchTerms, 500);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const useMobileMenu = useBreakpointValue(
    { base: true, lg: false },
    { fallback: 'lg' },
  );
  const [queryParams, setQueryParams] = useState<WalletsQueryParams>({
    sortBy: 'receivedTimestamp',
    direction: 'desc',
    chain: chainId
  });

  const fetcher = useCallback( async ({ pageParam = 1 }) => {
    const params: WalletsQueryParams = {
      ...queryParams,
      page: pageParam,
      chain: chainId
    }

    setQueryParams(params);

    return ApiService.withoutKey().getWallet(address, params);
  }, [chainId, queryParams])

  const amountSelected = (nftAddress: string, nftId: string) => {
    const selectedNft = barterState.maker.nfts.find((bNft) => ciEquals(bNft.nftAddress, nftAddress) && bNft.nftId === nftId);

    return selectedNft?.amountSelected || 0;
  }

  const {data, error, fetchNextPage, hasNextPage, status, refetch} = useInfiniteQuery({
    queryKey: ['Step2ChooseItems', address, queryParams, chainId],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  });

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

  const handleSelectItem = (nft: any) => {
    if(nft.chain == chainId) toggleOfferNFT(nft);
    else {
      toast.warning('Please select the items on the connected chain.')
    }
  }

  const userTheme =  user.theme;
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

  const handleClearSearch = useCallback(() => {
    setSearchTerms('');
  }, []);

  const historyContent = useMemo(() => {
    return status === 'pending' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === "error" ? (
      <p>Error: {(error as any).message}</p>
    ) : (
      <>
        <SimpleGrid
          columns={!useMobileMenu && filtersVisible ? {base: 1, sm: 2, lg: 3, xl: 4, '2xl': 6} : {base: 2, sm: 3, md: 4, lg: 5, xl: 6, '2xl': 7}}
          gap={3}
        >
          {data.pages.map((items, index) => (
            <React.Fragment key={index}>
              {items.data.map((nft, index) => {
                return (
                  <div key={`${nft.nftAddress}-${nft.nftId}-${index}`}>
                    <DealNftCard
                      nft={nft}
                      onSelect={handleSelectItem}
                      amountSelected={amountSelected(nft.nftAddress, nft.nftId)}
                    />
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </SimpleGrid>
      </>
    );
  }, [data, error, status, address, user.address, filtersVisible, handleSelectItem]);

  useEffect(() => {
    setQueryParams({...queryParams, search: debouncedSearch});
  }, [debouncedSearch]);

  useEffect(() => {
    async function func() {
      const result = await getWalletOverview(address);
      setCollections(result.data
        .reduce((arr: any, item: any) => {
          const existingIndex = arr.findIndex((c: any) => ciEquals(item.address, c.address));
          if (existingIndex >= 0) {
            arr[existingIndex].balance += round(Number(item.balance));
          } else {
            item.balance = Number(item.balance);
            arr.push(item);
          }
          return arr;
        }, [])
        .sort((a: any, b: any) => a.name > b.name ? 1 : -1)
      );
    }

    func();
  }, [address]);
  
  return (
    <>
      <Stack direction="row" mb={2} align="center">
        {useMobileMenu ? (
          <VStack spacing={0} mb={2} w='full'>
            <UnorderedList className="activity-filter" ms={0}>
              <ListItem className="active" onClick={toggleFilterVisibility}>
                <FontAwesomeIcon icon={faFilter} />
              </ListItem>
              <ListItem id="bulk" className={showMobileSearch ? 'active' : ''} onClick={() => setShowMobileSearch(!showMobileSearch)}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </ListItem>
              <ListItem onClick={toggleSortVisibility}>
                <FontAwesomeIcon icon={faSort} />
                <Box as='span' ms={2}>Sort</Box>
              </ListItem>
            </UnorderedList>

            <Box w='full'>
              <Collapse in={showMobileSearch} animateOpacity>
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
              </Collapse>
            </Box>
          </VStack>
        ) : (
          <HStack w='full'>
            <Box>
              <IconButton
                aria-label={'Toggle Filter'}
                onClick={toggleFilterVisibility}
                variant='outline'
                icon={<Icon as={FontAwesomeIcon} icon={filtersVisible ? faAngleLeft : faFilter} className="py-1" />}
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
          </HStack>
        )}
      </Stack>
      <InventoryFilterContainer
        queryParams={queryParams}
        collections={collections}
        onFilter={(newParams) => setQueryParams(newParams)}
        filtersVisible={filtersVisible}
        useMobileMenu={!!useMobileMenu}
        onMobileMenuClose={() => setFiltersVisible(false)}
      >
        <InfiniteScroll
          dataLength={data?.pages ? data.pages.flat().length : 0}
          next={fetchNextPage}
          hasMore={hasNextPage ?? false}
          style={{ overflow: 'hidden' }}
          loader={
            <Center>
              <Spinner />
            </Center>
          }
        >
          {historyContent}
        </InfiniteScroll>
      </InventoryFilterContainer>
      <MobileSort
        show={!!useMobileMenu && sortVisible}
        sortOptions={sortOptions}
        currentSort={sortOptions.find((option) => option.key === queryParams.sortBy && option.direction === queryParams.direction)}
        onSort={handleSort}
        onHide={() => setSortVisible(false)}
      />
    </>
  )
}