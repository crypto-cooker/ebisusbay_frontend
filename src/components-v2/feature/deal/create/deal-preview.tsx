import React, {MutableRefObject, ReactNode, useMemo, useRef, useState} from "react";
import {
  Avatar,
  AvatarBadge,
  Box,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Slide,
  Stack,
  VStack,
  Wrap
} from "@chakra-ui/react";
import {uniqueNftId} from "@src/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import useBarterDeal from "@src/components-v2/feature/deal/use-barter-deal";
import ImageService from "@src/core/services/image";
import {toast} from "react-toastify";
import {BarterToken} from "@src/jotai/atoms/deal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import {useUser} from "@src/components-v2/useUser";
import {commify} from "ethers/lib/utils";

const previewSize = '50px';

interface DealPreviewProps {
  onChangeStep: (step: number) => void;
  onConfirm: () => void;
  isConfirming: boolean;
}

export const DealPreview = ({onChangeStep, onConfirm, isConfirming}: DealPreviewProps) => {
  const user = useUser();
  const {
    barterState,
    updateAmountSelected,
    updateOfferAmountSelected,
    updateTokenAmountSelected,
    updateTokenOfferAmountSelected,
    toggleSelectionNFT,
    toggleSelectionERC20,
    toggleOfferNFT,
    toggleOfferERC20
  } = useBarterDeal();
  const sliderBackground = useColorModeValue('gray.50', 'gray.700')

  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep === 1) {
      if (barterState.taker.nfts.length < 1 && barterState.taker.erc20.length < 1) {
        toast.error('At least one NFT or Token is required');
        return;
      }
    }
    if (currentStep === 2) {
      if (barterState.maker.nfts.length < 1 && barterState.maker.erc20.length < 1) {
        toast.error('At least one NFT or Token is required');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
    onChangeStep(currentStep + 1);
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    onChangeStep(currentStep - 1);
  }

  const initialFocusRef = useRef(null);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const handleOpenPopover = (id: string) => {
    setOpenPopoverId(id);
  };

  const nftPopoverId = (nft: any, side: string) => {
    return `${side}${uniqueNftId(nft)}`;
  }

  const tokenPopoverId = (token: BarterToken, side: string) => {
    return `${side}${token.address}`;
  }

  return (
    <>
      <Slide direction='bottom' in={true} style={{ zIndex: 10 }}>
        <Box p={3} backgroundColor={sliderBackground} borderTop='1px solid white'>
          <Stack spacing={4} direction={{base:'column', sm: 'row'}} align={{base: 'end', sm: 'center'}}>
            <Stack w='full' direction='row' align='center'>
              <Wrap spacing={2} direction='row' justify='end' w='full'>
                <PlaceholderPreview nfts={barterState.taker.nfts} tokens={barterState.taker.erc20}>
                  {barterState.taker.nfts.map((nft) => (
                    <PreviewNftItem
                      key={uniqueNftId(nft)}
                      nft={nft}
                      ref={initialFocusRef}
                      isOpen={openPopoverId === nftPopoverId(nft, 'userA')}
                      onOpen={() => handleOpenPopover(nftPopoverId(nft, 'userA'))}
                      onClose={() => setOpenPopoverId(null)}
                      onSave={(nft: any, amount: number) => {
                        updateAmountSelected({
                          nftAddress: nft.nftAddress,
                          nftId: nft.nftId,
                          newAmountSelected: amount
                        });
                      }}
                      onRemove={(nft: any) => {
                        toggleSelectionNFT(nft);
                      }}
                      isPaused={false}
                    />
                  ))}
                  {barterState.taker.erc20.map((token) => (
                    <PreviewTokenItem
                      key={token.address}
                      token={token}
                      ref={initialFocusRef}
                      isOpen={openPopoverId === tokenPopoverId(token, 'userA')}
                      onOpen={() => handleOpenPopover(tokenPopoverId(token, 'userA'))}
                      onClose={() => setOpenPopoverId(null)}
                      onSave={(token: BarterToken, amount: number) => {
                        updateTokenAmountSelected({
                          tokenAddress: token.address,
                          newAmountSelected: amount
                        });
                      }}
                      onRemove={(nft: any) => {
                        toggleSelectionERC20(nft);
                      }}
                      isPaused={false}
                    />
                  ))}
                </PlaceholderPreview>
              </Wrap>
              <Box mx={4}>
                <Icon as={FontAwesomeIcon} icon={faHandshake} boxSize={6} />
              </Box>
              <Wrap spacing={2} direction='row' justify='start' w='full'>
                <PlaceholderPreview nfts={barterState.maker.nfts} tokens={barterState.maker.erc20}>
                  {barterState.maker.nfts.map((nft) => (
                    <PreviewNftItem
                      key={uniqueNftId(nft)}
                      nft={nft}
                      ref={initialFocusRef}
                      isOpen={openPopoverId === nftPopoverId(nft, 'userB')}
                      onOpen={() => handleOpenPopover(nftPopoverId(nft, 'userB'))}
                      onClose={() => setOpenPopoverId(null)}
                      onSave={(nft: any, amount: number) => {
                        updateOfferAmountSelected({
                          nftAddress: nft.nftAddress,
                          nftId: nft.nftId,
                          newAmountSelected: amount
                        });
                      }}
                      onRemove={(nft: any) => {
                        toggleOfferNFT(nft);
                      }}
                      isPaused={!user.wallet.isConnected}
                    />
                  ))}
                  {barterState.maker.erc20.map((token) => (
                    <PreviewTokenItem
                      key={token.address}
                      token={token}
                      ref={initialFocusRef}
                      isOpen={openPopoverId === tokenPopoverId(token, 'userB')}
                      onOpen={() => handleOpenPopover(tokenPopoverId(token, 'userB'))}
                      onClose={() => setOpenPopoverId(null)}
                      onSave={(token: BarterToken, amount: number) => {
                        updateTokenOfferAmountSelected({
                          tokenAddress: token.address,
                          newAmountSelected: amount
                        });
                      }}
                      onRemove={(nft: any) => {
                        toggleOfferERC20(nft);
                      }}
                      isPaused={!user.wallet.isConnected}
                    />
                  ))}
                </PlaceholderPreview>
              </Wrap>
            </Stack>
            {/*<Text*/}
            {/*  fontSize="sm"*/}
            {/*  fontWeight="bold"*/}
            {/*  mb={{base: 2, sm: showSecureCancelConfirmation ? 2 : 0, md: 0}}*/}
            {/*  w='140px'*/}
            {/*>*/}
            {/*  X selected*/}
            {/*</Text>*/}
            <Box>
              <HStack justify='end'>
                  <HStack>
                    {currentStep > 1 && (
                      <SecondaryButton
                        onClick={handleBack}
                      >
                        Back
                      </SecondaryButton>
                    )}
                    {currentStep < 2 ? (
                      <PrimaryButton
                        onClick={handleNext}
                        isDisabled={barterState.taker.nfts.length < 1 && barterState.taker.erc20.length < 1}
                      >
                        Next
                      </PrimaryButton>
                    ) : currentStep === 2 ? (
                      <PrimaryButton
                        onClick={handleNext}
                        isDisabled={
                          (barterState.taker.nfts.length < 1 && barterState.taker.erc20.length < 1) ||
                          (barterState.maker.nfts.length < 1 && barterState.maker.erc20.length < 1) ||
                          !user.wallet.isConnected
                        }
                      >
                        Review
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton
                        onClick={onConfirm}
                        isLoading={isConfirming}
                        isDisabled={
                          (barterState.taker.nfts.length < 1 && barterState.taker.erc20.length < 1) ||
                          (barterState.maker.nfts.length < 1 && barterState.maker.erc20.length < 1) ||
                          !user.wallet.isConnected
                        }
                      >
                        Confirm
                      </PrimaryButton>
                    )}
                  </HStack>
              </HStack>
            </Box>
          </Stack>
        </Box>
      </Slide>
    </>
  )
}

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

