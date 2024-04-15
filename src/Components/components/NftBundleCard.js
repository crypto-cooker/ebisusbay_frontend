import React, {memo, useState} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import Link from 'next/link';
import {ethers} from 'ethers';

import MakeOfferDialog from '@src/components-v2/shared/dialogs/make-offer';
import {appUrl, createSuccessfulAddCartContent, isNftBlacklisted, round, siPrefixedNumber, timeSince} from '@market/helpers/utils';
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {convertGateway, nftCardUrl} from '@src/helpers/image';
import {Box, Flex, Heading, HStack, Spacer, Text, Tooltip, useClipboard} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBoltLightning,
  faExternalLink,
  faHand,
  faLink,
  faShoppingBag,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {darkTheme, lightTheme} from "@src/global/theme/theme";
import {MenuPopup} from "@src/Components/components/chakra-components";
import {toast} from "react-toastify";
import {refreshMetadata} from "@market/state/redux/slices/nftSlice";
import {specialImageTransform} from "@market/helpers/hacks";
import Slider from '../Account/Profile/Inventory/components/Slider';
import ImageService from "@src/core/services/image";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import {useExchangeRate} from "@market/hooks/useGlobalPrices";
import useAuthedFunction from "@market/hooks/useAuthedFunction";
import useCart from "@market/hooks/use-cart";

