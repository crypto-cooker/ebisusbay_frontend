import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getNftsForAddress2} from "@src/core/api";
import InfiniteScroll from "react-infinite-scroll-component";
import {Form, Spinner} from "react-bootstrap";
import MyNftCard from "@src/Components/components/MyNftCard";
import {caseInsensitiveCompare, findCollectionByAddress} from "@src/utils";
import NftCard from "@src/Components/components/NftCard";
import {appConfig} from "@src/Config";
import {MyNftPageActions} from "@src/GlobalState/User";
import MyNftTransferDialog from "@src/Components/components/MyNftTransferDialog";
import MyNftCancelDialog from "@src/Components/components/MyNftCancelDialog";
import {useRouter} from "next/router";
import useSWRInfinite from "swr/infinite";
import {getWalletOverview} from "@src/core/api/endpoints/walletoverview";
import TopFilterBar from "@src/Components/components/TopFilterBar";

const knownContracts = appConfig('collections');


const fetcher = async (...args) => {
  const [key, address, provider, page, collection] = args;
  return await getNftsForAddress2(address, provider, page, collection !== '' ? collection : undefined);
};

export default function Inventory({ address }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user);

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite((index) => {
    return ['Inventory', address, user.provider, index + 1, collectionFilter?.value ?? '']
  }, fetcher);

  const items = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 50);
  const isRefreshing = isValidating && data && data.length === size;

  const [collections, setCollections] = useState([]);
  const [collectionFilter, setCollectionFilter] = useState({label: 'All', value: ''});

  const onFilterChange = (filterOption) => {
    setCollectionFilter(filterOption);
  };

  useEffect(() => {
    setSize(1);
  }, [collectionFilter])

  const loadMore = () => {
    setSize(size + 1);
  };

  useEffect(() => {
    async function func() {
      const result = await getWalletOverview(address);
      setCollections(result.data
        .map((c) => {
          const name = c.name ?? findCollectionByAddress(c.nftAddress, c.nftId)?.name;
          return {label:name, value:c.nftAddress}
        })
        .sort((a, b) => a.name > b.name ? 1 : -1)
      );
    }

    func();

  }, []);

  return (
    <>
      <div className="row">
        <div className="col">
          <TopFilterBar
            className="col-6"
            showFilter={true}
            showSort={false}
            showSearch={false}
            filterOptions={[{label: 'All', value: ''}, ...collections]}
            filterPlaceHolder="Filter Collection..."
            onFilterChange={onFilterChange}
            filterValue={collectionFilter}
          />
        </div>
      </div>
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