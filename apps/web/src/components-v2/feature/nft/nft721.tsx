import React, {memo, useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Contract, ContractInterface, ethers} from 'ethers';
import {faHeart as faHeartOutline} from '@fortawesome/free-regular-svg-icons';
import {
  faCopy,
  faCrow,
  faDownload,
  faExternalLinkAlt,
  faHeart as faHeartSolid,
  faHeartBroken,
  faShareAlt,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import NftPropertyLabel from '@src/components-v2/feature/nft/property-label';
import LayeredIcon from '@src/Components/components/LayeredIcon';
import {AnyMedia, MultimediaImage} from "@src/components-v2/shared/media/any-media";
import NftProfilePreview from '@src/components-v2/feature/nft/profile-preview'

import {
  appUrl,
  ciEquals,
  findNextLowestNumber,
  isAnyWeirdApesCollection,
  isArgonautsBrandCollection,
  isBabyWeirdApesCollection,
  isCroCrowCollection,
  isCrognomidesCollection,
  isCroSkullPetsCollection,
  isEmptyObj,
  isEvoSkullCollection,
  isHeroesCollection,
  isLadyWeirdApesCollection,
  isLazyHorseCollection,
  isLazyHorsePonyCollection,
  isNftBlacklisted,
  isVaultCollection,
  isVoxelWeirdApesCollection,
  isWeirdApesCollection,
  rankingsLinkForCollection,
  rankingsLogoForCollection,
  rankingsTitleForCollection,
  shortAddress,
} from '@market/helpers/utils';
import {getNftDetails, refreshMetadata, tickFavorite} from '@market/state/redux/slices/nftSlice';
import {specialImageTransform} from '@market/helpers/hacks';
import PriceActionBar from './price-action-bar';
import {ERC721} from '@src/global/contracts/Abis';
import MakeOfferDialog from '@src/components-v2/shared/dialogs/make-offer';
import {OFFER_TYPE} from '@src/Components/Offer/MadeOffers/MadeOffersRow';
import {commify} from 'ethers/lib/utils';
import {appConfig} from '@src/config';
import Link from 'next/link';
import axios from "axios";
import Button from "@src/Components/components/common/Button";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {
  Box,
  Button as ChakraButton,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  HStack,
  MenuButton as MenuButtonCK,
  Spinner,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
  useClipboard,
  VStack
} from "@chakra-ui/react";
import {toast} from "react-toastify";
import {Menu} from '@src/Components/components/chakra-components';
import {faFacebook, faSquareTwitter, faTelegram} from '@fortawesome/free-brands-svg-icons';
import {useQuery} from "@tanstack/react-query";
import {getCollections} from "@src/core/api/next/collectioninfo";
import {ImageContainer} from "@src/Components/Bundle";
import {getTheme} from "@src/global/theme/theme";
import useToggleFavorite from "@src/components-v2/feature/nft/hooks/useToggleFavorite";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {useAppDispatch, useAppSelector} from "@market/state/redux/store/hooks";
import ImageService from "@src/core/services/image";
import OffersTab from "@src/components-v2/feature/nft/tabs/offers";
import {OfferState, OfferType} from "@src/core/services/api-service/types";
import Properties from "@src/components-v2/feature/nft/tabs/properties";
import HistoryTab from "@src/components-v2/feature/nft/tabs/history";
import {ApiService} from "@src/core/services/api-service";
import DynamicNftImage from '@src/components-v2/shared/media/dynamic-nft-image';
import useAuthedFunction from "@market/hooks/useAuthedFunction";
import {useUser} from "@src/components-v2/useUser";
import {getBlockExplorerLink} from "@dex/utils";
import {ChainLogo} from "@dex/components/logo";
import {getChainByIdOrSlug} from "@src/helpers";

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
  chain: number;
  slug?: string;
  nft: any;
  isBundle?: boolean;
}

