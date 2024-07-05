import React, {memo, useState} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import Link from 'next/link';
import {ethers} from 'ethers';

import MakeOfferDialog from '@src/components-v2/shared/dialogs/make-offer';
import {darkTheme, getTheme, lightTheme} from '@src/global/theme/theme';
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {appUrl, createSuccessfulAddCartContent, round, siPrefixedNumber, timeSince} from '@market/helpers/utils';
import {convertGateway, nftCardUrl} from "@src/helpers/image";
import {Box, Flex, Heading, HStack, Spacer, Text, Tooltip, useClipboard} from "@chakra-ui/react";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {MenuPopup} from "@src/Components/components/chakra-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBoltLightning,
  faExternalLink,
  faHand,
  faLink,
  faShoppingBag,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import {refreshMetadata} from "@market/state/redux/slices/nftSlice";
import {specialImageTransform} from "@market/helpers/hacks";
import ImageService from "@src/core/services/image";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";
import {useTokenExchangeRate} from "@market/hooks/useGlobalPrices";
import {DynamicNftImage} from "@src/components-v2/shared/media/dynamic-nft-image";
import {useUser} from "@src/components-v2/useUser";
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

const ListingCard = ({ listing, imgClass = 'marketplace', watermark }) => {
  const nftUrl = appUrl(`/collection/${listing.nftAddress}/${listing.nftId}`);
  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);
  const dispatch = useDispatch();
  const user = useUser();
  const cart = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const isInCart = cart.isItemInCart(listing.listingId);
  const { onCopy } = useClipboard(nftUrl.toString());
  const [runAuthedFunction] = useAuthedFunction();
  const {tokenUsdRate, tokenToUsdValue} = useTokenExchangeRate(listing.currency);

  const getOptions = () => {
    const options = [];

    options.push({
      icon: faHand,
      label: 'Make Offer',
      handleClick: handleMakeOffer,
    });

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
    runAuthedFunction(async() => {
      setOpenMakeOfferDialog(!openMakeOfferDialog);
    });
  };

  const handleAddToCart = () => {
    cart.addItem({
      listingId: listing.listingId,
      name: listing.nft.name,
      image: listing.nft.image,
      price: listing.price,
      address: listing.nftAddress,
      id: listing.nftId,
      rank: listing.nft.rank,
      expirationDate: listing.expirationDate ?? null,
      seller: listing.seller ?? null,
      listingTime:  listing.listingTime ?? null,
      is1155: listing.is1155,
      amount: listing.amount,
      currency: listing.currency
    });
    toast.success(createSuccessfulAddCartContent(cart.openCart));
  };

  const handleRemoveFromCart = () => {
    cart.removeItem(listing.listingId);
    toast.success('Removed from cart');
  };

  const handleOpenOriginal = () => {
    if (listing.nft.original_image) {
      window.open(specialImageTransform(listing.nftAddress, convertGateway(listing.nft.original_image)), '_blank')
    }
  };

  const handleRefresh = () => {
    dispatch(refreshMetadata(listing.nftAddress, listing.nftId, listing.listingId));
  };

  const handleCopy = () => {
    onCopy();
    toast.success('Link copied!');
  };

  const getCorrectPrice = (price) => {
    try {
      let newPrice = ethers.utils.commify(round(price));
      return newPrice;
    } catch (error) {
      return ethers.utils.commify(price);
    }
  };

  const convertListingData = (listingData) => {
    const res = {
      address: listingData.nftAddress,
      id: listingData.nftId,
      image: listingData.nft.image,
      name: listingData.nft.name,
      description: listingData.nft.description,
      rank: listingData.rank,
      royalty: listingData.royalty,
    };
    return res;
  };

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
                      image={nftCardUrl(listing.nftAddress, listing.nft.image)}
                      className={`card-img-top ${imgClass}`}
                      title={listing.nft.name}
                      url={`/collection/${listing.nftAddress}/${listing.nftId}`}
                      height={440}
                      width={440}
                    />
                  </Watermarked>
                ) : (
                  <DynamicNftImage nft={listing.nft} address={listing.nftAddress} id={listing.nftId}>
                    <AnyMedia
                      image={nftCardUrl(listing.nftAddress, listing.nft.image)}
                      className={`card-img-top ${imgClass}`}
                      title={listing.nft.name}
                      url={`/collection/${listing.nftAddress}/${listing.nftId}`}
                      height={440}
                      width={440}
                      video={listing.nft.video ?? listing.nft.animationUrl ?? listing.nft.animation_url}
                      thumbnail={!!listing.nft.video || !!listing.nft.animationUrl || !!listing.nft.animation_url ? ImageService.translate(listing.nft.video ?? listing.nft.animationUrl ?? listing.nft.animation_url).thumbnail() : undefined}
                      usePlaceholder={true}
                    />
                  </DynamicNftImage>
                )}
              </Box>
            </div>
            {listing.nft.rank ? (
              <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{listing.nft.rank}</div>
            ) : (
              <div>&nbsp;</div>
            )}
            <Flex direction='column' justify='space-between' px={2} py={1}>
              {listing.collection && (
                <Link href={`/collection/${listing.collection.slug}`}>
                  <h6
                    className="mt-auto fw-normal"
                    style={{ fontSize: '12px', color: getTheme(user.theme).colors.textColor4 }}
                  >
                    {listing.collection.name}
                  </h6>
                </Link>
              )}
              <Link href={`/collection/${listing.collection.slug}/${listing.nftId}`}>
                <Heading as="h6" size="sm" className="mt-auto mb-1">{listing.nft.name}{listing.amount > 1 ? ` (x${listing.amount})` : ''}</Heading>
              </Link>

              <Tooltip label="Listing Price" placement='top-start'>
                <Box fontSize='sm'>
                  <HStack w='full'>
                    <Box w='16px'>
                      <FontAwesomeIcon icon={faBoltLightning} />
                    </Box>
                    <Box>
                      <Flex alignItems='center'>
                        <DynamicCurrencyIcon address={listing.currency} boxSize={4} />
                        <Box as='span' ms={1}>
                          {getCorrectPrice(listing.price)}
                        </Box>
                      </Flex>
                    </Box>
                    {listing.expirationDate && (
                      <Text mt={1} flex={1} align='end' className='text-muted'>{timeSince(listing.expirationDate)}</Text>
                    )}
                  </HStack>
                  {!!tokenUsdRate && (
                    <Flex ps={5} className='text-muted'>
                      <Box as='span' ms={1}>
                        ${tokenToUsdValue(listing.price) > 100000 ? siPrefixedNumber(tokenToUsdValue(listing.price)) : ethers.utils.commify(round(tokenToUsdValue(listing.price), 2))}
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Tooltip>
            </Flex>
            <Spacer />
            <Box
              borderBottomRadius={15}
              _groupHover={{background: useColorModeValue(lightTheme.textColor4, darkTheme.textColor4), color:lightTheme.textColor1}}
              px={4}
              py={1}
            >
              <div className="d-flex justify-content-between">
                <Box
                  _groupHover={{visibility:'visible', color:lightTheme.textColor1}}
                  visibility="hidden"
                >
                  {isInCart ? (
                    <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={handleRemoveFromCart}>Remove From Cart</Text>
                  ) : (
                    <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={handleAddToCart}>Add to Cart</Text>
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
          nftId={listing.nftId}
          nftAddress={listing.nftAddress}
        />
      )}
    </>
  );
};

export default memo(ListingCard);
