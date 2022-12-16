import React, {useState, useCallback, useEffect} from 'react';
import {Badge, Form, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {Contract, ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {getCollectionMetadata} from "@src/core/api";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {createSuccessfulTransactionToastContent, isBundle} from "@src/utils";
import {appConfig} from "@src/Config";
import Offer from "@src/Contracts/Offer.json";
import Market from "@src/Contracts/Marketplace.json";
import {useWindowSize} from "@src/hooks/useWindowSize";
import * as Sentry from '@sentry/react';
import {getFilteredOffers} from "@src/core/subgraph";
import {offerState} from "@src/core/api/enums";
import {getNft} from "@src/core/api/endpoints/nft";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {specialImageTransform} from "@src/hacks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import {getTheme} from "@src/Theme/theme";
import {getCollection, getCollections} from "@src/core/api/next/collectioninfo";
import ImagesContainer from "../../Bundle/ImagesContainer";

const config = appConfig();
const numberRegexValidation = /^[1-9]+[0-9]*$/;
const floorThreshold = 25;

export default function MakeOfferDialog({ isOpen, initialNft, onClose, nftId, nftAddress }) {
  const walletAddress = useSelector((state) => state.user.address);

  const [nft, setNft] = useState(initialNft);
  const [offerPrice, setOfferPrice] = useState(null);
  const [floorPrice, setFloorPrice] = useState(0);
  const [priceError, setPriceError] = useState(false);
  const [existingOffer, setExistingOffer] = useState(null);
  const [royalty, setRoyalty] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [executingCreateListing, setExecutingCreateListing] = useState(false);

  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const windowSize = useWindowSize();
  const user = useSelector((state) => state.user);
  const {contractService} = user;

  const isAboveFloorPrice = (price) => {
    return (parseInt(floorPrice) > 0 && ((Number(price) - floorPrice) / floorPrice) * 100 > floorThreshold);
  };

  const costOnChange = useCallback((e) => {
    const newSalePrice = e.target.value.toString();
    if (numberRegexValidation.test(newSalePrice) || newSalePrice === '') {
      setOfferPrice(newSalePrice)
    }
  }, [setOfferPrice, floorPrice, offerPrice]);

  const onQuickCost = useCallback((percentage) => {
    if (executingCreateListing || showConfirmButton) return;

    const newSalePrice = Math.round(floorPrice * (1 + percentage));
    setOfferPrice(newSalePrice);

    if (isAboveFloorPrice(newSalePrice)) {
      setShowConfirmButton(false);
    }
  })

  useEffect(() => {
    async function asyncFunc() {
      await getInitialProps();
    }
    if (user.provider && (nft || nftId) && nftAddress) {
      asyncFunc();
    }
  }, [user.provider, nft, nftId, nftAddress]);

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      setPriceError(null);

      let fetchedNft = nft;
      if (!nft) {
        const tmpNft = await getNft(nftAddress, nftId);
        fetchedNft = tmpNft.nft;
        setNft(tmpNft.nft);
      }

      const collection = await getCollection(nftAddress);
      if (collection.multiToken) {
        setFloorPrice(collection.stats.tokens[fetchedNft.id ?? fetchedNft.nftId].floor_price ?? 0);
      } else {
        setFloorPrice(collection.stats.total.floorPrice ?? 0);
      }

      const filteredOffers = await getFilteredOffers(
        fetchedNft.address ?? fetchedNft.nftAddress,
        fetchedNft.id ?? fetchedNft.nftId,
        walletAddress
      );
      setExistingOffer(filteredOffers.data?.find((o) => o.state.toString() === offerState.ACTIVE.toString()))
      const royalties = await collectionRoyaltyPercent(nftAddress, fetchedNft.id ?? fetchedNft.nftId);
      setRoyalty(royalties);

      setIsLoading(false);
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
      console.log(error);
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    try {
      const price = ethers.utils.parseEther(offerPrice.toString());

      setExecutingCreateListing(true);
      Sentry.captureEvent({message: 'handleCreateOffer', extra: {address: nftAddress, price}});
      const contract = contractService.offer;
      let tx;
      if (existingOffer) {
        const newPrice = parseInt(offerPrice) - parseInt(existingOffer.price)
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
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
    } finally {
      setExecutingCreateListing(false);
    }
  };

  const processCreateListingRequest = async (e) => {
    if (!validateInput()) return;

    if (isAboveFloorPrice(offerPrice)) {
      setShowConfirmButton(true);
    } else {
      await handleCreateOffer(e)
    }
  }

  const validateInput = () => {
    if (!offerPrice || parseInt(offerPrice) < 1) {
      setPriceError('Value must be greater than zero');
      return false;
    }
    if (offerPrice.toString().length > 18) {
      setPriceError('Value must not exceed 18 digits');
      return false;
    }
    if (existingOffer && parseInt(offerPrice) <= parseInt(existingOffer.price)) {
      setPriceError('Offer must be greater than previous offer');
      return false;
    }

    setPriceError(null);
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
                <>{existingOffer ? <>Update Offer</> : <>Make Offer}</>}</>
              )}
            </ModalHeader>
            <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
            <ModalBody>
              <div className="nftSaleForm row gx-3">
                <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                  {isBundle(nft.address ?? nft.nftAddress) ? (
                    <ImagesContainer nft={nft} />
                  ) : (
                    <AnyMedia
                      image={specialImageTransform(nft.address ?? nft.nftAddress, nft.image)}
                      video={nft.video ?? nft.animation_url}
                      videoProps={{ height: 'auto', autoPlay: true }}
                      title={nft.name}
                      usePlaceholder={false}
                      className="img-fluid img-rounded"
                    />
                  )}
                </div>
                <div className="col-12 col-sm-6">
                  {existingOffer && (
                    <div className="d-flex justify-content-between">
                      <Form.Label className="formLabel">
                        Previous Offer:
                      </Form.Label>
                      <div>
                        {existingOffer.price} CRO
                      </div>
                    </div>
                  )}
                  <Form.Group className="form-field">
                    <Form.Label className="formLabel w-100">
                      <div className="d-flex">
                        <div className="flex-grow-1">Offer Amount</div>
                        <div className="my-auto">
                          <Badge
                            pill
                            bg={user.theme === 'dark' ? 'light' : 'secondary'}
                            text={user.theme === 'dark' ? 'dark' : 'light'}
                            className="ms-2"
                          >
                            Floor: {floorPrice} CRO
                          </Badge>
                        </div>
                      </div>
                    </Form.Label>
                    <Form.Control
                      className="input"
                      type="number"
                      placeholder="Enter Amount"
                      value={offerPrice ?? ''}
                      onChange={costOnChange}
                      disabled={showConfirmButton || executingCreateListing}
                    />
                    <Form.Text className="field-description textError">
                      {priceError}
                    </Form.Text>
                  </Form.Group>

                  <div className="d-flex flex-wrap justify-content-between mb-3">
                    {windowSize.width > 377 && (
                      <Badge bg="danger" text="light" className="cursor-pointer my-1 d-sm-none d-md-block" onClick={() => onQuickCost(-0.25)}>
                        -25%
                      </Badge>
                    )}
                    <Badge bg="danger" text="light" className="cursor-pointer my-1" onClick={() => onQuickCost(-0.1)}>
                      -10%
                    </Badge>
                    <Badge
                      bg={user.theme === 'dark' ? 'light' : 'secondary'}
                      text={user.theme === 'dark' ? 'dark' : 'light'}
                      className="cursor-pointer my-1" onClick={() => onQuickCost(0)}
                    >
                      Floor
                    </Badge>
                    <Badge bg="success" text="light" className="cursor-pointer my-1" onClick={() => onQuickCost(0.1)}>
                      +10%
                    </Badge>

                    {windowSize.width > 377 && (
                      <Badge bg="success" text="light" className="cursor-pointer my-1 d-sm-none d-md-block" onClick={() => onQuickCost(0.25)}>
                        +25%
                      </Badge>
                    )}
                  </div>

                  <div className="text-center my-3" style={{fontSize: '14px'}}>
                    Offer amount will be held in escrow until the offer is either accepted, rejected, or cancelled
                  </div>
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
              <div className="w-100">
                {showConfirmButton ? (
                  <>
                    <div className="alert alert-danger my-auto mb-2 fw-bold text-center">
                      The desired price is {(100 - (floorPrice * 100 / offerPrice)).toFixed(1)}% above the current floor price of {floorPrice} CRO. Are you sure?
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
              </div>
            </ModalFooter>
          </>
        ) : (
          <EmptyData>
            <Spinner animation="border" role="status" size="sm" className="ms-1">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </EmptyData>
        )}
      </ModalContent>
    </Modal>
  );
}
