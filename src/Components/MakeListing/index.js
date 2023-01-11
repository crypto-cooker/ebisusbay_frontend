import React, { useState, useCallback, useEffect } from 'react';
import { specialImageTransform } from "@src/hacks";
import { AnyMedia } from "@src/Components/components/AnyMedia";
import DotIcon from "@src/Components/components/DotIcon";
import { faCheck, faDollarSign, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useFeatureFlag from "@src/hooks/useFeatureFlag";
import Constants from "@src/constants";
import { Badge, Form, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Contract, ethers } from "ethers";
import Button from "@src/Components/components/Button";
import { getCollectionMetadata } from "@src/core/api";
import { toast } from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import { ERC721 } from "@src/Contracts/Abis";
import { createSuccessfulTransactionToastContent, isBundle } from "@src/utils";
import { appConfig } from "@src/Config";
import Market from "@src/Contracts/Marketplace.json";
import { useWindowSize } from "@src/hooks/useWindowSize";
import * as Sentry from '@sentry/react';
import { collectionRoyaltyPercent } from "@src/core/chain";
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
import ImagesContainer from "@src/Components/Bundle/ImagesContainer";
import useCreateGaslessListing from '../Account/Settings/hooks/useCreateGaslessListing';
import useUpdateGaslessListing from '../Account/Settings/hooks/useUpdateGaslessListing';

import moment from 'moment';

const config = appConfig();
const numberRegexValidation = /^[1-9]+[0-9]*$/;
const floorThreshold = 5;

const expirationDatesValues = [
  {
    value: 3600000,
    label: '1 Hour'
  },
  {
    value: 10800000,
    label: '3 Hours'
  },
  {
    value: 21600000,
    label: '6 Hours'
  },
  {
    value: 86400000,
    label: '1 Day'
  },
  {
    value: 259200000,
    label: '3 Days'
  },
  {
    value: 604800000,
    label: '7 Days'
  },
  {
    value: 1296000000,
    label: '15 Days'
  },
  {
    value: 2592000000,
    label: '30 Days'
  },

]

export default function MakeListingDialog({ isOpen, nft, onClose, listing }) {
  const { Features } = Constants;
  const [saleType, setSaleType] = useState(1);
  const [salePrice, setSalePrice] = useState(null);
  const [expirationDate, setExpirationDate] = useState({ type: 'dropdown', value: new Date().getTime() + 2592000000 });
  const [floorPrice, setFloorPrice] = useState(0);
  const [priceError, setPriceError] = useState(false);
  const [fee, setFee] = useState(0);
  const [royalty, setRoyalty] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isTransferApproved, setIsTransferApproved] = useState(false);
  const [executingApproval, setExecutingApproval] = useState(false);
  const [executingCreateListing, setExecutingCreateListing] = useState(false);

  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const windowSize = useWindowSize();
  const isAuctionOptionEnabled = useFeatureFlag(Features.AUCTION_OPTION_SALE);

  const isGaslessListingEnabled = useFeatureFlag(Features.GASLESS_LISTING);

  const user = useSelector((state) => state.user);
  const [createGaslessListing, responseCreate] = useCreateGaslessListing();
  const [updateGaslessListing, responseUpdate] = useUpdateGaslessListing();

  const { contractService } = user;

  const changeSaleType = (type) => {
    switch (type) {
      case 'auction':
        setSaleType(0);
        break;
      case 'fixedPrice':
        setSaleType(1);
        break;
      default:
        setSaleType(1);
    }
  }

  const isBelowFloorPrice = (price) => {
    return (floorPrice !== 0 && ((floorPrice - Number(price)) / floorPrice) * 100 > floorThreshold);
  };

  const costOnChange = useCallback((e) => {
    const newSalePrice = e.target.value.toString();
    if (numberRegexValidation.test(newSalePrice) || newSalePrice === '') {
      setSalePrice(newSalePrice)
    }
  }, [setSalePrice, floorPrice, salePrice]);

  const expirationDateOnChange = useCallback((e) => {

    if (!e.target.value.includes('T')) {
      setExpirationDate({ type: 'dropdown', value: new Date().getTime() + parseInt(e.target.value) });
    }
    else {
      setExpirationDate({ type: 'select', value: new Date(e.target.value).getTime() });
    }

  }, [setExpirationDate])

  const onQuickCost = useCallback((percentage) => {
    if (executingCreateListing || showConfirmButton) return;

    const newSalePrice = Math.round(floorPrice * (1 + percentage));
    setSalePrice(newSalePrice);

    if (isBelowFloorPrice(newSalePrice)) {
      setShowConfirmButton(false);
    }
  })

  const getSaleValue = () => {
    try {
      return ethers.utils.commify(salePrice.toFixed(2));
    } catch (e) {
      return salePrice
    }
  };

  const getYouReceiveViewValue = () => {
    const youReceive = salePrice - (fee / 100) * salePrice - (royalty / 100) * salePrice;
    try {
      return ethers.utils.commify(youReceive.toFixed(2));
    } catch (e) {
      return youReceive
    }
  };

  useEffect(() => {
    async function asyncFunc() {
      await getInitialProps();
    }
    if (nft && user.provider) {
      asyncFunc();
    }
  }, [nft, user.provider]);

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      setPriceError(null);
      const nftAddress = nft.address ?? nft.nftAddress;
      const nftId = nft.id ?? nft.nftId;
      const marketContractAddress = config.contracts.market;
      const gaslessListingContract = config.contracts.gaslessListing;
      const marketContract = user.contractService.market;
      setSalePrice(listing ? Math.round(listing.price) : null)

      const floorPrice = await getCollectionMetadata(nftAddress);
      if (floorPrice.collections.length > 0) {
        setFloorPrice(floorPrice.collections[0].floorPrice ?? 0);
      }

      const fees = await marketContract.fee(user.address);

      if (!nft.listingNonce) setFee((fees / 10000) * 100)

      const royalties = await collectionRoyaltyPercent(nftAddress, nftId);
      setRoyalty(royalties);

      const contract = new Contract(nftAddress, ERC721, user.provider.getSigner());
      const transferEnabled = await contract.isApprovedForAll(user.address, marketContractAddress);

      if (transferEnabled) {
        setIsTransferApproved(true);
      } else {
        setIsTransferApproved(false);
      }

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

  const handleApproval = async (e) => {
    e.preventDefault();
    try {
      const nftAddress = nft.address ?? nft.nftAddress;
      const marketContractAddress = config.contracts.market;
      const gaslessListingContract = config.contracts.gaslessListing;
      const contract = new Contract(nftAddress, ERC721, user.provider.getSigner());
      setExecutingApproval(true);

      const tx = await contract.setApprovalForAll(marketContractAddress, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setIsTransferApproved(true);

    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
      console.log(error);
    } finally {
      setExecutingApproval(false);
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    try {
      const nftAddress = nft.address ?? nft.nftAddress;
      const nftId = nft.id ?? nft.nftId;
      const price = ethers.utils.parseEther(salePrice.toString());
      setExecutingCreateListing(true);
      if (isGaslessListingEnabled) {
        if (nft.listed) {
          if (nft.listingNonce) {
            const res = await updateGaslessListing({ collectionAddress: nftAddress, tokenId: nftId, price: salePrice.toString(), expirationDate: expirationDate.value, nonce: nft.listingNonce });
          }
          else {
            Sentry.captureEvent({ message: 'handleCreateListing', extra: { nftAddress, nftId, price } });
            let tx = await contractService.market.makeListing(nftAddress, nftId, price);
            let receipt = await tx.wait();
            toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
          }
        }
        else {
          const res = await createGaslessListing({ collectionAddress: nftAddress, tokenId: nftId, price: salePrice.toString(), expirationDate: expirationDate.value, is1155: nft.multiToken });
        }
        toast.success("Listing Successful");

      } else {
        Sentry.captureEvent({ message: 'handleCreateListing', extra: { nftAddress, nftId, price } });
        let tx = await contractService.market.makeListing(nftAddress, nftId, price);
        let receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      }
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

    if (isBelowFloorPrice(salePrice)) {
      setShowConfirmButton(true);
    } else {
      await handleCreateListing(e)
    }
  }

  const validateInput = () => {
    if (!salePrice || parseInt(salePrice) < 1) {
      setPriceError('Value must be greater than zero');
      return false;
    }
    if (salePrice.toString().length > 18) {
      setPriceError('Value must not exceed 18 digits');
      return false;
    }

    setPriceError(null);
    return true;
  }

  if (!nft) return <></>;

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          {listing ? 'Update' : 'Sell'} {nft.name}
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
        {!isLoading ? (
          <>
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
                  <h3>Sale Type</h3>
                  <div className="d-flex">
                    {/* <div className={`card flex-fill form_icon_button shadow first-button ${saleType === 0 ? 'active' : ''}`} onClick={() => changeSaleType('auction')}>*/}
                    {/*  {saleType === 0 && <DotIcon icon={faCheck} />}*/}
                    {/*  <FontAwesomeIcon className='icon' icon={faClock} />*/}
                    {/*  <p>Auction</p>*/}
                    {/*</div> */}

                    <div className={`card flex-fill form_icon_button shadow ${saleType === 1 ? 'active' : ''}`} onClick={() => changeSaleType('fixedPrice')}>
                      {saleType === 1 && <DotIcon icon={faCheck} />}
                      <FontAwesomeIcon className='icon' icon={faDollarSign} />
                      <p>Fixed Price</p>
                    </div>
                  </div>

                  <Form.Group className="form-field">
                    <Form.Label className="formLabel w-100">
                      <div className="d-flex">
                        <div className="flex-grow-1">{saleType === 1 ? 'Listing Price' : 'Starting Bid Price'}</div>
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
                      value={salePrice}
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

                  {isGaslessListingEnabled && (
                    <Form.Group className="form-field mb-3">
                      <Form.Label className="formLabel w-100">
                        <div className="d-flex">
                          <div className="flex-grow-1">Expiration Date</div>
                        </div>
                      </Form.Label>
                      <div style={{ display: 'flex', gap: '8px' }}>

                        {expirationDate.type === 'dropdown' ?
                          (<>
                            <Form.Select defaultValue={2592000000}
                              onChange={expirationDateOnChange}
                            >
                              {expirationDatesValues.map((time) => (
                                <option value={time.value}>{time.label}</option>
                              ))
                              }

                            </Form.Select>

                          </>)
                          :
                          (<>
                            <Form.Control
                              className="input"
                              type="text"
                              value={moment(new Date(expirationDate.value)).format('DD/MM/YYYY HH:mm:ss a')}
                              disabled

                            />

                            <Button type='outlined' style={{ maxWidth: '38px', height: '40px' }} className="simple-button" onClick={() => { setExpirationDate({ value: new Date().getTime() + 2592000000, type: 'dropdown' }) }}>
                              <FontAwesomeIcon className='icon-fa' icon={faTimes} />
                            </Button>
                          </>
                          )
                        }
                        <Form.Control
                          style={{ maxWidth: '38px', visibility: expirationDate.type === 'dropdown' ? 'visible' : 'hidden', position: expirationDate.type === 'dropdown' ? 'relative' : 'absolute' }}
                          className="input"
                          type="datetime-local"
                          onChange={expirationDateOnChange}

                        />

                      </div>
                    </Form.Group>)}

                  <div>
                    <h3 className="feeTitle">Fees</h3>
                    <hr />
                    <div className="fee">
                      <span>Service Fee: </span>
                      <span>{fee} %</span>
                    </div>
                    <div className="fee">
                      <span>Royalty Fee: </span>
                      <span>{royalty} %</span>
                    </div>
                    <div className="fee">
                      <span className='label'>Buyer pays: </span>
                      <span>{getSaleValue()} CRO</span>
                    </div>
                    <div className="fee">
                      <span className='label'>You receive: </span>
                      <span>{getYouReceiveViewValue()} CRO</span>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-0">
              <div className="w-100">

                {nft.listed && !nft.listingNonce && (
                  <div className="alert alert-warning my-auto mb-2 fw-bold text-center">
                    Gasless listing is available
                  </div>)
                }
                {isTransferApproved ? (
                  <>
                    {showConfirmButton ? (
                      <>
                        <div className="alert alert-danger my-auto mb-2 fw-bold text-center">
                          The desired price is {(100 - (salePrice * 100 / floorPrice)).toFixed(1)}% below the current floor price of {floorPrice} CRO. Are you sure?
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
                            onClick={handleCreateListing}
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
                            {listing ? 'Update Listing' : 'Confirm Listing'}
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-2 text-center fst-italic">
                      <small>Ebisu's Bay needs approval to transfer this NFT on your behalf once sold</small>
                    </div>
                    <div className="d-flex justify-content-end">
                      <Button type="legacy"
                        onClick={handleApproval}
                        isLoading={executingApproval}
                        disabled={executingApproval}
                        className="flex-fill">
                        Approve
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
