import React, {useCallback, useEffect, useState} from 'react';
import {Contract} from "ethers";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {specialImageTransform} from "@src/hacks";
import {ERC1155, ERC721} from "@src/Contracts/Abis";
import {
  Box,
  BoxProps,
  Button as ChakraButton,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
  useNumberInput
} from "@chakra-ui/react";
import {is1155} from "@src/helpers/chain";
import {parseErrorMessage} from "@src/helpers/validator";
import {getCroidAddressFromName, isCroName} from "@src/helpers/croid";
import {DynamicNftImage} from "@src/components-v2/shared/media/dynamic-nft-image";
import {useUser} from "@src/components-v2/useUser";
import {ResponsiveDialogComponents, useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";

type TransferNftDialogProps = {
  isOpen: boolean;
  nft: any;
  onClose: () => void;
}

export const ResponsiveTransferNftDialog = ({ isOpen, onClose, nft, ...props }: TransferNftDialogProps & BoxProps) => {
  const { DialogComponent, DialogBody, DialogFooter } = useResponsiveDialog();

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} title={`Transfer ${nft.name}`} {...props}>
      <DialogContent
        isOpen={isOpen}
        onClose={onClose}
        nft={nft}
        DialogBody={DialogBody}
        DialogFooter={DialogFooter}
        {...props}
      />
    </DialogComponent>
  );
};

