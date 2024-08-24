import React, {ChangeEvent, memo, useCallback, useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CreateListingDialog from "@src/components-v2/shared/dialogs/create-listing";
import {useInfiniteQuery} from "@tanstack/react-query";
import ResponsiveListingsTable from "@src/components-v2/shared/responsive-table/responsive-listings-table";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  CloseButton,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  Switch,
  Text,
  useBreakpointValue
} from "@chakra-ui/react";
import ListingsFilterContainer
  from "@src/components-v2/feature/account/profile/tabs/listings/listings-filter-container";
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import nextApiService from "@src/core/services/api-service/next";
import {InvalidState} from "@src/core/services/api-service/types";
import {getWalletOverview} from "@src/core/api/endpoints/walletoverview";
import {ciEquals, findCollectionByAddress} from "@market/helpers/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faCheckDouble, faFilter} from "@fortawesome/free-solid-svg-icons";
import useDebounce from "@src/core/hooks/useDebounce";
import BatchPreview from "@src/components-v2/feature/account/profile/tabs/listings/batch-preview";
import {MultiSelectContext} from './context';
import {useUser} from "@src/components-v2/useUser";
import {ResponsiveCancelListingDialog} from "@src/components-v2/shared/dialogs/cancel-listing";

interface UserPrivateListingsProps {
  walletAddress: string
}

const UserPrivateListings = ({ walletAddress }: UserPrivateListingsProps) => {
  const [collections, setCollections] = useState<any[]>([]);
  const [searchTerms, setSearchTerms] = useState<string>();
  const debouncedSearch = useDebounce(searchTerms, 500);
  const [showInvalidOnly, setShowInvalidOnly] = useState(false);
  const [hasInvalidListings, setHasInvalidListings] = useState(false);
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
  const user = useUser();
  const [selected, setSelected] = useState<any[]>([]);
  const [mobileMultiSelectMode, setMobileMultiSelectMode] = useState(false);

  const [cancelDialogNft, setCancelDialogNft] = useState<any>(null);
  const [updateListingNft, setUpdateListingNft] = useState<any>(null);

  const fetcher = async ({ pageParam = 1 }) => {
    const listings = await nextApiService.getUserUnfilteredListings(walletAddress, {
      ...queryParams,
      page: pageParam,
    });
    if (listings.data.some((value) => !value.valid && value.invalid !== InvalidState.LEGACY)) {
      setHasInvalidListings(true);
    }
    listings.data = listings.data
      .filter((x) => x.invalid !== InvalidState.LEGACY)
      .filter((x) => (showInvalidOnly ? !x.valid : true));

    return listings;
  };

  const {data, error, fetchNextPage, hasNextPage, status} = useInfiniteQuery({
    queryKey: ['MyListingsCollection', walletAddress, queryParams, showInvalidOnly],
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

  const loadMore = () => {
    fetchNextPage();
  };

  const handleSort = useCallback((field: string) => {
    let newSort = {
      sortBy: field,
      direction: 'desc'
    }
    if (queryParams.sortBy === newSort.sortBy) {
      newSort.direction = queryParams.direction === 'asc' ? 'desc' : 'asc'
    }
    setQueryParams({
      ...queryParams,
      sortBy: newSort.sortBy as any,
      direction: newSort.direction as any
    });
  }, [queryParams]);

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerms('');
  }, []);

  const handleSelected = useCallback((selectedListing: any, checked?: boolean) => {
    const alreadyChecked = !!selected.find((listing: any) => ciEquals(listing.listingId, selectedListing.listingId));
    if ((checked !== undefined && !checked) || alreadyChecked) {
      setSelected(selected.filter((listing: any) => !ciEquals(listing.listingId, selectedListing.listingId)));
    } else if (checked || !alreadyChecked) {
      setSelected([...selected, selectedListing]);
    }
  }, [selected]);

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

  return (
    <MultiSelectContext.Provider value={{ selected, setSelected, isMobileEnabled: mobileMultiSelectMode }}>
      {hasInvalidListings && (
        <Alert
          status='error'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          minH='200px'
        >
          <AlertIcon boxSize='40px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            Invalid listings detected!
          </AlertTitle>
          <AlertDescription>
            <Text>
              <strong>Some of your current listings are invalid.</strong> This can happen when a listed NFT was not
              delisted from the marketplace before being staked, transferred, or approval being revoked. This can cause
              NFTs to be sold significantly under floor price once the NFT returns to your wallet. Please cancel these
              listings to prevent any unwanted sales.
            </Text>
          </AlertDescription>
        </Alert>
      )}

      <div className="row pt-3">
        <div className="col-12 col-sm-6 col-md-4 m-0 text-nowrap d-flex align-items-center">
          <div className="items_filter">
            <Switch
              title='Only invalid'
              checked={showInvalidOnly}
              onChange={() => setShowInvalidOnly(!showInvalidOnly)}
            />
          </div>
        </div>
      </div>
      <Stack direction="row" mb={2} align="center">
        <HStack w='full'>
          {useMobileMenu && (
            <Box>
              <IconButton
                aria-label='Multiselect'
                icon={<Icon as={FontAwesomeIcon} icon={faCheckDouble} />}
                variant='outline'
                colorScheme={mobileMultiSelectMode ? 'blue' : 'gray'}
                onClick={() => setMobileMultiSelectMode(!mobileMultiSelectMode)}
              />
            </Box>
          )}
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
            {status === 'pending' ? (
              <Center>
                <Spinner />
              </Center>
            ) : status === "error" ? (
              <p>Error: {(error as any).message}</p>
            ) : (
              <ResponsiveListingsTable
                data={data}
                onUpdate={(listing) => {
                  const collection = collections.find((c: any) => ciEquals(c.address, listing.nftAddress));
                  let nft = listing.nft;
                  if (!!collection) {
                    nft = {...listing.nft, is_1155: collection.is_1155};
                  }
                  setUpdateListingNft({...listing, nft});
                }}
                onCancel={(listing) => {
                  setCancelDialogNft(listing);
                }}
                onSort={handleSort}
                breakpointValue={filtersVisible ? 'xl' : 'lg'}
              />
            )}
          </InfiniteScroll>
        </ListingsFilterContainer>
      </Box>

      {!!cancelDialogNft && (
        <ResponsiveCancelListingDialog
          isOpen={!!cancelDialogNft}
          listing={cancelDialogNft}
          onClose={() => setCancelDialogNft(null)}
        />
      )}
      {!!updateListingNft && (
        <CreateListingDialog
          isOpen={!!updateListingNft}
          nft={updateListingNft.nft}
          onClose={() => setUpdateListingNft(null)}
          listing={updateListingNft}
        />
      )}
      <BatchPreview
        mutationKey={['MyListingsCollection', walletAddress, queryParams, showInvalidOnly]}
      />
    </MultiSelectContext.Provider>
  );
};

export default memo(UserPrivateListings);
