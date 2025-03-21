import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {ethers} from 'ethers';

import MakeOfferDialog from '@src/components-v2/shared/dialogs/make-offer';
import {
  appUrl,
  ciEquals,
  createSuccessfulAddCartContent,
  isNftBlacklisted,
  round,
  siPrefixedNumber,
  timeSince,
} from '@market/helpers/utils';
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {convertGateway, nftCardUrl} from '@src/helpers/image';
import {Box, Flex, Heading, HStack, Spacer, Text, Tooltip, useClipboard, useColorModeValue} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBoltLightning,
  faExchangeAlt,
  faExternalLink,
  faHand,
  faLink,
  faMinus,
  faPen,
  faShoppingBag,
  faSync,
  faTag,
  faTags,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {darkTheme, lightTheme} from "@src/global/theme/theme";
import {MenuPopup} from "@src/Components/components/chakra-components";
import {toast} from "react-toastify";
import {refreshMetadata} from "@market/state/redux/slices/nftSlice";
import {specialImageTransform} from "@market/helpers/hacks";
import ImageService from "@src/core/services/image";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import {useTokenExchangeRate} from "@market/hooks/useGlobalPrices";
import {DynamicNftImage} from "@src/components-v2/shared/media/dynamic-nft-image";
import {useUser} from "@src/components-v2/useUser";
import useAuthedFunction from "@market/hooks/useAuthedFunction";
import useCart from "@market/hooks/use-cart";
import {useAppDispatch} from "@market/state/redux/store/hooks";
import {CurrencyLogoByAddress} from "@dex/components/logo";
import {isOffersEnabledForChain} from "@src/global/utils/app";

const Watermarked = styled.div<{ watermark: string }>`
  position: relative;
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background-image: url(${(props) => props.watermark});
    background-size: 60px 60px;
    background-position: 0px 0px;
    background-repeat: no-repeat;
    opacity: 0.3;
  }
`;