const DialogContent = ({isOpen, onClose, nft, DialogBody, DialogFooter}: ResponsiveDialogComponents & TransferNftDialogProps) => {
  const [recipientAddress, setRecipientAddress] = useState<string>();
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [executingTransferNft, setExecutingTransferNft] = useState(false);
  const [executingCidLookup, setExecutingCidLookup] = useState(false);
  const [quantity, setQuantity] = useState<string>('1');
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const user = useUser();

  const onChangeAddress = useCallback((e: any) => {
    const newRecipientAddress = e.target.value.toString();
    setRecipientAddress(newRecipientAddress)
  }, [setRecipientAddress, recipientAddress]);

  useEffect(() => {
    async function asyncFunc() {
      await getInitialProps();
    }
    if (nft && user.wallet.isConnected) {
      asyncFunc();
    }
  }, [nft, user.wallet.isConnected]);

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      setFieldError(null);

      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  };

  const handleMaxQuantity = () => {
    setQuantity(nft.balance.toString());
  }

  const handleTransfer = async () => {
    try {
      const nftAddress = nft.address ?? nft.nftAddress;
      const nftId = nft.id ?? nft.nftId;

      let targetAddress = recipientAddress;
      if (!!recipientAddress && isCroName(recipientAddress)) {
        setExecutingCidLookup(true);
        const croidAddress = await getCroidAddressFromName(recipientAddress);
        if (croidAddress) {
          targetAddress = croidAddress;
          setExecutingCidLookup(false);
        } else {
          setFieldError('No matching profiles for this Cronos ID');
          setExecutingCidLookup(false);
          return;
        }
      }

      setExecutingTransferNft(true);
      // Sentry.captureEvent({message: 'handleTransfer', extra: {address: nftAddress, targetAddress}});

      let tx;
      if (await is1155(nftAddress)) {
        const contract = new Contract(nftAddress, ERC1155, user.provider.getSigner());
        tx = await contract.safeTransferFrom(user.address, targetAddress, nftId, quantity, []);
      } else {
        const contract = new Contract(nftAddress, ERC721, user.provider.getSigner());
        tx = await contract.safeTransferFrom(user.address, targetAddress, nftId);
      }

      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setExecutingTransferNft(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setExecutingTransferNft(false);
      setExecutingCidLookup(false);
    }
  };

  const processTransferRequest = async () => {
    if (!validateInput()) return;

    if (Number(quantity || 1) > 1) {
      setShowConfirmButton(true);
    } else {
      await handleTransfer();
    }
  }

  const validateInput = () => {
    if (nft.balance > 1 && (Number(quantity) < 1 || Number(quantity) > nft.balance)) {
      setQuantityError('Quantity out of range');
      return false;
    }

    if (!recipientAddress || (!recipientAddress.endsWith('.cro') && !recipientAddress.startsWith('0x'))) {
      setFieldError('Please enter a valid Cronos address or Cronos ID');
      return false;
    }

    setQuantityError(null);
    setFieldError(null);
    return true;
  }

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: nft.balance,
      precision: 0,
      value: quantity,
      onChange(valueAsString, valueAsNumber) {
        setQuantity(valueAsString);
      },
      isDisabled: showConfirmButton || executingTransferNft
    })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  if (!nft) return <></>;

  return (
    <>
      {isLoading ? (
        <Flex h='200px' justify='center'>
          <Center>
            <Spinner />
          </Center>
        </Flex>
      ) : !nft ? (
        <Box textAlign='center'>Error: NFT not found</Box>
      ) : (
        <>
          <DialogBody>
            <Stack direction='row' spacing={4}>
              <Box w={{base: '30%', sm: 'full'}}>
                <DynamicNftImage nft={nft} address={nft.address ?? nft.nftAddress} id={nft.id ?? nft.nftId}>
                  <AnyMedia
                    image={specialImageTransform(nft.address ?? nft.nftAddress, nft.image)}
                    video={nft.video ?? nft.animation_url}
                    videoProps={{ height: 'auto', autoPlay: true }}
                    title={nft.name}
                    usePlaceholder={false}
                    className="img-fluid img-rounded"
                  />
                </DynamicNftImage>
              </Box>
              <Box w={{base: '70%', sm: 'full'}}>
                {nft.balance > 1 && (
                  <FormControl className="mb-3" isInvalid={!!quantityError}>
                    <FormLabel className="formLabel">
                      Quantity (up to {nft.balance})
                    </FormLabel>
                    <HStack>
                      <ChakraButton {...dec}>-</ChakraButton>
                      <Input {...input} />
                      <ChakraButton {...inc}>+</ChakraButton>
                      <ChakraButton minW='65px' onClick={handleMaxQuantity}>
                        Max
                      </ChakraButton>
                    </HStack>
                    <FormErrorMessage className="field-description textError">{quantityError}</FormErrorMessage>
                  </FormControl>
                )}
                <Box className="mt-4 mt-sm-0 mb-3 mb-sm-0">
                  <FormControl className="form-field" isInvalid={!!fieldError}>
                    <FormLabel w='full' className="formLabel">
                      Recipient Address or Cronos ID
                    </FormLabel>
                    <Input
                      type="text"
                      placeholder="Address or Cronos ID"
                      value={recipientAddress}
                      onChange={onChangeAddress}
                      disabled={showConfirmButton || executingTransferNft}
                    />
                    <FormErrorMessage className="field-description textError">{fieldError}</FormErrorMessage>
                  </FormControl>
                </Box>
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter className="border-0">
            <Box w='full'>
              {showConfirmButton ? (
                <>
                  <div className="alert alert-danger my-auto mb-2 fw-bold text-center">
                    {quantity} items selected. Do you wish to continue?
                  </div>
                  {executingTransferNft && (
                    <Box mb={2} textAlign='center'>
                      <Text as='i' fontSize='sm'>Please check your wallet for confirmation</Text>
                    </Box>
                  )}
                  <Flex>
                    <SecondaryButton
                      onClick={() => setShowConfirmButton(false)}
                      isDisabled={executingTransferNft}
                      className="me-2 flex-fill"
                    >
                      Go Back
                    </SecondaryButton>
                    <PrimaryButton
                      onClick={handleTransfer}
                      isLoading={executingTransferNft || executingCidLookup}
                      isDisabled={executingTransferNft || executingCidLookup}
                      className="flex-fill"
                    >
                      Continue
                    </PrimaryButton>
                  </Flex>
                </>
              ) : (
                <>
                  {executingTransferNft && (
                    <Box mb={2} textAlign='center'>
                      <Text as='i' fontSize='sm'>Please check your wallet for confirmation</Text>
                    </Box>
                  )}
                  <Flex>
                    <PrimaryButton
                      onClick={processTransferRequest}
                      isLoading={executingTransferNft || executingCidLookup}
                      disabled={executingTransferNft || executingCidLookup}
                      className="flex-fill"
                    >
                      Confirm Transfer
                    </PrimaryButton>
                  </Flex>
                </>
              )}
            </Box>
          </DialogFooter>
        </>
      )}
    </>
  )
}
