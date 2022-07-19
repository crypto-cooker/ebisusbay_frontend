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

const knownContracts = appConfig('collections');

export default function Inventory({ address }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);

  const user = useSelector((state) => state.user);

  const loadMore = () => {
    if (!loading) {
      let nextPage = page + 1;
      setPage(nextPage);
    }
  };

  useEffect(() => {
    const fetchNfts = async() => {
      setLoading(true);
      if (!items.length) setInitialized(false);
      try {
        const response = await getNftsForAddress2(address, user.provider, page);
        console.log(response);
        if (response.length > 0) {
          items.push(...response);
          setCanLoadMore(true);
        } else {
          setCanLoadMore(false);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }

    if (!loading) {
      fetchNfts();
    }
    
    // eslint-disable-next-line
  }, [page, user.provider]);

  return (
    <>
      <div className="row">
        {initialized ? (
          <InfiniteScroll
            dataLength={items.length}
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