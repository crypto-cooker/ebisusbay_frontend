import React, { useCallback } from 'react';
import { Box, CloseButton, Flex, Image, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { commify } from 'ethers/lib/utils';
import { pluralize, round } from '@market/helpers/utils';
import ImageService from '@src/core/services/image';
import CronosIconBlue from '@src/components-v2/shared/icons/cronos-blue';

type ResultCollectionProps = {
  collection: any;
  floorPrice?: number;
  onClick: (collection: any) => void;
  onRemove?: (collection: any) => void;
  useCloseButton?: boolean;
  isFocused?: boolean;
};
const ResultCollection = ({
  collection,
  floorPrice,
  onClick,
  onRemove,
  useCloseButton = false,
  isFocused = false,
}: ResultCollectionProps) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const hoverColor = useColorModeValue('black', 'white');

  const handleClick = useCallback(() => {
    onClick(collection);
  }, [onClick, collection]);

  const handleRemove = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (onRemove) onRemove(collection);
    },
    [onRemove, collection],
  );

  return (
    <Box
      key={`${collection.address}`}
      _hover={{ background: hoverBackground }}
      p={2}
      rounded="lg"
      w="100%"
      fontSize="12px"
      cursor="pointer"
      bg={isFocused ? hoverBackground : 'inherit'}
      position={'relative'}
    >
      <Flex onClick={handleClick} >
        <Box width={50} height={50} style={{ borderRadius: '20px' }}>
          {collection.metadata && (
            <Image
              src={ImageService.translate(collection.metadata.avatar).avatar()}
              alt={collection.name}
              rounded="md"
            />
          )}
        </Box>
        <Box flex="1" ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Text fontWeight="bold" noOfLines={1}>
              {collection.name}
            </Text>
            {collection.totalSupply && (
              <Text noOfLines={1} className="text-muted">
                {commify(collection.totalSupply)} {pluralize(collection.totalSupply, 'item')}
              </Text>
            )}
          </VStack>
        </Box>
      </Flex>
      {(useCloseButton || (!!floorPrice && floorPrice > 0)) && (
        <Flex position={'absolute'} right={0} top={0} ms={2} my="auto" className="text-muted" alignItems="center">
          {useCloseButton ? (
            <>
              <CloseButton
                onClick={handleRemove}
                _hover={{ color: hoverColor }}
                color={isFocused ? hoverColor : 'inherit'}
              />
            </>
          ) : (
            !!floorPrice &&
            floorPrice > 0 && (
              <>
                <CronosIconBlue boxSize={4} />
                <span className="ms-1">{commify(round(floorPrice))}</span>
              </>
            )
          )}
        </Flex>
      )}
    </Box>
  );
};

export default ResultCollection;
