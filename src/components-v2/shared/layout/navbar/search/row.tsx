import {useColorModeValue} from "@chakra-ui/color-mode";
import React, {useCallback} from "react";
import {Box, CloseButton, Flex, Image, Text, VStack} from "@chakra-ui/react";
import {ImageKitService} from "@src/helpers/image";
import {commify} from "ethers/lib/utils";
import {pluralize, round} from "@src/utils";
import NextImage from "next/image";

type ResultCollectionProps = {
  collection: any;
  floorPrice?: number;
  onClick: (collection: any) => void;
  onRemove?: (collection: any) => void;
  useCloseButton?: boolean;
  isFocused?: boolean;
}
const ResultCollection = ({collection, floorPrice, onClick, onRemove, useCloseButton = false, isFocused = false}: ResultCollectionProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const hoverColor = useColorModeValue('black', 'white');

  const handleClick = useCallback(() => {
    onClick(collection);
  }, [onClick, collection]);

  const handleRemove = useCallback((e: any) => {
    e.stopPropagation();
    if (onRemove) onRemove(collection);
  }, [onRemove, collection]);

  return (
    <Box
      key={`${collection.address}`}
      _hover={{background: hoverBackground}}
      p={2}
      rounded="lg"
      w="100%"
      fontSize="12px"
      cursor="pointer"
      onClick={handleClick}
      bg={isFocused ? hoverBackground : 'inherit'}
    >
      <Flex>
        <Box
          width={50}
          height={50}
          style={{borderRadius: '20px'}}
        >
          {collection.metadata && (
            <Image
              src={ImageKitService.buildAvatarUrl(collection.metadata.avatar)}
              alt={collection.name}
              rounded="md"
            />
          )}
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Text fontWeight="bold" noOfLines={1}>{collection.name}</Text>
            {collection.totalSupply && (
              <Text noOfLines={1} className="text-muted">{commify(collection.totalSupply)} {pluralize(collection.totalSupply, 'item')}</Text>
            )}
          </VStack>
        </Box>
        {(useCloseButton || (!!floorPrice && floorPrice > 0)) && (
          <Flex ms={2} my="auto" className="text-muted">
            {useCloseButton ? (
              <>
                <CloseButton onClick={handleRemove} _hover={{color: hoverColor}} color={isFocused ? hoverColor : 'inherit'} />
              </>
            ) : (!!floorPrice && floorPrice > 0) && (
              <>
                <NextImage src="/img/logos/cdc_icon.svg" width={16} height={16} alt='Cronos Logo' />
                <span className="ms-1">
                  {commify(round(floorPrice))}
                </span>
              </>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  )
}

export default ResultCollection;