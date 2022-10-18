import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  MyListingsCollectionPageActions, MyNftPageActions,
} from '@src/GlobalState/User';
import { Form, Spinner } from 'react-bootstrap';
import MyListingCard from './MyListingCard';
import MyNftCancelDialog from './MyNftCancelDialog';
import InvalidListingsPopup from './InvalidListingsPopup';

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useRouter } from 'next/router';
import {getUnfilteredListingsForAddress} from "@src/core/api";
import MakeListingDialog from "@src/Components/MakeListing";
import {useInfiniteQuery} from "@tanstack/react-query";


const MyListingsCollection = ({ walletAddress = null }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showInvalidOnly, setShowInvalidOnly] = useState(false);
  const [hasInvalidListings, setHasInvalidListings] = useState(false);

  const user = useSelector((state) => state.user);

  const fetcher = async ({ pageParam = 1 }) => {
    const listings = await getUnfilteredListingsForAddress(walletAddress, user.provider, pageParam);
    if (listings.some((value) => !value.valid)) {
      setHasInvalidListings(true);
    }
    return listings
      .filter((x) => x.listed)
      .filter((x) => (showInvalidOnly ? !x.valid : true));
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery(['MySoldNftCollection', walletAddress], fetcher, {
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  })

  const loadMore = () => {
    fetchNextPage();
  };

  return (
    <>
      {hasInvalidListings && (
        <div className="alert alert-danger" role="alert">
          <span>
            {' '}
            <FontAwesomeIcon color="var(--bs-danger)" icon={faExclamationCircle} size={'2x'} />{' '}
          </span>
          <p>
            <strong>Some of your current listings are invalid.</strong> This can happen when a listed NFT was not
            delisted from the marketplace before being staked, transferred, or approval being revoked. This can cause
            NFTs to be sold significantly under floor price once the NFT returns to your wallet.
          </p>
          <h5>Option 1 (Recommended):</h5>
          <p className="mb-4">
            Cancel your listings below <strong>before</strong> those NFTs are returned to your wallet or approval
            granted.
          </p>
          <h5>Option 2 (AT YOUR OWN RISK, lower gas fees):</h5>
          <p>
            Either cancel or update the price of the NFT as soon as it is in your wallet. This is cheaper but must be
            done as soon as possible to avoid users from buying your listing before it can be cancelled or updated.
          </p>
          <p>
            <strong>
              Please note: No refunds will be given for sales at older prices. It is your own responsibility to cancel
              listings for NFTs that you stake, transfer or revoke approval.
            </strong>
          </p>
        </div>
      )}

      <div className="row pt-3">
        <div className="col-12 col-sm-6 col-md-4 m-0 text-nowrap d-flex align-items-center">
          <div className="items_filter">
            <Form.Switch
              className=""
              label={'Only invalid'}
              checked={showInvalidOnly}
              onChange={() => setShowInvalidOnly(!showInvalidOnly)}
            />
          </div>
        </div>
      </div>
      <div className="row gap-3">
        <InfiniteScroll
          dataLength={data?.pages ? data.pages.flat().length : 0}
          next={loadMore}
          hasMore={hasNextPage}
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
          {status === "loading" ? (
            <div className="col-lg-12 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : status === "error" ? (
            <p>Error: {error.message}</p>
          ) : (
            <div className="card-group">
              {data && data.pages.map((pages, index) => (
                <React.Fragment key={index}>
                  {pages.map((listing, index) => (
                    <div key={index} className="d-item col-lg-6 col-md-12 mb-4 px-2">
                      <MyListingCard
                        nft={listing}
                        key={index}
                        canCancel={listing.state === 0}
                        canUpdate={listing.state === 0 && listing.isInWallet}
                        onUpdateButtonPressed={() =>{
                          dispatch(MyListingsCollectionPageActions.showMyNftPageListDialog(listing.nft, listing))
                        }}
                        onCancelButtonPressed={() =>
                          dispatch(MyListingsCollectionPageActions.showMyNftPageCancelDialog(listing))
                        }
                        newTab={true}
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </InfiniteScroll>
      </div>

      <MyNftCancelDialog/>
      <InvalidListingsPopup navigateTo={false}/>
      <MakeListingDialog
        isOpen={!!user.myNftPageListDialog?.nft}
        nft={user.myNftPageListDialog?.nft}
        onClose={() => dispatch(MyNftPageActions.hideMyNftPageListDialog())}
        listing={user.myNftPageListDialog?.listing}
      />
    </>
  );
};

export default memo(MyListingsCollection);