const Watermarked = styled.div`
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

const NftCard = ({ listing: nft, imgClass = 'marketplace', watermark = false, canBuy = true }) => {
  const nftUrl = appUrl(`/collection/${nft.address ?? nft.nftAddress}/${nft.id ?? nft.nftId}`);
  const dispatch = useDispatch();
  const cart = useCart();
  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isInCart = cart.isItemInCart(nft.market.id);
  const { onCopy } = useClipboard(nftUrl.toString());
  const {usdValueForToken} = useExchangeRate();
  const [runAuthedFunction] = useAuthedFunction();

  const marketUsdValue = () => {
    if (nft.market?.price) {
      return usdValueForToken(nft.market.price, nft.market.currency);
    }
    return 0;
  };

  const getOptions = () => {
    const options = [];

    options.push({
      icon: faHand,
      label: 'Make Offer',
      handleClick: handleMakeOffer,
    });

    if (nft.market) {
      if (isInCart) {
        options.push({
          icon: faShoppingBag,
          label: 'Remove from Cart',
          handleClick: handleRemoveFromCart,
        });
      } else {
        options.push({
          icon: faShoppingBag,
          label: 'Add to Cart',
          handleClick: handleAddToCart,
        });
      }
    }

    options.push({
      icon: faSync,
      label: 'Refresh Metadata',
      handleClick: handleRefresh,
    });

    options.push({
      icon: faExternalLink,
      label: 'Open Original',
      handleClick: handleOpenOriginal,
    });

    options.push({
      icon: faLink,
      label: 'Copy link',
      handleClick: handleCopy,
    });

    return options;
  };

  const handleMakeOffer = () => {
    const isBlacklisted = isNftBlacklisted(nft.address ?? nft.nftAddress, nft.id ?? nft.nftId);
    if (isBlacklisted) return;

    runAuthedFunction(async() => {
      setOpenMakeOfferDialog(!openMakeOfferDialog);
    });
  };

  const handleAddToCart = () => {
    cart.addItem({
      listingId: nft.market.id,
      name: nft.name,
      image: nft.image,
      price: nft.market.price,
      address: nft.address ?? nft.nftAddress,
      id: nft.id ?? nft.nftId,
      rank: nft.rank,
      currency: nft.market.currency
    });
    toast.success(createSuccessfulAddCartContent(cart.openCart));
  };

  const handleRemoveFromCart = () => {
    cart.removeItem(nft.market.id);
    toast.success('Removed from cart');
  };

  const handleOpenOriginal = () => {
    if (nft.original_image) {
      window.open(specialImageTransform(nft.address ?? nft.nftAddress, convertGateway(nft.original_image)), '_blank')
    }
  };

  const handleRefresh = () => {
    dispatch(refreshMetadata(nft.address ?? nft.nftAddress, nft.id ?? nft.nftId, nft.market?.id));
  };

  const handleCopy = () => {
    onCopy();
    toast.success('Link copied!');
  };

  const getIsNftListed = () => {
    if (nft.market?.price) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Box
        className="card eb-nft__card h-100 shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-group
        _hover={{
          borderColor: useColorModeValue('#595d69', '#ddd'),
        }}
      >
        <Box
          _groupHover={{
            background: useColorModeValue('#FFFFFF', '#404040'),
            transition: '0.3s ease'
          }}
          borderRadius={'15px'}
          transition="0.3s ease"
          height="100%"
        >
          <Flex direction="column" height="100%">
            <div className="card-img-container">
            <Slider size={nft.nfts?.length}>
              {nft.nfts?.map((currentNft)=> (
                <Box
                _groupHover={{ transform: 'scale(1.05)', transition: '0.3s ease' }}
                transition="0.3s ease"
                transform="scale(1.0)"
              >
                {watermark ? (
                  <Watermarked watermark={watermark}>
                    <AnyMedia
                      image={nftCardUrl(currentNft.address, currentNft.image)}
                      className={`card-img-top ${imgClass}`}
                      title={currentNft.title}
                      url={nftUrl}
                      width={440}
                      height={440}
                      video={currentNft.video ?? currentNft.animationUrl ?? currentNft.animation_url}
                      thumbnail={!!currentNft.video || !!currentNft.animationUrl || !!currentNft.animation_url ? ImageService.translate(currentNft.video ?? currentNft.animationUrl ?? currentNft.animation_url).thumbnail() : undefined}
                      usePlaceholder={true}
                    />
                  </Watermarked>
                ) : (
                  <AnyMedia
                    image={nftCardUrl(currentNft.address, currentNft.image)}
                    className={`card-img-top ${imgClass}`}
                    title={currentNft.title}
                    url={nftUrl}
                    width={440}
                    height={440}
                    video={currentNft.video ?? currentNft.animationUrl ?? currentNft.animation_url}
                    thumbnail={!!currentNft.video || !!currentNft.animationUrl || !!currentNft.animation_url ? ImageService.translate(currentNft.video ?? currentNft.animationUrl ?? currentNft.animation_url).thumbnail() : undefined}
                    usePlaceholder={true}
                  />
                )}
              </Box>
              ))}

            </Slider>
              </div>
            {nft.rank && <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{nft.rank}</div>}
            <Flex direction='column' justify='space-between' px={2} py={1}>
              <Link href={nftUrl}>
                <Heading as="h6" size="sm" className="card-title mt-auto">{nft.name}</Heading>
              </Link>
              {getIsNftListed() && (
                <Tooltip label="Listing Price" placement='top-start'>
                  <Box fontSize='sm'>
                    <HStack w='full'>
                      <Box w='16px'>
                        <FontAwesomeIcon icon={faBoltLightning} />
                      </Box>
                      <Box>
                        <Flex alignItems='center'>
                          <CronosIconBlue boxSize={4} />
                          <Box as='span' ms={1}>
                            {nft.market?.price > 6 ? siPrefixedNumber(nft.market?.price) : ethers.utils.commify(round(nft.market?.price))}
                          </Box>
                        </Flex>
                      </Box>
                      {nft.market?.expirationDate && (
                        <Text mt={1} flex={1} align='end' className='text-muted'>{timeSince(nft.market.expirationDate)}</Text>
                      )}
                    </HStack>
                    {marketUsdValue() && (
                      <Flex ps={5} className='text-muted'>
                        <Box as='span' ms={1}>
                          ${marketUsdValue() > 100000 ? siPrefixedNumber(marketUsdValue()) : ethers.utils.commify(round(marketUsdValue(), 2))}
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
              _groupHover={{ background: useColorModeValue(lightTheme.textColor4, darkTheme.textColor4), color: lightTheme.textColor1 }}
              px={4}
              py={1}
            >
              <div className="d-flex justify-content-between">
                <Box
                  _groupHover={{ visibility: 'visible', color: lightTheme.textColor1 }}
                  visibility="hidden"
                >
                  {nft.market?.price ? (
                    <>
                      {isInCart ? (
                        <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={handleRemoveFromCart}>Remove From Cart</Text>
                      ) : (
                        <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={handleAddToCart}>Add to Cart</Text>
                      )}
                    </>
                  ) : (
                    <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={handleMakeOffer}>Make Offer</Text>
                  )}
                </Box>
                <MenuPopup options={getOptions()} />
              </div>
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
        />
      )}
    </>
  );
};

export default memo(NftCard);
