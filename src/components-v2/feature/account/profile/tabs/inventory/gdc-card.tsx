import React, {memo} from 'react';
import {nftCardUrl} from "@src/helpers/image";
import {Box, Flex, Heading, Spacer, useClipboard} from "@chakra-ui/react";
import {appUrl} from "@src/utils";
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
              _groupHover={{transform:'scale(1.05)', transition:'0.3s ease'}}
              transition="0.3s ease"
              transform="scale(1.0)"
              onClick={() => navigateTo(nftUrl.toString())}
              cursor="pointer"
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
          <Flex direction='column' justify='space-between' px={2} py={1}>
            <div className="card-title mt-auto">
              <span onClick={() => navigateTo(nftUrl.toString())} style={{ cursor: 'pointer' }}>
                <Heading as="h6" size="sm">{nft.name}</Heading>
              </span>
            </div>
          </Flex>
          <Spacer />
          <Box borderBottomRadius={15} p={2}>
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
