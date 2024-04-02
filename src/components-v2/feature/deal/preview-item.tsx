import React, {MutableRefObject, ReactNode, useMemo, useState} from "react";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {toast} from "react-toastify";
import {
  AccordionButton, AccordionIcon,
  AccordionItem, AccordionPanel,
  Avatar,
  AvatarBadge,
  Box, ButtonGroup,
  Flex,
  FormControl,
  FormLabel, HStack,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow, PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text,
  VStack
} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import {commify} from "ethers/lib/utils";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import {ItemType} from "@src/hooks/use-create-order-signer";
import {BarterToken} from "@src/jotai/atoms/deal";
import useCurrencyBroker from "@src/hooks/use-currency-broker";
import {Image as ChakraImage} from "@chakra-ui/image/dist/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {round, siPrefixedNumber} from "@src/utils";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import {SortKeys} from "@src/components-v2/shared/responsive-table/responsive-collections-table";

const previewSize = '50px';

interface NftIconProps {
  onClick: () => void;
  isActive: boolean;
  name: string;
  image: string;
  quantityAvailable: number;
  quantitySelected: number;
}

const NftIcon = ({onClick, isActive, name, image, quantityAvailable, quantitySelected}: NftIconProps) => {
  const borderColor = useColorModeValue('#000', '#FFF');

  return (
    <Box
      cursor='pointer'
      onClick={onClick}
      filter={!isActive ? 'grayscale(80%)' : 'auto'}
      opacity={!isActive ? 0.5 : 'auto'}
      title={name}
    >
      <Avatar
        src={ImageService.translate(image).avatar()}
        w={previewSize}
        h={previewSize}
        borderRadius='md'
        border={`1px solid ${borderColor}`}
      >
        {quantityAvailable > 1 && (
          <AvatarBadge
            boxSize={6}
            bg={!isActive ? 'gray.500' : '#218cff'}
            fontSize={quantitySelected > 99 ? 'xs' : 'sm'}
            border={`1px solid ${borderColor}`}
          >
            {quantitySelected > 999 ? '+' : quantitySelected}
          </AvatarBadge>
        )}
      </Avatar>
    </Box>
  )
}

interface TokenIconProps {
  onClick: () => void;
  isActive: boolean;
  address: string;
  quantityAvailable: number;
  quantitySelected: number;
}
const TokenIcon = ({onClick, isActive, address, quantityAvailable, quantitySelected}: TokenIconProps) => {
  const borderColor = useColorModeValue('#000', '#FFF');
  const { getByAddress  } = useCurrencyBroker();

  const image = useMemo(() => {
    return getByAddress(address)?.image;
  }, [address]);

  const name = useMemo(() => {
    return getByAddress(address)?.name;
  }, [address]);

  return (
    <Flex
      cursor='pointer'
      onClick={onClick}
      borderRadius='md'
      border={`1px solid ${borderColor}`}
      w={previewSize}
      h={previewSize}
      align='center'
      direction='column'
      justify='space-between'
      overflow='hidden'
      title={`${quantitySelected} ${name}`}
    >
      <Box p={1}>{image}</Box>
      <Box
        fontSize='xs'
        w='full'
        textAlign='center'
        bgColor={!isActive ? 'gray.500' : '#218cff'}
        fontWeight='bold'
        color='white'
      >
        {quantitySelected >= 10000 ? '9,999+' : commify(quantitySelected)}
      </Box>
    </Flex>
  )
}

interface UpdateItemFormProps {
  image: string | ReactNode;
  name: string;
  quantityAvailable: number;
  quantitySelected: number;
  onRemove?: () => void;
  onClose: () => void;
  onSave?: (amount: number) => void;
  isActive: boolean;
  mode: 'READ' | 'WRITE'
}

