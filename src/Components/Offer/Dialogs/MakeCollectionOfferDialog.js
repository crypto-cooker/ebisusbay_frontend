import React, {useState, useCallback, useEffect} from 'react';
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import {Badge, Form, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {Contract, ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {getCollectionMetadata} from "@src/core/api";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {appConfig} from "@src/Config";
import Offer from "@src/Contracts/Offer.json";
import Market from "@src/Contracts/Marketplace.json";
import {useWindowSize} from "@src/hooks/useWindowSize";
import * as Sentry from '@sentry/react';
import {hostedImage} from "@src/helpers/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {getMyCollectionOffers} from "@src/core/subgraph";
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

const config = appConfig();
const numberRegexValidation = /^[1-9]+[0-9]*$/;
const floorThreshold = 25;

export default function MakeCollectionOfferDialog({ isOpen, collection, onClose }) {
  const [offerPrice, setOfferPrice] = useState(null);
  const [floorPrice, setFloorPrice] = useState(0);
  const [priceError, setPriceError] = useState(false);
  const [existingOffer, setExistingOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [executingCreateListing, setExecutingCreateListing] = useState(false);

  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const windowSize = useWindowSize();
  const user = useSelector((state) => state.user);
  const {offerContract, marketContract} = user;

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
    if (collection && user.provider) {
      asyncFunc();
    }
  }, [collection, user.provider]);

  const wrappedOfferContract = () => {
    return offerContract ?? new Contract(config.contracts.offer, Offer.abi, user.provider.getSigner());
  };

  const wrappedMarketContract = () => {
    return marketContract ?? new Contract(config.contracts.market, Market.abi, user.provider.getSigner());
  };

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      setPriceError(null);
      const collectionAddress = collection.address;
      const marketContract = wrappedMarketContract();

      const floorPrice = await getCollectionMetadata(collectionAddress);
      if (floorPrice.collections.length > 0) {
        setFloorPrice(floorPrice.collections[0].floorPrice ?? 0);
      }

      const collectionOffers = await getMyCollectionOffers(user.address, '0', '0', collection.address);
      setExistingOffer(collectionOffers.data)

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
      const collectionAddress = collection.address;
      const price = ethers.utils.parseEther(offerPrice.toString());

      setExecutingCreateListing(true);
      Sentry.captureEvent({message: 'handleCreateOffer', extra: {address: collectionAddress, price}});
      const contract = wrappedOfferContract();

      let tx;
      if (existingOffer) {
        const newPrice = parseInt(offerPrice) - parseInt(existingOffer.price)
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
                      {collection.metadata.verified && (
                        <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass="eb-avatar_badge" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 my-auto">
                  <div className="mt-4 mt-sm-0 mb-3 mb-sm-0">
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
                        value={offerPrice}
                        onChange={costOnChange}
                        disabled={showConfirmButton || executingCreateListing}
                      />
                      <Form.Text className="field-description textError">
                        {priceError}
                      </Form.Text>
                    </Form.Group>

                    <div className="d-flex flex-wrap justify-content-between">
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
                  </div>
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
