import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {Contract} from "ethers";
import Button from "@src/Components/components/Button";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {specialImageTransform} from "@src/hacks";
import {ERC1155, ERC721} from "@src/Contracts/Abis";
import {
  Box,
  Button as ChakraButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useNumberInput
} from "@chakra-ui/react";
import {getTheme} from "@src/Theme/theme";
import {is1155} from "@src/helpers/chain";
import {parseErrorMessage} from "@src/helpers/validator";
import {getCroidAddressFromName, isCroName} from "@src/helpers/croid";
import {DynamicNftImage} from "@src/components-v2/shared/media/dynamic-nft-image";
import {useUser} from "@src/components-v2/useUser";

interface TransferNftDialogProps {
  isOpen: boolean;
  nft: any;
  onClose: () => void;
}

export default function TransferNftDialog({ isOpen, nft, onClose }: TransferNftDialogProps) {
  const [recipientAddress, setRecipientAddress] = useState<string>();
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [executingTransferNft, setExecutingTransferNft] = useState(false);
  const [executingCnsLookup, setExecutingCnsLookup] = useState(false);
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
        setExecutingCnsLookup(true);
        const croidAddress = await getCroidAddressFromName(recipientAddress);
        if (croidAddress) {
          targetAddress = croidAddress;
          setExecutingCnsLookup(false);
        } else {
          setFieldError('No matching profiles for this Cronos ID');
          setExecutingCnsLookup(false);
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
      setExecutingCnsLookup(false);
    }
  };

  const processTransferRequest = async (e: ChangeEvent<HTMLButtonElement>) => {
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
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
            <ModalHeader className="text-center">
              Transfer {nft.name}
            </ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
              <div className="nftSaleForm row gx-3">
                <div className="col-12 col-sm-4 mb-sm-3">
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
                </div>
                <div className="col-12 col-sm-8 my-auto">
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
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-0">
              <Box w='full'>
                {showConfirmButton ? (
                  <>
                    <div className="alert alert-danger my-auto mb-2 fw-bold text-center">
                      {quantity} items selected. Do you wish to continue?
                    </div>
                    {executingTransferNft && (
                      <div className="mb-2 text-center fst-italic">
                        <small>Please check your wallet for confirmation</small>
                      </div>
                    )}
                    <div className="d-flex">
                      <Button type="legacy"
                              onClick={() => setShowConfirmButton(false)}
                              disabled={executingTransferNft}
                              className="me-2 flex-fill">
                        Go Back
                      </Button>
                      <Button type="legacy-outlined"
                              onClick={handleTransfer}
                              isLoading={executingTransferNft || executingCnsLookup}
                              disabled={executingTransferNft || executingCnsLookup}
                              className="flex-fill">
                        Continue
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {executingTransferNft && (
                      <div className="mb-2 text-center fst-italic">
                        <small>Please check your wallet for confirmation</small>
                      </div>
                    )}
                    <div className="d-flex">
                      <Button type="legacy"
                              onClick={processTransferRequest}
                              isLoading={executingTransferNft || executingCnsLookup}
                              disabled={executingTransferNft || executingCnsLookup}
                              className="flex-fill">
                        Confirm Transfer
                      </Button>
                    </div>
                  </>
                )}
              </Box>
            </ModalFooter>
          </>
        ) : (
          <EmptyData>
            <Spinner size='sm' ms={1} />
          </EmptyData>
        )}
      </ModalContent>
    </Modal>
  );
}
