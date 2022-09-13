import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Blockies from 'react-blockies';
import {faCheck, faCircle} from '@fortawesome/free-solid-svg-icons';
import {Collapse, Spinner} from 'react-bootstrap';
import styled from 'styled-components';
import LayeredIcon from '../components/LayeredIcon';
import Footer from '../components/Footer';
import CollectionInfoBar from '../components/CollectionInfoBar';
import SalesCollection from '../components/SalesCollection';
import CollectionNftsGroup from '../components/CollectionNftsGroup';
import CollectionListingsGroup from '../components/CollectionListingsGroup';
import {init, fetchListings, getStats, updateTab} from '@src/GlobalState/collectionSlice';
import { isCronosVerseCollection, isCrosmocraftsCollection } from '@src/utils';
import SocialsBar from './SocialsBar';
import { CollectionSortOption } from '../Models/collection-sort-option.model';
import stakingPlatforms from '../../core/data/staking-platforms.json';
import CollectionCronosverse from '../Collection/collectionCronosverse';
import {hostedImage, ImageKitService} from "@src/helpers/image";
import {useRouter} from "next/router";
import {CollectionFilters} from "../Models/collection-filters.model";
import {pushQueryString} from "@src/helpers/query";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {CollectionTaskBar} from "@src/Components/Collection/CollectionTaskBar";
import {DesktopFilters} from "@src/Components/Collection/CollectionTaskBar/DesktopFilters";
import useBreakpoint from "use-breakpoint";
import {MobileFilters} from "@src/Components/Collection/CollectionTaskBar/MobileFilters";
import {FilterResultsBar} from "@src/Components/Collection/FilterResultsBar";
import {MobileSort} from "@src/Components/Collection/CollectionTaskBar/MobileSort";

const NegativeMargin = styled.div`
  margin-left: -1.75rem !important;
  margin-right: -1.75rem !important;
`;

const ThemedBackground = styled.div`
  background: ${({ theme }) => theme.colors.bgColor1}
`;

const tabs = {
  items: 'items',
  activity: 'activity',
  map: 'map'
};

