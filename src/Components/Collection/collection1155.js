import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {faBullhorn, faCheck, faCircle} from '@fortawesome/free-solid-svg-icons';
import Blockies from 'react-blockies';

import Footer from '../components/Footer';
import CollectionListingsGroup from '../components/CollectionListingsGroup';
import LayeredIcon from '../components/LayeredIcon';
import {init, fetchListings, getStats, updateTab} from '@src/GlobalState/collectionSlice';
import {isCrosmocraftsPartsCollection, isEbVipCollection} from '@src/utils';
import SocialsBar from './SocialsBar';
import { CollectionSortOption } from '../Models/collection-sort-option.model';
import CollectionInfoBar from '../components/CollectionInfoBar';
import stakingPlatforms from '../../core/data/staking-platforms.json';
import SalesCollection from '../components/SalesCollection';
import CollectionNftsGroup from '../components/CollectionNftsGroup';
import {ImageKitService} from "@src/helpers/image";
import {CollectionFilters} from "../Models/collection-filters.model";
import {Spinner} from "react-bootstrap";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {pushQueryString} from "@src/helpers/query";
import {useRouter} from "next/router";
import {Box, Flex, Heading, Link, Text} from "@chakra-ui/react";
import MintingButton from "@src/Components/Collection/MintingButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NextLink from "next/link";


const tabs = {
  items: 'items',
  activity: 'activity'
};

