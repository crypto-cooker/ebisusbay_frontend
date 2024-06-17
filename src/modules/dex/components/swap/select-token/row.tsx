import {useColorModeValue} from "@chakra-ui/color-mode";
import {Box, Flex, HStack, Image, VStack} from "@chakra-ui/react";
import React from "react";
import {Currency, CurrencyAmount} from "@uniswap/sdk-core";
import {WrappedTokenInfo} from "@dex/hooks/use-supported-tokens";

interface RowProps {
  token: CurrencyAmount<Currency>;
  hasVerticalScrollbar: boolean;
  onSelect: (token: Currency) => void;
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
      onClick={() => onSelect(token.currency)}
    >
      <HStack w='full'>..
        <Box>
          <Image src={(token.currency as WrappedTokenInfo).logoURI} w='30px' rounded='full' />
        </Box>
        <VStack align='start' spacing={0}>
          <Box fontWeight='bold'>{token.currency.symbol}</Box>
          <Box className='text-muted' fontSize='sm'>{token.currency.name}</Box>
        </VStack>
      </HStack>
      <Box my='auto'>{token.toExact()}</Box>
    </Flex>
  )
}