import React, {MutableRefObject, useMemo} from "react";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  GridItem,
  HStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  VStack
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import {commify} from "ethers/lib/utils";
import {ItemType} from "@src/hooks/use-create-order-signer";
import useCurrencyBroker from "@src/hooks/use-currency-broker";
import Link from "next/link";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {DealItem} from "@src/core/services/api-service/mapi/types";
import {isAddress, shortAddress, shortString} from "@src/utils";
import {ethers} from "ethers";


interface GetDealItemPreviewProps {
  item: DealItem;
}

export const GetDealItemPreview = ({item}: GetDealItemPreviewProps) => {
  const { getByAddress  } = useCurrencyBroker();
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  const token = useMemo(() => {
    return getByAddress(item.token);
  }, [item.token]);

  const isToken = [ItemType.NATIVE, ItemType.ERC20].includes(item.item_type);
  const isNft = [ItemType.ERC721, ItemType.ERC1155].includes(item.item_type);

  const normalizedItem = useMemo(() => {
    if (isNft) {
      return {
        name: item.token_details!.metadata.name,
        image: (
          <AnyMedia
            image={ImageService.translate(item.token_details!.metadata.image).avatar()}
            title={item.token_details!.metadata.name}
          />
        ),
        amount: parseInt(item.start_amount),
        category: item.collection?.name,
        categoryUrl: `/collection/${item.token}`,
        itemUrl: `/collection/${item.token}/${item.identifier_or_criteria}`,
      }
    } else if (isToken) {
      const token = getByAddress(item.token);

      return {
        name: token?.symbol ?? shortString(item.token, 5),
        image: token?.image,
        amount: ethers.utils.formatUnits(item.start_amount, item.token_decimals ?? 18),
        category: token ? token.name : 'Custom Token',
        categoryUrl: ``,
        itemUrl: ``,
      }
    }
  }, [item.token]);

  if (!normalizedItem) return;

  return (
    <AccordionItem key={item.token}>
      <Flex w='100%' my={2} ps={4}>
        <Box flex='1' textAlign='left' my='auto'>
          <HStack>
            <Box
              width='40px'
              position='relative'
              rounded='md'
              overflow='hidden'
            >
              {normalizedItem!.image}
            </Box>

            <Box flex='1' fontSize='sm'>
              <VStack align='start' spacing={0}>
                {!!normalizedItem.category && (
                  <Box fontSize='xs' className='color'>{isAddress(normalizedItem.category) ? shortAddress(normalizedItem.category) : normalizedItem.category}</Box>
                )}
                <Box fontWeight='bold'>
                  {!!normalizedItem.itemUrl ? (
                    <Link href={normalizedItem.itemUrl} target='_blank'>
                      {normalizedItem!.name}
                    </Link>
                  ) : (
                    <>{normalizedItem!.name}</>
                  )}
                </Box>
              </VStack>
            </Box>
          </HStack>
        </Box>
        <Box ms={2}>
          <VStack align='end' spacing={0} fontSize='sm'>
            <Stat size='sm' textAlign='end'>
              <StatLabel>Amount</StatLabel>
              <StatNumber>
                {commify(normalizedItem!.amount)}
              </StatNumber>
            </Stat>
          </VStack>
        </Box>
        {isNft ? (
          <AccordionButton w='auto'>
            <AccordionIcon />
          </AccordionButton>
        ) : (
          <Box w='50px'>

          </Box>
        )}
      </Flex>
      <AccordionPanel>
        {/*<Flex justify='space-around' textAlign='center' fontSize='sm' bg={hoverBackground} rounded='md' py={2}>*/}
        {/*  {isNft && item.token_details?.metadata.rank && (*/}
        {/*    <VStack direction="row" spacing={0}>*/}
        {/*      <Text fontWeight="bold">Rank:</Text>*/}
        {/*      <Text>{item.token_details?.metadata.rank}</Text>*/}
        {/*    </VStack>*/}
        {/*  )}*/}
        {/*</Flex>*/}
        {item.token_details?.metadata.rank ? (
          <SimpleGrid spacing={2} columns={{base: 1, sm: 2, lg: 3}}>
            {item.token_details?.metadata.attributes.map((attr) => (
              <GridItem key={attr.trait_type} bg={hoverBackground} rounded='md'>
                <VStack fontSize='sm' spacing={0} py={2} textAlign='center'>
                  <Box fontWeight='bold'>{attr.trait_type}</Box>
                  <Box>{attr.value}</Box>
                </VStack>

              </GridItem>
            ))}
          </SimpleGrid>
        )  : (
          <Box fontSize='sm' textAlign='center'>No additional info found for this item</Box>
        )}
      </AccordionPanel>
    </AccordionItem>
  )
}