const Nft721 = ({ address, id, chain, slug, nft, isBundle = false }: Nft721Props) => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const chainConfig = getChainByIdOrSlug(chain);

  const { refreshing, favorites, loading:isLoading } = useAppSelector((state) => state.nft);
  const { onCopy } = useClipboard(appUrl(`/collection/${chain}/${address}/${id}`).toString());
  const [runAuthedFunction] = useAuthedFunction();

  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);
  const [offerType, setOfferType] = useState(OFFER_TYPE.none);
  const [offerData, setOfferData] = useState();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const currentListing = useAppSelector((state) => state.nft.currentListing);
  const powertraits = useAppSelector((state) => state.nft.nft?.powertraits);

  const { isPending: isLoadingCollection, error, data, status } = useQuery({
    queryKey: ['Collections', address],
    queryFn: () => getCollections({address})
  });

  const [collection, setCollection] = useState<any>(null);
  const izanamiImageSize = useBreakpointValue(
    {base: 250, sm: 368, lg: 500},
    {fallback: 'md'}
  );

  const { data: rdConfig } = useQuery({
    queryKey: ['RyoshiDynastiesContext'],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getGlobalContext(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 61,
    refetchOnWindowFocus: false,
    enabled: isVaultCollection(address)
  });

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

  const retrieveLayeredImage = async() => {
      const response = await fetch(`/api/heroes/${id}`);
      return response.blob();
  }

  const [downloadingImage, setDownloadingImage] = useState(false);
  const downloadImage = async() => {
    try {
      setDownloadingImage(true);

      const blobImage = await retrieveLayeredImage();
      const href = URL.createObjectURL(blobImage);

      const anchorElement = document.createElement('a');
      anchorElement.href = href;
      anchorElement.download = `hero_${id}.png`;

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloadingImage(false);
    }

  }

  const [copyingImage, setCopyingImage] = useState(false);
  const copyImage = async() => {
    try {
      setCopyingImage(true);

      const blobImage = await retrieveLayeredImage();

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Unable to get canvas context');
        }
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Canvas toBlob failed');
          }
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]).then(() => {
            toast.success('Image copied!');
          }, (err) => {
            throw err;
          });
        }, 'image/png');
      };
      img.src = URL.createObjectURL(blobImage);
    } catch (error) {
      console.error(error);
    } finally {
      setCopyingImage(false);
    }
  }

  const DownloadImage = async (nftId:string) => {
    try {
      const response = await fetch(`/api/heroes/${nftId}`);
      const blobImage = await response.blob();

      const href = URL.createObjectURL(blobImage);

      const anchorElement = document.createElement('a');
      anchorElement.href = href;
      anchorElement.download = `hero_${nftId}.png`;

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    } catch (error) {
      console.error(error);
    }
  }
  const [{ isLoading: isFavoriting, response, error: errorTF }, toggleFavorite] = useToggleFavorite();

  const copyLink = useCallback(() => {
    if (typeof navigator !== 'undefined' && typeof window !== 'undefined') {
      onCopy();
      toast.info(`Link copied!`);
    }
  }, [onCopy, toast]);

  const shareOptions = () => {
    if (typeof navigator !== 'undefined' && typeof window !== 'undefined') {
      const location = window.location;
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
  }

  const MenuItems = (
    shareOptions().map(option => (
      option.type === 'url' ?
        (
          <div >
            <a href={option.url} target='_blank' >
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
      <MenuButtonCK as={ChakraButton}>
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
      const royalty = await collectionRoyaltyPercent(address, id, chain);
      setRoyalty(royalty);
    }
    getRoyalty();
  }, []);

  useEffect(() => {
    dispatch(getNftDetails(address, id, chain));
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
        const abiFile = require(`@market/assets/abis/baby-weird-apes.json`);
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
        const abiFile = require(`@market/assets/abis/weird-apes-bio.json`);
        const contract = new Contract('0x213f9b2ead19522a063b3d5c8429ca759ffda812', abiFile, readProvider);
        const voxelAbi = require(`@market/assets/abis/voxel-weird-apes.json`);
        const voxelContract = new Contract('0xe02a74813053e96c5c98f817c0949e0b00728ef6', voxelAbi, readProvider);
        try {
          let apeInfo;
          if (isWeirdApesCollection(address)) {
            apeInfo = await contract.infoGWAC(id);
            const isClaimed = await voxelContract.isClaimed(id);
            setVoxelClaimed(isClaimed);
          } else if (isLadyWeirdApesCollection(address)) {
            apeInfo = await contract.infoLWAC(id);
            const isClaimed = await voxelContract.isClaimed(Number(id)+2500);
            setVoxelClaimed(isClaimed);
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
        const abiFile = require(`@market/assets/abis/evo-skull.json`);
        const attributes = await getAttributes(abiFile);
        setOnChainPowertraits(attributes);
      } else {
        setOnChainPowertraits([]);
      }
    }
    async function getCroSkullPetsAttributes() {
      if (isCroSkullPetsCollection(address)) {
        const abiFile = require(`@market/assets/abis/croskull-pets.json`);
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
        const abiFile = require(`@market/assets/abis/lady-weird-apes-children.json`);
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

  useEffect(() => {
    async function getEbisuVaultsExtraAttributes() {
      if (isVaultCollection(address)) {
        let attributes = [];
        const startTime = nft.attributes.find((attribute: any) => attribute.trait_type === 'Start Time')?.value ?? 0;
        const endTime = nft.attributes.find((attribute: any) => attribute.trait_type === 'End Time')?.value ?? 0;

        const timeRemaining = (parseInt(endTime) - (Date.now() / 1000));
        const timeRemainingDays = Math.floor(timeRemaining / 86400);

        attributes.push({
          key: 'Days Remaining',
          value: `${timeRemainingDays} days`,
          type: 'string'
        });

        if (rdConfig) {
          const totalStakingDays = Math.floor((parseInt(endTime) - parseInt(startTime)) / 86400);
          const numTerms = Math.floor(totalStakingDays / rdConfig.bank.staking.fortune.termLength);
          const availableAprs = rdConfig.bank.staking.fortune.apr as any;
          let apr = 'N/A';
          console.log('availableAprs', availableAprs)
          if (availableAprs && Object.keys(availableAprs).length > 0) {
            const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
            apr = `${(availableAprs[aprKey] ?? availableAprs[1]) * 100}%`;
          }

          attributes.push({
            key: 'APR',
            value: apr,
            type: 'number'
          });
        }

        setOnChainPowertraits(attributes);
      } else {
        setOnChainPowertraits([]);
      }
    }
    getEbisuVaultsExtraAttributes();

    // eslint-disable-next-line
  }, [address, rdConfig]);

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

  const handleMakeOffer = async () => {
    await runAuthedFunction(() => setOpenMakeOfferDialog(!openMakeOfferDialog));
  };

  const onRefreshMetadata = useCallback(() => {
    dispatch(refreshMetadata(address, id, currentListing?.listingId));
  }, [address, id, currentListing]);

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
    if ((user.profile as any).error) {
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
    if (!(user.profile as any)?.favorites) return false;
    return (user.profile as any).favorites.find((f: any) => ciEquals(address, f.tokenAddress) && id === f.tokenId);
  }

  return (
    <div>
      {isLoading || isLoadingCollection || !collection ? (
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
                isBundle ? (
                  <ImageContainer nft={nft} />
                ) : nft.useIframe ? (
                  <iframe width="100%" height="636" src={nft.iframeSource} title="nft" />
                ) : (
                  <>
                    <DynamicNftImage nft={nft} address={nft.nftAddress ?? nft.nftAddress} id={nft.nftId ?? nft.nftId} showDetails={true}>
                      <AnyMedia
                        image={ImageService.translate(specialImageTransform(address, nft.image)).convert()}
                        video={nft.video ?? nft.animation_url}
                        videoProps={{ height: 'auto', autoPlay: true }}
                        title={nft.name}
                        usePlaceholder={false}
                        className="img-fluid img-rounded mb-sm-30"
                      />
                    </DynamicNftImage>
                  </>
                )
              ) : (
                <></>
              )}
              <div className="mt-2" style={{ cursor: 'pointer' }}>
                <ButtonGroup size='md' isAttached variant='outline'>
                  <ChakraButton title="Refresh Metadata" onClick={onRefreshMetadata} disabled={refreshing}>
                    <FontAwesomeIcon icon={faSync} spin={refreshing} />
                  </ChakraButton>
                  <ChakraButton
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
                  </ChakraButton>
                  {nft && nft.original_image && !isHeroesCollection(nft.nftAddress) && (
                    <ChakraButton title="View Full Image" onClick={() =>
                        typeof window !== 'undefined' &&
                        window.open(specialImageTransform(address, fullImage()), '_blank')
                    }>
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </ChakraButton>
                  )}
                  {isHeroesCollection(nft.nftAddress) && (
                    <>
                      <ChakraButton
                          title="Download Image"
                          onClick={downloadImage}
                          isLoading={downloadingImage}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </ChakraButton>
                      <ChakraButton
                          title="Copy Image"
                          onClick={copyImage}
                          isLoading={copyingImage}
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </ChakraButton>
                    </>
                  )}
                  <Menu MenuItems={MenuItems} MenuButton={MenuButton()} />

                </ButtonGroup>
              </div>
            </div>
            <div className="col-md-6">
              {nft && (
                <Box className="item_info">
                  {isNftBlacklisted(address, id) ? (
                    <Box mb={4}>
                      <Heading mb={0}>{customProfile.name ?? nft.name}</Heading>
                      <Flex>
                        <Tag size='sm' colorScheme='red' variant='solid'>Blacklisted</Tag>
                      </Flex>
                    </Box>
                  ) : (
                    <Heading>{customProfile.name ?? nft.name}</Heading>
                  )}

                  {(customProfile.description ?? nft.description) && (
                    <Box mb={2}>
                      <Text noOfLines={showFullDescription ? 0 : 2}>{customProfile.description ?? nft.description}</Text>
                      {(customProfile.description ?? nft.description).length > 60 && (
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
                  {isLadyWeirdApesCollection(address) && ladyWeirdApeChildren !== null && ladyWeirdApeChildren > 0 && (
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
                  {(isWeirdApesCollection(address) || isLadyWeirdApesCollection(address)) && !voxelClaimed && (
                    <div className="d-flex flex-row align-items-center mb-4">
                      <LayeredIcon
                        icon={faHeartBroken}
                        bgColor={'#ffffff00'}
                        color={'#dc143c'}
                        inverse={false}
                        title={`This Weird Ape has claimed a Voxel Weird Ape`}
                      />
                      <span className="fw-bold">This Weird Ape has not yet claimed a Voxel Weird Ape</span>
                    </div>
                  )}
                  
                  {collection.listable && !nft.burnt && (
                    <PriceActionBar
                      offerType={offerType}
                      collectionName={collectionName}
                      isVerified={collection.verification?.verified}
                      onOfferSelected={() => handleMakeOffer()}
                      isOwner={ciEquals(user.address, nft.owner)}
                    />
                  )}

                  <div className="row" style={{ gap: '2rem 0' }}>
                    {nft.owner ? (
                      <NftProfilePreview address={nft.owner} title='Owner' />
                    ) : (currentListing && collection.listable) && (
                      <NftProfilePreview address={currentListing.seller} title='Owner' />
                    )}

                    <NftPropertyLabel
                      label="Collection"
                      value={collectionName ?? 'View Collection'}
                      avatar={collectionMetadata?.avatar ? ImageService.translate(collectionMetadata?.avatar).avatar() : undefined}
                      address={address}
                      verified={collection.verification?.verified}
                      to={`/collection/${chain}/${address}`}
                    />

                    {typeof nft.rank !== 'undefined' && nft.rank !== null && (
                      <NftPropertyLabel
                        label="Rarity Rank"
                        value={nft.rank}
                        avatar={rankingsLogoForCollection(collection)}
                        hover={rankingsTitleForCollection(collection)}
                        to={rankingsLinkForCollection(collection, nft.nftId)}
                        pop={true}
                      />
                    )}
                  </div>


                  {isArgonautsBrandCollection(nft.nftAddress) ? (
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
                        <>
                          {(nft.attributes && Array.isArray(nft.attributes) && nft.attributes.length > 0) ||
                          (nft.properties && Array.isArray(nft.properties) && nft.properties.length > 0) ? (
                            <>
                              {nft.attributes && Array.isArray(nft.attributes) && (
                                <Properties
                                  address={address}
                                  slug={slug}
                                  attributes={nft.attributes}
                                  queryKey='traits'
                                />
                              )}
                              {nft.attributes && Array.isArray(nft.properties) && (
                                <Properties
                                  address={address}
                                  slug={slug}
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
                        <>
                          {(powertraits && powertraits.length > 0) || (onChainPowertraits && onChainPowertraits.length > 0) || (lazyHorseTraits && lazyHorseTraits.length > 0) ? (
                            <>
                              {powertraits && powertraits.length > 0 && (
                                <Properties
                                  address={address}
                                  slug={slug}
                                  attributes={powertraits}
                                  queryKey='powertraits'
                                />
                              )}
                              {onChainPowertraits && Array.isArray(onChainPowertraits) && (
                                <Properties
                                  address={address}
                                  slug={slug}
                                  attributes={onChainPowertraits}
                                  queryKey='powertraits'
                                />
                              )}
                              {lazyHorseTraits && Array.isArray(lazyHorseTraits) && (
                                <Box mt={3}>
                                  <Properties
                                    address={address}
                                    slug={slug}
                                    attributes={lazyHorseTraits}
                                    queryKey='powertraits'
                                  />
                                </Box>
                              )}
                            </>
                          ) : (
                            <>
                              <span>No in-game attributes found for this item</span>
                            </>
                          )}
                        </>
                      )}
                      {currentTab === tabs.history && (
                        <div className="listing-tab tab-3 onStep fadeIn">
                          <HistoryTab address={address} tokenId={id} />
                        </div>
                      )}

                      {currentTab === tabs.offers && (
                        <OffersTab
                          nftAddress={address}
                          nftId={id}
                          type={OfferType.DIRECT}
                        />
                      )}

                      {currentTab === tabs.info && (
                        <Box className="tab-1 onStep fadeIn">
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
                              <Box>Royalty</Box>
                              <Box>{royalty ? `${royalty}%` : 'N/A'}</Box>
                            </Flex>
                          </VStack>
                        </Box>
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
                                    source={ImageService.translate(specialImageTransform(nft.nftAddress, nft.image)).fixedWidth(100, 100)}
                                    fallbackSource={ImageService.translate(ImageService.translate(nft.image).thumbnail()).fixedWidth(100, 100)}
                                    title={nft.name}
                                    className="img-fluid img-rounded mb-sm-30"
                                  />
                                </Box>
                                <Stack>
                                  {nft.collectionName && (
                                    <Link href={`/collection/${chain}/${nft.collectionSlug ?? nft.nftAddress}`}>
                                      <h6
                                        className="mt-auto fw-normal mb-0"
                                        style={{ fontSize: '12px', color: getTheme(user.theme).colors.textColor4 }}
                                      >
                                        {nft.collectionName}
                                      </h6>
                                    </Link>
                                  )}
                                  <Link href={`/collection/${chain}/${nft.nftAddress}/${nft.nftId}`}>
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
                </Box>
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


