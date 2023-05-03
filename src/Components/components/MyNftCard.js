import React, {memo, useState} from 'react';
import {useRouter} from 'next/router';
import {ethers} from 'ethers';
import {toast} from 'react-toastify';
import {
  faBoltLightning,
  faEllipsisH,
  faExchangeAlt,
  faHand,
  faLink,
  faPen,
  faPlusCircle,
  faTag,
  faTags,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {MenuPopup} from '../components/chakra-components';
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {nftCardUrl} from "@src/helpers/image";
import {
  Badge,
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
  Tooltip,
  useBreakpointValue,
  useClipboard
} from "@chakra-ui/react";
import Image from "next/image";
import {appUrl, caseInsensitiveCompare, round, siPrefixedNumber, timeSince} from "@src/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {darkTheme, lightTheme} from "@src/Theme/theme";
import {useSelector} from "react-redux";
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons";
import ImageService from "@src/core/services/image";

const MyNftCard = ({
  nft,
  canTransfer = false,
  canSell = false,
  isStaked = false,
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
  const nftUrl = appUrl(`/collection/${nft.nftAddress}/${nft.nftId}`);
  const [isHovered, setIsHovered] = useState(false);
  const user = useSelector((state) => state.user);
  const batchListingCart = useSelector((state) => state.batchListing);
  const canUseBatchListing = useBreakpointValue(
    {base: false, md: true,},
    {fallback: 'md'},
  );
  const { onCopy } = useClipboard(nftUrl.toString());

  const navigateTo = (link) => {
    if (batchListingCart.isDrawerOpen) {
      if (isInBatchListingCart()) {
        onRemoveFromBatchListingButtonPressed();
      } else if (canTransfer) {
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
    }
    if (canTransfer) {
      options.push({
        icon: faTags,
        label: 'Add to batch',
        handleClick: onAddToBatchListingButtonPressed,
      });
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
    return batchListingCart.items.some((o) => o.nft.nftId === nft.nftId && caseInsensitiveCompare(o.nft.nftAddress, nft.nftAddress));
  };

  return (
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
                  <FontAwesomeIcon icon={faCheckCircle} size="xl" style={{background:'dodgerblue', color:'white'}} className="rounded-circle"/>
                </Box>
              ) : (canTransfer) && (
                <Box
                  _groupHover={{display:'inline', transition:'0.3s ease', opacity: 1}}
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
                    if (canTransfer) {
                      onAddToBatchListingButtonPressed()
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlusCircle} size="xl" style={{background:'white', color:'grey'}} className="rounded-circle" />
                </Box>
              )}
            </>
            <Box
              _groupHover={{transform:'scale(1.05)', transition:'0.3s ease'}}
              transition="0.3s ease"
              transform="scale(1.0)"
              onClick={() => navigateTo(nftUrl)}
              cursor="pointer"
            >
              <AnyMedia image={nftCardUrl(nft.nftAddress, nft.image)}
                        title={nft.name}
                        newTab={true}
                        className="card-img-top marketplace"
                        height={440}
                        width={440}
                        video={batchListingCart.items.length > 0 ? undefined : (nft.video ?? nft.animationUrl ?? nft.animation_url)}
                        thumbnail={!!nft.video || !!nft.animationUrl || !!nft.animation_url ? ImageService.translate(nft.video ?? nft.animationUrl ?? nft.animation_url).thumbnail() : undefined}
                        usePlaceholder={true}
              />
            </Box>
          </div>
          {nft.rank && <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{nft.rank}</div>}
          <Flex direction='column' justify='space-between' px={2} py={1}>
            <div className="card-title mt-auto">
              <span onClick={() => navigateTo(nftUrl)} style={{ cursor: 'pointer' }}>
                {nft.balance && nft.balance > 1 ? (
                  <Heading as="h6" size="sm">
                    {nft.name} (x{nft.balance})
                  </Heading>
                ) : (
                  <Heading as="h6" size="sm">{nft.name}</Heading>
                )}
              </span>
            </div>
            {!!nft.listed && !!nft.market.price && (
              <Tooltip label="Listing Price" placement='top-start'>
                <HStack w='full' fontSize='sm'>
                  <Box w='16px'>
                    <FontAwesomeIcon icon={faBoltLightning} />
                  </Box>
                  <Box>
                    <Flex>
                      <Image src="/img/logos/cdc_icon.svg" width={16} height={16} alt='Cronos Logo' />
                      <Box as='span' ms={1}>
                        {nft.market.price > 6 ? siPrefixedNumber(nft.market.price) : ethers.utils.commify(round(nft.market.price))}
                      </Box>
                    </Flex>
                  </Box>
                  {nft.market.expirationDate && (
                    <Text mt={1} flex={1} align='end' className='text-muted'>{timeSince(nft.market.expirationDate)}</Text>
                  )}
                </HStack>
              </Tooltip>
            )}
            {nft.offer?.id && (
              <Tooltip label="Best Offer Price" placement='top-start'>
                <HStack w='full' fontSize='sm'>
                  <Box w='16px'>
                    <FontAwesomeIcon icon={faHand} />
                  </Box>
                  <Box>
                    <Flex>
                      <Image src="/img/logos/cdc_icon.svg" width={16} height={16} alt='Cronos Logo' />
                      <Box as='span' ms={1}>
                        {nft.offer.price > 6 ? siPrefixedNumber(nft.offer.price) : ethers.utils.commify(round(nft.offer.price))}
                      </Box>
                    </Flex>
                  </Box>
                </HStack>
              </Tooltip>
            )}

            {isStaked && (
              <Badge variant='outline' colorScheme='orange'>
                <Center>
                  STAKED
                </Center>
              </Badge>
            )}
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
