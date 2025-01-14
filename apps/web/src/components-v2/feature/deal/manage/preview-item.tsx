import React, {useMemo} from "react";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  VStack,
  Wrap
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import {commify} from "ethers/lib/utils";
import {ItemType} from "@market/hooks/use-create-order-signer";
import useCurrencyBroker from "@market/hooks/use-currency-broker";
import Link from "next/link";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {DealItem} from "@src/core/services/api-service/mapi/types";
import { ciEquals, isAddress, shortAddress, shortString } from '@market/helpers/utils';
import {ethers} from "ethers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAward} from "@fortawesome/free-solid-svg-icons";
import Properties from "@src/components-v2/feature/nft/tabs/properties";
import Trait from "@src/components-v2/feature/nft/tabs/properties/trait";
import {useChainSlugById} from "@src/config/hooks";
import {SupportedChainId} from "@src/config/chains";
import { CurrencyLogoByAddress } from '@dex/components/logo';
import { useDealsTokens } from '@src/global/hooks/use-supported-tokens';


interface GetDealItemPreviewProps {
  item: DealItem;
  invalid: boolean;
  chainId: SupportedChainId;
}

export const GetDealItemPreview = ({item, invalid, chainId}: GetDealItemPreviewProps) => {
  const chainSlug = useChainSlugById(chainId);
  const { search: findDealToken } = useDealsTokens(chainId);

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
        itemUrl: `/collection/${chainSlug ?? chainId}/${item.token}/${item.identifier_or_criteria}`,
        custom: false
      }
    } else if (isToken) {
      const token = findDealToken(item.token);

      return {
        name: item.token_symbol || token?.symbol || shortString(item.token, 5),
        image: <CurrencyLogoByAddress address={item.token} chainId={chainId} size='24px' />,
        amount: ethers.utils.formatUnits(item.start_amount, item.token_decimals ?? 18),
        category: token ? token.name : 'Custom Token',
        categoryUrl: ``,
        itemUrl: ``,
        custom: !token
      }
    }
  }, [item.token]);

  if (!normalizedItem) return;

  return (
    <AccordionItem key={item.token} border={invalid ? '1px solid red' : 'auto'}>
      <Flex w='100%' my={2} ps={4}>
        <Box flex='1' textAlign='left' my='auto'>
          <HStack>
            <Box
              width='40px'
              position='relative'
              rounded='md'
              overflow='hidden'
            >
              {normalizedItem!.image || (
                <Flex
                  w='35px'
                  h='35px'
                  bg='gray.400'
                  rounded='full'
                  align='center'
                  justify='center'
                  fontWeight='bold'
                >
                  ?
                </Flex>
              )}
            </Box>

            <Box flex='1' fontSize='sm'>
              <VStack align='start' spacing={0}>
                {!!normalizedItem.category && (
                  <Box fontSize='xs' className='color'>{isAddress(normalizedItem.category) ? shortAddress(normalizedItem.category) : normalizedItem.category}</Box>
                )}
                <Wrap fontWeight='bold' spacing={1}>
                  {!!normalizedItem.itemUrl ? (
                    <Link href={normalizedItem.itemUrl} target='_blank'>
                      {normalizedItem!.name}
                    </Link>
                  ) : (
                    <>{normalizedItem!.name}</>
                  )}
                  {!!item.token_details?.metadata.rank && (
                    <Badge
                      variant='solid'
                      colorScheme='blue'
                    >
                      <HStack spacing={1} h='full'>
                        <Icon as={FontAwesomeIcon} icon={faAward} />
                        <Box>{item.token_details.metadata.rank}</Box>
                      </HStack>
                    </Badge>
                  )}
                </Wrap>
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
        {(isNft || (isToken && normalizedItem!.custom)) ? (
          <AccordionButton w='auto'>
            <AccordionIcon />
          </AccordionButton>
        ) : (
          <Box w='50px'>

          </Box>
        )}
      </Flex>
      <AccordionPanel>
        {item.token_details?.metadata.attributes ? (
          <Properties
            address={item.token}
            attributes={item.token_details?.metadata.attributes}
            chainSlug={chainSlug}
          />
        ) : (isToken && normalizedItem!.custom) ? (
          <Flex justify='space-around'>
            <Trait
              title='Token Address'
              value={item.token}
              chainSlug={chainSlug}
            />
          </Flex>
        ) : (
          <Box fontSize='sm' textAlign='center'>No additional info found for this item</Box>
        )}
      </AccordionPanel>
    </AccordionItem>
  )
}