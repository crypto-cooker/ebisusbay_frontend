import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import MyNftCard from "@src/Components/components/MyNftCard";
import {
  ciEquals,
  isBundle,
  isCollectionListable,
  isNftBlacklisted,
  isVaultCollection, round
} from '@market/helpers/utils';
import NftBundleCard from "@src/Components/components/NftBundleCard";
import {ResponsiveCancelListingDialog} from "@src/components-v2/shared/dialogs/cancel-listing";
import {getWalletOverview} from "@src/core/api/endpoints/walletoverview";
import {useInfiniteQuery} from "@tanstack/react-query";
import CreateListingDialog from "@src/components-v2/shared/dialogs/create-listing";
import Button from "@src/Components/components/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter, faLayerGroup, faMagnifyingGlass, faSort} from "@fortawesome/free-solid-svg-icons";
import {ResponsiveTransferNftDialog} from "@src/components-v2/shared/dialogs/transfer-nft";
import {
  addToBatchListingCart,
  closeBatchListingCart,
  openBatchListingCart,
  removeFromBatchListingCart,
  setBatchType,
  setRefetchNfts
} from "@market/state/redux/slices/user-batch";
import {MobileBatchPreview} from "@src/components-v2/feature/account/profile/tabs/inventory/mobile-batch-preview";
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
import MyBundleCard from '@src/Components/Account/Profile/Inventory/components/MyBundleCard';
import {NftCard} from "@src/components-v2/shared/nft-card";
import nextApiService from "@src/core/services/api-service/next";
import {useAppDispatch, useAppSelector} from "@market/state/redux/store/hooks";
import Select from "react-select";
import {getTheme} from "@src/global/theme/theme";
import {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import {SortOption, sortOptions} from "@src/components-v2/feature/account/profile/tabs/inventory/sort-options";
import {MobileSort} from "@src/components-v2/shared/drawers/mobile-sort";
import InventoryFilterContainer
  from "@src/components-v2/feature/account/profile/tabs/inventory/inventory-filter-container";
import useDebounce from "@src/core/hooks/useDebounce";
import {useUser} from "@src/components-v2/useUser";
import {ApiService} from "@src/core/services/api-service";
import {toast} from "react-toastify";
import {ChainId} from "@pancakeswap/chains";
import {useAccount} from "wagmi";


interface InventoryProps {
  address: string;
}

export default function Inventory({ address }: InventoryProps) {
  const dispatch = useAppDispatch();

  const user = useUser();
  const { chain} = useAccount();
  const batchListingCart = useAppSelector((state) => state.batchListing);

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
    blacklist: '0,1'
  });

  const fetcher = async ({ pageParam = 1 }) => {
    const params: WalletsQueryParams = {
      page: pageParam,
      ...queryParams
    }
    return ApiService.withoutKey().getWallet(address, params);
  };

  const {data, error, fetchNextPage, hasNextPage, status, refetch} = useInfiniteQuery({
    queryKey: ['Inventory', address, queryParams],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  });

  const loadMore = () => {
    fetchNextPage();
  };

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

  useEffect(() => {
    if (batchListingCart.refetchNfts && batchListingCart.items) {
      refetch()
      dispatch(setRefetchNfts(false))
    }
  }, [batchListingCart.refetchNfts]);

  const toggleOpenBatchListingCart = () => {
    if (batchListingCart.isDrawerOpen) {
      dispatch(closeBatchListingCart());
    } else {
      dispatch(openBatchListingCart());
    }
  };

  const handleOpenBatchShortcut = (shortcut: any) => {
    if (!batchListingCart.isDrawerOpen) {
      dispatch(openBatchListingCart());
    }
    dispatch(setBatchType(shortcut));
  };

  const [transferDialogNft, setTransferDialogNft] = useState<any>(null);
  const [cancelDialogNft, setCancelDialogNft] = useState<any>(null);
  const [createListingNft, setCreateListingNft] = useState<any>(null);

  const handleAddToBatch = (nft: any) => {
    if (![ChainId.CRONOS, ChainId.CRONOS_TESTNET].includes(chain?.id)) {
      toast.error('Please switch to Cronos Mainnet');
      return;
    }

    if (![ChainId.CRONOS, ChainId.CRONOS_TESTNET].includes(nft.chain)) {
      toast.error('Feature only available for NFTs on Cronos Mainnet');
      return;
    }

    dispatch(addToBatchListingCart(nft))
  }

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
                if(isBundle(nft.nftAddress)){
                  return (
                    <div key={`${nft.nftAddress}-${nft.nftId}-${index}`}>
                      {ciEquals(address, user.address) ? (
                        <MyBundleCard
                          nft={nft}
                          canTransfer={nft.canTransfer}
                          canSell={isCollectionListable(nft.collection) && !nft.listed && nft.canSell}
                          canCancel={nft.listed && !!nft.listingId}
                          canUpdate={isCollectionListable(nft.collection) && nft.listed}
                          onTransferButtonPressed={() => setTransferDialogNft(nft)}
                          onSellButtonPressed={() => setCreateListingNft(nft)}
                          onUpdateButtonPressed={() => setCreateListingNft(nft)}
                          onCancelButtonPressed={() => setCancelDialogNft(nft)}
                          onAddToBatchListingButtonPressed={() => handleAddToBatch(nft)}
                          onRemoveFromBatchListingButtonPressed={() => dispatch(removeFromBatchListingCart(nft))}
                          newTab={true}
                        />
                      ) : (
                        <NftBundleCard 
                          listing={nft}
                          imgClass="collection"
                        />
                      )}
                    </div>
                  )
                }
                else{
                  return (
                    <div key={`${nft.nftAddress}-${nft.nftId}-${nft.listed}-${index}`}>
                      {ciEquals(address, user.address) ? (
                        <MyNftCard
                          nft={nft}
                          canTransfer={nft.canTransfer}
                          canSell={isCollectionListable(nft.collection) && (!nft.listed || nft.is1155) && nft.canSell}
                          isStaked={nft.isStaked}
                          canCancel={nft.listed && !!nft.listingId}
                          canUpdate={isCollectionListable(nft.collection) && nft.listed && !nft.is1155}
                          isVault={isVaultCollection(nft.nftAddress)}
                          onTransferButtonPressed={() => setTransferDialogNft(nft)}
                          onSellButtonPressed={() => setCreateListingNft(nft)}
                          onUpdateButtonPressed={() => setCreateListingNft(nft)}
                          onCancelButtonPressed={() => setCancelDialogNft(nft)}
                          onAddToBatchListingButtonPressed={() => handleAddToBatch(nft)}
                          onRemoveFromBatchListingButtonPressed={() => dispatch(removeFromBatchListingCart(nft))}
                          onImportVaultButtonPressed={() => console.log('TBI')}
                          newTab={true}
                        />
                      ) : (
                        <NftCard
                          nft={nft}
                          imgClass="collection"
                          canBuy={!isNftBlacklisted(nft.nftAddress, nft.nftId)}
                        />
                      )}
                    </div>
                  )
                }
              })}
              
            </React.Fragment>
          ))}
        </SimpleGrid>
      </>
    );
  }, [data, error, status, address, user.address, filtersVisible]);

  const toggleFilterVisibility = () => {
    setFiltersVisible(!filtersVisible)
  };

  const toggleSortVisibility = () => {
    setSortVisible(!sortVisible)
  };

  const handleSort = useCallback((sort: string, direction: string) => {
    setQueryParams({...queryParams, sortBy: sort as any, direction: direction as any});
  }, [queryParams]);

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

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerms('');
  }, []);

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
              <ListItem id="bulk" className={batchListingCart.isDrawerOpen ? 'active' : ''} onClick={toggleOpenBatchListingCart}>
                <FontAwesomeIcon icon={faLayerGroup} />
                <Box as='span' ms={2}>Bulk Mode</Box>
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
              <Button
                type="legacy-outlined"
                onClick={() => handleOpenBatchShortcut('listing')}
              >
                <HStack>
                  <Icon as={FontAwesomeIcon} icon={faLayerGroup} />
                  <Box>
                    Bulk mode
                  </Box>
                </HStack>
              </Button>
            </Box>
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
          next={loadMore}
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

      {!!cancelDialogNft && (
        <ResponsiveCancelListingDialog
          isOpen={!!cancelDialogNft}
          listingId={cancelDialogNft.listingId}
          onClose={() => setCancelDialogNft(null)}
        />
      )}
      {!!transferDialogNft && (
        <ResponsiveTransferNftDialog
          isOpen={!!transferDialogNft}
          nft={transferDialogNft}
          onClose={() => setTransferDialogNft(null)}
        />
      )}
      {!!createListingNft && (
        <CreateListingDialog
          isOpen={!!createListingNft}
          nft={createListingNft}
          onClose={() => setCreateListingNft(null)}
          listing={createListingNft.listingId ? {listingId: createListingNft.listingId} : null}
        />
      )}
      {useMobileMenu && (
        <MobileBatchPreview />
      )}
    </>
  )
}

