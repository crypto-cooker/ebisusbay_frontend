import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import Blockies from 'react-blockies';
import {faCheck, faCircle} from '@fortawesome/free-solid-svg-icons';
import {Collapse, Spinner} from 'react-bootstrap';
import styled from 'styled-components';
import LayeredIcon from '../../../Components/components/LayeredIcon';
import CollectionInfoBar from '../../../Components/components/CollectionInfoBar';
import SalesCollection from '../../../Components/components/SalesCollection';
import CollectionNftsGroup from '../../../Components/components/CollectionNftsGroup';
import CollectionListingsGroup from '../../../Components/components/CollectionListingsGroup';
import {fetchListings, getStats, init, updateTab} from '@src/GlobalState/collectionSlice';
import {isBundle, isCnsCollection, isCronosVerseCollection, isCrosmocraftsCollection} from '@src/utils';
import SocialsBar from '@src/Components/Collection/SocialsBar';
import {CollectionSortOption} from '@src/Components/Models/collection-sort-option.model';
import CollectionCronosverse from '@src/Components/Collection/Custom/Cronosverse';
import {hostedImage} from "@src/helpers/image";
import {useRouter} from "next/router";
import {CollectionFilters} from "@src/Components/Models/collection-filters.model";
import {pushQueryString} from "@src/helpers/query";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {CollectionTaskBar} from "@src/Components/Collection/CollectionTaskBar";
import {DesktopFilters} from "@src/Components/Collection/CollectionTaskBar/DesktopFilters";
import {MobileFilters} from "@src/Components/Collection/CollectionTaskBar/MobileFilters";
import {FilterResultsBar} from "@src/Components/Collection/FilterResultsBar";
import {MobileSort} from "@src/Components/Collection/CollectionTaskBar/MobileSort";
import {CnsRegistration} from "@src/Components/Collection/Custom/CnsRegistration";
import {Box, Button, Flex, Heading, Text, useBreakpointValue} from "@chakra-ui/react";
import MintingButton from "@src/Components/Collection/MintingButton";
import CollectionBundlesGroup from "@src/Components/components/CollectionBundlesGroup";
import {useAppSelector} from "@src/Store/hooks";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import useGetStakingPlatform from "@src/hooks/useGetStakingPlatform";
import ImageService from "@src/core/services/image";

const NegativeMargin = styled.div`
  margin-left: -1.75rem !important;
  margin-right: -1.75rem !important;
`;

const ThemedBackground = styled.div`
  background: ${({ theme }) => theme.colors.bgColor1}
`;

const tabs = {
  items: 'items',
  bundles: 'bundles',
  activity: 'activity',
  map: 'map',
  cns: 'cns'
};

interface Collection721Props {
  collection: any;
  query: any;
  activeDrop?: any;
}

