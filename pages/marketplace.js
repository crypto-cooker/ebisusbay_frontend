import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ListingCollection from '../src/Components/components/ListingCollection';
import Footer from '../src/Components/components/Footer';
import TopFilterBar from '../src/Components/components/TopFilterBar';
import { sortOptions } from '@src/Components/components/constants/sort-options';
import SalesCollection from '../src/Components/components/SalesCollection';
import { getMarketData, searchListings, sortListings, filterListingsByVerification } from '@src/GlobalState/marketplaceSlice';
import { debounce, siPrefixedNumber } from '@src/utils';
import { SortOption } from '@src/Components/Models/sort-option.model';
import PageHead from "../src/Components/Head/PageHead";
import {Heading} from "@chakra-ui/react";

const Marketplace = () => {
  const cacheName = 'marketplace';

  const dispatch = useDispatch();

  const marketplace = useSelector((state) => {
    return state.marketplace;
  });

  const marketData = useSelector((state) => {
    return state.marketplace.marketData;
  });

  const [openMenu, setOpenMenu] = React.useState(0);
  const handleBtnClick = (index) => (element) => {
    var elements = document.querySelectorAll('.tab');
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('active');
    }
    element.target.parentElement.classList.add('active');

    setOpenMenu(index);
  };

  useEffect(() => {
    dispatch(getMarketData());
    // eslint-disable-next-line
  }, []);

  const selectDefaultSearchValue = marketplace.query.filter.search ?? '';
  const selectDefaultSortValue = marketplace.query.sort ?? SortOption.default();
  const selectSortOptions = useSelector((state) => {
    if (state.marketplace.hasRank) {
      return sortOptions;
    }

    return sortOptions.filter((s) => s.key !== 'rank');
  });

  const [onlyVerified, setOnlyVerified] = useState(false)

  useEffect(() => {
    dispatch(filterListingsByVerification(false, onlyVerified ? 1 : null));
  }, [onlyVerified])

  const onSortChange = useCallback(
    (sortOption) => {
      dispatch(sortListings(sortOption, cacheName));
    },
    [dispatch]
  );

  const onSearch = debounce((event) => {
    const { value } = event.target;
    dispatch(searchListings(value, cacheName));
  }, 300);

  return (
    <div>
      <PageHead
        title="Marketplace"
        description="View the hottest NFTs for sale on Ebisu's Bay Marketplace"
        url="/marketplace"
      />
      <section className="jumbotron breadcumb no-bg tint">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <Heading as="h1" size="2xl" className="text-center">Marketplace</Heading>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gl-legacy container">
        <div className="row">
          {marketData && (
            <div className="d-item col-lg-6 col-sm-10 mb-4 mx-auto">
              <div className="nft_attr">
                <div className="row">
                  <div className="col-4">
                    <h5>Volume</h5>
                    <h4>{siPrefixedNumber(Number(marketData.totalVolume).toFixed(0))} CRO</h4>
                  </div>
                  <div className="col-4">
                    <h5>Sales</h5>
                    <h4>{siPrefixedNumber(Number(marketData.totalSales).toFixed(0))}</h4>
                  </div>
                  <div className="col-4">
                    <h5>Active</h5>
                    <h4>{siPrefixedNumber(marketData.totalActive)}</h4>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="de_tab">
          <ul className="de_nav mb-2">
            <li id="Mainbtn0" className="tab active">
              <span onClick={handleBtnClick(0)}>Listings</span>
            </li>
            <li id="Mainbtn1" className="tab">
              <span onClick={handleBtnClick(1)}>Activity</span>
            </li>
          </ul>

          <div className="de_tab_content">
            {openMenu === 0 && (
              <div className="tab-1 onStep fadeIn">
                <div className="row">
                  <div className="col-lg-12">
                    <TopFilterBar
                      showSort={true}
                      showSwitch={true}
                      sortOptions={[SortOption.default(), ...selectSortOptions]}
                      defaultSortValue={selectDefaultSortValue}
                      defaultSearchValue={selectDefaultSearchValue}
                      sortPlaceHolder="Sort Listings..."
                      onSortChange={onSortChange}
                      onSearch={onSearch}
                      onlyVerified={onlyVerified}
                      setOnlyVerified={setOnlyVerified}
                    />
                  </div>
                </div>
                <ListingCollection cacheName="marketplace" />
              </div>
            )}
            {openMenu === 1 && (
              <div className="tab-2 onStep fadeIn">
                <SalesCollection cacheName="marketplace" />
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Marketplace;