interface PreviewTokenItemProps {
  token: BarterToken;
  ref: MutableRefObject<any>;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSave: (nft: BarterToken, amount: number) => void;
  onRemove: (nft: BarterToken) => void;
  isPaused: boolean;
}

const PreviewTokenItem = ({token, ref, isOpen, onOpen, onClose, onSave, onRemove, isPaused}: PreviewTokenItemProps) => {
  const [quantity, setQuantity] = useState(token.amount.toString());
  const borderColor = useColorModeValue('#000', '#FFF');

  const isValid = () => {
    return true;
  }

  const handleUpdateSelectedAmount = () => {
    if (isPaused) return;

    if (!isValid()) {
      toast.error('Invalid value');
      return;
    }

    if (parseInt(quantity) < 1) {
      onRemove(token);
      return;
    }

    onSave(token, Math.floor(parseInt(quantity)));
    onClose();
  }

  const handleRemoveItem = () => {
    if (isPaused) return;
    onRemove(token);
    onClose();
  }

  const handleOpen = () => {
    if (isPaused) return;
    onOpen();
  }

  return (
    <Popover
      initialFocusRef={ref}
      placement='top'
      isOpen={isOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Flex
          cursor='pointer'
          onClick={handleOpen}
          borderRadius='md'
          border={`1px solid ${borderColor}`}
          w={previewSize}
          h={previewSize}
          align='center'
          direction='column'
          justify='space-between'
          overflow='hidden'
          title={`${token.amount} ${token.name}`}
        >
          <Box p={1}>{token.image}</Box>
          <Box
            fontSize='xs'
            w='full'
            textAlign='center'
            bgColor={isPaused ? 'gray.500' : '#218cff'}
            fontWeight='bold'
            color='white'
          >
            {token.amount >= 10000 ? '9,999+' : commify(token.amount)}
          </Box>
        </Flex>
      </PopoverTrigger>
      <PopoverContent p={5}>
        <PopoverArrow />
        <PopoverCloseButton />
        <Flex w='full' justify='space-between' my={4}>
          <Box
            w={previewSize}
            h={previewSize}
          >
            {token.image}
          </Box>
          <VStack align='end' fontSize='sm' spacing={0}>
            <Box>{token.name}</Box>
            <Box fontWeight='bold'>{commify(token.amount)}</Box>
          </VStack>
        </Flex>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Update Quantity</FormLabel>
            <NumberInput
              value={quantity}
              max={1000000}
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
      </PopoverContent>
    </Popover>
  )
}

const PlaceholderPreview = ({nfts, tokens, children}: {nfts: any[], tokens: BarterToken[], children: ReactNode}) => {
  const borderColor = useColorModeValue('#000', '#FFF');

  return (
    <>
      {nfts.length > 0 || tokens.length > 0 ? (
        <>{children}</>
      ) : (
        <Box
          w={previewSize}
          h={previewSize}
          borderRadius='md'
          border={`1px dashed ${borderColor}`}
        >

        </Box>
      )}
    </>
  )
}