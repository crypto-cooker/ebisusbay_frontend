import {useColorModeValue} from "@chakra-ui/color-mode";
import React, {useCallback} from "react";
import {Box, Flex, Text, VStack} from "@chakra-ui/react";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {ImageKitService} from "@src/helpers/image";
import {commify} from "ethers/lib/utils";
import {pluralize, round} from "@src/utils";

const ResultCollection = ({collection, floorPrice, onClick}) => {
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const handleClick = useCallback(() => {
    onClick(collection);
  }, [onClick, collection]);

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
    >
      <Flex>
        <Box
          width={50}
          height={50}
          style={{borderRadius: '20px'}}
        >
          {collection.metadata && (
            <AnyMedia
              image={ImageKitService.buildAvatarUrl(collection.metadata.avatar)}
              title={collection.name}
              usePlaceholder={false}
              className="img-rounded-8"
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
        {floorPrice > 0 && (
          <Box ms={2} my="auto" className="text-muted">
            {commify(round(floorPrice))} CRO
          </Box>
        )}
      </Flex>
    </Box>
  )
}

export default ResultCollection;