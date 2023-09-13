import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import SalesCollection from '../src/Components/components/SalesCollection';
import {getMarketData} from '../src/GlobalState/marketplaceSlice';
import {siPrefixedNumber} from '@src/utils';
import PageHead from "@src/components-v2/shared/layout/page-head";
import {Box} from "@chakra-ui/react";
import {useAppSelector} from "@src/Store/hooks";
import Listings from "@src/components-v2/feature/marketplace/tabs/listings";
import {MarketplacePageContext} from "@src/components-v2/feature/marketplace/context";
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {useRouter} from "next/router";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import {pushQueryString} from "@src/helpers/query";
import {useQuery} from "@tanstack/react-query";
import {getStats} from "@src/components-v2/feature/collection/collection-721";
import {getMarketMetadata} from "@src/core/api";


const tabs = {
  listings: 'listings',
  activity: 'activity'
};

const Marketplace = () => {
  const router = useRouter();
  const { slug, tab, ...remainingQuery }: Partial<{ slug: string; tab: string }> & ListingsQueryParams = router.query;
  const [queryParams, setQueryParams] = useState(remainingQuery);

  const dispatch = useDispatch();

  const { data: marketData } = useQuery({
    queryKey: ['MarketData'],
    queryFn: () => getMarketMetadata(),
    refetchOnWindowFocus: false
  });

  const [openMenu, setOpenMenu] = useState(tabs.listings);

  const handleBtnClick = (key: string) => (e: any) => {
    setOpenMenu(key);

    pushQueryString(router, {
      slug: router.query.slug,
      tab: key
    });
  };

  useEffect(() => {
    dispatch(getMarketData());
    // eslint-disable-next-line
  }, []);

  // const [onlyVerified, setOnlyVerified] = useState(false)
  //
  // useEffect(() => {
  //   dispatch(filterListingsByVerification(false, onlyVerified));
  // }, [onlyVerified])

  useEffect(() => {
    if (router.query) {
      setQueryParams(router.query as any);
    }
  }, [router.query]);

  return (
    <div>
      <PageHead
        title="Marketplace"
        description="View the hottest NFTs for sale on Ebisu's Bay Marketplace"
        url="/marketplace"
      />

      <MarketplacePageContext.Provider value={{ queryParams, setQueryParams}}>
        <PageHeader title={'Marketplace'} />

        <Box mt={4} className="gl-legacy container">
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
        </Box>
        <Box className="de_tab">
          <ul className="de_nav mb-2">
            <li id="Mainbtn0" className={`tab ${openMenu === tabs.listings ? 'active' : ''}`}>
              <span onClick={handleBtnClick(tabs.listings)}>Listings</span>
            </li>
            <li id="Mainbtn1" className={`tab ${openMenu === tabs.activity ? 'active' : ''}`}>
              <span onClick={handleBtnClick(tabs.activity)}>Activity</span>
            </li>
          </ul>

          <Box className="de_tab_content" px={2}>
            {openMenu === tabs.listings && (
              <Listings />
            )}
            {openMenu === tabs.activity && (
              <div className="tab-2 onStep fadeIn">
                <SalesCollection cacheName="marketplace" />
              </div>
            )}
          </Box>
        </Box>
      </MarketplacePageContext.Provider>
    </div>
  );
};
export default Marketplace;
