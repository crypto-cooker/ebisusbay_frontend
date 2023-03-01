import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import {ethers} from 'ethers';
import {
  faExternalLinkAlt,
  faHeart as faHeartSolid,
  faSync,
  faShareAlt,
  faBullhorn
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner } from 'react-bootstrap';
import MetaMaskOnboarding from '@metamask/onboarding';

import ProfilePreview from '../components/ProfilePreview';
import {
  caseInsensitiveCompare,
  findCollectionByAddress,
  humanize,
  isCrosmocraftsPartsDrop, isEbVipCollection, isEmptyObj,
  mapAttributeString,
  millisecondTimestamp, rankingsLinkForCollection, rankingsLogoForCollection, rankingsTitleForCollection,
  relativePrecision,
  shortAddress,
  timeSince,
} from '@src/utils';
import { getNftDetails, refreshMetadata, tickFavorite } from '@src/GlobalState/nftSlice';
import { specialImageTransform } from '@src/hacks';
import { chainConnect, connectAccount, retrieveProfile } from '@src/GlobalState/User';

import ListingItem from '../NftDetails/NFTTabListings/ListingItem';
import { listingState, offerState } from '@src/core/api/enums';
import { getFilteredOffers } from '@src/core/subgraph';
import PriceActionBar from '../NftDetails/PriceActionBar';
import NFTTabListings from '../NftDetails/NFTTabListings';
import MakeOfferDialog from '../Offer/Dialogs/MakeOfferDialog';
import { OFFER_TYPE } from '../Offer/MadeOffers/MadeOffersRow';
import NFTTabOffers from '../Offer/NFTTabOffers';
import { AnyMedia } from '../components/AnyMedia';
import { hostedImage } from '@src/helpers/image';
import { appConfig } from "@src/Config";
import { collectionRoyaltyPercent } from "@src/core/chain";
import Button, { LegacyOutlinedButton } from "@src/Components/components/common/Button";
import {Box, ButtonGroup, Flex, Heading, Link, MenuButton as MenuButtonCK, Text, useClipboard} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import { Menu } from '../components/chakra-components';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faSquareTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { getStats } from '@src/GlobalState/collectionSlice';
import NextLink from 'next/link';
import useToggleFavorite from "@src/components-v2/feature/nft/hooks/useToggleFavorite";
import {Button as ChakraButton} from "@chakra-ui/button";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";

const config = appConfig();
const tabs = {
  properties: 'properties',
  powertraits: 'powertraits',
  history: 'history',
  listings: 'listings',
  offers: 'offers',
  info: 'info',
};