const BREAKPOINTS = { xs: 0, m: 768, l: 1199, xl: 1200 };
const Collection721 = ({ collection,  cacheName = 'collection', query }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const collectionStats = useSelector((state) => state.collection.stats);
  const collectionLoading = useSelector((state) => state.collection.loading);
  const initialLoadComplete = useSelector((state) => state.collection.initialLoadComplete);
  // const currentFilter = useSelector((state) => state.collection.query.filter);

  const [isFirstLoaded, setIsFirstLoaded] = useState(0);

  const listings = useSelector((state) => state.collection.listings);
  const hasRank = useSelector((state) => state.collection.hasRank);
  const canLoadMore = useSelector((state) => {
    return (
      state.collection.listings.length > 0 &&
      (state.collection.query.page === 0 || state.collection.query.page < state.collection.totalPages)
    );
  });

  const isUsingListingsFallback = useSelector((state) => state.collection.isUsingListingsFallback);

  const [openMenu, setOpenMenu] = useState(0);
  const handleBtnClick = (key) => (element) => {
    setOpenMenu(key);

    if (key === tabs.items) {
      resetFilters();
    }

    pushQueryString(router, {
      slug: router.query.slug,
      tab: key
    });
    dispatch(updateTab(key));
  };

  const resetFilters = (preservedQuery) => {
    const sortOption = CollectionSortOption.default();
    sortOption.key = 'price';
    sortOption.direction = 'asc';
    sortOption.label = 'By Price';

    const filterOption = preservedQuery ? CollectionFilters.fromQuery(preservedQuery) : CollectionFilters.default();
    filterOption.address = collection.mergedAddresses
      ? [collection.address, ...collection.mergedAddresses]
      : collection.address;

    dispatch(init(filterOption, sortOption));
    dispatch(fetchListings());
  }

  // const activeFiltersCount = () => {
  //   const traits = Object.values(currentFilter.traits)
  //     .map((traitCategoryValue) => traitCategoryValue.length)
  //     .reduce((prev, curr) => prev + curr, 0);
  //   const powertraits = Object.values(currentFilter.powertraits)
  //     .map((traitCategoryValue) => traitCategoryValue.length)
  //     .reduce((prev, curr) => prev + curr, 0);
  //   let count = traits + powertraits;
  //
  //   if (currentFilter.minPrice) count++;
  //   if (currentFilter.maxPrice) count++;
  //   if (currentFilter.minRank) count++;
  //   if (currentFilter.maxRank) count++;
  //   if (currentFilter.search) count++;
  //   if (currentFilter.listed) count++;
  //
  //   return count;
  // };

  const loadMore = () => {
    dispatch(fetchListings());
  };

  useEffect(() => {
    resetFilters(query);
    setOpenMenu(query.tab ?? tabs.items);
    // eslint-disable-next-line
  }, [dispatch, collection.address]);

  useEffect(() => {
    async function asyncFunc() {
      dispatch(getStats(collection, null, collection.mergedAddresses));
    }
    asyncFunc();
    // eslint-disable-next-line
  }, [dispatch, collection]);

  useEffect(() => {
    if (collectionLoading && isFirstLoaded === 0) {
      setIsFirstLoaded(1);
    }
    if (!collectionLoading && isFirstLoaded === 1) {
      setIsFirstLoaded(2);
    }
  }, [collectionLoading, isFirstLoaded]);

  const [filtersVisible, setFiltersVisible] = useState(true);
  const [mobileSortVisible, setMobileSortVisible] = useState(false);
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
    <div>
      <section
        id="profile_banner"
        className="jumbotron breadcumb no-bg"
        style={{
          backgroundImage: `url(${ImageKitService.buildBannerUrl(collection.metadata.banner ?? '')})`,
          backgroundPosition: '50% 50%',
        }}
      >
        <div className="mainbreadcumb"></div>
      </section>

      <section className="container d_coll no-top no-bottom">
        <div className="row">
          <div className="col-md-12">
            <div className="d_profile">
              <div className="profile_avatar">
                <div className="d_profile_img">
                  {collection.metadata.avatar ? (
                    <img src={hostedImage(collection.metadata.avatar)} alt={collection.name} />
                  ) : (
                    <Blockies seed={collection.address.toLowerCase()} size={15} scale={10} />
                  )}
                  {collection.metadata.verified && (
                    <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass="eb-avatar_badge" />
                  )}
                </div>

                <div className="profile_name">
                  <h4>
                    {collection.name}
                    <div className="clearfix" />
                  </h4>
                  <CollectionVerificationRow
                    doxx={collection.verification?.doxx}
                    kyc={collection.verification?.kyc}
                    escrow={collection.verification?.escrow}
                    creativeCommons={collection.verification?.creativeCommons}
                    center={true}
                  />
                  {collection.metadata.description && <p>{collection.metadata.description}</p>}
                  <span className="fs-4">
                    <SocialsBar address={collection.address} socials={collection.metadata} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4">
        {collectionStats && (
          <div className="row">
            {hasRank && collection.metadata.rarity === 'rarity_sniper' && (
              <div className="row">
                <div className="col-lg-8 col-sm-10 mx-auto text-center mb-3" style={{ fontSize: '0.8em' }}>
                  Rarity scores and ranks provided by{' '}
                  <a href="https://raritysniper.com/" target="_blank" rel="noreferrer">
                    <span className="color">Rarity Sniper</span>
                  </a>
                </div>
              </div>
            )}
            <CollectionInfoBar collectionStats={collectionStats} />
            {collection.address.toLowerCase() === '0x7D5f8F9560103E1ad958A6Ca43d49F954055340a'.toLowerCase() && (
              <div className="row m-3">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '1.2em' }}>
                  {'  '} Please visit{' '}
                  <a href="/collection/weird-apes-club-v2">
                    <span className="color">here </span>
                  </a>
                  for the newer, migrated contract until these pages are unified
                </div>
              </div>
            )}
            {isCrosmocraftsCollection(collection.address) && (
              <div className="row">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '0.8em' }}>
                  Got Crosmocraft parts?{' '}
                  <a href="/build-ship">
                    <span className="color">build your Crosmocraft!</span>
                  </a>
                </div>
              </div>
            )}
            {collection.metadata.staking && (
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
              <span onClick={handleBtnClick('items')}>Items</span>
            </li>
            <li id="Mainbtn1" className={`tab ${openMenu === tabs.activity ? 'active' : ''}`}>
              <span onClick={handleBtnClick('activity')}>Activity</span>
            </li>
            {isCronosVerseCollection(collection.address) && (
              <li id="Mainbtn9" className={`tab ${openMenu === tabs.map ? 'active' : ''}`}>
                <span onClick={handleBtnClick('map')}>Map</span>
              </li>
            )}
          </ul>

          <div className="de_tab_content">
            {openMenu === tabs.items && (
              <div className="tab-1 onStep fadeIn">
                <ThemedBackground className="row sticky-top pt-2">
                  <CollectionTaskBar
                    collection={collection}
                    onFilterToggle={toggleFilterVisibility}
                    onSortToggle={() => setMobileSortVisible(!mobileSortVisible)}
                  />
                </ThemedBackground>
                <div className="d-flex">
                  <Collapse in={filtersVisible && !useMobileMenu} dimension="width">
                    <div className="m-0 p-0">
                      <div className="me-4" style={{width: 250, top:'56px'}}>
                        <DesktopFilters
                          address={collection.address}
                          traits={collectionStats?.traits}
                          powertraits={collectionStats?.powertraits}
                        />
                      </div>
                    </div>
                  </Collapse>
                  <div className="flex-fill">
                    <FilterResultsBar collection={collection} />
                    {isUsingListingsFallback ? (
                      <CollectionListingsGroup listings={listings} canLoadMore={canLoadMore} loadMore={loadMore} />
                    ) : (
                      <CollectionNftsGroup
                        listings={listings}
                        canLoadMore={canLoadMore}
                        loadMore={loadMore}
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
              <div className="tab-2 onStep fadeIn container">
                <SalesCollection cacheName="collection" collectionId={collection.address} />
              </div>
            )}
            {openMenu === tabs.map && (
              <NegativeMargin className="tab-2 onStep fadeIn overflow-auto mt-2">
                <CollectionCronosverse collection={collection} slug={collection.slug} cacheName={collection.slug} />
              </NegativeMargin>
            )}
          </div>
        </div>
      </div>

      <MobileFilters
        address={collection.address}
        show={useMobileMenu && filtersVisible}
        onHide={() => setFiltersVisible(false)}
        traits={collectionStats?.traits}
        powertraits={collectionStats?.powertraits}
      />

      <MobileSort
        show={useMobileMenu && mobileSortVisible}
        onHide={() => setMobileSortVisible(false)}
      />

      {/*{useMobileMenu && openMenu === tabs.items && (*/}
      {/*  <div className="d-flex fixed-bottom mx-2 my-2">*/}
      {/*    <div className="mx-auto">*/}
      {/*      <Button type="legacy" style={{height: '100%'}} onClick={() => setFiltersVisible(true)}>*/}
      {/*        <FontAwesomeIcon icon={faFilter} />*/}
      {/*        <span className="ms-2">Filters {activeFiltersCount()}</span>*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      <Footer />
    </div>
  );
};
export default Collection721;
