import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getNftsForAddress2} from "@src/core/api";
import InfiniteScroll from "react-infinite-scroll-component";
import {Spinner} from "react-bootstrap";
import MyNftCard from "@src/Components/components/MyNftCard";
import {caseInsensitiveCompare, findCollectionByAddress} from "@src/utils";
import NftCard from "@src/Components/components/NftCard";
import {appConfig} from "@src/Config";
import {MyNftPageActions} from "@src/GlobalState/User";
import MyNftTransferDialog from "@src/Components/components/MyNftTransferDialog";
import MyNftCancelDialog from "@src/Components/components/MyNftCancelDialog";
import {useRouter} from "next/router";
import {getWalletOverview} from "@src/core/api/endpoints/walletoverview";
import TopFilterBar from "@src/Components/components/TopFilterBar";
import {QueryClientProvider, useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import MakeListingDialog from "@src/Components/MakeListing";

const knownContracts = appConfig('collections');

export default function Inventory({ address }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useSelector((state) => state.user);

  const [collections, setCollections] = useState([]);
  const [collectionFilter, setCollectionFilter] = useState(null);

  const onFilterChange = (filterOption) => {
    setCollectionFilter(filterOption);
  };

  const fetcher = async ({ pageParam = 1 }) => {
    return await getNftsForAddress2(address, user.provider, pageParam, collectionFilter?.value);
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(['Inventory', address, collectionFilter], fetcher, {
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
    },
  })

  const loadMore = () => {
    fetchNextPage();
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

  const historyContent = useMemo(() => {
    return status === "loading" ? (
      <div className="col-lg-12 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : status === "error" ? (
      <p>Error: {error.message}</p>
    ) : (
      <>
        <div className="card-group">

          {data.pages.map((items, index) => (
            <React.Fragment key={index}>
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
                        }}
                        onUpdateButtonPressed={() => {
                          dispatch(MyNftPageActions.showMyNftPageListDialog(nft))
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
            </React.Fragment>
          ))}
        </div>
      </>
    );
  }, [data, error, status]);

  return (
    <QueryClientProvider client={queryClient}>
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
          {historyContent}
        </InfiniteScroll>
        <MyNftTransferDialog />
        <MyNftCancelDialog />
        {user.myNftPageListDialog?.nft && (
          <MakeListingDialog
            isOpen={!!user.myNftPageListDialog?.nft}
            nft={user.myNftPageListDialog?.nft}
            onClose={() => dispatch(MyNftPageActions.hideMyNftPageListDialog())}
            listing={user.myNftPageListDialog?.listing}
          />
        )}
      </div>
    </QueryClientProvider>
  )
}