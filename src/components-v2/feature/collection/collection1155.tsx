import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {faCheck, faCircle} from '@fortawesome/free-solid-svg-icons';
import Blockies from 'react-blockies';
import LayeredIcon from '../../../Components/components/LayeredIcon';
import {fetchListings, getStats, init, updateTab} from '@src/GlobalState/collectionSlice';
import {isBundle, isCrosmocraftsPartsCollection} from '@src/utils';
import SocialsBar from '@src/Components/Collection/SocialsBar';
import {CollectionSortOption} from '@src/Components/Models/collection-sort-option.model';
import CollectionInfoBar from '@src/Components/components/CollectionInfoBar';
import SalesCollection from '@src/Components/components/SalesCollection';
import CollectionNftsGroup from '@src/Components/components/CollectionNftsGroup';
import {CollectionFilters} from "@src/Components/Models/collection-filters.model";
import {Spinner} from "react-bootstrap";
import {CollectionVerificationRow} from "@src/Components/components/CollectionVerificationRow";
import {pushQueryString} from "@src/helpers/query";
import {useRouter} from "next/router";
import {Box, Button, Flex, Heading, Text} from "@chakra-ui/react";
import MintingButton from "@src/Components/Collection/MintingButton";
import {useAppSelector} from "@src/Store/hooks";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import useGetStakingPlatform from "@src/hooks/useGetStakingPlatform";
import ImageService from "@src/core/services/image";
import CollectionBundlesGroup from "@src/Components/components/CollectionBundlesGroup";


const tabs = {
  items: 'items',
  bundles: 'bundles',
  activity: 'activity'
};

interface Collection1155Props {
  collection: any;
  query: any;
  tokenId?: string;
  activeDrop?: any;
}

const Collection1155 = ({ collection, tokenId, query, activeDrop = null }: Collection1155Props) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const collectionStats = useAppSelector((state) => state.collection.stats);
  const initialLoadComplete = useAppSelector((state) => state.collection.initialLoadComplete);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const { stakingPlatform } = useGetStakingPlatform(collection.address);

  const listings = useAppSelector((state) => state.collection.listings);
  const hasRank = useAppSelector((state) => state.collection.hasRank);
  const canLoadMore = useAppSelector((state) => {
    return (
      state.collection.listings.length > 0 &&
      (state.collection.query.page === 0 || state.collection.query.page < state.collection.totalPages)
    );
  });
  const isUsingListingsFallback = useAppSelector((state) => state.collection.isUsingListingsFallback);

  const collectionName = () => {
    return collection.name;
  };

  const [openMenu, setOpenMenu] = React.useState(tabs.items);
  const handleBtnClick = (key: string) => (e: any) => {
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
    if (tokenId !== undefined) {
      // @ts-ignore
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
      if (tokenId !== undefined) {
        // @ts-ignore
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
      <section
        id="profile_banner"
        className="jumbotron breadcumb no-bg"
        style={{
          backgroundImage: `url(${!!collection.metadata.banner ? ImageService.translate(collection.metadata.banner).banner() : ''})`,
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
                    <SocialsBar
                      address={collection.address}
                      socials={collection.metadata}
                    />
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
            <li id="Mainbtn0" className={`tab ${openMenu === tabs.items ? 'active' : ''}`}>
              <span onClick={handleBtnClick(tabs.items)}>Items</span>
            </li>
            {!isBundle(collection.address) && (
              <li className={`tab ${openMenu === tabs.bundles ? 'active' : ''} my-1`}>
                <span onClick={handleBtnClick(tabs.bundles)}>Bundles</span>
              </li>
            )}
            <li id="Mainbtn1" className={`tab ${openMenu === tabs.activity ? 'active' : ''}`}>
              <span onClick={handleBtnClick(tabs.activity)}>Activity</span>
            </li>
          </ul>

          <div className="de_tab_content">
            {openMenu === tabs.items && (
              <div className="tab-1 onStep fadeIn">
                <div className="row">
                  <div className="col-md-12">
                    <CollectionNftsGroup
                      listings={listings}
                      canLoadMore={canLoadMore}
                      loadMore={loadMore}
                      collection={collection}
                      showLoadMore={true}
                    />
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
              <div className="tab-2 onStep fadeIn">
                <SalesCollection cacheName="collection" collectionId={collection.address} tokenId={tokenId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Collection1155;