type BaseNftCardProps = {
  nft: any;
  imgClass: string;
  watermark: any;
  is1155: boolean;
  canBuy: boolean;
}
const BaseNftCard = ({ nft, imgClass = 'marketplace', watermark, is1155 = false, canBuy = true }: BaseNftCardProps) => {
  const nftUrl = appUrl(`/collection/${nft.chain}/${nft.address}/${nft.id}`);
  const dispatch = useAppDispatch();
  const user = useUser();
  const cart = useCart();
  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { onCopy } = useClipboard(nftUrl.toString());
  const {calculateValuesFromToken} = useTokenExchangeRate(nft.market?.currency ?? nft.currency, nft.chain);
  const [runAuthedFunction] = useAuthedFunction();

  const getListing = (): any => {
    if (nft.market?.price) {
      const usdPrice = calculateValuesFromToken(nft.market.price).totalUSD;
      return {
        id: nft.market.id,
        price: nft.market.price,
        usdPrice: usdPrice,
        expirationDate: nft.market.expirationDate,
        currency: nft.market.currency,
        chainId: nft.chain
      };
    }
    if (nft.listed) {
      const usdPrice = calculateValuesFromToken(nft.price).totalUSD;
      return {
        id: nft.listingId,
        price: nft.price,
        usdPrice: usdPrice,
        expirationDate: nft.expirationDate,
        currency: nft.currency,
        chainId: nft.chain
      };
    }

    return null;
  }

  const isInCart = getListing()?.id && cart.items.map((o: any) => o.listingId).includes(getListing().id);

  const handleMakeOffer = () => {
    const isBlacklisted = isNftBlacklisted(nft.address, nft.id);
    if (isBlacklisted) return;

    runAuthedFunction(async() => {
      setOpenMakeOfferDialog(!openMakeOfferDialog);
    });
  };

  const handleAddToCart = () => {
    const listing = getListing();
    if (!listing) {
      toast.error('No listing found for NFT');
      return;
    }

    cart.addItem({
      listingId: listing.id,
      name: nft.name,
      image: nft.image,
      price: listing.price,
      address: nft.address,
      id: nft.id,
      rank: nft.rank,
      amount: listing.amount ?? 1,
      currency: listing.currency,
      chain: nft.chain
    });
    toast.success(createSuccessfulAddCartContent(cart.openCart));
  };

  const handleRemoveFromCart = useCallback(() => {
    const listing = getListing();
    cart.removeItem(listing.id);
    toast.success('Removed from cart');
  }, [nft]);

  const handleOpenOriginal = () => {
    if (nft.original_image) {
      window.open(specialImageTransform(nft.address, convertGateway(nft.original_image)), '_blank')
    }
  };

  const handleRefresh = () => {
    dispatch(refreshMetadata(nft.address, nft.id, nft.market?.id));
  };

  const handleCopy = () => {
    onCopy();
    toast.success('Link copied!');
  };

  const menuOptions = ciEquals(user.address, nft.address ?? nft.nftAddress) ?
    ownerMenuOptions({
      onRefresh: handleRefresh,
      onOpenLink: handleOpenOriginal,
      onCopy: handleCopy
    }) : publicMenuOptions({
      onRefresh: handleRefresh,
      onOpenLink: handleOpenOriginal,
      onCopy: handleCopy,
      onAddToCart: handleAddToCart,
      onRemoveFromCart: handleRemoveFromCart,
      onMakeOffer: handleMakeOffer,
      isInCart: isInCart,
      canBuy: nft.market && canBuy,
      chainId: nft.chain
    });

  return (
    <>
      <Box
        className="card eb-nft__card h-100 shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-group
        _hover={{
          borderColor:useColorModeValue('#595d69', '#ddd'),
        }}
      >
        <Box
          _groupHover={{
            background:useColorModeValue('#FFFFFF', '#404040'),
            transition:'0.3s ease'
        }}
          borderRadius={'15px'}
          transition="0.3s ease"
          height="100%"
        >
          <Flex direction="column" height="100%">
            <div className="card-img-container">
              <Box
                _groupHover={{transform:'scale(1.05)', transition:'0.3s ease'}}
                transition="0.3s ease"
                transform="scale(1.0)"
              >
                {watermark ? (
                  <Watermarked watermark={watermark}>
                    <AnyMedia
                      image={nftCardUrl(nft.address ?? nft.nftAddress, nft.image)}
                      className={`card-img-top ${imgClass}`}
                      title={nft.name}
                      url={`/collection/${nft.chain}/${nft.address ?? nft.nftAddress}/${nft.id ?? nft.nftId}`}
                      width={440}
                      height={440}
                      video={nft.video ?? nft.animationUrl ?? nft.animation_url}
                      thumbnail={!!nft.video || !!nft.animationUrl || !!nft.animation_url ? ImageService.translate(nft.video ?? nft.animationUrl ?? nft.animation_url).thumbnail() : undefined}
                      usePlaceholder={true}
                    />
                  </Watermarked>
                ) : (
                <DynamicNftImage nft={nft} address={nft.address ?? nft.nftAddress} id={nft.id ?? nft.nftId}>
                  <AnyMedia
                    image={nftCardUrl(nft.address ?? nft.nftAddress, nft.image)}
                    className={`card-img-top ${imgClass}`}
                    title={nft.name}
                    url={`/collection/${nft.chain}/${nft.address ?? nft.nftAddress}/${nft.id ?? nft.nftId}`}
                    width={440}
                    height={440}
                    video={nft.video ?? nft.animationUrl ?? nft.animation_url}
                    thumbnail={!!nft.video || !!nft.animationUrl || !!nft.animation_url ? ImageService.translate(nft.video ?? nft.animationUrl ?? nft.animation_url).thumbnail() : undefined}
                    usePlaceholder={true}
                  />
                </DynamicNftImage>
                )}
              </Box>
            </div>
            {nft.rank && <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{nft.rank}</div>}
            <Flex direction='column' justify='space-between' px={2} py={1}>
              <Link href={`/collection/${nft.chain}/${nft.address ?? nft.nftAddress}/${nft.id ?? nft.nftId}`}>
                <Heading as="h6" size="sm" className="mt-auto">{nft.name}</Heading>
              </Link>
              {getListing() && (
                <Tooltip label="Listing Price" placement='top-start'>
                  <Box fontSize='sm'>
                    <HStack w='full'>
                      <Box w='16px'>
                        <FontAwesomeIcon icon={faBoltLightning} />
                      </Box>
                      <Box>
                        <Flex alignItems='center'>
                          <CurrencyLogoByAddress address={getListing().currency} chainId={getListing().chainId} size='16px' />
                          <Box as='span' ms={1}>
                            {getListing().price > 6 ? siPrefixedNumber(getListing().price) : ethers.utils.commify(round(getListing().price))}
                          </Box>
                        </Flex>
                      </Box>
                      {getListing().expirationDate && (
                        <Text mt={1} flex={1} align='end' className='text-muted'>{timeSince(getListing().expirationDate)}</Text>
                      )}
                    </HStack>
                    {!!getListing().usdPrice && (
                      <Flex ps={5} className='text-muted'>
                        <Box as='span' ms={1}>
                          ${getListing().usdPrice > 100000 ? siPrefixedNumber(getListing().usdPrice) : ethers.utils.commify(round(getListing().usdPrice, 2))}
                        </Box>
                      </Flex>
                    )}
                  </Box>
                </Tooltip>
              )}
              {nft.offer?.id && (
                <Tooltip label="Best Offer Price" placement='top-start'>
                  <HStack w='full' fontSize='sm'>
                    <Box w='16px'>
                      <FontAwesomeIcon icon={faHand} />
                    </Box>
                    <Box>
                      <Flex alignItems='center'>
                        <CronosIconBlue boxSize={4} />
                        <Box as='span' ms={1}>
                          {nft.offer.price > 6 ? siPrefixedNumber(nft.offer.price) : ethers.utils.commify(round(nft.offer.price))}
                        </Box>
                      </Flex>
                    </Box>
                  </HStack>
                </Tooltip>
              )}
            </Flex>
            <Spacer />
            <Box
              borderBottomRadius={15}
              _groupHover={{background: useColorModeValue(lightTheme.textColor4, darkTheme.textColor4), color:lightTheme.textColor1}}
              px={4}
              py={1}
            >
              <Flex justify='space-between' align='center'>
                <Box
                  _groupHover={{visibility:'visible', color:lightTheme.textColor1}}
                  visibility="hidden"
                >
                  {getListing()?.price && canBuy ? (
                    <>
                      {isInCart ? (
                        <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={handleRemoveFromCart}>Remove From Cart</Text>
                      ) : (
                        <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={handleAddToCart}>Add to Cart</Text>
                      )}
                    </>
                  ) : isOffersEnabledForChain(nft.chain) && (
                    <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={handleMakeOffer}>Make Offer</Text>
                  )}
                </Box>
                <MenuPopup options={menuOptions} />
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Box>
      {openMakeOfferDialog && (
        <MakeOfferDialog
          isOpen={openMakeOfferDialog}
          onClose={() => setOpenMakeOfferDialog(false)}
          initialNft={nft}
          nftAddress={nft.address ?? nft.nftAddress}
          nftId={nft.id ?? nft.nftId}
        />
      )}
    </>
  );
};

