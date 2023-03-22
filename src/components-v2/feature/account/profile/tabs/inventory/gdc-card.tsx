import React, {memo} from 'react';
import {ethers} from 'ethers';
import {toast} from 'react-toastify';
import {faBoltLightning, faHand, faLink, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {nftCardUrl} from "@src/helpers/image";
import {Box, Flex, Heading, HStack, Spacer, Text, Tooltip, useClipboard} from "@chakra-ui/react";
import Image from "next/image";
import {appUrl, round, siPrefixedNumber, timeSince} from "@src/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import Button from "@src/Components/components/Button";

interface GdcCardProps {
  nft: any;
  onClaim: (id: number) => void;
}
const GdcCard = ({nft, onClaim}: GdcCardProps) => {
  const nftUrl = appUrl(`/collection/${nft.nftAddress}/${nft.nftId}`);
  const { onCopy } = useClipboard(nftUrl.toString());

  const navigateTo = (link: string) => {
    window.open(link, '_blank');
  };

  const onCopyLinkButtonPressed = () => {
    onCopy();
    toast.success('Link copied!');
  };

  return (
    <Box
      className="card eb-nft__card h-100"
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
            >
              <FontAwesomeIcon icon={faPlusCircle} size="xl" style={{background:'white', color:'grey'}} className="rounded-circle" />
            </Box>
            <Box
              _groupHover={{transform:'scale(1.05)', transition:'0.3s ease'}}
              transition="0.3s ease"
              transform="scale(1.0)"
              onClick={() => navigateTo(nftUrl.toString())}
              cursor="pointer"
              filter='sepia(80%)'
            >
              <AnyMedia
                image={nftCardUrl(nft.nftAddress, nft.image)}
                title={nft.name}
                newTab={true}
                className="card-img-top marketplace"
                height={440}
                width={440}
                usePlaceholder={true}
                video=''
              />
            </Box>
          </div>
          {nft.rank && <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{nft.rank}</div>}
          <Flex direction='column' justify='space-between' px={2} py={1}>
            <div className="card-title mt-auto">
              <span onClick={() => navigateTo(nftUrl.toString())} style={{ cursor: 'pointer' }}>
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
          </Flex>
          <Spacer />
          <Box
            borderBottomRadius={15}
            p={2}
          >
            <Flex>
              <Button type="legacy"
                      onClick={() => onClaim(nft.nftId)}
                      className="flex-fill"
              >
                Claim
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>

  );
};

export default memo(GdcCard);