const Collection1155 = ({ collection, tokenId = null, query, activeDrop = null }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const collectionStats = useSelector((state) => state.collection.stats);
  const initialLoadComplete = useSelector((state) => state.collection.initialLoadComplete);

  const listings = useSelector((state) => state.collection.listings);
  const hasRank = useSelector((state) => state.collection.hasRank);
  const canLoadMore = useSelector((state) => {
    return (
      state.collection.listings.length > 0 &&
      (state.collection.query.page === 0 || state.collection.query.page < state.collection.totalPages)
    );
  });
  const isUsingListingsFallback = useSelector((state) => state.collection.isUsingListingsFallback);

  const collectionName = () => {
    return collection.name;
  };

  const [openMenu, setOpenMenu] = React.useState(0);
  const handleBtnClick = (key) => (element) => {
    setOpenMenu(key);

    pushQueryString(router, {
      slug: router.query.slug,
      tab: key
    });
    dispatch(updateTab(key));
  };

  const loadMore = () => {
    dispatch(fetchListings());
  };

  useEffect(() => {
    const sortOption = CollectionSortOption.default();
    sortOption.key = 'price';
    sortOption.direction = 'asc';
    sortOption.label = 'By Price';

    const filterOption = CollectionFilters.default();
    filterOption.address = collection.address;
    if (tokenId != null) {
      filterOption.token = tokenId;
    }

    dispatch(init(filterOption));
    dispatch(fetchListings());
    // eslint-disable-next-line
  }, [dispatch, collection]);

  useEffect(() => {
    setOpenMenu(query.tab ?? tabs.items);
    // eslint-disable-next-line
  }, [dispatch, collection.address]);

  useEffect(() => {
    async function asyncFunc() {
      if (tokenId != null) {
        dispatch(getStats(collection, tokenId));
      } else {
        dispatch(getStats(collection));
      }
    }
    asyncFunc();
    // eslint-disable-next-line
  }, [dispatch, collection]);

  const handleMintingButtonClick = () => {
    if (activeDrop.redirect) {
      window.open(activeDrop.redirect, '_blank');
    } else {
      router.push(`/drops/${activeDrop.slug}`)
    }
  }

  return (
    <div>
      {isEbVipCollection(collection.address, tokenId) && (
        <Box className="promo">
          <Flex justify="center" px={3}>
            <FontAwesomeIcon icon={faBullhorn} className="my-auto"/>
            <Text ms={2}>
              Ebisu's Bay VIP Founding Member will be migrating to the new Ryoshi Tales VIP collection on Friday Nov 11th.{' '}
              <Box align="center">
                <Link href="https://blog.ebisusbay.com/ebisus-bay-vip-split-506b05c619c7" isExternal fontWeight="bold">
                  Learn more
                </Link>
                <span className="mx-2">|</span>
                <NextLink href="/drops/ryoshi-tales-vip" >
                  <Link fontWeight="bold">View drop</Link>
                </NextLink>
              </Box>
            </Text>
          </Flex>
        </Box>
      )}
      <section
        id="profile_banner"
        className="jumbotron breadcumb no-bg"
        style={{
          backgroundImage: `url(${ImageKitService.buildBannerUrl(collection.metadata?.banner ?? '')})`,
          backgroundPosition: '50% 50%',
        }}
      >
        <div className="mainbreadcumb"></div>
      </section>

      <section className="gl-legacy container d_coll no-top no-bottom">
        <div className="row">
          <div className="col-md-12">
            <div className="d_profile">
              <div className="profile_avatar">
                <div className="d_profile_img">
                  {collection.metadata?.avatar ? (
                    <img src={collection.metadata.avatar} alt={collectionName()} />
                  ) : (
                    <Blockies seed={collection.address.toLowerCase()} size={15} scale={10} />
                  )}
                  {collection.verification?.verified && (
                    <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass="eb-avatar_badge" />
                  )}
                </div>

                <div className="profile_name">
                  <Flex justify="center" align="center" mb={4}>
                    <Heading as="h4" size="md" my="auto">
                      {collection.name}
                    </Heading>
                    {activeDrop && (
                      <MintingButton onClick={handleMintingButtonClick} />
                    )}
                  </Flex>
                  <CollectionVerificationRow
                    doxx={collection.verification?.doxx}
                    kyc={collection.verification?.kyc}
                    escrow={collection.verification?.escrow}
                    creativeCommons={collection.verification?.creativeCommons}
                    center={true}
                  />
                  {collection.metadata.description && <p>{collection.metadata.description}</p>}
                  <span className="fs-4">
                  <SocialsBar
                    address={collection.address}
                    socials={collection.metadata}
                  />
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 mb-4">
        {collectionStats && (
          <div className="row">
            {hasRank && collection.metadata?.rarity === 'rarity_sniper' && (
              <div className="row">
                <div className="col-lg-8 col-sm-10 mx-auto text-center mb-3" style={{ fontSize: '0.8em' }}>
                  Rarity scores and ranks provided by{' '}
                  <a href="https://raritysniper.com/" target="_blank" rel="noreferrer">
                    <span className="color">Rarity Sniper</span>
                  </a>
                </div>
              </div>
            )}
            <div className="d-item col-md-12 mx-auto">
              <CollectionInfoBar collectionStats={collectionStats} />
            </div>
            {isCrosmocraftsPartsCollection(collection.address) && (
              <div className="row mb-2">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '0.8em' }}>
                  Collect Crosmocraft parts to{' '}
                  <a href="/build-ship">
                    <span className="color">build your Crosmocraft!</span>
                  </a>
                </div>
              </div>
            )}
            {collection.metadata?.staking && (
              <div className="row">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '0.8em' }}>
                  NFTs from this collection can be staked at{' '}
                  <a href={stakingPlatforms[collection.metadata.staking].url} target="_blank" rel="noreferrer">
                    <span className="color">{stakingPlatforms[collection.metadata.staking].name}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="de_tab">
          <ul className="de_nav mb-2">
            <li id="Mainbtn0" className={`tab ${openMenu === tabs.items ? 'active' : ''}`}>
              <span onClick={handleBtnClick(tabs.items)}>Items</span>
            </li>
            <li id="Mainbtn1" className={`tab ${openMenu === tabs.activity ? 'active' : ''}`}>
              <span onClick={handleBtnClick(tabs.activity)}>Activity</span>
            </li>
          </ul>

          <div className="de_tab_content">
            {openMenu === tabs.items && (
              <div className="tab-1 onStep fadeIn">
                <div className="row">
                  <div className="col-md-12">
                    {isUsingListingsFallback ? (
                      <CollectionListingsGroup listings={listings} canLoadMore={canLoadMore} loadMore={loadMore} />
                    ) : (
                      <CollectionNftsGroup
                        listings={listings}
                        canLoadMore={canLoadMore}
                        loadMore={loadMore}
                        address={collection.address}
                        collection={collection}
                      />
                    )}
                    {!initialLoadComplete && (
                      <div className="row mt-5">
                        <div className="col-lg-12 text-center">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {openMenu === tabs.activity && (
              <div className="tab-2 onStep fadeIn">
                <SalesCollection cacheName="collection" collectionId={collection.address} tokenId={tokenId} />
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Collection1155;
