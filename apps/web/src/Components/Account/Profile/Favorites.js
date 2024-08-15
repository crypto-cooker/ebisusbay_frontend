import {getUserFavorites} from "@src/core/cms/next/favorites";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {useQuery} from "@tanstack/react-query";
import {isNftBlacklisted} from "@market/helpers/utils";
import {NftCard} from "@src/components-v2/shared/nft-card";
import {Center, Spinner} from "@chakra-ui/react";

export default function Favorites({ address }) {

  const { error, data:nfts, status } = useQuery({
    queryKey: ['Favorites', address],
    queryFn: () => getUserFavorites(address)
  })

  return status === 'pending' ? (
    <Center>
      <Spinner />
    </Center>
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
                  nft={nft}
                  imgClass="collection"
                  canBuy={!isNftBlacklisted(nft.address, nft.id) && nft.collection.listable}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}