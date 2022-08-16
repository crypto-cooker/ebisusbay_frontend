import React, {useState, useCallback, useEffect} from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import styled from 'styled-components';
import {specialImageTransform} from "@src/hacks";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import DotIcon from "@src/Components/components/DotIcon";
import {faCheck, faDollarSign} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useFeatureFlag from "@src/hooks/useFeatureFlag";
import Constants from "@src/constants";
import {Badge, Form, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {Contract, ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {getCollectionMetadata} from "@src/core/api";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {ERC721} from "@src/Contracts/Abis";
import {txExtras} from "@src/core/constants";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {appConfig} from "@src/Config";
import Market from "@src/Contracts/Marketplace.json";

const DialogContainer = styled(Dialog)`
  .MuiPaper-root {
    border-radius: 8px;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.bgColor1};
  }

  .MuiDialogContent-root {
    width: 700px;
    padding: 15px 42px 28px !important;
    border-radius: 8px;
    max-width: 734px;
    background-color: ${({ theme }) => theme.colors.bgColor1};
    color: ${({ theme }) => theme.colors.textColor3};

    @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
      width: 100%;
    }
  }
`;

const DialogTitleContainer = styled(DialogTitle)`
  font-size: 26px !important;
  color: ${({ theme }) => theme.colors.textColor3};
  padding: 0px !important;
  margin-bottom: 18px !important;
  font-weight: bold !important;
  text-align: center;
`;

const CloseIconContainer = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  cursor: pointer;

  img {
    width: 28px;
  }
`;

const config = appConfig();
const numberRegexValidation = /^[1-9]+[0-9]*$/;

export default function MakeListingDialog({ isOpen, nft, onClose, listing }) {
  const { Features } = Constants;

  const [saleType, setSaleType] = useState(1);
  const [salePrice, setSalePrice] = useState(0);
  const [floorPrice, setFloorPrice] = useState(0);
  const [priceError, setPriceError] = useState(false);
  const [fee, setFee] = useState(0);
  const [royalty, setRoyalty] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isTransferApproved, setIsTransferApproved] = useState(false);
  const [executingApproval, setExecutingApproval] = useState(false);
  const [executingCreateListing, setExecutingCreateListing] = useState(false);

  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const isAuctionOptionEnabled = useFeatureFlag(Features.AUCTION_OPTION_SALE);
  const user = useSelector((state) => state.user);
  const {marketContract} = user;

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

  const isBelowFloorPrice = (floorPrice !== 0 && ((floorPrice - Number(salePrice)) / floorPrice) * 100 > 5);
  const costOnChange = useCallback((e) => {
    const newSalePrice = e.target.value.toString();
    if (numberRegexValidation.test(newSalePrice) || newSalePrice === '') {
      setSalePrice(newSalePrice)
    }
  }, [setSalePrice, floorPrice, salePrice]);

  const getYouReceiveViewValue = () => {
    const youReceive = salePrice - (fee / 100) * salePrice - (royalty / 100) * salePrice;
    return ethers.utils.commify(youReceive.toFixed(2));
  };

  useEffect(() => {
    async function asyncFunc() {
      await getInitialProps();
    }
    if (nft && user.provider) {
      asyncFunc();
    }
  }, [nft, user.provider]);

  const wrappedMarketContract = () => {
    return marketContract ?? new Contract(config.contracts.market, Market.abi, user.provider.getSigner());
  };

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      setPriceError(false);
      const nftAddress = nft.address ?? nft.nftAddress;
      const marketContractAddress = config.contracts.market;
      const marketContract = wrappedMarketContract();
      setSalePrice(listing ? Math.round(listing.price) : 0)

      const floorPrice = await getCollectionMetadata(nftAddress);
      if (floorPrice.collections.length > 0) {
        setFloorPrice(floorPrice.collections[0].floorPrice ?? 0);
      }

      const fees = await marketContract.fee(user.address);
      const royalties = await marketContract.royalties(nftAddress);

      setFee((fees / 10000) * 100);
      setRoyalty((royalties[1] / 10000) * 100);

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
      const marketContractAddress = marketContract.address;
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
    e.preventDefault()
    try {
      const nftAddress = nft.address ?? nft.nftAddress;
      const nftId = nft.id ?? nft.nftId;
      const price = ethers.utils.parseEther(salePrice);

      setExecutingCreateListing(true);
      let tx = await marketContract.makeListing(nftAddress, nftId, price, txExtras);
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
    if (salePrice <= 0) {
      setPriceError(true);
      return;
    }

    if (isBelowFloorPrice) {
      setShowConfirmButton(true);
    } else {
      await handleCreateListing(e)
    }
  }

  if (!nft) return <></>;

  return (
    <DialogContainer onClose={onClose} open={isOpen} maxWidth="md">
      <DialogContent>
        <DialogTitleContainer className="fs-5 fs-md-3">
          {listing ? 'Update' : 'Sell'} {nft.name}
        </DialogTitleContainer>
        {!isLoading ? (
          <>
            <div className="nftSaleForm row gx-3">
              <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                <AnyMedia
                  image={specialImageTransform(nft.address ?? nft.nftAddress, nft.image)}
                  video={nft.video ?? nft.animation_url}
                  videoProps={{ height: 'auto', autoPlay: true }}
                  title={nft.name}
                  usePlaceholder={false}
                  className="img-fluid img-rounded"
                />
              </div>
              <div className="col-12 col-sm-6">
                <h3>Sale Type</h3>
                <div className="d-flex">
                  {/*<div className={`card flex-fill form_icon_button shadow first-button ${saleType === 0 ? 'active' : ''}`} onClick={() => changeSaleType('auction')}>*/}
                  {/*  {saleType === 0 && <DotIcon icon={faCheck} />}*/}
                  {/*  <FontAwesomeIcon className='icon' icon={faClock} />*/}
                  {/*  <p>Auction</p>*/}
                  {/*</div>*/}

                  <div className={`card flex-fill form_icon_button shadow ${saleType === 1 ? 'active' : ''}`} onClick={() => changeSaleType('fixedPrice')}>
                    {saleType === 1 && <DotIcon icon={faCheck} />}
                    <FontAwesomeIcon className='icon' icon={faDollarSign} />
                    <p>Fixed Price</p>
                  </div>
                </div>

                <Form.Group className="form-field mb-1">
                  <Form.Label className="formLabel w-100">
                    <div className="d-flex">
                      <div className="flex-grow-1">{saleType === 1 ? 'Listing Price' : 'Starting Bid Price'}</div>
                      <div>
                        <Badge
                          pill
                          bg={user.theme === 'dark' ? 'light' : 'secondary'}
                          text={user.theme === 'dark' ? 'dark' : 'light'}
                          className="ms-2"
                        >
                          Floor Price: {floorPrice} CRO
                        </Badge>
                      </div>
                    </div>
                  </Form.Label>
                  <Form.Control
                    className="input"
                    type="text"
                    placeholder="Enter Amount"
                    value={salePrice}
                    onChange={costOnChange}
                    disabled={showConfirmButton || executingCreateListing || !isTransferApproved}
                  />
                  <Form.Text className="field-description textError">
                    {priceError && 'The entered value must be greater than zero'}
                  </Form.Text>
                </Form.Group>

                <div className="d-flex flex-wrap justify-content-between mb-3">
                  <Badge bg="danger" text="light" className="cursor-pointer" onClick={() => setSalePrice(floorPrice - floorPrice * 0.25)}>
                    -25%
                  </Badge>
                  <Badge bg="danger" text="light" className="cursor-pointer" onClick={() => setSalePrice(floorPrice - floorPrice * 0.1)}>
                    -10%
                  </Badge>
                  <Badge
                    bg={user.theme === 'dark' ? 'light' : 'secondary'}
                    text={user.theme === 'dark' ? 'dark' : 'light'}
                    className="cursor-pointer" onClick={() => setSalePrice(floorPrice)}
                  >
                    Floor
                  </Badge>
                  <Badge bg="success" text="light" className="cursor-pointer" onClick={() => setSalePrice(floorPrice + (floorPrice * 0.1))}>
                    +10%
                  </Badge>
                  <Badge bg="success" text="light" className="cursor-pointer" onClick={() => setSalePrice(floorPrice + (floorPrice * 0.25))}>
                    +25%
                  </Badge>
                </div>

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
                    <span>{salePrice} CRO</span>
                  </div>
                  <div className="fee">
                    <span className='label'>You receive: </span>
                    <span>{getYouReceiveViewValue()} CRO</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 mx-auto">
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
                      <small>Ebisu's Bay needs approval to transfer this NFT on your behalf</small>
                    </div>
                    <div className="d-flex justify-content-end">
                      <Button type="legacy"
                              onClick={handleApproval}
                              isLoading={executingApproval}
                              disabled={executingApproval}
                              className="flex-fill">
                        Approve Transfer
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <EmptyData>
            <Spinner animation="border" role="status" size="sm" className="ms-1">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </EmptyData>
        )}
        <CloseIconContainer onClick={onClose}>
          <img src="/img/icons/close-icon-blue.svg" alt="close" width="40" height="40" />
        </CloseIconContainer>
      </DialogContent>
    </DialogContainer>
  );
}
