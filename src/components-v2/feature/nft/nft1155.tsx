import React, {memo, useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  faBullhorn,
  faCopy,
  faExternalLinkAlt,
  faHeart as faHeartSolid,
  faShareAlt,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import NftPropertyLabel from '@src/components-v2/feature/nft/property-label';
import {
  appUrl,
  caseInsensitiveCompare,
  isEbVipCollection,
  isEmptyObj,
  rankingsLinkForCollection,
  rankingsLogoForCollection,
  rankingsTitleForCollection,
  shortAddress,
} from '@src/utils';
import {getNftDetails, refreshMetadata, tickFavorite} from '@src/GlobalState/nftSlice';
import {specialImageTransform} from '@src/hacks';
import {retrieveProfile} from '@src/GlobalState/User';
import PriceActionBar from '@src/components-v2/feature/nft/price-action-bar';
import ListingsTab from '@src/components-v2/feature/nft/tabs/listings';
import MakeOfferDialog from '@src/components-v2/shared/dialogs/make-offer';
import {OFFER_TYPE} from '@src/Components/Offer/MadeOffers/MadeOffersRow';
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {appConfig} from "@src/Config";
import {collectionRoyaltyPercent} from "@src/core/chain";
import Button, {LegacyOutlinedButton} from "@src/Components/components/common/Button";
import {
  Box,
  ButtonGroup,
  Center,
  Heading,
  HStack,
  Link,
  MenuButton as MenuButtonCK,
  Spinner,
  Text,
  useClipboard,
  VStack
} from "@chakra-ui/react";
import {toast} from "react-toastify";
import {faHeart as faHeartOutline} from "@fortawesome/free-regular-svg-icons";
import {Menu} from '@src/Components/components/chakra-components';
import {faFacebook, faSquareTwitter, faTelegram} from '@fortawesome/free-brands-svg-icons';
import useToggleFavorite from "@src/components-v2/feature/nft/hooks/useToggleFavorite";
import {Button as ChakraButton} from "@chakra-ui/button";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {useAppSelector} from "@src/Store/hooks";
import OffersTab from "@src/components-v2/feature/nft/tabs/offers";
import {OfferState, OfferType} from "@src/core/services/api-service/types";
import ImageService from "@src/core/services/image";
import Properties from "@src/components-v2/feature/nft/tabs/properties";
import HistoryTab from "@src/components-v2/feature/nft/tabs/history";
import {ApiService} from "@src/core/services/api-service";
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();
const tabs = {
  properties: 'properties',
  powertraits: 'powertraits',
  history: 'history',
  listings: 'listings',
  offers: 'offers',
  info: 'info',
};

interface Nft721Props {
  address: string;
  id: string;
  collection: any;
}

const Nft1155 = ({ address, id, collection }: Nft721Props) => {
  const dispatch = useDispatch();
  const { onCopy } = useClipboard(appUrl(`/collection/${address}/${id}`).toString());
  const [runAuthedFunction] = useAuthedFunction();

  const { nft, refreshing, favorites } = useAppSelector((state) => state.nft);

  const powertraits = useAppSelector((state) => state.nft.nft?.powertraits);
  const collectionMetadata = useAppSelector((state) => {
    return collection?.metadata;
  });
  const collectionName = useAppSelector((state) => {
    return collection?.name;
  });
  const collectionSlug = useAppSelector((state) => {
    return collection?.slug;
  });
  const isLoading = useAppSelector((state) => state.nft.loading);
  const user = useUser();
  const [{ isLoading: isFavoriting, response, error }, toggleFavorite] = useToggleFavorite();
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    dispatch(getNftDetails(address, id));
  }, [dispatch, address, id]);

  const [royalty, setRoyalty] = useState<number | null>(null);
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

  const [currentTab, setCurrentTab] = useState(tabs.properties);
  const handleTabChange = useCallback((tab: string) => {
    setCurrentTab(tab);
  }, []);

  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);
  const [offerType, setOfferType] = useState(OFFER_TYPE.none);

  const handleMakeOffer = async () => {
    await runAuthedFunction(() => setOpenMakeOfferDialog(!openMakeOfferDialog));
  };

  const onRefreshMetadata = useCallback(() => {
    dispatch(refreshMetadata(address, id));
  }, [address, id]);

  useEffect(() => {
    async function func() {
      const existingOffer = await ApiService.withoutKey().getMadeOffersByUser(user.address!, {
        collection: [nft.address],
        tokenId: nft.id,
        state: OfferState.ACTIVE,
        pageSize: 1
      });
      setOfferType(existingOffer.data.length > 0 ? OFFER_TYPE.update : OFFER_TYPE.make);
    }
    if (!offerType && user.address && nft && nft.address && nft.id) {
      func();
    }

    // eslint-disable-next-line
  }, [nft, user.address]);

  const onFavoriteClicked = async () => {
    if (isEmptyObj(user.profile) || !user.address) {
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
    return user.profile.favorites.find((f: any) => caseInsensitiveCompare(address, f.tokenAddress) && id === f.tokenId);
  }

  return (
    <div>
      {isEbVipCollection(address, id) && (
        <Box className="promo">
          <VStack ms={2} textAlign='center' px={3}>
            <HStack>
              <FontAwesomeIcon icon={faBullhorn} className="my-auto"/>
              <Text>
                As of 11 November 2023, all member and staking benefits have now ended for this NFT. This NFT is now a collectible only.
              </Text>
            </HStack>
            <Box>
              <Link href="https://blog.ebisusbay.com/ebisus-bay-vip-split-506b05c619c7" isExternal fontWeight="bold">
                Learn more
              </Link>
            </Box>
          </VStack>
        </Box>
      )}
      {isLoading ? (
        <section className="gl-legacy container">
          <Center>
            <Spinner />
          </Center>
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
                    <PriceActionBar
                      offerType={offerType}
                      onOfferSelected={() => handleMakeOffer()}
                      label="Floor Price"
                      collectionName={collectionName}
                      isVerified={collection.verification?.verified}
                      isOwner={false}
                    />
                  )}
                  <div className="row" style={{ gap: '2rem 0' }}>
                    <NftPropertyLabel
                      label="Collection"
                      value={collectionName ?? 'View Collection'}
                      avatar={ImageService.translate(collectionMetadata?.avatar).avatar()}
                      address={address}
                      verified={collection.verification?.verified}
                      to={`/collection/${collectionSlug}`}
                    />

                    {typeof nft.rank !== 'undefined' && nft.rank !== null && (
                      <NftPropertyLabel
                        label="Rarity Rank"
                        value={nft.rank}
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
                        <>
                          {(nft.attributes && Array.isArray(nft.attributes) && nft.attributes.length > 0) ||
                          (nft.properties && Array.isArray(nft.properties) && nft.properties.length > 0) ? (
                            <>
                              {nft.attributes && Array.isArray(nft.attributes) && (
                                <Properties
                                  address={address}
                                  slug={nft.collectionSlug}
                                  attributes={nft.attributes}
                                  queryKey='traits'
                                />
                              )}
                              {nft.attributes && Array.isArray(nft.properties) && (
                                <Properties
                                  address={address}
                                  slug={nft.collectionSlug}
                                  attributes={nft.properties}
                                  queryKey='traits'
                                />
                              )}
                            </>
                          ) : (
                            <>
                              <span>No traits found for this item</span>
                            </>
                          )}
                        </>
                      )}
                      {currentTab === tabs.powertraits && (
                        <div className="tab-2 onStep fadeIn">
                          {powertraits && powertraits.length > 0 ? (
                            <>
                              <div className="d-block mb-3">
                                <div className="row gx-3 gy-2">
                                  {powertraits.map((data: any, i: number) => {
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
                          <HistoryTab address={address} tokenId={id} />
                        </div>
                      )}
                      {currentTab === tabs.listings && (
                        <div className="tab-3 onStep fadeIn">
                          <ListingsTab nft={nft} />
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

                      {currentTab === tabs.offers && (
                        <OffersTab
                          nftAddress={address}
                          nftId={id}
                          type={OfferType.COLLECTION}
                        />
                      )}
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
          initialNft={null}
        />
      )}
    </div>
  );
};

export default memo(Nft1155);
