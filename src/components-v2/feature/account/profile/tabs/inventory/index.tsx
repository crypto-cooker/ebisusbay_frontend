import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch} from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import {Spinner} from "react-bootstrap";
import MyNftCard from "@src/Components/components/MyNftCard";
import {caseInsensitiveCompare, findCollectionByAddress, isBundle, isNftBlacklisted} from "@src/utils";
import NftBundleCard from "@src/Components/components/NftBundleCard";
import {MyNftPageActions} from "@src/GlobalState/User";
import MyNftCancelDialog from "@src/Components/components/MyNftCancelDialog";
import {getWalletOverview} from "@src/core/api/endpoints/walletoverview";
import {useInfiniteQuery} from "@tanstack/react-query";
import MakeListingDialog from "@src/Components/MakeListing";
import {CollectionFilter} from "./collection-filter";
import {MobileFilters} from "./mobile-filters";
import Button from "@src/Components/components/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter, faSort} from "@fortawesome/free-solid-svg-icons";
import TransferNftDialog from "@src/Components/Account/Profile/Dialogs/TransferNftDialog";
import {
  addToBatchListingCart,
  closeBatchListingCart,
  openBatchListingCart,
  removeFromBatchListingCart,
  setBatchType,
  setRefetchNfts
} from "@src/GlobalState/batchListingSlice";
import {MobileBatchListing} from "@src/Components/Account/Profile/Inventory/MobileBatchListing";
import {
  Box,
  Button as ChakraButton,
  HStack,
  ListItem,
  Spacer,
  Stack,
  UnorderedList,
  useBreakpointValue,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import MyBundleCard from '@src/Components/Account/Profile/Inventory/components/MyBundleCard';
import {NftCard} from "@src/components-v2/shared/nft-card";
import nextApiService from "@src/core/services/api-service/next";
import {useAppSelector} from "@src/Store/hooks";
import Select from "react-select";
import {getTheme} from "@src/Theme/theme";
import {WalletsQueryParams} from "@src/core/services/api-service/mapi/queries/wallets";
import {SortOption, sortOptions} from "@src/components-v2/feature/account/profile/tabs/inventory/sort-options";
import {MobileSort} from "@src/components-v2/feature/account/profile/tabs/inventory/mobile-sort";

interface InventoryProps {
  address: string;
}

export default function Inventory({ address }: InventoryProps) {
  const dispatch = useDispatch();

  const user = useAppSelector((state) => state.user);
  const batchListingCart = useAppSelector((state) => state.batchListing);

  const [collections, setCollections] = useState([]);
  const [collectionFilter, setCollectionFilter] = useState([]);
  const [sortOption, setSortOption] = useState<SortOption>(sortOptions[0])
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const useMobileMenu = useBreakpointValue(
    { base: true, lg: false },
    { fallback: 'lg' },
  );

  const onFilterChange = (filterOption: any) => {
    setCollectionFilter(filterOption ?? []);
    refetch();
  };

  const fetcher = async ({ pageParam = 1 }) => {
    const params: WalletsQueryParams = {
      page: pageParam,
      collection: collectionFilter,
      sortBy: sortOption.key,
      direction: sortOption.direction,
    }
    return nextApiService.getWallet(address, params);
  };

  const {data, error, fetchNextPage, hasNextPage, status, refetch} = useInfiniteQuery(
    ['Inventory', address, collectionFilter, sortOption],
    fetcher,
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    }
  )

  const loadMore = () => {
    fetchNextPage();
  };

  useEffect(() => {
    async function func() {
      const result = await getWalletOverview(address);
      setCollections(result.data
        .reduce((arr: any, item: any) => {
          const coll = findCollectionByAddress(item.nftAddress, item.nftId);
          if (!coll) return arr;
          const existingIndex = arr.findIndex((c: any) => caseInsensitiveCompare(coll.address, c.address));
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
  }, [address]);

  useEffect(() => {
    if (batchListingCart.refetchNfts) refetch()
    dispatch(setRefetchNfts(false))
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

  const historyContent = useMemo(() => {
    return status === "loading" ? (
      <div className="col-lg-12 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : status === "error" ? (
      <p>Error: {(error as any).message}</p>
    ) : (
      <>
        <div className="card-group row g-3">
          {data.pages.map((items, index) => (
            <React.Fragment key={index}>
              {items.data.map((nft, index) => {
                if(isBundle(nft.nftAddress)){
                  return (
                    <div
                      className={`d-item ${filtersVisible ? 'col-xs-12 col-sm-6 col-lg-4 col-xl-3' : 'col-6 col-sm-4 col-xl-3 col-xxl-2'}  mb-4`}
                      key={`${nft.nftAddress}-${nft.nftId}-${index}`}
                    >
                      {caseInsensitiveCompare(address, user.address) ? (
                        <MyBundleCard
                          nft={nft}
                          canTransfer={nft.canTransfer}
                          canSell={nft.listable && !nft.listed && nft.canSell}
                          canCancel={nft.listed && !!nft.listingId}
                          canUpdate={nft.listable && nft.listed}
                          onTransferButtonPressed={() => dispatch(MyNftPageActions.showMyNftPageTransferDialog(nft))}
                          onSellButtonPressed={() => {
                            dispatch(MyNftPageActions.showMyNftPageListDialog(nft, null))
                          }}
                          onUpdateButtonPressed={() => {
                            dispatch(MyNftPageActions.showMyNftPageListDialog(nft, null))
                          }}
                          onCancelButtonPressed={() => dispatch(MyNftPageActions.showMyNftPageCancelDialog(nft))}
                          onAddToBatchListingButtonPressed={() => dispatch(addToBatchListingCart(nft))}
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
                    <div
                      className={`d-item ${filtersVisible ? 'col-xs-12 col-sm-6 col-lg-4 col-xl-3' : 'col-6 col-sm-4 col-xl-3 col-xxl-2'}  mb-4`}
                      key={`${nft.nftAddress}-${nft.nftId}-${nft.listed}-${index}`}
                    >
                      {caseInsensitiveCompare(address, user.address) ? (
                        <MyNftCard
                          nft={nft}
                          canTransfer={nft.canTransfer}
                          canSell={nft.listable && !nft.listed && nft.canSell}
                          isStaked={nft.isStaked}
                          canCancel={nft.listed && !!nft.listingId}
                          canUpdate={nft.listable && nft.listed}
                          onTransferButtonPressed={() => dispatch(MyNftPageActions.showMyNftPageTransferDialog(nft))}
                          onSellButtonPressed={() => {
                            dispatch(MyNftPageActions.showMyNftPageListDialog(nft, null))
                          }}
                          onUpdateButtonPressed={() => {
                            dispatch(MyNftPageActions.showMyNftPageListDialog(nft, null))
                          }}
                          onCancelButtonPressed={() => dispatch(MyNftPageActions.showMyNftPageCancelDialog(nft)) }
                          onAddToBatchListingButtonPressed={() => dispatch(addToBatchListingCart(nft))}
                          onRemoveFromBatchListingButtonPressed={() => dispatch(removeFromBatchListingCart(nft))}
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
        </div>
      </>
    );
  }, [data, error, status, address, user.address, filtersVisible]);

  const toggleFilterVisibility = () => {
    setFiltersVisible(!filtersVisible)
  };

  const toggleSortVisibility = () => {
    setSortVisible(!sortVisible)
  };

  const handleSort = useCallback((sortOption: any) => {
    setSortOption(sortOption as SortOption);
  }, [setSortOption]);

  const userTheme = useAppSelector((state) => state.user.theme);
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
      <div className="d-flex">
        {filtersVisible && !useMobileMenu && (
          <div className="m-0 p-0">
            <div className="me-4 px-2" style={{ width: 320 }}>
              <CollectionFilter
                collections={collections}
                currentFilter={collectionFilter}
                onFilter={onFilterChange}
              />
            </div>
          </div>
        )}
        <div className="flex-fill">
          <Stack direction="row" mb={2} align="center">
            {useMobileMenu ? (
              <UnorderedList className="activity-filter">
                <ListItem className="active" onClick={toggleFilterVisibility}>
                  <FontAwesomeIcon icon={faFilter} />
                </ListItem>
                <ListItem onClick={toggleSortVisibility}>
                  <FontAwesomeIcon icon={faSort} />
                  <Box as='span' ms={2}>Sort</Box>
                </ListItem>
                <ListItem id="bulk" className={batchListingCart.isDrawerOpen ? 'active' : ''} onClick={toggleOpenBatchListingCart}>
                  Bulk Mode
                </ListItem>
              </UnorderedList>
            ) : (
              <>
                <Box>
                  <Button
                    type="legacy-outlined"
                    onClick={toggleFilterVisibility}
                  >
                    <FontAwesomeIcon icon={filtersVisible ? faAngleLeft : faFilter} className="py-1" />
                  </Button>
                </Box>
                <HStack align="center" spacing={2} border="1px solid white" rounded='md' ps={2} pe={1} py={1}>
                  <Box>
                    Bulk mode:
                  </Box>
                  <Wrap gap={2}>
                    <WrapItem>
                      <ChakraButton variant="ghost" size="sm" onClick={() => handleOpenBatchShortcut('listing')}>
                        Sell
                      </ChakraButton>
                      <ChakraButton variant="ghost" size="sm" onClick={() => handleOpenBatchShortcut('bundle')}>
                        Bundle
                      </ChakraButton>
                      <ChakraButton variant="ghost" size="sm" onClick={() => handleOpenBatchShortcut('transfer')}>
                        Transfer
                      </ChakraButton>
                    </WrapItem>
                  </Wrap>
                </HStack>
                <Spacer />
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
                        onChange={handleSort}
                      />
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Stack>
          <InfiniteScroll
            dataLength={data?.pages ? data.pages.flat().length : 0}
            next={loadMore}
            hasMore={hasNextPage ?? false}
            style={{ overflow: 'hidden' }}
            loader={
              <div className="row">
                <div className="col-lg-12 text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </div>
            }
          >
            {historyContent}
          </InfiniteScroll>
        </div>
      </div>
      <MobileFilters
        show={!!useMobileMenu && filtersVisible}
        collections={collections}
        currentFilter={collectionFilter}
        onFilter={onFilterChange}
        onHide={() => setFiltersVisible(false)}
      />
      <MobileSort
        show={!!useMobileMenu && sortVisible}
        currentSort={sortOption}
        onSort={handleSort}
        onHide={() => setSortVisible(false)}
      />
      <MyNftCancelDialog />
      {user.myNftPageTransferDialog && (
        <TransferNftDialog
          isOpen={!!user.myNftPageTransferDialog}
          nft={user.myNftPageTransferDialog}
          onClose={() => dispatch(MyNftPageActions.hideMyNftPageTransferDialog())}
        />
      )}
      {user.myNftPageListDialog?.nft && (
        <MakeListingDialog
          isOpen={!!user.myNftPageListDialog?.nft}
          nft={user.myNftPageListDialog?.nft}
          onClose={() => dispatch(MyNftPageActions.hideMyNftPageListDialog())}
          listing={user.myNftPageListDialog?.listing}
        />
      )}
      {useMobileMenu && (
        <MobileBatchListing />
      )}
    </>
  )
}