const Collection721 = ({ collection, query, activeDrop = null}: Collection721Props) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const collectionStats = useAppSelector((state) => state.collection.stats);
  const collectionLoading = useAppSelector((state) => state.collection.loading);
  const initialLoadComplete = useAppSelector((state) => state.collection.initialLoadComplete);

  const [isFirstLoaded, setIsFirstLoaded] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const listings = useAppSelector((state) => state.collection.listings);
  const hasRank = useAppSelector((state) => state.collection.hasRank);
  const canLoadMore = useAppSelector((state) => {
    return (
      state.collection.listings.length > 0 &&
      (state.collection.query.page === 0 || state.collection.query.page < state.collection.totalPages)
    );
  });

  const isUsingListingsFallback = useAppSelector((state) => state.collection.isUsingListingsFallback);
  const { stakingPlatform } = useGetStakingPlatform(collection.address);

  const [openMenu, setOpenMenu] = useState(tabs.items);
  const handleBtnClick = (key: string) => (e: any) => {
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

  const resetFilters = (preservedQuery?: any) => {
    const sortOption = CollectionSortOption.default();
    sortOption.key = 'price';
    sortOption.direction = 'asc';
    sortOption.label = 'By Price';

    const filterOption = preservedQuery ? CollectionFilters.fromQuery(preservedQuery) : CollectionFilters.default();
    filterOption.address = collection.address;

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
  const [useMobileMenu, setUseMobileMenu] = useState<boolean>(false);
  const isMobileSize = useBreakpointValue({base: true, md: false}, {fallback: 'md'})
  const [hasManuallyToggledFilters, setHasManuallyToggledFilters] = useState(false);

  useEffect(() => {
    setUseMobileMenu(isMobileSize!);
    if (!hasManuallyToggledFilters) {
      setFiltersVisible(!isMobileSize);
    }
  }, [isMobileSize]);

  const toggleFilterVisibility = () => {
    setHasManuallyToggledFilters(true);
    setFiltersVisible(!filtersVisible)
  };

  const handleMintingButtonClick = () => {
    if (activeDrop.redirect) {
      window.open(activeDrop.redirect, '_blank');
    } else {
      router.push(`/drops/${activeDrop.slug}`)
    }
  }

  return (
    <div>
      <section
        id="profile_banner"
        className="jumbotron breadcumb no-bg"
        style={{
          backgroundImage: `url(${ImageService.translate(collection.metadata.banner ?? '').banner()})`,
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
                  {collection.metadata.avatar ? (
                    <img src={ImageService.translate(collection.metadata.avatar).fixedWidth(150, 150)} alt={collection.name} />
                  ) : (
                    <Blockies seed={collection.address.toLowerCase()} size={15} scale={10} />
                  )}
                  {collection.verification.verified && (
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
                  {collection.metadata.description && (
                    <Box>
                      <Text noOfLines={showFullDescription ? 0 : 2}>{collection.metadata.description}</Text>
                      {collection.metadata.description.length > 255 && (
                        <Button variant="link" onClick={() => setShowFullDescription(!showFullDescription)}>
                          See {showFullDescription ? 'less' : 'more'}
                          {showFullDescription ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </Button>
                      )}
                    </Box>
                  )}
                  <Box className="fs-4 mt-2">
                    <SocialsBar address={collection.address} socials={collection.metadata} />
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 mb-4">
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
            <CollectionInfoBar collectionStats={collectionStats} hideFloor={!collection.listable} />
            {collection.address.toLowerCase() === '0x7D5f8F9560103E1ad958A6Ca43d49F954055340a'.toLowerCase() && (
              <div className="row m-3">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '1.2em' }}>
                  {'  '} Please visit{' '}
                  <a href="/collection/weird-apes-club-v2">
                    <span className="color">here </span>
                  </a>
                  for the newer, migrated contract
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
            {!!stakingPlatform && (
              <div className="row">
                <div className="mx-auto text-center fw-bold" style={{ fontSize: '0.8em' }}>
                  NFTs from this collection can be staked at{' '}
                  <a href={stakingPlatform.url} target="_blank" rel="noreferrer">
                    <span className="color">{stakingPlatform.name}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="de_tab">
          <ul className="de_nav mb-2">
            <li className={`tab ${openMenu === tabs.items ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.items)}>Items</span>
            </li>
            {!isBundle(collection.address) && (
              <li className={`tab ${openMenu === tabs.bundles ? 'active' : ''} my-1`}>
                <span onClick={handleBtnClick(tabs.bundles)}>Bundles</span>
              </li>
            )}
            <li className={`tab ${openMenu === tabs.activity ? 'active' : ''} my-1`}>
              <span onClick={handleBtnClick(tabs.activity)}>Activity</span>
            </li>
            {isCronosVerseCollection(collection.address) && (
              <li className={`tab ${openMenu === tabs.map ? 'active' : ''} my-1`}>
                <span onClick={handleBtnClick(tabs.map)}>Map</span>
              </li>
            )}
            {isCnsCollection(collection.address) && (
              <li className={`tab ${openMenu === tabs.cns ? 'active' : ''} my-1`}>
                <span onClick={handleBtnClick(tabs.cns)}>Register Domain</span>
              </li>
            )}
          </ul>

          <div className="de_tab_content">
            {openMenu === tabs.items && (
              <div className="tab-1 onStep fadeIn">
                <ThemedBackground className="row position-sticky pt-2" style={{top: 74, zIndex: 5}}>
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
                          traits={(collectionStats as any)?.traits}
                          powertraits={(collectionStats as any)?.powertraits}
                        />
                      </div>
                    </div>
                  </Collapse>
                  <div className="flex-fill">
                    <FilterResultsBar collection={collection} />
                    {isUsingListingsFallback ? (
                      <CollectionListingsGroup
                        listings={listings}
                        canLoadMore={canLoadMore}
                        loadMore={loadMore}
                        showLoadMore={true}
                        address={null}
                        collectionMetadata={null}
                      />
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
            {openMenu === tabs.bundles && (
              <div className="tab-2 onStep fadeIn container">
                <CollectionBundlesGroup
                  collection={collection}
                />
              </div>
            )}
            {openMenu === tabs.activity && (
              <div className="tab-2 onStep fadeIn container">
                <SalesCollection cacheName="collection" collectionId={collection.address} />
              </div>
            )}
            {openMenu === tabs.map && (
              <NegativeMargin className="tab-2 onStep fadeIn overflow-auto mt-2">
                <CollectionCronosverse collection={collection} />
              </NegativeMargin>
            )}
            {openMenu === tabs.cns && (
              <CnsRegistration />
            )}
          </div>
        </div>
      </div>

      <MobileFilters
        address={collection.address}
        show={useMobileMenu && filtersVisible}
        onHide={() => setFiltersVisible(false)}
        traits={(collectionStats as any)?.traits}
        powertraits={(collectionStats as any)?.powertraits}
      />

      <MobileSort
        show={useMobileMenu && mobileSortVisible}
        onHide={() => setMobileSortVisible(false)}
        hasRank={hasRank}
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
    </div>
  );
};
export default Collection721;
