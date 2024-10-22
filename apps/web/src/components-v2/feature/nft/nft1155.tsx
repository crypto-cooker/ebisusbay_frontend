import React, {memo, useCallback, useEffect, useState} from 'react';
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
  ciEquals,
  isCollectionListable,
  isEbVipCollection,
  isEmptyObj,
  rankingsLinkForCollection,
  rankingsLogoForCollection,
  rankingsTitleForCollection,
  shortAddress,
} from '@market/helpers/utils';
import {getNftDetails, refreshMetadata, tickFavorite} from '@market/state/redux/slices/nftSlice';
import {specialImageTransform} from '@market/helpers/hacks';
import PriceActionBar from '@src/components-v2/feature/nft/price-action-bar';
import ListingsTab from '@src/components-v2/feature/nft/tabs/listings';
import MakeOfferDialog from '@src/components-v2/shared/dialogs/make-offer';
import {OFFER_TYPE} from '@src/Components/Offer/MadeOffers/MadeOffersRow';
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {appConfig} from "@src/config";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {
  Box,
  Button as ChakraButton,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner, Tag,
  Text,
  useClipboard,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import {toast} from "react-toastify";
import {faHeart as faHeartOutline} from "@fortawesome/free-regular-svg-icons";
import {faFacebook, faSquareTwitter, faTelegram} from '@fortawesome/free-brands-svg-icons';
import useToggleFavorite from "@src/components-v2/feature/nft/hooks/useToggleFavorite";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {useAppDispatch, useAppSelector} from "@market/state/redux/store/hooks";
import OffersTab from "@src/components-v2/feature/nft/tabs/offers";
import {OfferState, OfferType} from "@src/core/services/api-service/types";
import ImageService from "@src/core/services/image";
import Properties from "@src/components-v2/feature/nft/tabs/properties";
import HistoryTab from "@src/components-v2/feature/nft/tabs/history";
import {ApiService} from "@src/core/services/api-service";
import useAuthedFunction from "@market/hooks/useAuthedFunction";
import {useUser} from "@src/components-v2/useUser";
import {SecondaryButton} from "@src/components-v2/foundation/button";
import {getBlockExplorerLink} from "@dex/utils";
import {ChainLogo} from "@dex/components/logo";
import {getChainByIdOrSlug} from "@src/helpers";
import chainConfigs from "@src/config/chains";
import {ChainId} from "@pancakeswap/chains";

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
  chain: number;
  collection: any;
}

