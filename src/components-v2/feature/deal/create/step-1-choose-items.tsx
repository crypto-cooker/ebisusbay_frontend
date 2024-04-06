import InventoryFilterContainer
  from "@src/components-v2/feature/account/profile/tabs/inventory/inventory-filter-container";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Box,
  Center,
  CloseButton,
  Collapse,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  UnorderedList,
  useBreakpointValue,
  VStack
} from "@chakra-ui/react";
import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import {useInfiniteQuery} from "@tanstack/react-query";
import {useUser} from "@src/components-v2/useUser";
import {ApiService} from "@src/core/services/api-service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter, faMagnifyingGlass, faSort} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import ReactSelect, {SingleValue} from "react-select";
import {SortOption, sortOptions} from "@src/components-v2/feature/account/profile/tabs/inventory/sort-options";
import useDebounce from "@src/core/hooks/useDebounce";
import {getTheme} from "@src/Theme/theme";
import {DealNftCard} from "@src/components-v2/shared/nft-card2";
import useBarterDeal from "@src/components-v2/feature/deal/use-barter-deal";
import {ciEquals} from "@src/utils";
import {Tab, Tabs} from "@src/components-v2/foundation/tabs";
import useCurrencyBroker, {BrokerCurrency} from "@src/hooks/use-currency-broker";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {toast} from "react-toastify";
import {Card} from "@src/components-v2/foundation/card";

interface Step1ChooseItemsProps {
  address: string;
}

export const Step1ChooseItems = ({address}: Step1ChooseItemsProps) => {

  return (
    <>
      <Box my={4}>
        <Heading>
          Step 1: Select their items
        </Heading>
        <Text>
          Choose NFTs, Tokens, or both!
        </Text>
      </Box>
      <Tabs tabListStyle={{textAlign: 'start'}}>
        <Tab label='NFTs'>
          <ChooseNftsTab address={address} />
        </Tab>
        <Tab label='Tokens'>
          <ChooseTokensTab address={address} />
        </Tab>
      </Tabs>
    </>
  )
}

const ChooseNftsTab = ({address}: {address: string}) => {
  const user = useUser();
  const { toggleSelectionNFT, barterState } = useBarterDeal();


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
    direction: 'desc'
  });

  const fetcher = async ({ pageParam = 1 }) => {
    const params: WalletsQueryParams = {
      page: pageParam,
      ...queryParams
    }

    return ApiService.withoutKey().getWallet(address, params);
  };

  const amountSelected = (nftAddress: string, nftId: string) => {
    const selectedNft = barterState.taker.nfts.find((bNft) => ciEquals(bNft.nftAddress, nftAddress) && bNft.nftId === nftId);

    return selectedNft?.amountSelected || 0;
  }

  const {data, error, fetchNextPage, hasNextPage, status, refetch} = useInfiniteQuery({
    queryKey: ['Step1ChooseItems', address, queryParams],
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
    toggleSelectionNFT(nft);
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
                  <Box key={`${nft.nftAddress}-${nft.nftId}-${index}`}>
                    <DealNftCard
                      nft={nft}
                      onSelect={handleSelectItem}
                      amountSelected={amountSelected(nft.nftAddress, nft.nftId)}
                    />
                  </Box>
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
          style={{ overflow: 'initial' }}
          loader={
            <Center>
              <Spinner />
            </Center>
          }
        >
          {historyContent}
        </InfiniteScroll>
      </InventoryFilterContainer>
    </>
  )
}

const ChooseTokensTab = ({address}: {address: string}) => {
  const user = useUser();
  const { allERC20Currencies  } = useCurrencyBroker();
  const { toggleSelectionERC20 } = useBarterDeal();
  const [quantity, setQuantity] = useState<string>();
  const [selectedCurrency, setSelectedCurrency] = useState<BrokerCurrency>(allERC20Currencies[0]);

  const handleCurrencyChange = useCallback((currency: SingleValue<BrokerCurrency>) => {
    setSelectedCurrency(currency!);
  }, [selectedCurrency]);

  const handleAddCurrency = () => {
    if (!selectedCurrency) {
      toast.error('A currency is required');
      return;
    }

    if (!quantity) {
      toast.error('An amount is required');
      return;
    }

    toggleSelectionERC20({
      ...selectedCurrency,
      amount: Math.floor(parseInt(quantity)),
    })
  }

  const userTheme = user.theme;
  const customStyles = {
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
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
      padding: 1,
      minWidth: '132px',
      borderColor: 'none'
    }),
  };

  return (
    <Container>
      <Card>
        <Stack direction={{base: 'column', sm: 'row'}}>
          <ReactSelect
            isSearchable={false}
            menuPortalTarget={document.body} menuPosition={'fixed'}
            styles={customStyles}
            options={allERC20Currencies}
            formatOptionLabel={({ name, image }) => (
              <HStack>
                {image}
                <span>{name}</span>
              </HStack>
            )}
            value={selectedCurrency}
            defaultValue={allERC20Currencies[0]}
            onChange={handleCurrencyChange}
          />
          <NumberInput
            value={quantity}
            max={1000000}
            onChange={(valueAsString: string) => setQuantity(valueAsString)}
            precision={0}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Stack>
        <Flex justify='end' mt={2}>
          <PrimaryButton onClick={handleAddCurrency}>
            Add
          </PrimaryButton>
        </Flex>
      </Card>
    </Container>
  )
}

