import React, { memo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { init, fetchListings, filterListings, sortListings, searchListings } from '../../GlobalState/marketplaceSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner, Table } from 'react-bootstrap';
import { SortOption } from '../Models/sort-option.model';
import { debounce, shortAddress, timeSince } from '../../utils';
import Link from 'next/link';
import { ethers } from 'ethers';
import TopFilterBar from './TopFilterBar';
import { marketPlaceCollectionFilterOptions } from './constants/filter-options';
import { sortOptions } from './constants/sort-options';
import {MarketFilters} from "../Models/market-filters.model";

const SalesCollection = ({
  showLoadMore = true,
  collectionId = null,
  tokenId = null,
  sellerId = null,
  cacheName = null,
}) => {
  const dispatch = useDispatch();

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
      if (tokenId != null) {
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

  const onSearch = debounce((event) => {
    const { value } = event.target;
    dispatch(searchListings(value, cacheName, true));
  }, 300);

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
          <div className="row">
            <div className="col-lg-12 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
        }
        endMessage={() => {
          if (listings.length) {
            return (
              <div className="row mt-4">
                <div className="col-lg-12 text-center">
                  <span>Nothing to see here...</span>
                </div>
              </div>
            );
          }
        }}
      >
        <Table responsive className="table de-table table-rank sales-table align-middle" data-mobile-responsive="true">
          <thead>
            <tr>
              <th scope="col" colSpan="2">
                Item
              </th>
              <th scope="col">Rank</th>
              <th scope="col">Price</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Time</th>
            </tr>
            <tr />
          </thead>
          <tbody>
            {listings &&
              listings.map((listing, index) => (
                <tr key={index}>
                  <td style={{ minWidth: '50px' }}>
                    <Link href={`/collection/${listing.nftAddress}/${listing.nftId}`}>
                      <a>
                        <img
                          className="lazy rounded"
                          src={listing.nft.image}
                          alt={listing.nft.name}
                          style={{ maxHeight: '75px' }}
                        />
                      </a>
                    </Link>
                  </td>
                  <th style={{ minWidth: '115px' }}>
                    <Link href={`/collection/${listing.nftAddress}/${listing.nftId}`}>
                      <a>{listing.nft.name ?? 'Unknown'}</a>
                    </Link>
                  </th>
                  <td>{listing.nft.rank ?? '-'}</td>
                  <td style={{ minWidth: '100px' }}>{ethers.utils.commify(Math.round(listing.price))} CRO</td>
                  <td>
                    <Link href={`/seller/${listing.seller}`}>
                      <a>{shortAddress(listing.seller)}</a>
                    </Link>
                  </td>
                  <td>
                    <Link href={`/seller/${listing.purchaser}`}>
                      <a>{shortAddress(listing.purchaser)}</a>
                    </Link>
                  </td>
                  <td className="px-2" style={{ minWidth: '115px' }}>
                    {timeSince(listing.saleTime + '000')} ago
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </InfiniteScroll>
    </>
  );
};

export default memo(SalesCollection);
