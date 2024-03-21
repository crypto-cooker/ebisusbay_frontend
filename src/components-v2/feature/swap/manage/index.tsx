import {
  Avatar,
  AvatarBadge,
  Box, ButtonGroup, Flex, FormControl, FormLabel,
  Icon, Image, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  Popover,
  PopoverArrow, PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack, VStack
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import React, {MutableRefObject, useEffect, useState} from "react";
import useGetProfilePreview from "@src/hooks/useGetUsername";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {toast} from "react-toastify";
import ImageService from "@src/core/services/image";
import {commify} from "ethers/lib/utils";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";

interface ManageSwapProps {
  swap: any;
}

const ManageSwap = ({swap}: ManageSwapProps) => {
  const {username: makerUsername, avatar: makerAvatar} = useGetProfilePreview(swap.maker);
  const {username: takerUsername, avatar: takerAvatar} = useGetProfilePreview(swap.taker);
  const editMode = false;

  useEffect(() => {
    console.log('SWAP', swap);

  }, []);

  return (
    <Stack direction={{base: 'column', sm: 'row'}} justify='center'>
      <Box>
        <Box>{makerUsername}</Box>
      </Box>
      <Box>
        <Icon as={FontAwesomeIcon} icon={faHandshake} />
      </Box>
      <Box>
        <Box>{takerUsername}</Box>
      </Box>
    </Stack>
  )
}

export default ManageSwap;


const previewSize = '50px';
interface PreviewItemProps {
  nft: any;
  ref: MutableRefObject<any>;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSave: (nft: any, amount: number) => void;
  onRemove: (nft: any) => void;
  isPaused: boolean;
}

const PreviewNftItem = ({nft, ref, isOpen, onOpen, onClose, onSave, onRemove, isPaused}: PreviewItemProps) => {
  const [quantity, setQuantity] = useState(nft.amountSelected.toString());
  const borderColor = useColorModeValue('#000', '#FFF');

  const isValid = () => {
    if (quantity > nft.balance) return false;
    return true;
  }

  const handleUpdateSelectedAmount = () => {
    if (isPaused) return;

    if (!isValid()) {
      toast.error('Invalid value')
      return;
    }

    if (quantity < 1) {
      onRemove(nft);
      return;
    }

    onSave(nft, Math.floor(parseInt(quantity)));
    onClose();
  }

  const handleRemoveItem = () => {
    if (isPaused) return;
    onRemove(nft);
    onClose();
  }

  const handleOpen = () => {
    if (isPaused) return;
    onOpen();
  }

  const hoverTitle = nft.amountSelected > 1 ? `${nft.amountSelected} x${quantity}` : `${nft.amountSelected}`;

  return (
    <Popover
      initialFocusRef={ref}
      placement='top'
      isOpen={isOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Box
          cursor='pointer'
          onClick={handleOpen}
          filter={isPaused ? 'grayscale(80%)' : 'auto'}
          opacity={isPaused ? 0.5 : 'auto'}
          title={hoverTitle}
        >
          <Avatar
            src={ImageService.translate(nft.image).avatar()}
            w={previewSize}
            h={previewSize}
            borderRadius='md'
            border={`1px solid ${borderColor}`}
          >
            {nft.balance > 1 && (
              <AvatarBadge
                boxSize={6}
                bg={isPaused ? 'gray.500' : '#218cff'}
                fontSize={nft.amountSelected > 99 ? 'xs' : 'sm'}
                border={`1px solid ${borderColor}`}
              >
                {nft.amountSelected > 999 ? '+' : nft.amountSelected}
              </AvatarBadge>
            )}
          </Avatar>
        </Box>
      </PopoverTrigger>
      <PopoverContent p={5}>
        <PopoverArrow />
        <PopoverCloseButton />
        <Flex w='full' justify='space-between' my={4}>
          <Box>
            <Image
              src={ImageService.translate(nft.image).avatar()}
              w={previewSize}
              h={previewSize}
              borderRadius='md'
              border={`1px solid ${borderColor}`}
            />
          </Box>
          <VStack spacing={1} align='end' fontSize='sm'>
            <Box>
              {nft.name}
            </Box>
            <Box>
              Available: <strong>{commify(nft.balance)}</strong>
            </Box>
          </VStack>
        </Flex>
        {nft.balance > 1 ? (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Quantity</FormLabel>
              <NumberInput
                value={quantity}
                max={nft.balance ?? 1}
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
      </PopoverContent>
    </Popover>
  )
}
