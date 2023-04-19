import React, {memo, useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Contract, ethers} from 'ethers';
import {faHeart as faHeartOutline} from '@fortawesome/free-regular-svg-icons';
import {
  faCopy,
  faCrow,
  faExternalLinkAlt,
  faHeart as faHeartSolid,
  faShareAlt,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import MetaMaskOnboarding from '@metamask/onboarding';
import {Badge, Spinner} from 'react-bootstrap';

import ProfilePreview from '@src/Components/components/ProfilePreview';
import LayeredIcon from '@src/Components/components/LayeredIcon';
import {AnyMedia, MultimediaImage} from "@src/components-v2/shared/media/any-media";
import ProfileImage from '@src/Components/components/ProfileImage'

import {
  appUrl,
  caseInsensitiveCompare,
  isAnyWeirdApesCollection,
  isArgonautsBrandCollection,
  isBabyWeirdApesCollection,
  isCroCrowCollection,
  isCrognomidesCollection,
  isCroSkullPetsCollection,
  isEmptyObj,
  isEvoSkullCollection,
  isLadyWeirdApesCollection,
  isLazyHorseCollection,
  isLazyHorsePonyCollection,
  isNftBlacklisted, isVoxelWeirdApesCollection,
  isWeirdApesCollection,
  rankingsLinkForCollection,
  rankingsLogoForCollection,
  rankingsTitleForCollection,
  shortAddress,
  timeSince,
} from '@src/utils';
import {getNftDetails, refreshMetadata, tickFavorite} from '@src/GlobalState/nftSlice';
import {chainConnect, connectAccount, retrieveProfile} from '@src/GlobalState/User';
import {specialImageTransform} from '@src/hacks';
import ListingItem from './tabs/listings/item';
import PriceActionBar from './price-action-bar';
import {ERC721} from '@src/Contracts/Abis';
import {getFilteredOffers} from '@src/core/subgraph';
import MakeOfferDialog from '@src/Components/Offer/Dialogs/MakeOfferDialog';
import NFTTabOffers from '@src/Components/Offer/NFTTabOffers';
import {OFFER_TYPE} from '@src/Components/Offer/MadeOffers/MadeOffersRow';
import {offerState} from '@src/core/api/enums';
import {commify} from 'ethers/lib/utils';
import {appConfig} from '@src/Config';
import {hostedImage} from '@src/helpers/image';
import Link from 'next/link';
import axios from "axios";
import Button, {LegacyOutlinedButton} from "@src/Components/components/common/Button";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {
  Box,
  Button as ChakraButton,
  ButtonGroup,
  Flex,
  Heading,
  MenuButton as MenuButtonCK,
  Stack,
  Text,
  useClipboard
} from "@chakra-ui/react";
import {toast} from "react-toastify";
import {Menu} from '@src/Components/components/chakra-components';
import {faFacebook, faSquareTwitter, faTelegram} from '@fortawesome/free-brands-svg-icons';
import {useQuery} from "@tanstack/react-query";
import {getCollections} from "@src/core/api/next/collectioninfo";
import {ImageContainer} from "@src/Components/Bundle";
import {getTheme} from "@src/Theme/theme";
import useToggleFavorite from "@src/components-v2/feature/nft/hooks/useToggleFavorite";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {useAppSelector} from "@src/Store/hooks";
import {ContractInterface} from "@ethersproject/contracts";
import Trait from "@src/components-v2/feature/nft/trait";
import ImageService from "@src/core/services/image";

const config = appConfig();
const tabs = {
  properties: 'properties',
  powertraits: 'powertraits',
  history: 'history',
  offers: 'offers',
  info: 'info',
  breeding: 'breeding',
  items: 'items',
};

interface Nft721Props {
  address: string;
  id: string;
  nft: any;
  isBundle?: boolean;
}

const Nft721 = ({ address, id, nft, isBundle = false }: Nft721Props) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const { refreshing, favorites, loading:isLoading } = useAppSelector((state) => state.nft);
  const { onCopy } = useClipboard(appUrl(`/collection/${address}/${id}`).toString());

  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);
  const [offerType, setOfferType] = useState(OFFER_TYPE.none);
  const [offerData, setOfferData] = useState();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const currentListing = useAppSelector((state) => state.nft.currentListing);
  const listingHistory = useAppSelector((state) =>
    state.nft.history.filter((i: any) => i.state === 1).sort((a: any, b: any) => (a.saleTime < b.saleTime ? 1 : -1))
  );

  const powertraits = useAppSelector((state) => state.nft.nft?.powertraits);


  const collectionStats = useAppSelector((state) => state.collection.stats);

  const { isLoading: isLoadingCollection, error, data, status } = useQuery(['Collections', address], () =>
    getCollections({ address }),
  )

  const [collection, setCollection] = useState<any>(null);

  // useEffect(() => {
  //   if (collection) {
  //     async function asyncFunc() {
  //       dispatch(getStats(collection, null, collection.mergedAddresses));
  //     }
  //     asyncFunc();
  //   }
  //   // eslint-disable-next-line
  // }, [dispatch, collection]);

  useEffect(() => {
    if (!isLoadingCollection && data) {
      setCollection(data.data.collections[0])
    }
  }, [isLoadingCollection, data])

  const collectionMetadata = useSelector((state) => {
    return collection?.metadata;
  });
  const collectionName = useSelector((state) => {
    return collection?.name;
  });

  const [{ isLoading: isFavoriting, response, error: errorTF }, toggleFavorite] = useToggleFavorite();

  const copyLink = useCallback(() => {
    onCopy();
    toast.info(`Link copied!`);
  }, [navigator, window.location])

  const options = [
    {
      url: 'https://www.facebook.com/sharer/sharer.php?u=',
      label: 'Share on Facebook',
      icon: faFacebook,
      type: 'url'
    },
    {
      url: 'https://twitter.com/intent/tweet?text=',
      label: 'Share on Twitter',
      icon: faSquareTwitter,
      type: 'url'
    },
    {
      url: 'https://telegram.me/share/?url=',
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

  // Custom breeding considerations
  const [croCrowBreed, setCroCrowBreed] = useState(null);
  const [crognomideBreed, setCrognomideBreed] = useState(null);
  const [babyWeirdApeBreed, setBabyWeirdApeBreed] = useState<any>(null);
  const [ladyWeirdApeChildren, setLadyWeirdApeChildren] = useState<number | null>(null);
  const [voxelClaimed, setVoxelClaimed] = useState(false);
  const [onChainPowertraits, setOnChainPowertraits] = useState<{ key: string; value: unknown; type: string; }[]>();
  const [lazyHorseTraits, setLazyHorseTraits] = useState<any>([]);
  const [customProfile, setCustomProfile] = useState({
    name: null,
    description: null
  });

  const [royalty, setRoyalty] = useState<number | null>(null);
  useEffect(() => {
    async function getRoyalty() {
      const royalty = await collectionRoyaltyPercent(address, id);
      setRoyalty(royalty);
    }
    getRoyalty();
  }, []);

  useEffect(() => {
    dispatch(getNftDetails(address, id));
  }, [dispatch, address, id]);

  useEffect(() => {
    async function asyncFunc() {
      if (isCroCrowCollection(address) && croCrowBreed === null) {
        const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
        const crowpunkContract = new Contract(
          '0x0f1439a290e86a38157831fe27a3dcd302904055',
          [
            'function availableCrows(address _owner) public view returns (uint256[] memory, bool[] memory)',
            'function isCrowUsed(uint256 tokenId) public view returns (bool)',
          ],
          readProvider
        );
        const croCrowContract = new Contract('0xE4ab77ED89528d90E6bcf0E1Ac99C58Da24e79d5', ERC721, readProvider);
        try {
          if (parseInt(id) < 3500) {
            const used = await crowpunkContract.isCrowUsed(id);
            setCroCrowBreed(used);
          } else {
            const ownerAddress = await croCrowContract.ownerOf(id);
            const crows = await crowpunkContract.availableCrows(ownerAddress);
            for (const [i, o] of crows[0].entries()) {
              if (o.toNumber() === parseInt(id)) {
                setCroCrowBreed(crows[1][i]);
                return;
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        setCroCrowBreed(null);
      }
    }

    asyncFunc();

    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    async function getCrognomid() {
      if (isCrognomidesCollection(address) && crognomideBreed === null) {
        const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
        const contract = new Contract(
          '0xE57742748f98ab8e08b565160D3A9A32BFEF7352',
          ['function crognomidUsed(uint256) public view returns (bool)'],
          readProvider
        );
        try {
          const used = await contract.crognomidUsed(id);
          setCrognomideBreed(used);
        } catch (error) {
          console.log(error);
        }
      } else {
        setCrognomideBreed(null);
      }
    }
    getCrognomid();

    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    async function getApeInfo() {
      if (isBabyWeirdApesCollection(address)) {
        const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
        const abiFile = require(`@src/Assets/abis/baby-weird-apes.json`);
        const contract = new Contract(address, abiFile.abi, readProvider);
        try {
          const apeInfo = await contract.apeInfo(id);
          setBabyWeirdApeBreed(apeInfo);
        } catch (error) {
          console.log(error);
        }
      } else {
        setBabyWeirdApeBreed(null);
      }
    }
    getApeInfo();

    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    async function getApeInfo() {
      if (isAnyWeirdApesCollection(address)) {
        const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
        const abiFile = require(`@src/Assets/abis/weird-apes-bio.json`);
        const contract = new Contract('0x213f9b2ead19522a063b3d5c8429ca759ffda812', abiFile, readProvider);
        try {
          let apeInfo;
          if (isWeirdApesCollection(address)) {
            apeInfo = await contract.infoGWAC(id);
            const voxelAbi = require(`@src/Assets/abis/voxel-weird-apes.json`);
            const voxelContract = new Contract('0xe02a74813053e96c5c98f817c0949e0b00728ef6', voxelAbi, readProvider);
            const isClaimed = await voxelContract.isClaimed(id);
            setVoxelClaimed(isClaimed);
          } else if (isLadyWeirdApesCollection(address)) {
            apeInfo = await contract.infoLWAC(id);
          } else if (isBabyWeirdApesCollection(address)) {
            apeInfo = await contract.infoBWAC(id);
          } else if (isVoxelWeirdApesCollection(address)) {
            apeInfo = await contract.infoVWAC(id);
          } else return;

          setCustomProfile({
            name: apeInfo._name.length > 0 ? apeInfo._name : null,
            description: apeInfo._lore.length > 0 ? apeInfo._lore : null
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        setCustomProfile({ name: null, description: null });
      }
    }
    getApeInfo();

    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    async function getAttributes(abi: ContractInterface) {
      const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
      const contract = new Contract(address, abi, readProvider);
      try {
        const traits = await contract.getToken(id);
        return Object.entries(traits.currentToken)
          .filter(([key]) => {
            return !/[^a-zA-Z]/.test(key);
          })
          .map(([key, value], i) => {
            let type = 'string';
            if (typeof value == 'boolean') {
              type = 'boolean';
              value = value ? 'yes' : 'no';
            } else if (key === 'lastClaimTimestamp') {
              type = 'date';
            } else if (key === 'lastActionBlock') {
              value = commify(value as string);
            }
            return { key, value, type };
          });
      } catch (error) {
        console.log(error);
      }
    }
    async function getEvoSkullAttributes() {
      if (isEvoSkullCollection(address)) {
        const abiFile = require(`@src/Assets/abis/evo-skull.json`);
        const attributes = await getAttributes(abiFile);
        setOnChainPowertraits(attributes);
      } else {
        setOnChainPowertraits([]);
      }
    }
    async function getCroSkullPetsAttributes() {
      if (isCroSkullPetsCollection(address)) {
        const abiFile = require(`@src/Assets/abis/croskull-pets.json`);
        const attributes = await getAttributes(abiFile.abi);
        setOnChainPowertraits(attributes);
      } else {
        setOnChainPowertraits([]);
      }
    }
    getEvoSkullAttributes();
    getCroSkullPetsAttributes();

    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    async function getLazyHorseName() {
      if (isLazyHorseCollection(address) || isLazyHorsePonyCollection(address)) {
        const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
        const contract = new Contract(address, ERC721, readProvider);
        try {
          const uri = await contract.tokenURI(id);
          await axios.get(uri)
            .then((response) => {
              setCustomProfile({ name: response.data.name.length > 0 ? response.data.name : null, description: null });
              setLazyHorseTraits([
                response.data.attributes.find((trait: any) => trait.trait_type === 'Race Count'),
                response.data.attributes.find((trait: any) => trait.trait_type === 'Breeded'),
              ])
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        setCustomProfile({ name: null, description: null });
      }
    }
    getLazyHorseName();

    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    async function getLadyApeInfo() {
      if (isLadyWeirdApesCollection(address)) {
        const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
        const abiFile = require(`@src/Assets/abis/lady-weird-apes-children.json`);
        const contract = new Contract(address, abiFile.abi, readProvider);
        try {
          const numChildren = await contract.numChildren(id);
          setLadyWeirdApeChildren(3 - numChildren);
        } catch (error) {
          console.log(error);
        }
      } else {
        setLadyWeirdApeChildren(null);
      }
    }
    getLadyApeInfo();

    // eslint-disable-next-line
  }, [address]);

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
  useEffect(() => { setCurrentTab(isBundle ? tabs.items : tabs.properties)}, [isBundle] )
  const handleTabChange = useCallback((tab: string) => {
    setCurrentTab(tab);
  }, [isBundle, currentTab]);

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
    dispatch(refreshMetadata(address, id, currentListing?.listingId));
  }, [address, id, currentListing]);

  useEffect(() => {
    async function func() {
      const filteredOffers = await getFilteredOffers(nft.address, nft.id.toString(), user.address);
      const data = filteredOffers ? filteredOffers.data.filter((o: any) => o.state === offerState.ACTIVE.toString()) : [];
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
    if (isEmptyObj(user.profile) || !user.address) {
      toast.info(`Connect wallet and create a profile to start adding favorites`);
      return;
    }
    if ((user.profile as any).error) {
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
    if (!(user.profile as any)?.favorites) return false;
    return (user.profile as any).favorites.find((f: any) => caseInsensitiveCompare(address, f.tokenAddress) && id === f.tokenId);
  }

  return (
    <div>
      {isLoading || isLoadingCollection || !collection ? (
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
                isBundle ? (
                  <ImageContainer nft={nft} />
                ) : nft.useIframe ? (
                  <iframe width="100%" height="636" src={nft.iframeSource} title="nft" />
                ) : (
                  <>
                    <AnyMedia
                      image={ImageService.proxy.convert(specialImageTransform(address, nft.image))}
                      video={nft.video ?? nft.animation_url}
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
                  {isNftBlacklisted(address, id) ? (
                    <div className="mb-4">
                      <Heading className="mb-0">{customProfile.name ?? nft.name}</Heading>
                      <div className="d-flex">
                        <Badge bg="danger">Blacklisted</Badge>
                      </div>
                    </div>
                  ) : (
                    <Heading>{customProfile.name ?? nft.name}</Heading>
                  )}

                  {(customProfile.description ?? nft.description) && (
                    <Box mb={4}>
                      <Text noOfLines={showFullDescription ? 0 : 2}>{customProfile.description ?? nft.description}</Text>
                      {(customProfile.description ?? nft.description).length > 60 && (
                        <ChakraButton variant="link" onClick={() => setShowFullDescription(!showFullDescription)}>
                          See {showFullDescription ? 'less' : 'more'}
                          {showFullDescription ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </ChakraButton>
                      )}
                    </Box>
                  )}

                  {isCroCrowCollection(address) && croCrowBreed && (
                    <div className="d-flex flex-row align-items-center mb-4">
                      <LayeredIcon
                        icon={faCrow}
                        bgColor={'#ed7a11'}
                        color={'#000'}
                        inverse={false}
                        title="This crow has been bred to create a CrowPunk!"
                      />
                      <span className="fw-bold">This CRO Crow has been bred for a CrowPunk</span>
                    </div>
                  )}
                  {isCrognomidesCollection(address) && crognomideBreed && (
                    <div className="d-flex flex-row align-items-center mb-4">
                      <LayeredIcon
                        icon={faHeartSolid}
                        bgColor={'#ffffff00'}
                        color={'#dc143c'}
                        inverse={false}
                        title="This Crognomide has been bred for a Croby!"
                      />
                      <span className="fw-bold">This Crognomide has been bred for a Croby</span>
                    </div>
                  )}
                  {isLadyWeirdApesCollection(address) && ladyWeirdApeChildren !== null && (
                    <div className="d-flex flex-row align-items-center mb-4">
                      <LayeredIcon
                        icon={faHeartSolid}
                        bgColor={'#ffffff00'}
                        color={'#dc143c'}
                        inverse={false}
                        title={`This Lady Weird Ape can make ${ladyWeirdApeChildren} ${ladyWeirdApeChildren === 1 ? 'baby' : 'babies'}`}
                      />
                      <span className="fw-bold">This Lady Weird Ape can make {`${ladyWeirdApeChildren} ${ladyWeirdApeChildren === 1 ? 'baby' : 'babies'}`}</span>
                    </div>
                  )}
                  {isWeirdApesCollection(address) && voxelClaimed && (
                    <div className="d-flex flex-row align-items-center mb-4">
                      <LayeredIcon
                        icon={faHeartSolid}
                        bgColor={'#ffffff00'}
                        color={'#dc143c'}
                        inverse={false}
                        title={`This Weird Ape has claimed a Voxel Weird Ape`}
                      />
                      <span className="fw-bold">This Weird Ape has claimed a Voxel Weird Ape</span>
                    </div>
                  )}
                  
                  {collection.listable && !nft.burnt && (
                    <PriceActionBar
                      offerType={offerType}
                      collectionName={collectionName}
                      isVerified={collection.verification?.verified}
                      onOfferSelected={() => handleMakeOffer()}
                      isOwner={caseInsensitiveCompare(user.address, nft.owner)}
                      collectionStats={collectionStats} />
                  )}

                  <div className="row" style={{ gap: '2rem 0' }}>
                    {nft.owner ? (
                      <ProfileImage address={nft.owner} title='Owner' displayName />
                    ) : (currentListing && collection.listable) && (
                      <ProfilePreview
                        type="Owner"
                        address={currentListing.seller}
                        to={`/account/${currentListing.seller}`}
                        useCnsLookup={true}
                      />
                    )}

                    <ProfilePreview
                      type="Collection"
                      title={collectionName ?? 'View Collection'}
                      avatar={hostedImage(collectionMetadata?.avatar, true)}
                      address={address}
                      verified={collection.verification?.verified}
                      to={`/collection/${address}`}
                    />

                    {typeof nft.rank !== 'undefined' && nft.rank !== null && (
                      <ProfilePreview
                        type="Rarity Rank"
                        title={nft.rank}
                        avatar={rankingsLogoForCollection(collection)}
                        hover={rankingsTitleForCollection(collection)}
                        to={rankingsLinkForCollection(collection, nft.id)}
                        pop={true}
                      />
                    )}
                  </div>


                  {isArgonautsBrandCollection(nft.address) ? (
                    <Box my={6}>
                      <Button styleType="default-outlined" borderColor={getTheme(user.theme).colors.textColor4}>
                        <a href={`https://hub.argofinance.money/${nft.owner}`} target="_blank" className="fw-bold" style={{ fontSize: '0.8em' }}>
                          <span className="color">View Argonaut's Hub</span>
                        </a>
                      </Button>
                    </Box>
                  ) : (
                    <div className="spacer-40"></div>
                  )}

                  <div className="de_tab">
                    <ul className="de_nav nft_tabs_options">
                      {isBundle ? (
                        <li className={`tab ${currentTab === tabs.items ? 'active' : ''}`}>
                          <span onClick={() => handleTabChange(tabs.items)}>Items</span>
                        </li>
                      ) : (
                        <li className={`tab ${currentTab === tabs.properties ? 'active' : ''}`}>
                          <span onClick={() => handleTabChange(tabs.properties)}>Properties</span>
                        </li>
                      )}
                      {((powertraits && powertraits.length > 0) || (onChainPowertraits && onChainPowertraits.length > 0)) && (
                        <li className={`tab ${currentTab === tabs.powertraits ? 'active' : ''}`}>
                          <span onClick={() => handleTabChange(tabs.powertraits)}>In-Game Attributes</span>
                        </li>
                      )}
                      <li className={`tab ${currentTab === tabs.history ? 'active' : ''}`}>
                        <span onClick={() => handleTabChange(tabs.history)}>History</span>
                      </li>
                      <li className={`tab ${currentTab === tabs.offers ? 'active' : ''}`}>
                        <span onClick={() => handleTabChange(tabs.offers)}>Offers</span>
                      </li>
                      {!isBundle && (
                        <li className={`tab ${currentTab === tabs.info ? 'active' : ''}`}>
                          <span onClick={() => handleTabChange(tabs.info)}>Info</span>
                        </li>
                      )}
                      {babyWeirdApeBreed && (
                        <li className={`tab ${currentTab === tabs.breeding ? 'active' : ''}`}>
                          <span onClick={() => handleTabChange(tabs.breeding)}>Breed Info</span>
                        </li>
                      )}
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
                                    .filter((a: any) => a.value !== 'None')
                                    .map((data: any, i: number) => {
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
                                  nft.properties.map((data: any, i: number) => {
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
                      )}
                      {currentTab === tabs.powertraits && (
                        <div className="tab-2 onStep fadeIn">
                          {(powertraits && powertraits.length > 0) || (onChainPowertraits && onChainPowertraits.length > 0) || (lazyHorseTraits && lazyHorseTraits.length > 0) ? (
                            <>
                              <div className="d-block mb-3">
                                <div className="row gx-3 gy-2">
                                  {powertraits &&
                                    powertraits.length > 0 &&
                                    powertraits.map((data: any, i: number) => {
                                      return (
                                        <Trait
                                          key={i}
                                          title={data.trait_type}
                                          value={data.value}
                                          valueDisplay={data.value > 0 ? `+ ${data.value}` : data.value}
                                          percent={data.percent}
                                          occurrence={data.occurrence}
                                          type={data.display_type}
                                          collectionAddress={address}
                                          collectionSlug={collection.slug}
                                          queryKey="powertraits"
                                        />
                                      );
                                    })}
                                  {onChainPowertraits &&
                                    Array.isArray(onChainPowertraits) &&
                                    onChainPowertraits.map((data: any, i) => {
                                      return (
                                        <Trait
                                          key={i}
                                          title={data.key}
                                          value={data.value}
                                          type={data.type}
                                          collectionAddress={address}
                                        />
                                      );
                                    })}
                                  {lazyHorseTraits &&
                                    Array.isArray(lazyHorseTraits) &&
                                    lazyHorseTraits.map((data: any, i) => {
                                      return (
                                        <Trait
                                          key={i}
                                          title={data.trait_type}
                                          value={data.value}
                                        />
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
                          {listingHistory && listingHistory.length > 0 ? (
                            <>
                              {listingHistory.map((listing: any, index: number) => (
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

                      {currentTab === tabs.offers && <NFTTabOffers nftAddress={address} nftId={id} />}

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

                      {currentTab === tabs.breeding && babyWeirdApeBreed && (
                        <div className="tab-2 onStep fadeIn">
                          <div className="d-block mb-3">
                            <div className="row mt-5 gx-3 gy-2">
                              {babyWeirdApeBreed.breedStatus ? (
                                <div key={0} className="col-lg-4 col-md-6 col-sm-6">
                                  <div className="nft_attr">
                                    <h5>Birthdate</h5>
                                    {babyWeirdApeBreed.birthdate.gt(0) ? (
                                      <h4>
                                        {new Date(babyWeirdApeBreed.birthdate.toNumber() * 1000).toLocaleDateString()}
                                      </h4>
                                    ) : (
                                      <h4>Unknown</h4>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div key={0} className="col-lg-4 col-md-6 col-sm-6">
                                  <div className="nft_attr">
                                    <h5>Incubator ID</h5>
                                    <h4>{id}</h4>
                                  </div>
                                </div>
                              )}
                              <div key={1} className="col-lg-4 col-md-6 col-sm-6">
                                <div className="nft_attr">
                                  <h5>Mother ID</h5>
                                  <h4>{babyWeirdApeBreed.mother.toNumber()}</h4>
                                </div>
                              </div>
                              <div key={2} className="col-lg-4 col-md-6 col-sm-6">
                                <div className="nft_attr">
                                  <h5>Father ID</h5>
                                  <h4>
                                    <a href={`/collection/weird-apes-club/${babyWeirdApeBreed.father.toNumber()}`}>
                                      {babyWeirdApeBreed.father.toNumber()}
                                    </a>
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentTab === tabs.items && (
                        <Flex flexDir='column' gap='8px' maxH='340ox' overflowY='auto'>
                          {nft.nfts?.map((nft: any, i: number) => (
                            <Box p='16px' key={i}>
                              <Flex gap='15px'>
                                <Box w='72px'>
                                  <MultimediaImage
                                    source={ImageService.proxy.fixedWidth(specialImageTransform(nft.address, nft.image), 100, 100)}
                                    fallbackSource={ImageService.instance.provider.fixedWidth(ImageService.proxy.thumbnail(nft.image), 100, 100)}
                                    title={nft.name}
                                    className="img-fluid img-rounded mb-sm-30"
                                  />
                                </Box>
                                <Stack>
                                  {nft.collectionName && (
                                    <Link href={`/collection/${nft.collectionSlug ?? nft.address}`}>
                                      <h6
                                        className="card-title mt-auto fw-normal mb-0"
                                        style={{ fontSize: '12px', color: getTheme(user.theme).colors.textColor4 }}
                                      >
                                        {nft.collectionName}
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
          initialNft={nft}
          nftAddress={address}
          nftId={undefined}
        />
      )}
    </div>
  );
};

export default memo(Nft721);


