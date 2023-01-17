import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import {
  createSuccessfulTransactionToastContent,
  isGaslessListing,
  isNftBlacklisted,
  isUserBlacklisted
} from '@src/utils';
import { Card, Spinner } from 'react-bootstrap';
import MetaMaskOnboarding from '@metamask/onboarding';
import { chainConnect, connectAccount } from '@src/GlobalState/User';
import { listingUpdated } from '@src/GlobalState/listingSlice';
import { listingState } from '@src/core/api/enums';
import { OFFER_TYPE } from "../Offer/MadeOffers/MadeOffersRow";
import Button from "../components/Button";
import { useRouter } from "next/router";
import MakeListingDialog from "@src/Components/MakeListing";
import Image from "next/image";
import { shortAddress } from '@src/utils'
import useFeatureFlag from "@src/hooks/useFeatureFlag";
import Constants from "@src/constants";
import useBuyGaslessListings from '@src/hooks/useBuyGaslessListings';
import useCancelGaslessListing from '@src/Components/Account/Settings/hooks/useCancelGaslessListing';

import {
  useDisclosure,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from '@chakra-ui/react';

import { Modal } from '../components/chakra-components';

const PriceActionBar = ({ offerType, onOfferSelected, label, collectionName, isVerified, isOwner, collectionStats }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { Features } = Constants;
  const isWarningMessageEnabled = useFeatureFlag(Features.UNVERIFIED_WARNING);

  const user = useSelector((state) => state.user);
  const { currentListing: listing, nft } = useSelector((state) => state.nft);
  const [executingBuy, setExecutingBuy] = useState(false);
  const [executingCancel, setExecutingCancel] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const isGaslessListingEnabled = useFeatureFlag(Features.GASLESS_LISTING);
  const [buyGaslessListings, response] = useBuyGaslessListings();
  const [cancelGaslessListing, responseCancelListing] = useCancelGaslessListing();

  const openPopup = useCallback((e) => {
    e.preventDefault();
    onOpen();
  }, [onOpen])

  const listingAdapter = (listing) => {
    return {
      address: listing.nftAddress,
      expirationDate: listing.expirationDate,
      id: listing.nftId,
      is1155: listing.is1155,
      listingId: listing.listingId,
      listingTime: listing.listingTime,
      salt: listing.salt,
      price: listing.price,
      seller: listing.seller,
      sellerSignature: listing.sellerSignature
    }
  }

  const executeBuy = (amount) => async () => {
    try {
      setExecutingBuy(true);
      onClose();
      await buyGaslessListings([listingAdapter(listing)], parseInt(listing.price));
      setExecutingBuy(false);
    }
    catch (error) {
      setExecutingBuy(false);
    }
  };

  const executeCancel = () => async () => {
    setExecutingCancel(true);
    if(!isGaslessListing(listing.listingId)){
      await runFunction(async (writeContract) => {
        return (
          await writeContract.cancelListing(listing.listingId)
        ).wait();
      });
    }
    else{
      await cancelGaslessListing(listing.listingId)
    }

    setExecutingCancel(false);
  };

  const runFunction = async (fn) => {
    if (user.address) {
      try {
        const receipt = await fn(user.contractService.market);
        dispatch(
          listingUpdated({
            listing: {
              ...listing,
              state: 1,
              purchaser: user.address,
            },
          })
        );
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      } catch (error) {
        if (error.data) {
          toast.error(error.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          console.log(error);
          toast.error('Unknown Error');
        }
      }
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  };

  const onSellSelected = () => {
    setIsSellDialogOpen(true);
  };
  const onUpdateSelected = () => {
    setIsSellDialogOpen(true);
  };

  useEffect(() => {
    setCanBuy(
      listing &&
      !isUserBlacklisted(listing.seller) &&
      !isNftBlacklisted(listing.nftAddress, listing.nftId)
    );
  }, [listing]);


  const ModalBody = () => {
    return (
      <>
        This contract is not verified by Ebisu's Bay. Review this information to ensure it's what you want to buy.
        <TableContainer>
          <Table variant='simple'>
            <Tbody>
              {collectionStats ? (
                <>
                  <Tr>
                    <Td>Collections name</Td>
                    <Td>{collectionName}</Td>
                  </Tr>
                  <Tr>
                    <Td>Contract address</Td>
                    <Td>{shortAddress(collectionStats?.collection)}</Td>
                  </Tr>
                  <Tr>
                    <Td>Total Sales</Td>
                    <Td>{collectionStats?.numberOfSales}</Td>
                  </Tr>
                  <Tr>
                    <Td>Total Volume</Td>
                    <Td>{collectionStats?.totalVolume} CRO</Td>
                  </Tr>
                  <Tr>
                    <Td>Total Items</Td>
                    <Td>{collectionStats?.totalSupply}</Td>
                  </Tr>
                </>
              ) : (
                <Tr>
                  <Td className="text-center">
                    <Spinner animation="border" role="status" size="sm" className="ms-1">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </Td>
                </Tr>
              )
              }
            </Tbody>
          </Table>
        </TableContainer>
      </>
    )
  }

  const ModalFooter = () => {
    return (
      <div className="w-100">
        <div className="d-flex justify-content-center">
          <Button type="legacy-outlined" className="me-2" onClick={onClose}>
            Cancel
          </Button>
          <Button type="legacy" onClick={executeBuy(listing?.price)}>
            Continue
          </Button>
        </div>
      </div>
    )
  }


  return (
    <div className="price-action-bar">
      <Card className="mb-4 border-1 shadow pab-card">
        <Card.Body>
          <div id={`lid-${listing?.listingId}`}>
            <div className="d-flex flex-row justify-content-between">
              <div className={`my-auto fw-bold`}>
                <>
                  <h5>{label ?? 'Listing Price'}:</h5>
                  <span className="d-flex fs-3 ms-1">
                    {listing ? (
                      <>
                        <Image src="/img/logos/cdc_icon.svg" width={25} height={25} className="my-auto" />
                        <span className="ms-1">{ethers.utils.commify(listing.price)}</span>
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </span>
                </>
              </div>
            </div>
          </div>

          <div className="d-flex">
            {isOwner ? (
              <>
                {listing && listing.state === listingState.ACTIVE ? (
                  <>
                    <div className="flex-fill mx-1">
                      <Button type="legacy-outlined" className="w-100" onClick={executeCancel()} disabled={executingCancel}>
                        {executingCancel ? (
                          <>
                            Cancelling...
                            <Spinner animation="border" role="status" size="sm" className="ms-1">
                              <span className="visually-hidden">Loading...</span>
                            </Spinner>
                          </>
                        ) : (
                          <>Cancel Listing</>
                        )}
                      </Button>
                    </div>

                    <div className="flex-fill mx-1">
                      <Button type="legacy" className="w-100" onClick={onUpdateSelected} disabled={executingCancel}>
                        Update Listing
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button type="legacy" className="w-100" onClick={onSellSelected}>
                    Sell this NFT
                  </Button>
                )}
              </>
            ) : (
              <>
                {canBuy && (
                  <div className="flex-fill mx-1">
                    {listing.state === listingState.ACTIVE && (
                      <Button type="legacy" className="w-100" onClick={isVerified || !isWarningMessageEnabled ? executeBuy(listing.price) : openPopup} disabled={executingBuy}>
                        {executingBuy ? (
                          <>
                            Buy Now...
                            <Spinner animation="border" role="status" size="sm" className="ms-1">
                              <span className="visually-hidden">Loading...</span>
                            </Spinner>
                          </>
                        ) : (
                          <>Buy Now</>
                        )}
                      </Button>
                    )}
                  </div>
                )}
                <div className="flex-fill mx-1">
                  <Button type="legacy-outlined" className="w-100" onClick={onOfferSelected}>
                    {offerType === OFFER_TYPE.update ? 'Update' : 'Make'} Offer
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
      <MakeListingDialog
        isOpen={isSellDialogOpen}
        nft={nft}
        onClose={() => setIsSellDialogOpen(!isSellDialogOpen)}
        listing={listing}
      />
      <div className='nftSaleForm'>
        <Modal isCentered title={'This is an unverified collection'} body={ModalBody()} dialogActions={ModalFooter()} isOpen={isOpen} onClose={onClose} />
      </div>
    </div>
  );
};
export default PriceActionBar;
