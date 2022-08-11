import React, { memo } from 'react';
import { Spinner } from 'react-bootstrap';
import SoldNftCard from './SoldNftCard';
import InvalidListingsPopup from './InvalidListingsPopup';
import InfiniteScroll from 'react-infinite-scroll-component';
import { caseInsensitiveCompare } from '@src/utils';
import {appConfig} from "@src/Config";
import {getNftSalesForAddress} from "@src/core/api";
import useSWRInfinite from "swr/infinite";

const knownContracts = appConfig('collections');

const fetcher = async (...args) => {
  const [key, address, page] = args;
  return await getNftSalesForAddress(address, page);
};

const MySoldNftCollection = ({ walletAddress = null }) => {
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite((index) => {
    return ['MySoldNftCollection', walletAddress, index + 1]
  }, fetcher);

  const mySoldNfts = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < 50);
  const isRefreshing = isValidating && data && data.length === size;

  const loadMore = () => {
    setSize(size + 1);
  };

  return (
    <>
      <InvalidListingsPopup navigateTo={true} />
      <InfiniteScroll
        dataLength={mySoldNfts.length}
        next={loadMore}
        hasMore={!isReachingEnd}
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
        <div className="row">
          {mySoldNfts &&
            mySoldNfts.map((nft, index) => {
              if (!nft.nft) {
                const contract = knownContracts.find((c) => caseInsensitiveCompare(c.address, nft.nftAddress));
                nft = {
                  ...nft,
                  ...{
                    nft: {
                      missing: true,
                      name: `${contract?.name ?? nft.nftAddress} #${nft.nftId}`,
                    },
                  },
                };
              }
              return <SoldNftCard nft={nft} index={index}  />;
            })}
        </div>
      </InfiniteScroll>

      {(isEmpty || (!isLoadingInitialData && !mySoldNfts.length > 0)) && (
        <div className="row mt-4">
          <div className="col-lg-12 text-center">
            <span>Nothing to see here...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(MySoldNftCollection);
