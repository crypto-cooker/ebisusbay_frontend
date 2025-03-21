import React, {memo, useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {fetchListings, filterListings, init, searchListings, sortListings} from '@market/state/redux/slices/marketplaceSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import {SortOption} from '../Models/sort-option.model';
import {isBundle, knownErc20Token, shortAddress, timeSince} from '@market/helpers/utils';
import Link from 'next/link';
import {ethers} from 'ethers';
import TopFilterBar from './TopFilterBar';
import {marketPlaceCollectionFilterOptions} from './constants/filter-options';
import {sortOptions} from './constants/sort-options';
import {MarketFilters} from "../Models/market-filters.model";
import ImageService from "@src/core/services/image";
import {Center, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import useDebounce from "@src/core/hooks/useDebounce";
import {useAppDispatch} from "@market/state/redux/store/hooks";
import { useMarketTokens } from '@src/global/hooks/use-supported-tokens';

const SalesCollection = ({
  showLoadMore = true,
  collectionId = null,
  tokenId = '',
  sellerId = null,
  cacheName = '',
}) => {
  const dispatch = useAppDispatch();
  const [searchTerms, setSearchTerms] = useState('');
  const debouncedSearch = useDebounce(searchTerms, 500);
  const { tokens: knownMarketTokens } = useMarketTokens();

  // const mobileListBreakpoint = 768;
  // const [tableMobileView, setTableMobileView] = useState(window.innerWidth > mobileListBreakpoint);

  const listings = useSelector((state) => {
    return state.marketplace.listings;
  });
  const canLoadMore = useSelector((state) => {
    return state.marketplace.query.page === 0 || state.marketplace.query.page < state.marketplace.totalPages;
  });
  const isFetching = useSelector((state) => state.marketplace.loading);

  const marketplace = useSelector((state) => {
    return state.marketplace;
  });

  const defaultSort = () => {
    const defaultSort = new SortOption();
    defaultSort.key = 'saleTime';
    defaultSort.direction = 'desc';
    defaultSort.label = 'Sale Time';

    return defaultSort;
  };

  useEffect(() => {
    const sortOption = defaultSort();

    if (collectionId) {
      const filterOption = new MarketFilters();
      filterOption.collection.value = collectionId;
      if (tokenId !== '') {
        filterOption.tokenId = tokenId;
      }

      dispatch(init(sortOption, filterOption));
      dispatch(fetchListings(true));
      return;
    }

    if (sellerId) {
      const filterOption = new MarketFilters();
      filterOption.seller = sellerId;

      dispatch(init(sortOption, filterOption));
      dispatch(fetchListings(true));
      return;
    }

    const filterOption = marketplace.query.filter ?? MarketFilters.default();

    dispatch(init(sortOption, filterOption));
    dispatch(fetchListings(true));

    // eslint-disable-next-line
  }, [dispatch]);

  const loadMore = () => {
    if (!isFetching) {
      dispatch(fetchListings(true));
    }
  };

  const selectDefaultFilterValue = marketplace.query.filter.collection ?? MarketFilters.default();
  const selectDefaultSortValue = marketplace.query.sort ?? defaultSort();
  const selectDefaultSearchValue = marketplace.query.filter.search ?? '';

  const selectFilterOptions = marketPlaceCollectionFilterOptions;
  const selectSortOptions = useSelector((state) => {
    return sortOptions
      .filter((s) => state.marketplace.hasRank || s.key !== 'rank')
      .map((o) => {
        if (o.key === 'listingId') {
          return defaultSort();
        }
        return o;
      });
  });

  const onFilterChange = useCallback(
    (filterOption) => {
      dispatch(filterListings(filterOption, cacheName, true));
    },
    // eslint-disable-next-line
    [dispatch]
  );

  const onSortChange = useCallback(
    (sortOption) => {
      if (sortOption.key === null) {
        sortOption = defaultSort();
      }
      dispatch(sortListings(sortOption, cacheName, true));
    },
    // eslint-disable-next-line
    [dispatch]
  );

  const onSearch = (event) => {
    const { value } = event.target;
    setSearchTerms(value);
  }

  useEffect(() => {
    dispatch(searchListings(debouncedSearch, cacheName, true));
  }, [debouncedSearch]);

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <TopFilterBar
            showFilter={!collectionId}
            showSort={true}
            sortOptions={[SortOption.default(), ...selectSortOptions]}
            filterOptions={[MarketFilters.default(), ...selectFilterOptions]}
            defaultSortValue={selectDefaultSortValue}
            defaultFilterValue={selectDefaultFilterValue}
            defaultSearchValue={selectDefaultSearchValue}
            filterPlaceHolder="Filter Collection..."
            sortPlaceHolder="Sort Listings..."
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            onSearch={onSearch}
          />
        </div>
      </div>
      <InfiniteScroll
        dataLength={listings.length}
        next={loadMore}
        hasMore={canLoadMore}
        style={{ overflow: 'hidden' }}
        loader={
          <Center>
            <Spinner />
          </Center>
        }
        endMessage={!listings.length ? (
          <div className="row mt-4">
            <div className="col-lg-12 text-center">
              <span>Nothing to see here...</span>
            </div>
          </div>
        ) : <></>}
      >
        <TableContainer>
          <Table size={{base: 'sm', md: 'md'}} className="table-rank sales-table align-middle">
            <Thead>
            <Tr>
              <Th scope="col" colSpan="2">
                Item
              </Th>
              <Th scope="col">Rank</Th>
              <Th scope="col">Price</Th>
              <Th scope="col">From</Th>
              <Th scope="col">To</Th>
              <Th scope="col">Time</Th>
            </Tr>
            </Thead>
            <Tbody>
            {listings && listings.map((listing, index) => (
              <Tr key={index}>
                <Td minW={{base: '75px', md: '105px'}}>
                  <Link href={`/collection/${listing.chain}/${listing.nftAddress}/${listing.nftId}`}>
                    {isBundle(listing.nftAddress) ? (
                      <img
                        className="lazy rounded"
                        src={ImageService.translate('/img/logos/bundle.webp').fixedWidth(75, 75)}
                        alt={listing.nft.name}
                        style={{ maxHeight: '75px' }}
                      />
                    ) : (
                      <img
                        className="lazy rounded"
                        src={ImageService.translate(listing.nft.image).fixedWidth(75, 75)}
                        alt={listing.nft.name}
                        style={{ maxHeight: '75px' }}
                      />
                    )}
                  </Link>
                </Td>
                <Td minW={{base: '100px', md: '115px'}}>
                  <Link href={`/collection/${listing.chain}/${listing.nftAddress}/${listing.nftId}`}>
                    {listing.nft.name ?? 'Unknown'}
                  </Link>
                </Td>
                <Td>{listing.nft.rank ?? '-'}</Td>
                <Td style={{ minWidth: '100px' }}>{ethers.utils.commify(Math.round(listing.price))} {knownErc20Token(listing.currency, knownMarketTokens, listing.chain)?.symbol ?? 'CRO'}</Td>
                <Td>
                  <Link href={`/account/${listing.seller}`}>
                    {shortAddress(listing.seller)}
                  </Link>
                </Td>
                <Td>
                  <Link href={`/account/${listing.purchaser}`}>
                    {shortAddress(listing.purchaser)}
                  </Link>
                </Td>
                <Td className="px-2" style={{ minWidth: '115px' }}>
                  {timeSince(listing.saleTime)} ago
                </Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </InfiniteScroll>
    </>
  );
};

export default memo(SalesCollection);
