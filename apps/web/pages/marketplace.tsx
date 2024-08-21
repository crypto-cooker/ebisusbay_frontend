import React, {useEffect, useState} from 'react';
import SalesCollection from '../src/Components/components/SalesCollection';
import {siPrefixedNumber} from '@market/helpers/utils';
import PageHead from "@src/components-v2/shared/layout/page-head";
import {Box, Flex, SimpleGrid, Stack} from "@chakra-ui/react";
import Listings from "@src/components-v2/feature/marketplace/tabs/listings";
import {MarketplacePageContext} from "@src/components-v2/feature/marketplace/context";
import {ListingsQueryParams} from "@src/core/services/api-service/mapi/queries/listings";
import {useRouter} from "next/router";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import {pushQueryString} from "@src/helpers/query";
import {useQuery} from "@tanstack/react-query";
import {getMarketMetadata} from "@src/core/api";
import {DefaultContainer} from "@src/components-v2/shared/containers";


const tabs = {
  listings: 'listings',
  activity: 'activity'
};

const Marketplace = () => {
  const router = useRouter();
  const { tab, ...remainingQuery }: Partial<{ tab: string }> & ListingsQueryParams = router.query;
  const [queryParams, setQueryParams] = useState(remainingQuery);

  const { data: marketData } = useQuery({
    queryKey: ['MarketData'],
    queryFn: () => getMarketMetadata(),
    refetchOnWindowFocus: false
  });

  const [openMenu, setOpenMenu] = useState(tabs.listings);

  const handleBtnClick = (key: string) => (e: any) => {
    setOpenMenu(key);

    pushQueryString(router, {
      tab: key
    });
  };

  useEffect(() => {
    if (router.query) {
      const { tab, ...remainingQuery } = router.query;
      setQueryParams(remainingQuery as any);
    }
  }, [router.query]);

  return (
    <Box>
      <PageHead
        title="Marketplace"
        description="View the hottest NFTs for sale on Ebisu's Bay Marketplace"
        url="/marketplace"
      />

      <MarketplacePageContext.Provider value={{ queryParams, setQueryParams}}>
        <PageHeader title={'Marketplace'} />
        {marketData && (
          <Flex className='nft_attr' justify='center' borderRadius={0}>
            <Box maxW='500px' w='full'>
              <SimpleGrid columns={3}>
                <Stack direction={{base: 'column', sm: 'row'}} spacing={{base: 0, sm: 2}} justify='center'>
                  <h5>Volume</h5>
                  <h4>{siPrefixedNumber(Number(marketData.totalVolume).toFixed(0))} CRO</h4>
                </Stack>
                <Stack direction={{base: 'column', sm: 'row'}} spacing={{base: 0, sm: 2}} justify='center'>
                  <h5>Sales</h5>
                  <h4>{siPrefixedNumber(Number(marketData.totalSales).toFixed(0))}</h4>
                </Stack>
                <Stack direction={{base: 'column', sm: 'row'}} spacing={{base: 0, sm: 2}} justify='center'>
                  <h5>Active</h5>
                  <h4>{siPrefixedNumber(marketData.totalActive)}</h4>
                </Stack>
              </SimpleGrid>
            </Box>
          </Flex>
        )}
        <Box className="de_tab" mt={4}>
          <Box mb={2}>
            <ul className="de_nav">
              <li id="Mainbtn0" className={`tab ${openMenu === tabs.listings ? 'active' : ''}`}>
                <span onClick={handleBtnClick(tabs.listings)}>Listings</span>
              </li>
              <li id="Mainbtn1" className={`tab ${openMenu === tabs.activity ? 'active' : ''}`}>
                <span onClick={handleBtnClick(tabs.activity)}>Activity</span>
              </li>
            </ul>
          </Box>

          <DefaultContainer>
            {openMenu === tabs.listings && (
              <Listings />
            )}
            {openMenu === tabs.activity && (
              <Box className="tab-2 onStep fadeIn">
                <SalesCollection cacheName="marketplace"/>
              </Box>
            )}
          </DefaultContainer>
        </Box>
      </MarketplacePageContext.Provider>
    </Box>
  );
};
export default Marketplace;
