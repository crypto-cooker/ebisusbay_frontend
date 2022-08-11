import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getNftsForAddress2} from "@src/core/api";
import InfiniteScroll from "react-infinite-scroll-component";
import {Spinner} from "react-bootstrap";
import MyNftCard from "@src/Components/components/MyNftCard";
import {caseInsensitiveCompare} from "@src/utils";
import NftCard from "@src/Components/components/NftCard";
import {appConfig} from "@src/Config";
import {MyNftPageActions} from "@src/GlobalState/User";
import MyNftTransferDialog from "@src/Components/components/MyNftTransferDialog";
import MyNftCancelDialog from "@src/Components/components/MyNftCancelDialog";
import {useRouter} from "next/router";
import useSWRInfinite from "swr/infinite";

const knownContracts = appConfig('collections');

const fetcher = async (...args) => {
  const [key, address, provider, page] = args;
  return await getNftsForAddress2(address, provider, page);
};

export default function Inventory({ address }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user);

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite((index) => {
    return ['Inventory', address, user.provider, index + 1]
  }, fetcher);

  const items = data ? [].concat(...data) : [];
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
      <div className="row">
        {!isLoadingInitialData ? (
          <InfiniteScroll
            dataLength={items.length}
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
            endMessage={
              <>
                {!items.length && (
                  <div className="row mt-4">
                    <div className="col-lg-12 text-center">
                      <span>Nothing to see here...</span>
                    </div>
                  </div>
                )}
              </>
            }
          >
            <div className="card-group">
              {items.map((nft, index) => {
                const collection = knownContracts.find((c) => caseInsensitiveCompare(c.address, nft.address));
                return (
                  <div
                    className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2"
                    key={`${nft.address}-${nft.id}-${nft.listed}-${index}`}
                  >
                    {caseInsensitiveCompare(address, user.address) ? (
                      <MyNftCard
                        nft={nft}
                        canTransfer={nft.canTransfer}
                        canSell={nft.listable && !nft.listed && nft.canSell}
                        isStaked={nft.isStaked}
                        canCancel={nft.listed && nft.listingId}
                        canUpdate={nft.listable && nft.listed}
                        onTransferButtonPressed={() => dispatch(MyNftPageActions.showMyNftPageTransferDialog(nft))}
                        onSellButtonPressed={() => {
                          dispatch(MyNftPageActions.showMyNftPageListDialog(nft))
                          router.push(`/nfts/sell?collectionId=${nft.address}&nftId=${nft.id}`)
                        }}
                        onUpdateButtonPressed={() => {
                          dispatch(MyNftPageActions.showMyNftPageListDialog(nft))
                          router.push(`/nfts/sell?collectionId=${nft.address}&nftId=${nft.id}`)
                        }}
                        onCancelButtonPressed={() => dispatch(MyNftPageActions.showMyNftPageCancelDialog(nft))}
                        newTab={true}
                      />
                    ) : collection && (
                      <NftCard
                        listing={nft}
                        imgClass="collection"
                        collection={collection}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </InfiniteScroll>
        ) : (
          <div className="col-lg-12 text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        <MyNftTransferDialog />
        <MyNftCancelDialog />
      </div>
    </>
  )
}