import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Link from 'next/link';
import { ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';

import MakeOfferDialog from '../Offer/Dialogs/MakeOfferDialog';
import {darkTheme, getTheme, lightTheme} from '@src/Theme/theme';
import { AnyMedia } from './AnyMedia';
import { connectAccount, chainConnect } from '@src/GlobalState/User';
import {createSuccessfulAddCartContent, round} from '@src/utils';
import {convertGateway, nftCardUrl} from "@src/helpers/image";
import {Box, Flex, Heading, Spacer, Text} from "@chakra-ui/react";
import Image from "next/image";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {MenuPopup} from "@src/Components/components/chakra-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faEllipsisH,
  faExternalLink,
  faHand,
  faLink,
  faShoppingBag,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import {addToCart, openCart, removeFromCart} from "@src/GlobalState/cartSlice";
import {toast} from "react-toastify";
import {appConfig} from "@src/Config";
import {refreshMetadata} from "@src/GlobalState/nftSlice";
import {specialImageTransform} from "@src/hacks";

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

const MakeBuy = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ListingCard = ({ listing, imgClass = 'marketplace', watermark, address, collection }) => {
  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const [isHovered, setIsHovered] = useState(false);
  const isInCart = cart.nfts.map((o) => o.listingId).includes(listing.listingId);

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

  const handleAddToCart = () => {
    dispatch(addToCart({
      listingId: listing.listingId,
      name: listing.nft.name,
      image: listing.nft.image,
      price: listing.price,
      address: listing.nftAddress,
      id: listing.nftId,
      rank: listing.nft.rank
    }));
    toast.success(createSuccessfulAddCartContent(() => dispatch(openCart())));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(listing.listingId));
    toast.success('Removed to cart');
  };

  const handleOpenOriginal = () => {
    if (listing.nft.original_image) {
      window.open(specialImageTransform(listing.nftAddress, convertGateway(listing.nft.original_image)), '_blank')
    }
  };

  const handleRefresh = () => {
    dispatch(refreshMetadata(listing.nftAddress, listing.nftId));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${appConfig('urls.app')}collection/${listing.nftAddress}/${listing.nftId}`);
    toast.success('Address Copied!');
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
                  <AnyMedia
                    image={nftCardUrl(listing.nftAddress, listing.nft.image)}
                    className={`card-img-top ${imgClass}`}
                    title={listing.nft.name}
                    url={`/collection/${listing.nftAddress}/${listing.nftId}`}
                    height={440}
                    width={440}
                  />
                )}
              </Box>
            </div>
            {listing.nft.rank ? (
              <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{listing.nft.rank}</div>
            ) : (
              <div>&nbsp;</div>
            )}
            <div className="d-flex flex-column justify-content-between p-2 pb-1">
              {collection && (
                <Link href={`/collection/${collection.slug}`}>
                  <a>
                    <h6
                      className="card-title mt-auto fw-normal"
                      style={{ fontSize: '12px', color: getTheme(user.theme).colors.textColor4 }}
                    >
                      {collection.name}
                    </h6>
                  </a>
                </Link>
              )}
              <Link href={`/collection/${listing.nftAddress}/${listing.nftId}`}>
                <a>
                  <Heading as="h6" size="sm" className="card-title mt-auto">{listing.nft.name}</Heading>
                </a>
              </Link>
              <MakeBuy>
                <div className="d-flex">
                  <Image src="/img/logos/cdc_icon.svg" width={16} height={16} />
                  <span className="ms-1">
                    {getCorrectPrice(listing.price)}
                  </span>
                </div>
              </MakeBuy>
            </div>
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
                <MenuPopup options={getOptions()}>
                  <FontAwesomeIcon icon={faEllipsisH} style={{ cursor: 'pointer' }} className="my-auto" />
                </MenuPopup>
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
          collection={collection}
        />
      )}
    </>
  );
};

export default memo(ListingCard);
