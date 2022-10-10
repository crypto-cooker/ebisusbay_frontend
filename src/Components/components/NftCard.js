import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';

import MakeOfferDialog from '../Offer/Dialogs/MakeOfferDialog';
import { connectAccount, chainConnect } from '@src/GlobalState/User';
import {
  createSuccessfulAddCartContent,
  isNftBlacklisted,
  openWithCronosExplorer,
  round,
  siPrefixedNumber
} from '@src/utils';
import { AnyMedia } from './AnyMedia';
import {convertGateway, nftCardUrl} from '@src/helpers/image';
import {
  Box, Flex,
  Heading, Spacer,
  Text
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faEllipsisH, faExternalLink, faHand,
  faLink, faShoppingBag, faSync,
} from "@fortawesome/free-solid-svg-icons";
import {useColorModeValue} from "@chakra-ui/color-mode";
import Image from "next/image";
import {darkTheme, lightTheme} from "@src/Theme/theme";
import {MenuPopup} from "@src/Components/components/chakra-components";
import {addToCart, openCart, removeFromCart} from "@src/GlobalState/cartSlice";
import {toast} from "react-toastify";
import {refreshMetadata} from "@src/GlobalState/nftSlice";
import {appConfig} from "@src/Config";
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

const NftCard = ({ listing: nft, imgClass = 'marketplace', watermark, collection, canBuy = true }) => {
  const history = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const [openMakeOfferDialog, setOpenMakeOfferDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isInCart = nft.market?.id && cart.nfts.map((o) => o.listingId).includes(nft.market.id);

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
    const isBlacklisted = isNftBlacklisted(nft.address, nft.id);
    if (isBlacklisted) return;

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
      listingId: nft.market.id,
      name: nft.name,
      image: nft.image,
      price: nft.market.price,
      address: nft.address,
      id: nft.id,
      rank: nft.rank
    }));
    toast.success(createSuccessfulAddCartContent(() => dispatch(openCart())));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(nft.market.id));
    toast.success('Removed to cart');
  };

  const handleOpenOriginal = () => {
    if (nft.original_image) {
      window.open(specialImageTransform(nft.address, convertGateway(nft.original_image)), '_blank')
    }
  };

  const handleRefresh = () => {
    dispatch(refreshMetadata(nft.address, nft.id));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${appConfig('urls.app')}collection/${collection.slug}/${nft.id}`);
    toast.success('Address Copied!');
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
                      image={nftCardUrl(nft.address, nft.image)}
                      className={`card-img-top ${imgClass}`}
                      title={nft.name}
                      url={`/collection/${collection.slug}/${nft.id}`}
                      width={440}
                      height={440}
                      video={nft.video ?? nft.animation_url}
                      usePlaceholder={true}
                    />
                  </Watermarked>
                ) : (
                  <AnyMedia
                    image={nftCardUrl(nft.address, nft.image)}
                    className={`card-img-top ${imgClass}`}
                    title={nft.name}
                    url={`/collection/${collection.slug}/${nft.id}`}
                    width={440}
                    height={440}
                    video={nft.video ?? nft.animation_url}
                    usePlaceholder={true}
                  />
                )}
              </Box>
            </div>
            {nft.rank && <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{nft.rank}</div>}
            <div className="d-flex flex-column justify-content-between p-2 pb-1">
              <Link href={`/collection/${collection.slug}/${nft.id}`}>
                <a>
                  <Heading as="h6" size="sm" className="card-title mt-auto">{nft.name}</Heading>
                </a>
              </Link>
              {getIsNftListed() && (
                <MakeBuy>
                  {collection.multiToken && <div>Floor:</div>}
                  <div className="d-flex">
                    <Image src="/img/logos/cdc_icon.svg" width={16} height={16} />
                    <span className="ms-1">
                    {nft.market?.price > 6 ? siPrefixedNumber(nft.market?.price) : ethers.utils.commify(round(nft.market?.price))}
                  </span>
                  </div>
                </MakeBuy>
              )}
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
          nft={nft}
          collection={collection}
        />
      )}
    </>
  );
};

export default memo(NftCard);
