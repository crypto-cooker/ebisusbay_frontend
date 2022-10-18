import React, { memo } from 'react';
import { Spinner } from 'react-bootstrap';
import SoldNftCard from './SoldNftCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { caseInsensitiveCompare } from '@src/utils';
import {appConfig} from "@src/Config";
import {getNftSalesForAddress} from "@src/core/api";
import {useInfiniteQuery} from "@tanstack/react-query";

const knownContracts = appConfig('collections');

const MySoldNftCollection = ({ walletAddress = null }) => {

  const fetcher = async ({ pageParam = 1 }) => {
    return await getNftSalesForAddress(walletAddress, pageParam);
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
        <div className="row">
          {data && data.pages.map((pages, index) => (
            <React.Fragment key={index}>
              {pages.map((listing, index) => {
                if (!listing.nft) {
                  const contract = knownContracts.find((c) => caseInsensitiveCompare(c.address, listing.nftAddress));
                  listing = {
                    ...listing,
                    ...{
                      nft: {
                        missing: true,
                        name: `${contract?.name ?? listing.nftAddress} #${listing.nftId}`,
                      },
                    },
                  };
                }
                return <SoldNftCard nft={listing} index={index}  />;
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </InfiniteScroll>
  );
};

export default memo(MySoldNftCollection);