type NftCardProps = {
  nft: any;
  imgClass?: string;
  watermark?: any;
  is1155?: boolean;
  canBuy?: boolean;

  isInventory?: boolean;
  includeCollectionName?: boolean;
}
export const NftCard = ({ nft, imgClass = 'marketplace', watermark = false, is1155 = false, canBuy = true }: NftCardProps) => {
  return (
    <BaseNftCard
      nft={nft}
      imgClass={imgClass}
      watermark={watermark}
      is1155={is1155}
      canBuy={canBuy}
    />
  )
}

type OwnerMenuProps = {
  onRefresh: () => void;
  onOpenLink: () => void;
  onCopy: () => void;
  onCreateLising?: () => void;
  onUpdateListing?: () => void;
  onTransfer?: () => void;
  onCancelListing?: () => void;
  onAddToBatch?: () => void;
  onRemoveFromBatch?: () => void;
}
const ownerMenuOptions = (props: OwnerMenuProps) => {
  const options = [];

  options.push({
    icon: faTag,
    label: 'Sell',
    handleClick: props.onCreateLising,
  });

  if (props.onAddToBatch) {
    options.push({
      icon: faTags,
      label: 'Add to batch',
      handleClick: props.onAddToBatch,
    });
  }

  if (props.onRemoveFromBatch) {
    options.push({
      icon: faMinus,
      label: 'Remove from batch',
      handleClick: props.onRemoveFromBatch,
    });
  }

  options.push({
    icon: faSync,
    label: 'Refresh Metadata',
    handleClick: props.onRefresh,
  });

  options.push({
    icon: faExternalLink,
    label: 'Open Original',
    handleClick: props.onOpenLink,
  });

  options.push({
    icon: faLink,
    label: 'Copy link',
    handleClick: props.onCopy,
  });

  options.push({
    icon: faPen,
    label: 'Update',
    handleClick: props.onUpdateListing,
  });

  options.push({
    icon: faTimes,
    label: 'Cancel',
    handleClick: props.onCancelListing,
  });

  options.push({
    icon: faExchangeAlt,
    label: 'Transfer',
    handleClick: props.onTransfer,
  });

  return options;
};

type PublicMenuProps = {
  onRefresh: () => void;
  onOpenLink: () => void;
  onCopy: () => void;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onMakeOffer: () => void;
  isInCart: boolean;
  canBuy: boolean;
  chainId: number;
}
const publicMenuOptions = (props: PublicMenuProps) => {
  const options = [];

  if (isOffersEnabledForChain(props.chainId)) {
    options.push({
      icon: faHand,
      label: 'Make Offer',
      handleClick: props.onMakeOffer,
    });
  }

  if (props.canBuy) {
    if (props.isInCart) {
      options.push({
        icon: faMinus,
        label: 'Remove from Cart',
        handleClick: props.onRemoveFromCart,
      });
    } else {
      options.push({
        icon: faShoppingBag,
        label: 'Add to Cart',
        handleClick: props.onAddToCart,
      });
    }
  }

  options.push({
    icon: faSync,
    label: 'Refresh Metadata',
    handleClick: props.onRefresh,
  });

  options.push({
    icon: faExternalLink,
    label: 'Open Original',
    handleClick: props.onOpenLink,
  });

  options.push({
    icon: faLink,
    label: 'Copy link',
    handleClick: props.onCopy,
  });

  return options;
}