const Nft1155 = ({ address, id, collection }) => {
  const dispatch = useDispatch();
  const history = useRouter();
  const { onCopy } = useClipboard(window.location);

  const { nft, refreshing, favorites } = useSelector((state) => state.nft);
  const soldListings = useSelector((state) =>
    state.nft.history.filter((i) => i.state === listingState.SOLD).sort((a, b) => (a.saleTime < b.saleTime ? 1 : -1))
  );
  const activeListings = useSelector((state) =>
    state.nft.history.filter((i) => i.state === listingState.ACTIVE).sort((a, b) => a.price - b.price)
  );

  const powertraits = useSelector((state) => state.nft.nft?.powertraits);
  const collectionMetadata = useSelector((state) => {
    return collection?.metadata;
  });
  const collectionName = useSelector((state) => {
    return collection?.name;
  });
  const collectionSlug = useSelector((state) => {
    return collection?.slug;
  });
  const isLoading = useSelector((state) => state.nft.loading);
  const user = useSelector((state) => state.user);
  const [{ isLoading: isFavoriting, response, error }, toggleFavorite] = useToggleFavorite();
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    dispatch(getNftDetails(address, id));
  }, [dispatch, address, id]);

  const [royalty, setRoyalty] = useState(null);
  useEffect(() => {
    async function getRoyalty() {
      const royalty = await collectionRoyaltyPercent(address, id);
      setRoyalty(royalty);
    }
    getRoyalty();
  }, []);

  const copyLink = useCallback(() => {
    onCopy();
    toast.info(`Link copied!`);
  }, [navigator, window.location])

  const options = [
    {
      url: 'https://www.facebook.com/sharer/sharer.php?u=',
      label: 'Share on facebook',
      icon: faFacebook,
      type: 'url'
    },
    {
      url: 'https://twitter.com/intent/tweet?text=',
      label: 'Share on twitter',
      icon: faSquareTwitter,
      type: 'url'
    },
    {
      url: 'https://telegram.me/share/?url=',
      label: 'Share on telegram',
      icon: faTelegram,
      type: 'url'
    },
    {
      label: 'Copy Link',
      icon: faCopy,
      type: 'event',
      handleClick: copyLink
    }

  ];

  const MenuItems = (
    options.map(option => (
      option.type === 'url' ?
        (
          <div >
            <a href={`${option.url}${window.location}`} target='_blank' >
              <div key={option.label} className='social_media_item'>
                <div className='icon_container'>
                  <FontAwesomeIcon icon={option.icon} style={{ height: 28 }} />
                </div>
                <div className='label_container'>
                  <span>{option.label}</span>
                </div>
              </div>
            </a>
          </div>

        )
        :
        (
          <div className='social_media_item' onClick={option.handleClick} key={option.label}>
            <div className='icon_container'>
              <FontAwesomeIcon icon={option.icon} style={{ height: 28 }} />
            </div>
            <div className='label_container'>
              <span>
                {option.label}
              </span>
            </div>
          </div>
        )

    )))

  const MenuButton = () => {

    return (
      <MenuButtonCK as={LegacyOutlinedButton}>
        <FontAwesomeIcon icon={faShareAlt} style={{ cursor: 'pointer' }} />
      </MenuButtonCK>
    )
  }

  const fullImage = () => {
    if (nft.original_image.startsWith('ipfs://')) {
      const link = nft.original_image.split('://')[1];
      return `https://ipfs.io/ipfs/${link}`;
    }

    if (nft.original_image.startsWith('https://gateway.ebisusbay.com')) {
      const link = nft.original_image.replace('gateway.ebisusbay.com', 'ipfs.io');
      return link;
    }

    return nft.original_image;
  };


  const collectionStats = useSelector((state) => state.collection.stats);

  useEffect(() => {
    async function asyncFunc() {
      dispatch(getStats(collection));
    }
    asyncFunc();
    // eslint-disable-next-line
  }, [dispatch, collection]);

  const [currentTab, setCurrentTab] = useState(tabs.properties);
  const handleTabChange = useCallback((tab) => {
    setCurrentTab(tab);
  }, []);

  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);
  const [offerType, setOfferType] = useState(OFFER_TYPE.none);
  const [offerData, setOfferData] = useState();

  const handleMakeOffer = () => {
    if (user.address) {
      setOpenMakeOfferDialog(!openMakeOfferDialog);
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  };

  const onRefreshMetadata = useCallback(() => {
    dispatch(refreshMetadata(address, id));
  }, [address, id]);

  useEffect(() => {
    async function func() {
      const filteredOffers = await getFilteredOffers(nft.address, nft.id.toString(), user.address);
      const data = filteredOffers ? filteredOffers.data.filter((o) => o.state === offerState.ACTIVE.toString()) : [];
      if (data && data.length > 0) {
        setOfferType(OFFER_TYPE.update);
        setOfferData(data[0]);
      } else {
        setOfferType(OFFER_TYPE.make);
      }
    }
    if (!offerType && user.address && nft && nft.address && nft.id) {
      func();
    }

    // eslint-disable-next-line
  }, [nft, user.address]);

  const onFavoriteClicked = async () => {
    if (isEmptyObj(user.profile)) {
      toast.info(`Connect wallet and create a profile to start adding favorites`);
      return;
    }
    if (user.profile.error) {
      toast.info(`Error loading profile. Please try reconnecting wallet`);
      return;
    }
    const isCurrentFav = isFavorite();
    await toggleFavorite(user.address, address, id, !isCurrentFav);
    toast.success(`Item ${isCurrentFav ? 'removed from' : 'added to'} favorites`);
    dispatch(tickFavorite(isCurrentFav ? -1 : 1));
    dispatch(retrieveProfile());
  };

  const isFavorite = () => {
    if (!user.profile?.favorites) return false;
    return user.profile.favorites.find((f) => caseInsensitiveCompare(address, f.tokenAddress) && id === f.tokenId);
  }

  return (
    <div>
      {isEbVipCollection(address, id) && (
        <Box className="promo">
          <Flex justify="center" px={3}>
            <FontAwesomeIcon icon={faBullhorn} className="my-auto"/>
            <Text ms={2}>
              Swap your Ebisu's Bay VIP Founding Member for 10x Ryoshi Tales VIP NFTs and enjoy increased benefits in the Ebisu's Bay ecosystem.{' '}
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
      {isLoading ? (
        <section className="gl-legacy container">
          <div className="row mt-4">
            <div className="col-lg-12 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
        </section>
      ) : (
        <section className="gl-legacy container">

          <div className="row">
            <div className="col-md-6 text-center">
              {nft ? (
                nft.useIframe ? (
                  <iframe width="100%" height="636" src={nft.iframeSource} title="nft" />
                ) : (
                  <>
                    <AnyMedia
                      image={specialImageTransform(address, nft.image)}
                      video={specialImageTransform(address, nft.video ?? nft.animation_url)}
                      videoProps={{ height: 'auto', autoPlay: true }}
                      title={nft.name}
                      usePlaceholder={false}
                      className="img-fluid img-rounded mb-sm-30"
                    />
                  </>
                )
              ) : (
                <></>
              )}
              <div className="mt-2" style={{ cursor: 'pointer' }}>
                <ButtonGroup size='sm' isAttached variant='outline'>
                  <Button styleType="default-outlined" title="Refresh Metadata" onClick={onRefreshMetadata} disabled={refreshing}>
                    <FontAwesomeIcon icon={faSync} spin={refreshing} />
                  </Button>
                  <Button
                    styleType="default-outlined"
                    title={isFavorite() ? 'This item is in your favorites list' : 'Click to add to your favorites list'}
                    onClick={onFavoriteClicked}
                  >
                    <div>
                      <span className="me-1">{favorites}</span>
                      {isFavorite() ? (
                        <FontAwesomeIcon icon={faHeartSolid} style={{ color: '#dc143c' }} />
                      ) : (
                        <FontAwesomeIcon icon={faHeartOutline} />
                      )}
                    </div>
                  </Button>
                  {nft && nft.original_image && (
                    <Button styleType="default-outlined" title="View Full Image" onClick={() =>
                      typeof window !== 'undefined' &&
                      window.open(specialImageTransform(address, fullImage()), '_blank')
                    }>
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </Button>
                  )}
                  <Menu MenuItems={MenuItems} MenuButton={MenuButton()} />

                </ButtonGroup>
              </div>
            </div>
            <div className="col-md-6">
              {nft && (
                <div className="item_info">
                  <Heading>{nft.name}</Heading>

                  {nft.description && (
                    <Box mb={4}>
                      <Text noOfLines={showFullDescription ? 0 : 2}>{nft.description}</Text>
                      {nft.description.length > 60 && (
                        <ChakraButton variant="link" onClick={() => setShowFullDescription(!showFullDescription)}>
                          See {showFullDescription ? 'less' : 'more'}
                          {showFullDescription ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </ChakraButton>
                      )}
                    </Box>
                  )}

                  {collection.listable && (
                    <>
                      <PriceActionBar
                        offerType={offerType}
                        onOfferSelected={() => handleMakeOffer()}
                        label="Floor Price"
                        collectionName={collectionName}
                        isVerified={collection.verification?.verified}
                        collectionStats={collectionStats}
                      />
                    </>
                  )}
                  <div className="row" style={{ gap: '2rem 0' }}>
                    <ProfilePreview
                      type="Collection"
                      title={collectionName ?? 'View Collection'}
                      avatar={hostedImage(collectionMetadata?.avatar, true)}
                      address={address}
                      verified={collection.verification?.verified}
                      to={`/collection/${collectionSlug}`}
                    />

                    {typeof nft.rank !== 'undefined' && nft.rank !== null && (
                      <ProfilePreview
                        type="Rarity Rank"
                        title={nft.rank}
                        avatar={rankingsLogoForCollection(collection)}
                        hover={rankingsTitleForCollection(collection)}
                        to={rankingsLinkForCollection(collection)}
                        pop={true}
                      />
                    )}
                  </div>

                  <div className="spacer-40"></div>

                  <div className="de_tab">
                    <ul className="de_nav nft_tabs_options">
                      <li className={`tab ${currentTab === tabs.properties ? 'active' : ''}`}>
                        <span onClick={() => handleTabChange(tabs.properties)}>Properties</span>
                      </li>
                      {powertraits && powertraits.length > 0 && (
                        <li className={`tab ${currentTab === tabs.powertraits ? 'active' : ''}`}>
                          <span onClick={() => handleTabChange(tabs.powertraits)}>In-Game Attributes</span>
                        </li>
                      )}
                      <li className={`tab ${currentTab === tabs.history ? 'active' : ''}`}>
                        <span onClick={() => handleTabChange(tabs.history)}>History</span>
                      </li>
                      {collection.listable && (
                        <li className={`tab ${currentTab === tabs.listings ? 'active' : ''}`}>
                          <span onClick={() => handleTabChange(tabs.listings)}>Listings</span>
                        </li>
                      )}
                      <li className={`tab ${currentTab === tabs.offers ? 'active' : ''}`}>
                        <span onClick={() => handleTabChange(tabs.offers)}>Offers</span>
                      </li>
                      <li className={`tab ${currentTab === tabs.info ? 'active' : ''}`}>
                        <span onClick={() => handleTabChange(tabs.info)}>Info</span>
                      </li>
                    </ul>

                    <div className="de_tab_content">
                      {currentTab === tabs.properties && (
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
                                        <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                                          <div className="nft_attr">
                                            <h5>{humanize(data.trait_type)}</h5>
                                            <h4>
                                              {data.value !== undefined ? (
                                                <>
                                                  {data?.display_type === 'date' ? (
                                                    <>{new Date(millisecondTimestamp(data.value)).toDateString()}</>
                                                  ) : (
                                                    <>{mapAttributeString(data.value, address, data.trait_type, true)}</>
                                                  )}
                                                </>
                                              ) : (
                                                <>N/A</>
                                              )}
                                            </h4>
                                            {data.occurrence ? (
                                              <span>{relativePrecision(data.occurrence)}% have this trait</span>
                                            ) : (
                                              data.percent && <span>{data.percent}% have this trait</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                {nft.properties &&
                                  Array.isArray(nft.properties) &&
                                  nft.properties.map((data, i) => {
                                    return (
                                      <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                                        <div className="nft_attr">
                                          <h5>{humanize(data.trait_type)}</h5>
                                          <h4>
                                            {data.value !== undefined ? (
                                              <>
                                                {data?.display_type === 'date' ? (
                                                  <>{new Date(millisecondTimestamp(data.value)).toDateString()}</>
                                                ) : (
                                                  <>
                                                    {mapAttributeString(
                                                      isCrosmocraftsPartsDrop(address) ? data.Value : data.value,
                                                      address,
                                                      true
                                                    )}
                                                  </>
                                                )}
                                              </>
                                            ) : (
                                              <>N/A</>
                                            )}
                                          </h4>
                                          {data.occurrence ? (
                                            <span>{Math.round(data.occurrence * 100)}% have this trait</span>
                                          ) : (
                                            data.percent && <span>{data.percent}% have this trait</span>
                                          )}
                                        </div>
                                      </div>
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
                      )}
                      {currentTab === tabs.powertraits && (
                        <div className="tab-2 onStep fadeIn">
                          {powertraits && powertraits.length > 0 ? (
                            <>
                              <div className="d-block mb-3">
                                <div className="row gx-3 gy-2">
                                  {powertraits.map((data, i) => {
                                    return (
                                      <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                                        <div className="nft_attr">
                                          <h5>{data.trait_type}</h5>
                                          <h4>{data.value > 0 ? <>+ {data.value}</> : <>{data.value}</>}</h4>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <span>No in-game attributes found for this item</span>
                            </>
                          )}
                        </div>
                      )}
                      {currentTab === tabs.history && (
                        <div className="listing-tab tab-3 onStep fadeIn">
                          {soldListings && soldListings.length > 0 ? (
                            <>
                              {soldListings.map((listing, index) => (
                                <ListingItem
                                  key={`sold-item-${index}`}
                                  route="/account"
                                  primaryTitle="Bought by"
                                  user={listing.purchaser}
                                  time={timeSince(listing.saleTime)}
                                  price={ethers.utils.commify(listing.price)}
                                  primaryText={shortAddress(listing.purchaser)}
                                />
                                /*
                                <div className="p_list" key={index}>
                                  <Link href={`/seller/${listing.purchaser}`}>
                                    <a>
                                      <div className="p_list_pp">
                                        <span>
                                          <span onClick={viewSeller(listing.purchaser)}>
                                            <Blockies seed={listing.purchaser} size={10} scale={5} />
                                          </span>
                                        </span>
                                      </div>
                                    </a>
                                  </Link>
                                  <div className="p_list_info">
                                    <span>{timeSince(listing.saleTime + '000')} ago</span>
                                    Bought by{' '}
                                    <b>
                                      <Link href={`/seller/${listing.purchaser}`}>
                                        <a>{shortAddress(listing.purchaser)}</a>
                                      </Link>
                                    </b>{' '}
                                    for <b>{ethers.utils.commify(listing.price)} CRO</b>
                                  </div>
                                </div>
*/
                              ))}
                            </>
                          ) : (
                            <>
                              <span>No history found for this item</span>
                            </>
                          )}
                        </div>
                      )}
                      {currentTab === tabs.listings && (
                        <div className="tab-3 onStep fadeIn">
                          <NFTTabListings listings={activeListings} nft={nft} />
                        </div>
                      )}

                      {currentTab === tabs.info && (
                        <div className="tab-1 onStep fadeIn">
                          <div className="d-block mb-3">
                            <div className="row gx-3 gy-2">
                              <div className="d-flex justify-content-between">
                                <div>Contract Address</div>
                                <div>
                                  <a href={`${config.urls.explorer}address/${address}`} target="_blank">
                                    {shortAddress(address)}
                                    <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-2 text-muted" />
                                  </a>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between">
                                <div>Token ID</div>
                                <div>
                                  <a href={`${config.urls.explorer}token/${address}?a=${id}`} target="_blank">
                                    {id.length > 10 ? shortAddress(id) : id}
                                    <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-2 text-muted" />
                                  </a>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between">
                                <div>Token Standard</div>
                                <div>{collection.multiToken ? 'CRC-1155' : 'CRC-721'}</div>
                              </div>
                              <div className="d-flex justify-content-between">
                                <div>Royalty</div>
                                <div>{royalty ? `${royalty}%` : 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentTab === tabs.offers && <NFTTabOffers nftAddress={address} nftId={id} />}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      {openMakeOfferDialog && (
        <MakeOfferDialog
          isOpen={openMakeOfferDialog}
          onClose={() => setOpenMakeOfferDialog(false)}
          nftId={id}
          nftAddress={address}
        />
      )}
    </div>
  );
};

export default memo(Nft1155);
