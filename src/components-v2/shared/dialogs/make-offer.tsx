import React, {useCallback, useEffect, useState} from 'react';
import {ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {createSuccessfulTransactionToastContent, isBundle, isLandDeedsCollection, round} from "@src/utils";
import {useWindowSize} from "@src/hooks/useWindowSize";
import {getNft} from "@src/core/api/endpoints/nft";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {specialImageTransform} from "@src/hacks";
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
import {getTheme} from "@src/Theme/theme";
import {getCollection} from "@src/core/api/next/collectioninfo";
import ImagesContainer from "../../../Components/Bundle/ImagesContainer";
import {useAppSelector} from "@src/Store/hooks";
import {parseErrorMessage} from "@src/helpers/validator";
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {ApiService} from "@src/core/services/api-service";
import {OfferState} from "@src/core/services/api-service/types";
import {DynamicNftImage} from "@src/components-v2/shared/media/dynamic-nft-image";

const numberRegexValidation = /^[1-9]+[0-9]*$/;
const floorThreshold = 25;

interface MakeOfferDialogProps {
  isOpen: boolean;
  initialNft?: any;
  onClose: () => void;
  nftId?: string;
  nftAddress?: string;
}

export default function MakeOfferDialog({ isOpen, initialNft, onClose, nftId, nftAddress }: MakeOfferDialogProps) {
  const walletAddress = useAppSelector((state) => state.user.address);

  const [nft, setNft] = useState(initialNft);
  const [offerPrice, setOfferPrice] = useState<string | number | null>(null);
  const [floorPrice, setFloorPrice] = useState<string | number>(0);
  const [priceError, setPriceError] = useState<string>();
  const [existingOffer, setExistingOffer] = useState<any>(null);
  const [royalty, setRoyalty] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [executingCreateListing, setExecutingCreateListing] = useState(false);

  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const windowSize = useWindowSize();
  const user = useAppSelector((state) => state.user);
  const {contractService} = user;
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
    if (user.provider && (initialNft || nftId) && nftAddress) {
      asyncFunc();
    }
  }, [user.provider, initialNft, nftId, nftAddress]);

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      setPriceError(undefined);

      let fetchedNft = nft;
      if (!nft) {
        const tmpNft = await getNft(nftAddress, nftId);
        fetchedNft = tmpNft.nft;
        setNft(tmpNft.nft);
      }

      const collection = await getCollection(nftAddress);
      if (collection.multiToken) {
        setFloorPrice(collection.stats.total.floorPrice ?? 0);
      } else {
        setFloorPrice(collection.stats.total.floorPrice ?? 0);
      }

      const myOffers = await ApiService.withoutKey().getMadeOffersByUser(walletAddress!, {
        collection: [nftAddress!],
        tokenId: nftId ?? fetchedNft.id ?? fetchedNft.nftId,
        pageSize: 1,
        state: OfferState.ACTIVE
      });

      setExistingOffer(myOffers.data.length > 0 ? myOffers.data[0] : undefined);
      const royalties = await collectionRoyaltyPercent(nftAddress, fetchedNft.id ?? fetchedNft.nftId);
      setRoyalty(royalties);

      setIsLoading(false);
    } catch (error: any) {
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

        const price = ethers.utils.parseEther(offerPrice.toString());

        setExecutingCreateListing(true);
        // Sentry.captureEvent({message: 'handleCreateOffer', extra: {address: nftAddress, price}});
        const contract = contractService!.offer;
        let tx;
        if (existingOffer) {
          const newPrice = Number(offerPrice) - parseInt(existingOffer.price)
          tx = await contract.updateOffer(existingOffer.hash, existingOffer.offerIndex, {
            value: ethers.utils.parseEther(newPrice.toString())
          });
        } else {
          tx = await contract.makeOffer(nft.address ?? nft.nftAddress, nft.id ?? nft.nftId, {
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

  if (!nftAddress) return <></>;

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        {!isLoading ? (
          <>
            <ModalHeader className="text-center">
              {nft ? (
                <>{existingOffer ? <>Update Offer on {nft.name}</> : <>Offer on {nft.name}</>}</>
              ) : (
                <>{existingOffer ? <>Update Offer</> : <>Make Offer</>}</>
              )}
            </ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
              <div className="nftSaleForm row gx-3">
                <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                  {isBundle(nft.address ?? nft.nftAddress) ? (
                    <ImagesContainer nft={nft} />
                  ) : (
                    <DynamicNftImage address={nft.address ?? nft.nftAddress} id={nft.id ?? nft.nftId}>
                    <AnyMedia
                      image={specialImageTransform(nft.address ?? nft.nftAddress, nft.image)}
                      video={nft.video ?? nft.animation_url}
                      videoProps={{ height: 'auto', autoPlay: true }}
                      title={nft.name}
                      usePlaceholder={false}
                      className="img-fluid img-rounded"
                    />
                    </DynamicNftImage>
                  )}
                </div>
                <div className="col-12 col-sm-6">
                  {existingOffer && (
                    <div className="d-flex justify-content-between">
                      <FormLabel className="formLabel">
                        Previous Offer:
                      </FormLabel>
                      <div>
                        {existingOffer.price} CRO
                      </div>
                    </div>
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
                      value={offerPrice ?? ''}
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

                  <Box textAlign='center' my={3} fontSize='sm'>
                    Offer amount will be held in escrow until the offer is either accepted, rejected, or cancelled
                  </Box>
                  {!isBundle(nft.address ?? nft.nftAddress) && (
                    <div>
                      <h3 className="feeTitle">Fees</h3>
                      <hr />
                      <div className="fee">
                        <span>Royalty Fee: </span>
                        <span>{royalty} %</span>
                      </div>
                    </div>
                  )}
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
                    <div className="d-flex w-100">
                      <Button type="legacy"
                              onClick={() => setShowConfirmButton(false)}
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
