import React, {useCallback, useEffect, useState} from 'react';
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import {ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {getCollectionMetadata} from "@src/core/api";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {createSuccessfulTransactionToastContent, round} from "@market/helpers/utils";
import {useWindowSize} from "@market/hooks/useWindowSize";
import {hostedImage} from "@src/helpers/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tag
} from "@chakra-ui/react";
import {getTheme} from "@src/global/theme/theme";
import {parseErrorMessage} from "@src/helpers/validator";
import useAuthedFunction from "@market/hooks/useAuthedFunction";
import {ApiService} from "@src/core/services/api-service";
import {OfferState, OfferType} from "@src/core/services/api-service/types";
import {useContractService, useUser} from "@src/components-v2/useUser";

const numberRegexValidation = /^[1-9]+[0-9]*$/;
const floorThreshold = 25;

interface MakeCollectionOfferDialogProps {
  isOpen: boolean;
  collection: any;
  onClose: () => void;
}

export default function MakeCollectionOfferDialog({ isOpen, collection, onClose }: MakeCollectionOfferDialogProps) {
  const [offerPrice, setOfferPrice] = useState<string | number | null>(null);
  const [floorPrice, setFloorPrice] = useState<string | number>(0);
  const [priceError, setPriceError] = useState<string>();
  const [existingOffer, setExistingOffer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [executingCreateListing, setExecutingCreateListing] = useState(false);

  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const windowSize = useWindowSize();
  const user = useUser();
  const contractService = useContractService();
  const [runAuthedFunction] = useAuthedFunction();

  const isAboveFloorPrice = (price: string | number) => {
    const floor = Number(floorPrice);
    return (floor > 0 && ((Number(price) - floor) / floor) * 100 > floorThreshold);
  };

  const costOnChange = useCallback((e: any) => {
    const newSalePrice = e.target.value.toString();
    if (numberRegexValidation.test(newSalePrice) || newSalePrice === '') {
      setOfferPrice(newSalePrice)
    }
  }, [setOfferPrice, floorPrice, offerPrice]);

  const onQuickCost = useCallback((percentage: number) => {
    if (executingCreateListing || showConfirmButton) return;

    const newSalePrice = Math.round(Number(floorPrice) * (1 + percentage));
    setOfferPrice(newSalePrice);

    if (isAboveFloorPrice(newSalePrice)) {
      setShowConfirmButton(false);
    }
  }, [executingCreateListing, showConfirmButton, floorPrice]);

  useEffect(() => {
    async function asyncFunc() {
      await getInitialProps();
    }
    if (collection && user.wallet.address) {
      asyncFunc();
    }
  }, [collection, user.wallet.address]);

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      setPriceError(undefined);
      const collectionAddress = collection.address;

      const floorPrice = await getCollectionMetadata(collectionAddress);
      if (floorPrice.collections.length > 0) {
        setFloorPrice(floorPrice.collections[0].stats.total.floorPrice ?? 0);
      }

      const collectionOffers = await ApiService.withoutKey().getMadeOffersByUser(user.address!, {
        collection: [collectionAddress],
        state: OfferState.ACTIVE,
        type: OfferType.COLLECTION,
      });
      setExistingOffer(collectionOffers.data.length > 0 ? collectionOffers.data[0] : undefined);

      setIsLoading(false);
    } catch (error) {
      toast.error(parseErrorMessage(error));
      console.log(error);
    }
  };

  const handleCreateOffer = async (e: any) => {
    e.preventDefault();
    if (!validateInput()) return;

    runAuthedFunction(async () => {
      try {
        if (!offerPrice) throw 'Invalid offer price';

        const collectionAddress = collection.address;
        const price = ethers.utils.parseEther(offerPrice.toString());

        setExecutingCreateListing(true);
        // Sentry.captureEvent({message: 'handleCreateOffer', extra: {address: collectionAddress, price}});
        const contract = contractService!.offer;

        let tx;
        if (existingOffer) {
          const newPrice = Number(offerPrice) - parseInt(existingOffer.price)
          tx = await contract.uppdateCollectionOffer(existingOffer.nftAddress, existingOffer.offerIndex, {
            value: ethers.utils.parseEther(newPrice.toString())
          });
        } else {
          tx = await contract.makeCollectionOffer(collectionAddress, {
            value: ethers.utils.parseEther(offerPrice.toString())
          });
        }

        let receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        setExecutingCreateListing(false);
        onClose();
      } catch (error) {
        toast.error(parseErrorMessage(error));
      } finally {
        setExecutingCreateListing(false);
      }
    });
  };

  const processCreateListingRequest = async (e: any) => {
    if (!validateInput()) return;

    if (isAboveFloorPrice(Number(offerPrice))) {
      setShowConfirmButton(true);
    } else {
      await handleCreateOffer(e)
    }
  }

  const validateInput = () => {
    if (!offerPrice || Number(offerPrice) < 1) {
      setPriceError('Value must be greater than zero');
      return false;
    }
    if (offerPrice.toString().length > 18) {
      setPriceError('Value must not exceed 18 digits');
      return false;
    }
    if (existingOffer && Number(offerPrice) <= parseInt(existingOffer.price)) {
      setPriceError('Offer must be greater than previous offer');
      return false;
    }

    setPriceError(undefined);
    return true;
  }

  if (!collection) return <></>;

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
            <ModalHeader className="text-center">
              {existingOffer ? <>Update Offer on {collection.name}</> : <>Offer on {collection.name}</>}
            </ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
              <div className="text-center mb-2" style={{fontSize: '14px'}}>
                This is an offer on the entire {collection.name} collection. Any owners of this collection will be able to view and accept it.
              </div>
              <div className="nftSaleForm row gx-3">
                <div className="col-12 col-sm-6 mb-sm-3">
                  <div className="profile_avatar d-flex justify-content-center">
                    <div className="dialog_avatar position-relative">
                      {collection.metadata.avatar ? (
                        <img src={hostedImage(collection.metadata.avatar)} alt={collection.name} />
                      ) : (
                        <Blockies seed={collection.address.toLowerCase()} size={15} scale={10} />
                      )}
                      {collection.verification?.verified && (
                        <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass="eb-avatar_badge" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 my-auto">
                  <div className="mt-4 mt-sm-0 mb-3 mb-sm-0">
                    {existingOffer && (
                      <Flex justify='space-between'>
                        <FormLabel className="formLabel">
                          Previous Offer:
                        </FormLabel>
                        <Box>
                          {existingOffer.price} CRO
                        </Box>
                      </Flex>
                    )}
                    <FormControl className="form-field" isInvalid={!!priceError}>
                      <FormLabel w='full' className="formLabel">
                        <Flex>
                          <Box flex='1'>Offer Amount</Box>
                          <Box>
                            <Tag size='sm' colorScheme='gray' variant='solid' ms={2}>
                              Floor: {round(floorPrice)} CRO
                            </Tag>
                          </Box>
                        </Flex>
                      </FormLabel>
                      <Input
                        type="number"
                        placeholder="Enter Amount"
                        value={offerPrice?.toString()}
                        onChange={costOnChange}
                        disabled={showConfirmButton || executingCreateListing}
                      />
                      <FormErrorMessage className="field-description textError">{priceError}</FormErrorMessage>
                    </FormControl>

                    <Flex justify='space-between' mb={3} mt={2}>
                      {windowSize?.width && windowSize.width > 377 && (
                        <Tag size='sm' colorScheme='red' variant='solid' cursor='pointer' onClick={() => onQuickCost(-0.25)}>
                          -25%
                        </Tag>
                      )}
                      <Tag size='sm' colorScheme='red' variant='solid' cursor='pointer' onClick={() => onQuickCost(-0.1)}>
                        -10%
                      </Tag>
                      <Tag size='sm' colorScheme='gray' variant='solid' cursor='pointer' onClick={() => onQuickCost(0)}>
                        Floor
                      </Tag>
                      <Tag size='sm' colorScheme='green' variant='solid' cursor='pointer' onClick={() => onQuickCost(0.1)}>
                        +10%
                      </Tag>
                      {windowSize?.width && windowSize.width > 377 && (
                        <Tag size='sm' colorScheme='green' variant='solid' cursor='pointer' onClick={() => onQuickCost(0.25)}>
                          +25%
                        </Tag>
                      )}
                    </Flex>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-0">
              <Box w='full'>
                {showConfirmButton ? (
                  <>
                    <div className="alert alert-danger my-auto mb-2 fw-bold text-center">
                      The desired price is {(100 - (Number(floorPrice) * 100 / Number(offerPrice))).toFixed(1)}% above the current floor price of {floorPrice} CRO. Are you sure?
                    </div>
                    {executingCreateListing && (
                      <div className="mb-2 text-center fst-italic">Please check your wallet for confirmation</div>
                    )}
                    <div className="d-flex">
                      <Button type="legacy"
                              onClick={() => setShowConfirmButton(false)}
                              disabled={executingCreateListing}
                              className="me-2 flex-fill">
                        Go Back
                      </Button>
                      <Button type="legacy-outlined"
                              onClick={handleCreateOffer}
                              isLoading={executingCreateListing}
                              disabled={executingCreateListing}
                              className="flex-fill">
                        I understand, continue
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {executingCreateListing && (
                      <div className="mb-2 text-center fst-italic">
                        <small>Please check your wallet for confirmation</small>
                      </div>
                    )}
                    <div className="d-flex">
                      <Button type="legacy"
                              onClick={processCreateListingRequest}
                              isLoading={executingCreateListing}
                              disabled={executingCreateListing}
                              className="flex-fill">
                        Confirm Offer
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
