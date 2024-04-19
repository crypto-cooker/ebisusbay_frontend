import {useColorModeValue} from "@chakra-ui/color-mode";
import {Box, Flex, HStack, Image, VStack} from "@chakra-ui/react";
import {ethers} from "ethers";
import React from "react";
import {DexToken, DexTokenBalance} from "@dex/types";

interface RowProps {
  token: DexTokenBalance;
  hasVerticalScrollbar: boolean;
  onSelect: (token: DexToken) => void;
}
export default function Row({token, hasVerticalScrollbar, onSelect}: RowProps) {
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const hoverColor = useColorModeValue('black', 'white');

  return (
    <Flex
      justify='space-between'
      px={4}
      pe={hasVerticalScrollbar ? 2 : 0}
      py={2}
      cursor='pointer'
      _hover={{
        bg: hoverBackground
      }}
      onClick={() => onSelect(token)}
    >
      <HStack w='full'>
        <Box>
          <Image src={token.logoURI} w='30px' rounded='full' />
        </Box>
        <VStack align='start' spacing={0}>
          <Box fontWeight='bold'>{token.symbol}</Box>
          <Box className='text-muted' fontSize='sm'>{token.name}</Box>
        </VStack>
      </HStack>
      <Box my='auto'>{ethers.utils.formatUnits(token.balance, token.decimals)}</Box>
    </Flex>
  )
}