const UpdateItemForm = ({image, name, quantityAvailable, quantitySelected, isActive, onSave, onRemove, onClose, mode}: UpdateItemFormProps) => {
  const [quantity, setQuantity] = useState(quantitySelected.toString());
  const borderColor = useColorModeValue('#000', '#FFF');

  const handleUpdateSelectedAmount = () => {
    if (!isActive) return;

    if (parseInt(quantity) < 1) {
      onRemove?.();
      return;
    }

    onSave?.(Math.floor(parseInt(quantity)));
    onClose();
  }

  const handleRemoveItem = () => {
    if (!isActive) return;
    onRemove?.();
    onClose();
  }

  return (
    <>
      <Flex w='full' justify='space-between' my={4}>
        <Box>
          {typeof image === 'string' ? (
            <Image
              src={ImageService.translate(image).avatar()}
              w={previewSize}
              h={previewSize}
              borderRadius='md'
              border={`1px solid ${borderColor}`}
            />
          ) : (
            <>{image}</>
          )}
        </Box>
        <VStack spacing={1} align='end' fontSize='sm'>
          <Box>
            {name}
          </Box>
          <Box>
            Available: <strong>{commify(quantityAvailable)}</strong>
          </Box>
        </VStack>
      </Flex>
      {isActive && mode === 'WRITE' && (
        <>
          {quantityAvailable > 1 ? (
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Quantity</FormLabel>
                <NumberInput
                  value={quantity}
                  max={quantityAvailable ?? 1}
                  onChange={(valueAsString: string) => setQuantity(valueAsString)}
                  precision={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <ButtonGroup display='flex' justifyContent='flex-end'>
                <SecondaryButton onClick={handleRemoveItem}>
                  Remove
                </SecondaryButton>
                <PrimaryButton onClick={handleUpdateSelectedAmount}>
                  Save
                </PrimaryButton>
              </ButtonGroup>
            </Stack>
          ) : (
            <ButtonGroup display='flex' justifyContent='flex-end'>
              <SecondaryButton onClick={handleRemoveItem}>
                Remove
              </SecondaryButton>
            </ButtonGroup>
          )}
        </>
      )}
    </>
  )
}

interface GetDealItemPreviewProps {
  item: {
    token: string,
    identifier_or_criteria: string,
    item_type: number,
    start_amount: string,
    token_details: {
      metadata: {
        image: string,
        name: string,
        rank: number
      }
    },
    collection: {
      metadata: {
        name: string
      }
    }
  };
  ref: MutableRefObject<any>;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSave?: (item: any, amount: number) => void;
  onRemove?: (item: any) => void;
  isActive: boolean;
  mode: 'READ' | 'WRITE';
}

export const GetDealItemPreview = ({item, ref, isOpen, onOpen, onClose, onSave, onRemove, isActive, mode}: GetDealItemPreviewProps) => {
  const { getByAddress  } = useCurrencyBroker();

  const token = useMemo(() => {
    return getByAddress(item.token);
  }, [item.token]);

  const isToken = [ItemType.NATIVE, ItemType.ERC20].includes(item.item_type);
  const isNft = [ItemType.ERC721, ItemType.ERC1155].includes(item.item_type);

  const normalizedItem = useMemo(() => {
    if (isNft) {
      return {
        name: item.token_details.metadata.name,
        image: (
          <AnyMedia
            image={ImageService.translate(item.token_details.metadata.image).avatar()}
            title={item.token_details.metadata.name}
          />
        ),
        amount: parseInt(item.start_amount),
        category: item.collection.metadata?.name,
        categoryUrl: `/collection/${item.token}`,
        itemUrl: `/collection/${item.token}/${item.identifier_or_criteria}`,
      }
    } else if (isToken) {
      const token = getByAddress(item.token);
      return {
        name: token?.name,
        image: token?.image,
        amount: parseInt(item.start_amount),
        category: '',
        categoryUrl: ``,
        itemUrl: ``,
      }
    }
  }, [item.token]);

  if (!normalizedItem) return;

  return (
    <AccordionItem key={item.token}>
      <Flex w='100%' my={2}>
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
              <VStack align='start'>
                {!!normalizedItem.category && (
                  <Box fontSize='xs' className='color'>{normalizedItem.category}</Box>
                )}
                <Box fontWeight='bold'>
                  <Link href={normalizedItem.itemUrl} target='_blank'>
                    {normalizedItem!.name}
                  </Link>
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
        <AccordionButton w='auto'>
          <AccordionIcon />
        </AccordionButton>
      </Flex>
      <AccordionPanel>
        asdf
      </AccordionPanel>
    </AccordionItem>
  )
}