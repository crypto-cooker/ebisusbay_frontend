import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import {createSuccessfulTransactionToastContent, isNftBlacklisted, isUserBlacklisted} from '@src/utils';
import { Card, Spinner } from 'react-bootstrap';
import MetaMaskOnboarding from '@metamask/onboarding';
import { chainConnect, connectAccount } from '@src/GlobalState/User';
import { listingUpdated } from '@src/GlobalState/listingSlice';
import { listingState } from '@src/core/api/enums';
import {OFFER_TYPE} from "../Offer/MadeOffers/MadeOffersRow";
import Button from "../components/Button";
import {useRouter} from "next/router";
import MakeListingDialog from "@src/Components/MakeListing";
import Image from "next/image";

import DialogAlert from '../components/DialogAlert';
import useOutSide from '../../hooks/useOutSide';


const PriceActionBar = ({ offerType, onOfferSelected, label, collectionName, isVerified }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user);
  const {currentListing: listing, nft} = useSelector((state) => state.nft);
  const [executingBuy, setExecutingBuy] = useState(false);
  const [executingCancel, setExecutingCancel] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const { visible: finalStep, setVisible: setFinalStep, ref } = useOutSide(false);

  const openPopup = useCallback((e) => {
    e.preventDefault();

    setFinalStep(true);


  }, [setFinalStep])

  const closePopup = useCallback((e) => {
    e.preventDefault();
    setFinalStep(false);
  }, [setFinalStep])


  const executeBuy = (amount) => async () => {
    setFinalStep(false);
    setExecutingBuy(true);
    await runFunction(async (writeContract) => {
      let price = ethers.utils.parseUnits(amount.toString());
      return (
        await writeContract.makePurchase(listing.listingId, {
          value: price,
        })
      ).wait();
    });
    setExecutingBuy(false);
  };

  const executeCancel = () => async () => {
    setExecutingCancel(true);
    await runFunction(async (writeContract) => {
      return (
        await writeContract.cancelListing(listing.listingId)
      ).wait();
    });
    setExecutingCancel(false);
  };

  const runFunction = async (fn) => {
    if (user.address) {
      try {
        const receipt = await fn(user.marketContract);
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

    console.log('Listing: ', listing)
  }, [listing]);


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
                        <Image src="/img/logos/cdc_icon.svg" width={25} height={25} className="my-auto"/>
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
                      <Button type="legacy" className="w-100" onClick={isVerified ? executeBuy(listing.price) : openPopup} disabled={executingBuy}>
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
        {(finalStep) && (
          <span ref={ref}>
            {
              <DialogAlert
                title={'Unverified'}
                firstButtonText={'Cancel'}
                onClickFirstButton={closePopup}
                secondButtonText={'Buy'}
                onClickSecondButton={executeBuy(listing.price)}
                closePopup={closePopup}
                isWaiting={false}
                isWarningMessage={true}
              >
                <span>This contract in not verified by ebisusbay, make sure that {collectionName} is the one you are looking for</span>

              </DialogAlert>}
          </span>
        )}
      </div>
    </div>
  );
};
export default PriceActionBar;
