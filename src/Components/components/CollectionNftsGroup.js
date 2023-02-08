import React, { memo, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from 'react-bootstrap';

import {isBundle, isNftBlacklisted} from "../../utils";
import NftBundleCard from "@src/Components/components/NftBundleCard";
import {NftCard} from "@src/components-v2/shared/nft-card";

const CollectionNftsGroup = ({
  showLoadMore = true,
  listings = [],
  canLoadMore = false,
  loadMore,
  collection,
}) => {
  if (showLoadMore) {
    return (
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
        endMessage={!listings.length ? (
          <div className="row mt-4">
            <div className="col-lg-12 text-center">
              <span>Nothing to see here...</span>
            </div>
          </div>
        ) : <></>}
      >
        <div className="card-group row g-3">
          {listings &&
            listings.map((listing, index) => (
              <div key={index} className="d-item col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12">
                {isBundle(listing.address) ? (
                  <NftBundleCard
                    listing={listing}
                    imgClass="collection"
                  />
                ) : (
                  <NftCard
                    nft={listing}
                    imgClass="collection"
                    canBuy={!isNftBlacklisted(listing.address, listing.id) && collection.listable}
                    is1155={collection.multiToken}
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
            listings.map((listing, index) => (
              <div key={index} className="d-item col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                <NftCard
                  nft={listing}
                  imgClass="collection"
                  canBuy={!isNftBlacklisted(listing.address, listing.id) && collection.listable}
                  is1155={collection.multiToken}
                />
              </div>
            ))}
        </div>
        {showLoadMore && canLoadMore && (
          <div className="col-lg-12">
            <div className="spacer-single"></div>
            <span onClick={loadMore} className="btn-main lead m-auto">
              Load More
            </span>
          </div>
        )}
      </div>
    );
  }
};

export default memo(CollectionNftsGroup);