const Nft1155 = ({ address, id, chain, collection }: Nft721Props) => {
  const dispatch = useAppDispatch();
  const chainConfig = getChainByIdOrSlug(chain);

  const { onCopy } = useClipboard(appUrl(`/collection/${chainConfig?.slug ?? chain}/${address}/${id}`).toString());
  const [runAuthedFunction] = useAuthedFunction();
  const borderColor = useColorModeValue('gray.300', 'white');
  const [shareOptions, setShareOptions] = useState<any[]>([]);

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
    dispatch(getNftDetails(address, id, chain));
  }, [dispatch, address, id]);

  const [royalty, setRoyalty] = useState<number | null>(null);
  useEffect(() => {
    async function getRoyalty() {
      const royalty = await collectionRoyaltyPercent(address, id, chain);
      setRoyalty(royalty);
    }
    getRoyalty();
  }, []);

  const copyLink = useCallback(() => {
    if (typeof navigator !== 'undefined' && typeof window !== 'undefined') {
      onCopy();
      toast.info(`Link copied!`);
    }
  }, [onCopy, toast]);

  const MenuItems = (
    shareOptions.map(option => (
      <React.Fragment key={option.url}>
        {option.type === 'url' ? (
          <MenuItem>
            <Link href={option.url} target='_blank' >
              <HStack>
                <FontAwesomeIcon icon={option.icon} />
                <Box>{option.label}</Box>
              </HStack>
            </Link>
          </MenuItem>
        ) : (
          <MenuItem onClick={option.handleClick} key={option.label}>
            <HStack>
              <FontAwesomeIcon icon={option.icon} />
              <Box>{option.label}</Box>
            </HStack>
          </MenuItem>
        )}
      </React.Fragment>
    )));

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
        collection: [nft.nftAddress],
        tokenId: nft.nftId,
        state: OfferState.ACTIVE,
        pageSize: 1
      });
      setOfferType(existingOffer.data.length > 0 ? OFFER_TYPE.update : OFFER_TYPE.make);
    }
    if (!offerType && user.address && nft && nft.nftAddress && nft.nftId) {
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
    user.refreshProfile();
  };

  const isFavorite = () => {
    if (!user.profile?.favorites) return false;
    return user.profile.favorites.find((f: any) => ciEquals(address, f.tokenAddress) && id === f.tokenId);
  }

  useEffect(() => {
    const menuOptions = () => {
      if (typeof navigator !== 'undefined' && typeof window !== 'undefined') {
        const location = window.location.href;
        return [
          {
            url: `https://www.facebook.com/sharer/sharer.php?u=${location}`,
            label: 'Share on Facebook',
            icon: faFacebook,
            type: 'url'
          },
          {
            url: `https://twitter.com/intent/tweet?text=${location}`,
            label: 'Share on Twitter',
            icon: faSquareTwitter,
            type: 'url'
          },
          {
            url: `https://telegram.me/share/?url=${location}`,
            label: 'Share on Telegram',
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
      }
      return [];
    };

    setShareOptions(menuOptions());
  }, []);

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
                <ButtonGroup size='md' isAttached variant='outline'>
                  <SecondaryButton title="Refresh Metadata" onClick={onRefreshMetadata} disabled={refreshing}>
                    <FontAwesomeIcon icon={faSync} spin={refreshing} />
                  </SecondaryButton>
                  <SecondaryButton
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
                  </SecondaryButton>
                  {nft && nft.original_image && (
                    <SecondaryButton title="View Full Image" onClick={() =>
                      typeof window !== 'undefined' &&
                      window.open(specialImageTransform(address, fullImage()), '_blank')
                    }>
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </SecondaryButton>
                  )}
                  {/*<Menu MenuItems={MenuItems} MenuButton={MenuButton()} />*/}
                  <Menu>
                    <MenuButton
                      as={Button}
                      variant='outline'
                      borderColor={borderColor}
                    >
                      <Icon as={FontAwesomeIcon} icon={faShareAlt} style={{ cursor: 'pointer' }} />
                    </MenuButton>
                    <MenuList>
                      {MenuItems}
                    </MenuList>
                  </Menu>
                </ButtonGroup>
              </div>
            </div>
            <div className="col-md-6">
              {nft && (
                <div className="item_info">
                  <Heading>{nft.name}</Heading>

                  {nft.description && (
                    <Box mb={2}>
                      <Text noOfLines={showFullDescription ? 0 : 2}>{nft.description}</Text>
                      {nft.description.length > 60 && (
                        <ChakraButton variant="link" onClick={() => setShowFullDescription(!showFullDescription)}>
                          See {showFullDescription ? 'less' : 'more'}
                          {showFullDescription ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </ChakraButton>
                      )}
                    </Box>
                  )}

                  <Box mb={2}>
                    <Tag size='sm' colorScheme='teal' variant='subtle' cursor='pointer' py={1}>
                      <HStack>
                        <ChainLogo chainId={chainConfig?.chain.id} />
                        <Box>{chainConfig?.chain.name}</Box>
                      </HStack>
                    </Tag>
                  </Box>

                  {isCollectionListable(collection) && (
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
                      avatar={collectionMetadata?.avatar ? ImageService.translate(collectionMetadata?.avatar).avatar() : undefined}
                      address={address}
                      verified={collection.verification?.verified}
                      to={`/collection/${chainConfig?.slug ?? chain}/${collectionSlug}`}
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
                      {isCollectionListable(collection) && (
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
                                  chainSlug={chainConfig?.slug ?? chainConfigs[ChainId.CRONOS].slug}
                                  attributes={nft.attributes}
                                  queryKey='traits'
                                />
                              )}
                              {nft.attributes && Array.isArray(nft.properties) && (
                                <Properties
                                  address={address}
                                  slug={nft.collectionSlug}
                                  chainSlug={chainConfig?.slug ?? chainConfigs[ChainId.CRONOS].slug}
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
                        <Box className="tab-1 onStep fadeIn" mb={3}>
                          <VStack align='stretch'>
                            <Flex justify='space-between'>
                              <Box>Contract Address</Box>
                              <Box>
                                <Link href={getBlockExplorerLink(address, 'address', nft.chain)} target="_blank">
                                  {shortAddress(address)}
                                  <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-2 text-muted" />
                                </Link>
                              </Box>
                            </Flex>
                            <Flex justify='space-between'>
                              <Box>Token ID</Box>
                              <Box>
                                <Link href={getBlockExplorerLink(`${address}?a=${id}`, 'token', nft.chain)} target="_blank">
                                  {id.length > 10 ? shortAddress(id) : id}
                                  <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-2 text-muted" />
                                </Link>
                              </Box>
                            </Flex>
                            <Flex justify='space-between'>
                              <Box>Token Standard</Box>
                              <Box>{collection.is1155 ? 'CRC-1155' : 'CRC-721'}</Box>
                            </Flex>
                            <Flex justify='space-between'>
                              <Box>Supply</Box>
                              <Box>{nft.supply}</Box>
                            </Flex>
                            <Flex className="d-flex justify-content-between">
                              <Box>Royalty</Box>
                              <Box>{royalty ? `${royalty}%` : 'N/A'}</Box>
                            </Flex>
                          </VStack>
                        </Box>
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
