import React, {memo, useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {MyListingsCollectionPageActions, MyNftPageActions,} from '@src/GlobalState/User';
import {Form, Spinner} from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';

import {useRouter} from 'next/router';
import {getUnfilteredListingsForAddress} from "@src/core/api";
import MakeListingDialog from "@src/Components/MakeListing";
import {useInfiniteQuery} from "@tanstack/react-query";
import {invalidState} from "@src/core/api/enums";
import ResponsiveListingsTable from "@src/components-v2/shared/responsive-table/responsive-listings-table";
import {Alert, AlertDescription, AlertIcon, AlertTitle, Text} from "@chakra-ui/react";
import {useAppSelector} from "@src/Store/hooks";
import MyNftCancelDialog from '@src/Components/components/MyNftCancelDialog';


interface UserPrivateListingsProps {
  walletAddress: string
}

const UserPrivateListings = ({ walletAddress }: UserPrivateListingsProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showInvalidOnly, setShowInvalidOnly] = useState(false);
  const [hasInvalidListings, setHasInvalidListings] = useState(false);
  const [sort, setSort] = useState({
    sortBy: 'listingTime',
    direction: 'asc'
  });

  const user = useAppSelector((state) => state.user);

  const fetcher = async ({ pageParam = 1 }) => {
    // @ts-ignore
    const listings = await getUnfilteredListingsForAddress(walletAddress, user.provider, pageParam, sort);
    if (listings.some((value: any) => !value.valid && value.invalid !== invalidState.LEGACY)) {
      setHasInvalidListings(true);
    }
    return listings
      .filter((x: any) => x.listed && x.invalid !== invalidState.LEGACY)
      .filter((x: any) => (showInvalidOnly ? !x.valid : true));
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
  } = useInfiniteQuery(['MyListingsCollection', walletAddress, sort], fetcher, {
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  })

  const loadMore = () => {
    fetchNextPage();
  };

  const handleSort = useCallback((field: string) => {
    let newSort = {
      sortBy: field,
      direction: 'desc'
    }
    if (sort.sortBy === newSort.sortBy) {
      newSort.direction = sort.direction === 'asc' ? 'desc' : 'asc'
    }
    setSort(newSort)
  }, [sort]);

  return (
    <>
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
          {status === "loading" ? (
            <div className="col-lg-12 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : status === "error" ? (
            <p>Error: {(error as any).message}</p>
          ) : (
            <ResponsiveListingsTable
              data={data}
              onUpdate={(listing) => {
                dispatch(MyListingsCollectionPageActions.showMyNftPageListDialog(listing.nft, listing))
              }}
              onCancel={(listing) => {
                dispatch(MyListingsCollectionPageActions.showMyNftPageCancelDialog(listing))
              }}
              onSort={handleSort}
            />
          )}
        </InfiniteScroll>
      </div>

      <MyNftCancelDialog/>
      {user.myNftPageListDialog?.nft && (
        <MakeListingDialog
          isOpen={!!user.myNftPageListDialog?.nft}
          nft={user.myNftPageListDialog?.nft}
          onClose={() => dispatch(MyNftPageActions.hideMyNftPageListDialog())}
          listing={user.myNftPageListDialog?.listing}
        />
      )}
    </>
  );
};

export default memo(UserPrivateListings);
