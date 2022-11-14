import React, { memo, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import {
  faLink,
  faEllipsisH,
  faExchangeAlt,
  faTag,
  faTimes,
  faPen,
  faPlusCircle, faTags
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuPopup } from '@src/Components/components/chakra-components';
import AnyMedia from '@src/Components/components/AnyMedia';
import { nftCardUrl } from "@src/helpers/image";
import {
  Badge,
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  Text,
  useBreakpointValue,
  useClipboard
} from "@chakra-ui/react";
import Image from "next/image";
import { appUrl, caseInsensitiveCompare, round } from "@src/utils";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { darkTheme, lightTheme } from "@src/Theme/theme";
import { useSelector } from "react-redux";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import Slider from './Slider';

const MyNftCard = ({
  nft,
  canTransfer = false,
  canSell = false,
  canCancel = false,
  canUpdate = false,
  onTransferButtonPressed,
  onSellButtonPressed,
  onCancelButtonPressed,
  onUpdateButtonPressed,
  onAddToBatchListingButtonPressed,
  onRemoveFromBatchListingButtonPressed,
  newTab = false,
}) => {
  const history = useRouter();
  const nftUrl = appUrl(`/collection/${nft.address}/${nft.id}`);
  const [isHovered, setIsHovered] = useState(false);
  const user = useSelector((state) => state.user);
  const batchListingCart = useSelector((state) => state.batchListing);
  const canUseBatchListing = useBreakpointValue(
    { base: false, md: true, },
    { fallback: 'md' },
  );
  const { onCopy } = useClipboard(nftUrl);

  const navigateTo = (link) => {
    if (batchListingCart.isDrawerOpen) {
      if (isInBatchListingCart()) {
        onRemoveFromBatchListingButtonPressed();
      } else if (canSell || canUpdate) {
        onAddToBatchListingButtonPressed();
      } else {
        toast.error('Item is currently not listable')
      }
    } else if (newTab) {
      window.open(link, '_blank');
    } else {
      history.push(link);
    }
  };

  const onCopyLinkButtonPressed = () => {
    onCopy();
    toast.success('Link copied!');
  };

  const getOptions = () => {
    const options = [];

    if (canSell) {
      options.push({
        icon: faTag,
        label: 'Sell',
        handleClick: onSellButtonPressed,
      });
      options.push({
        icon: faTags,
        label: 'Sell in batch',
        handleClick: onAddToBatchListingButtonPressed,
      });
    }
    if (canTransfer) {
      options.push({
        icon: faExchangeAlt,
        label: 'Transfer',
        handleClick: onTransferButtonPressed,
      });
    }
    if (canUpdate) {
      options.push({
        icon: faPen,
        label: 'Update',
        handleClick: onUpdateButtonPressed,
      });
    }
    if (canCancel) {
      options.push({
        icon: faTimes,
        label: 'Cancel',
        handleClick: onCancelButtonPressed,
      });
    }

    options.push({
      icon: faLink,
      label: 'Copy link',
      handleClick: onCopyLinkButtonPressed,
    });

    return options;
  };

  const isInBatchListingCart = () => {
    return batchListingCart.nfts.some((o) => o.nft.id === nft.id && caseInsensitiveCompare(o.nft.address, nft.address));
  };

  return (
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
          <div className="card-img-container position-relative">
            <>
              {isInBatchListingCart() ? (
                <Box
                  top={0}
                  right={0}
                  position="absolute"
                  zIndex={2}
                  p={2}
                  cursor="pointer"
                  onClick={onRemoveFromBatchListingButtonPressed}
                >
                  <FontAwesomeIcon icon={faCheckCircle} size="xl" style={{ background: 'dodgerblue', color: 'white' }} className="rounded-circle" />
                </Box>
              ) : (canSell || canUpdate) && (
                <Box
                  _groupHover={{ display: 'inline', transition: '0.3s ease', opacity: 1 }}
                  transition="0.3s ease"
                  display="inline"
                  opacity={0}
                  top={0}
                  right={0}
                  position="absolute"
                  zIndex={2}
                  p={2}
                  cursor="pointer"
                  onClick={() => {
                    if (canSell || canUpdate) {
                      onAddToBatchListingButtonPressed()
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlusCircle} size="xl" style={{ background: 'white', color: 'grey' }} className="rounded-circle" />
                </Box>
              )}
            </>
            <Slider size={nft.nfts?.length}>

              {nft.nfts?.map((nft) =>


              (<Box
                _groupHover={{ transform: 'scale(1.05)', transition: '0.3s ease' }}
                transition="0.3s ease"
                transform="scale(1.0)"
                onClick={() => navigateTo(nftUrl)}
                cursor="pointer"
              >
                <AnyMedia image={nftCardUrl(nft.id, nft.image)}
                  title={nft.id}
                  newTab={true}
                  className="card-img-top marketplace"
                  height={440}
                  width={440}
                  video={batchListingCart.nfts.length > 0 ? undefined : (nft.video ?? nft.animation_url)}
                  usePlaceholder={true}
                />

              </Box>))}
            </Slider>
          </div>
          <div className="d-flex flex-column p-2 pb-1">
            <div className="card-title mt-auto">
              <span onClick={() => navigateTo(nftUrl)} style={{ cursor: 'pointer' }}>
                {nft.count && nft.count > 0 ? (
                  <Heading as="h6" size="sm">
                    {nft.title} (x{nft.count})
                  </Heading>
                ) : (
                  <Heading as="h6" size="sm">{nft.title}</Heading>
                )}
              </span>
            </div>
            <span className="card-text">
              {nft.listed && nft.price ? (
                <div className="d-flex">
                  <Image src="/img/logos/cdc_icon.svg" width={16} height={16} />
                  <span className="ms-1">
                    {ethers.utils.commify(round(nft.price, 2))}
                  </span>
                </div>
              ) : (
                <>&nbsp;</>
              )}
            </span>
          </div>
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
                {canSell ? (
                  <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={onSellButtonPressed}>Sell</Text>
                ) : canUpdate && (
                  <Text fontSize="sm" fontWeight="bold" cursor="pointer" onClick={onUpdateButtonPressed}>Update</Text>
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

  );
};

export default memo(MyNftCard);
