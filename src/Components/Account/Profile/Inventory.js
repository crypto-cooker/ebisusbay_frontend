import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getNftsForAddress2} from "@src/core/api";
import InfiniteScroll from "react-infinite-scroll-component";
import {Collapse, Spinner} from "react-bootstrap";
import MyNftCard from "@src/Components/components/MyNftCard";
import {caseInsensitiveCompare, findCollectionByAddress} from "@src/utils";
import NftCard from "@src/Components/components/NftCard";
import {appConfig} from "@src/Config";
import {MyNftPageActions} from "@src/GlobalState/User";
import MyNftTransferDialog from "@src/Components/components/MyNftTransferDialog";
import MyNftCancelDialog from "@src/Components/components/MyNftCancelDialog";
import {getWalletOverview} from "@src/core/api/endpoints/walletoverview";
import {useInfiniteQuery} from "@tanstack/react-query";
import MakeListingDialog from "@src/Components/MakeListing";
import {CollectionFilter} from "@src/Components/Account/Profile/Inventory/CollectionFilter";
import {MobileFilters} from "@src/Components/Account/Profile/Inventory/MobileFilters";
import Button from "@src/Components/components/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter} from "@fortawesome/free-solid-svg-icons";
import useBreakpoint from "use-breakpoint";

const knownContracts = appConfig('collections');

const BREAKPOINTS = { xs: 0, m: 768, l: 1199, xl: 1200 };
export default function Inventory({ address }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [collections, setCollections] = useState([]);
  const [collectionFilter, setCollectionFilter] = useState([]);

  const onFilterChange = (filterOption) => {
    console.log('setfilter', filterOption)
    setCollectionFilter(filterOption ?? []);
  };

  const fetcher = async ({ pageParam = 1 }) => {
    return await getNftsForAddress2(address, user.provider, pageParam, collectionFilter);
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
        .reduce((arr, item) => {
          const coll = findCollectionByAddress(item.nftAddress, item.nftId);
          if (!coll) return arr;
          coll.balance = item.balance;
          arr.push(coll);
          return arr;
        }, [])
        .sort((a, b) => a.name > b.name ? 1 : -1)
      );
    }

    func();

  }, [address]);

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
        <div className="card-group row g-3">

          {data.pages.map((items, index) => (
            <React.Fragment key={index}>
              {items.map((nft, index) => {
                const collection = knownContracts.find((c) => caseInsensitiveCompare(c.address, nft.address));
                return (
                  <div
                    className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4"
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

  const [filtersVisible, setFiltersVisible] = useState(true);
  const [useMobileMenu, setUseMobileMenu] = useState(false);
  const { breakpoint, maxWidth, minWidth } = useBreakpoint(BREAKPOINTS);
  const [hasManuallyToggledFilters, setHasManuallyToggledFilters] = useState(false);

  useEffect(() => {
    const isMobileSize = minWidth < BREAKPOINTS.m;
    setUseMobileMenu(isMobileSize);
    if (!hasManuallyToggledFilters) {
      setFiltersVisible(!isMobileSize);
    }
  }, [breakpoint]);

  const toggleFilterVisibility = () => {
    setHasManuallyToggledFilters(true);
    setFiltersVisible(!filtersVisible)
  };

  return (
    <>
      <div className="d-flex">
        <Collapse in={filtersVisible && !useMobileMenu} dimension="width">
          <div className="m-0 p-0">
            <div className="me-4 px-2" style={{width: 250}}>
              <CollectionFilter
                collections={collections}
                currentFilter={collectionFilter}
                onFilter={onFilterChange}
              />
            </div>
          </div>
        </Collapse>
        <div className="flex-fill">
          <div className="d-flex mb-2">
            <div>
              <Button
                type="legacy-outlined"
                onClick={toggleFilterVisibility}
              >
                <FontAwesomeIcon icon={filtersVisible ? faAngleLeft : faFilter} />
              </Button>
            </div>
          </div>
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
        </div>
      </div>
      <MobileFilters
        show={useMobileMenu && filtersVisible}
        collections={collections}
        currentFilter={collectionFilter}
        onFilter={onFilterChange}
        onHide={() => setFiltersVisible(false)}
      />
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
      {useMobileMenu && (
        <div className="d-flex fixed-bottom mx-2 my-2">
          <div className="mx-auto">
            <Button type="legacy" style={{height: '100%'}} onClick={() => setFiltersVisible(true)}>
              <FontAwesomeIcon icon={faFilter} />
              <span className="ms-2">Filters ({collectionFilter.length})</span>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}