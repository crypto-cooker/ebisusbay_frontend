import React, {memo, useEffect} from 'react';
import {useSelector} from 'react-redux';
// import InfiniteScroll from 'react-infinite-scroll-component';
import AuctionCard from './AuctionCard';
import {fetchListings, init} from '@market/state/redux/slices/auctionsSlice';
import {auctionState} from '@src/core/api/enums';
import {ciEquals} from "@market/helpers/utils";
import {Center, Spinner} from "@chakra-ui/react";
import {useAppDispatch} from "@market/state/redux/store/hooks";
// import ListingCard from './ListingCard';
// import Clock from './Clock';
// import auction from '../pages/auction';
// import { auctionState } from '../../core/api/enums';

const testAuctions = [
  '0x0733025a8c1b52cc7d606dd0aa87a4b65f1305f4e51a7844855a001ffef0be20-0',
  '0xf34f5ba60241d674568d5c9b553071a20e138e057058531f72aca049421c1d58-0'
];

const degenAddress = '0xA19bFcE9BaF34b92923b71D487db9D0D051a88F8';

const AuctionCollection = ({ showLoadMore = true, collectionId = null, sellerId = null, cacheName = null }) => {
  const dispatch = useAppDispatch();
  const activeAuctions = useSelector((state) =>
    state.auctions.auctions.filter((a) =>
      typeof a.nft != 'undefined' &&
      [auctionState.ACTIVE, auctionState.NOT_STARTED].includes(a.state) &&
      ciEquals(a.nftAddress, degenAddress) &&
      !testAuctions.includes(a.id)
    )
  );
  const completedAuctions = useSelector((state) =>
    state.auctions.auctions.filter((a) =>
      typeof a.nft != 'undefined' &&
      [auctionState.SOLD, auctionState.CANCELLED].includes(a.state) &&
      ciEquals(a.nftAddress, degenAddress) &&
      !testAuctions.includes(a.id)
    )
      .sort((a, b) => a.endAt < b.endAt ? 1 : -1)
  );
  const isLoading = useSelector((state) => state.auctions.loading);

  // const canLoadMore = useSelector((state) => {
  //   return state.marketplace.curPage === 0 || state.marketplace.curPage < state.marketplace.totalPages;
  // });

  const marketplace = useSelector((state) => {
    return state.marketplace;
  });

  useEffect(() => {
    let sort = {
      type: 'listingId',
      direction: 'desc',
    };

    let filter = {
      type: null,
      address: null,
    };

    if (collectionId) {
      filter.type = 'collection';
      filter.address = collectionId;
    } else if (sellerId) {
      filter.type = 'seller';
      filter.address = sellerId;
    } else {
      //  if cacheName is supplied filter and sort values remain same after changing pages.
    }
    dispatch(init(sort, filter));
    dispatch(fetchListings());
    // eslint-disable-next-line
  }, [dispatch]);

  // const loadMore = () => {
  //   dispatch(fetchListings());
  // };

  if (showLoadMore) {
    return (
      <>
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <div className="col-lg-12">
              <div className="text-center">
                <h2>Active Auctions</h2>
              </div>
            </div>
            <div className="col-lg-12 pt-3">
              {activeAuctions?.length > 0 ? (
                <div className="card-group">
                  {activeAuctions &&
                    activeAuctions.map((listing, index) => (
                      <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                        <AuctionCard listing={listing} imgClass="marketplace" />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center">No active auctions</div>
              )}
            </div>

            <div className="col-lg-12 mt-4">
              <div className="text-center">
                <h2>Completed Auctions</h2>
              </div>
            </div>
            <div className="col-lg-12 pt-3">
              {completedAuctions?.length > 0 ? (
                <div className="card-group">
                  {completedAuctions &&
                  completedAuctions.map((listing, index) => (
                    <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                      <AuctionCard listing={listing} imgClass="marketplace" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">No completed auctions</div>
              )}
            </div>
          </>
        )}
      </>
    );
  } else {
    return (
      <div className="row">
        {activeAuctions?.length > 0 ? (
          <div className="card-group">
            {activeAuctions &&
              activeAuctions.map((listing, index) => (
                <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                  <AuctionCard listing={listing} imgClass="marketplace" />
                </div>
              ))}
          </div>
        ) : (
          <span>No active auctions</span>
        )}
      </div>
    );
  }
};

export default memo(AuctionCollection);
