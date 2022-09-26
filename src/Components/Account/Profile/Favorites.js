import {getUserFavorites} from "@src/core/cms/next/favorites";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Spinner} from "react-bootstrap";
import NftCard from "@src/Components/components/NftCard";
import {useQuery} from "@tanstack/react-query";

export default function Favorites({ address }) {

  const { isLoading, error, data:nfts, status } = useQuery(['Favorites', address], () =>
    getUserFavorites(address)
  )

  return status === "loading" ? (
    <div className="row mt-4">
      <div className="col-lg-12 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </div>
  ) : status === "error" ? (
    <p className="text-center">Error: {error.message}</p>
  ) : nfts.length < 1 ? (
    <p className="text-center">Nothing to see here...</p>
  ) : (
    <div className="d-flex">
      <div className="flex-fill">
        <InfiniteScroll
          dataLength={nfts.length}
          hasMore={false}
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
          <div className="card-group row g-3">
            {nfts.map((nft) => (
              <div
                className={`d-item col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4`}
                key={`${nft.address}-${nft.id}`}
              >
                <NftCard
                  listing={nft}
                  imgClass="collection"
                  collection={nft.collection}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}