import React, {memo, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

import ListingCard from './ListingCard';
import {fetchListings, init} from '@src/GlobalState/marketplaceSlice';
import {SortOption} from '../Models/sort-option.model';

import {isMetapixelsCollection} from '@src/utils';
import {MarketFilters} from "../Models/market-filters.model";
import ListingBundleCard from './ListingBundleCard';
import {Center, Spinner} from "@chakra-ui/react";

const ListingCollection = ({
  limitSize = 0,
  showLoadMore = true,
  collectionId = null,
  sellerId = '',
  cacheName = '',
}) => {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.marketplace.listings);

  const canLoadMore = useSelector((state) => {
    return state.marketplace.query.page === 0 || state.marketplace.query.page < state.marketplace.totalPages;
  });
  const isFetching = useSelector((state) => state.marketplace.loading);

  const marketplace = useSelector((state) => {
    return state.marketplace;
  });

  useEffect(() => {
    const sortOption = new SortOption();
    const filterOption = new MarketFilters();

    if (limitSize) filterOption.limit = limitSize;

    if (collectionId) {
      sortOption.key = 'listingId';
      sortOption.direction = 'desc';
      sortOption.label = 'By Id';

      filterOption.collection.address = collectionId;

      dispatch(init(sortOption, filterOption));
      dispatch(fetchListings());
      return;
    }

    if (sellerId) {
      sortOption.key = 'listingId';
      sortOption.direction = 'desc';
      sortOption.label = 'By Id';

      filterOption.seller = sellerId;

      dispatch(init(sortOption, filterOption));
      dispatch(fetchListings());
      return;
    }

    dispatch(init(sortOption, filterOption));
    dispatch(fetchListings());
    // eslint-disable-next-line
  }, [dispatch]);

  const loadMore = () => {
    if (!isFetching) {
      dispatch(fetchListings());
    }
  };

  if (showLoadMore) {
    return (
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
        <div className="card-group">
          {listings &&
            listings.map((listing) => (
              <div key={listing.listingId} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                {!listing.nft.nfts ? (
                  <ListingCard
                    listing={listing}
                    imgClass="marketplace"
                    watermark={
                      isMetapixelsCollection(listing.nftAddress) ? 'https://cdn-prod.ebisusbay.com/files/collection-images/metapixels/avatar.png' : null
                    }
                  />
                ) : (
                  <ListingBundleCard
                    listing={listing}
                    imgClass="marketplace"
                    watermark={
                      isMetapixelsCollection(listing.nftAddress) ? 'https://cdn-prod.ebisusbay.com/files/collection-images/metapixels/avatar.png' : null
                    }
                  />
                )}
              </div>
            ))}
        </div>
      </InfiniteScroll>
    );
  } else {
    return (
      <div className="row">
        <div className="card-group">
          {listings &&
            listings.map((listing) => (
              <div key={listing.listingId} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                {!listing.nft.nfts? (
                  <ListingCard
                    listing={listing}
                    imgClass="marketplace"
                    watermark={
                      isMetapixelsCollection(listing.nftAddress) ? 'https://cdn-prod.ebisusbay.com/files/collection-images/metapixels/avatar.png' : null
                    }
                  />
                ) : (
                  <ListingBundleCard
                    listing={listing}
                    imgClass="marketplace"
                    watermark={
                      isMetapixelsCollection(listing.nftAddress) ? 'https://cdn-prod.ebisusbay.com/files/collection-images/metapixels/avatar.png' : null
                    }
                  />
                )}
              </div>
            ))}
        </div>
        {showLoadMore && canLoadMore && (
          <div className="col-lg-12">
            <div className="spacer-single" />
            <span onClick={loadMore} className="btn-main lead m-auto">
              Load More
            </span>
          </div>
        )}
      </div>
    );
  }
};

export default memo(ListingCollection);
