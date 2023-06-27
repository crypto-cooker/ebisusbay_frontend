import {useColorModeValue} from "@chakra-ui/color-mode";
import React, {useCallback} from "react";
import {Box, CloseButton, Flex, Image, Text, VStack} from "@chakra-ui/react";
import {commify} from "ethers/lib/utils";
import {pluralize, round} from "@src/utils";
import NextImage from "next/image";
import ImageService from "@src/core/services/image";

type ResultFactionProps = {
  collection: any;
  faction: any;
  onClick: (collection: any) => void;
  onRemove?: (collection: any) => void;
  useCloseButton?: boolean;
  isFocused?: boolean;
}
const ResultFaction = ({collection, faction, onClick, onRemove, useCloseButton = false, isFocused = false}: ResultFactionProps) => {
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
      key={`${faction.name}`}
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
        <Image
            src={ImageService.translate(faction.image).avatar()}
            alt={faction.name}
            rounded="md"
        />
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Text fontWeight="bold" noOfLines={1}>{faction.name}</Text>
          </VStack>
        </Box>
      </Flex>
    </Box>
  )
}

export default ResultFaction;