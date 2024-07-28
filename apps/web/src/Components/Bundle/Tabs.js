import {Box, Flex, Stack, Text} from "@chakra-ui/react";
import React, {useCallback, useState} from "react";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {specialImageTransform} from '@market/helpers/hacks';
import Link from "next/link";
import {shortAddress, timeSince} from "@market/helpers/utils";
import ListingItem from "@src/components-v2/feature/nft/tabs/listings/item";
import {ethers} from 'ethers';
import {getTheme} from "@src/global/theme/theme";
import {useSelector} from "react-redux";
import OffersTab from "@src/components-v2/feature/nft/tabs/offers";
import {OfferType} from "@src/core/services/api-service/types";
import {useUser} from "@src/components-v2/useUser";

const tabs = {
  properties: 'properties',
  powertraits: 'powertraits',
  history: 'history',
  offers: 'offers',
  info: 'info',
  breeding: 'breeding',
  items: 'items'
};

const Tabs = ({ nft }) => {
  const user = useUser();

  const [currentTab, setCurrentTab] = useState(tabs.properties);
  const [babyWeirdApeBreed, setBabyWeirdApeBreed] = useState(null);
  const listingHistory = useSelector((state) =>
    state.nft.history.filter((i) => i.state === 1).sort((a, b) => (a.saleTime < b.saleTime ? 1 : -1))
  );

  const handleTabChange = useCallback((tab) => {
    setCurrentTab(tab);
  }, []);

  return (
    <Flex className="de_tab" flexDir='column' textAlign='left'>
      <ul className="de_nav nft_tabs_options">
        {/* <li className={`tab ${currentTab === tabs.properties ? 'active' : ''}`}>
          <span onClick={() => handleTabChange(tabs.properties)}>Properties</span>
        </li> */}
        
        <li className={`tab ${currentTab === tabs.history ? 'active' : ''}`}>
          <span onClick={() => handleTabChange(tabs.history)}>History</span>
        </li>
        <li className={`tab ${currentTab === tabs.offers ? 'active' : ''}`}>
          <span onClick={() => handleTabChange(tabs.offers)}>Offers</span>
        </li>
        <li className={`tab ${currentTab === tabs.info ? 'active' : ''}`}>
          <span onClick={() => handleTabChange(tabs.info)}>Info</span>
        </li>
        {babyWeirdApeBreed && (
          <li className={`tab ${currentTab === tabs.breeding ? 'active' : ''}`}>
            <span onClick={() => handleTabChange(tabs.breeding)}>Breed Info</span>
          </li>
        )}
        <li className={`tab ${currentTab === tabs.items ? 'active' : ''}`}>
          <span onClick={() => handleTabChange(tabs.items)}>Items</span>
        </li>
      </ul>
      {
        nft ? (
          <div className="de_tab_content" style={{maxWidth: '600px'}}>
            {currentTab === tabs.history && (
              <div className="listing-tab tab-3 onStep fadeIn">
                {listingHistory && listingHistory.length > 0 ? (
                  <>
                    {listingHistory.map((listing, index) => (
                      <ListingItem
                        key={`sold-item-${index}`}
                        route="/account"
                        primaryTitle="Bought by"
                        user={listing.purchaser}
                        time={timeSince(listing.saleTime)}
                        price={ethers.utils.commify(listing.price)}
                        primaryText={shortAddress(listing.purchaser)}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <span>No history found for this item</span>
                  </>
                )}
              </div>
            )}

            {currentTab === tabs.offers && (
              <OffersTab
                nftAddress={nft.address}
                nftId={nft.id}
                type={OfferType.DIRECT}
              />
            )}

            {currentTab === tabs.info && (
              <div className="tab-1 onStep fadeIn">
                <div className="d-block mb-3">
                  <div className="row gx-3 gy-2">
                    <div className="d-flex justify-content-between">
                      <div>Token ID</div>
                      <div>
                        
                        {nft.id.length > 10 ? shortAddress(nft.id) : nft.id}
                          
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>Token Standard</div>
                      <div>CRC-721</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === tabs.items && (
              <Flex flexDir='column' gap='8px' maxH='340ox' overflow='scroll'>
                {nft.nfts.map((nft, i) => (
                  <Box p='16px' key={i}>
                    <Flex gap='15px'>
                      <Box w='72px'>
                        <AnyMedia
                          image={specialImageTransform(nft.address, nft.image)}
                          video={nft.video ?? nft.animation_url}
                          videoProps={{ height: 'auto', autoPlay: true }}
                          title={'title'}
                          usePlaceholder={false}
                          className="img-fluid img-rounded mb-sm-30"
                        />
                      </Box>
                      <Stack>
                        {nft.collectionName && (
                          <Link href={`/collection/${nft.address}`}>
                            <h6
                              className="mt-auto fw-normal mb-0"
                              style={{ fontSize: '12px', color: getTheme(user.theme).colors.textColor4 }}
                            >
                              {nft.name}
                            </h6>
                          </Link>
                        )}
                        <Link href={`/collection/${nft.address}/${nft.id}`}>
                          <Text fontWeight='bold'>{nft.name}</Text>
                        </Link>
                      </Stack>

                    </Flex>
                  </Box>
                ))
                }
              </Flex>
            )}
          </div>)
          :
          <></>
      }
    </Flex>
  )
}

export default Tabs;