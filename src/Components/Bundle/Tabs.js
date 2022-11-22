import { Flex, Box, Stack, Text } from "@chakra-ui/react";
import React, { useState, useCallback } from "react";
import { AnyMedia } from '@src/Components/components/AnyMedia'
import { specialImageTransform } from '@src/hacks';
import Link from "next/link";
import {shortAddress} from "@src/utils";
import NFTTabOffers from '@src/Components/Offer/NFTTabOffers';

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

  const [currentTab, setCurrentTab] = useState(tabs.properties);
  const [babyWeirdApeBreed, setBabyWeirdApeBreed] = useState(null);
  const [listingHistory, setListingHistory] = useState(nft.listings)

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
            {/* {currentTab === tabs.properties && (
              <div className="tab-1 onStep fadeIn">
                {(nft.attributes && Array.isArray(nft.attributes) && nft.attributes.length > 0) ||
                  (nft.properties && Array.isArray(nft.properties) && nft.properties.length > 0) ? (
                  <div className="d-block mb-3">
                    <div className="row gx-3 gy-2">
                      {nft.attributes &&
                        Array.isArray(nft.attributes) &&
                        nft.attributes
                          .filter((a) => a.value !== 'None')
                          .map((data, i) => {
                            return (
                              <Trait
                                key={i}
                                title={data.trait_type}
                                value={data.value}
                                percent={data.percent}
                                occurrence={data.occurrence}
                                type={data.display_type}
                                collectionAddress={address}
                                collectionSlug={collection.slug}
                                queryKey="traits"
                              />
                            );
                          })}
                      {nft.properties &&
                        Array.isArray(nft.properties) &&
                        nft.properties.map((data, i) => {
                          return (
                            <Trait
                              key={i}
                              title={data.trait_type}
                              value={data.value}
                              percent={data.percent}
                              occurrence={data.occurrence}
                              type={data.display_type}
                              collectionAddress={address}
                              collectionSlug={collection.slug}
                              queryKey="traits"
                            />
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  <>
                    <span>No traits found for this item</span>
                  </>
                )}
              </div>
            )} */}
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
                        time={timeSince(listing.saleTime + '000')}
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

            {currentTab === tabs.offers && <NFTTabOffers nftAddress={nft.address} nftId={nft.id} />}

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
                  <Link href={`/collection/${nft.address}/${nft.id}`}>
                  <Box p='16px' key={i} cursor='pointer' >
                    <Flex gap='20px'>
                      <Box w='72px'>
                        <AnyMedia
                          image={specialImageTransform('0xe94ac1647bF99FE299B2aDcF53FcF57153C23Fe1', nft.image)}
                          video={nft.video ?? nft.animation_url}
                          videoProps={{ height: 'auto', autoPlay: true }}
                          title={'title'}
                          usePlaceholder={false}
                          className="img-fluid img-rounded mb-sm-30"
                        />
                      </Box>
                      <Stack>
                        <Text>Address: {nft.address}</Text>
                        <Text>Id: {nft.id}</Text>
                      </Stack>

                    </Flex>
                  </Box>
                  </Link>
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