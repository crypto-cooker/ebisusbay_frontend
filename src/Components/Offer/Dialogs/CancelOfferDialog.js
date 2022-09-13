import React, {useState} from "react";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import {hostedImage} from "@src/helpers/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import {Spinner} from "react-bootstrap";
import Button from "@src/Components/components/Button";
import EmptyData from "@src/Components/Offer/EmptyData";
import styled from "styled-components";
import {specialImageTransform} from "@src/hacks";
import {useWindowSize} from "@src/hooks/useWindowSize";
import {useSelector} from "react-redux";
import {txExtras} from "@src/core/constants";
import {toast} from "react-toastify";
import * as Sentry from "@sentry/react";
import {createSuccessfulTransactionToastContent} from "@src/utils";

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
  text-align: center;<
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

const ImageContainer = styled.div`
  width: 232px;
  height: auto;
  margin-top: 6px;
  text-align: center;

  img {
    width: 100%;
    border-radius: 6px;
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: auto;
    margin-bottom: 10px;
  }
`;

export const CancelOfferDialog = ({onClose, isOpen, collection, isCollectionOffer, nft, offer}) => {
  const [isLoading, setIsLoading] = useState(false);
  const offerContract = useSelector((state) => state.user.offerContract);
  const [executingCancelOffer, setExecutingCancelOffer] = useState(false);

  const handleCancelOffer = async (e) => {
    e.preventDefault();

    try {
      setExecutingCancelOffer(true);
      Sentry.captureEvent({message: 'handleCancelOffer', extra: {address: collection.address}});
      let tx;
      if (isCollectionOffer) {
        tx = await offerContract.cancelCollectionOffer(offer.nftAddress, offer.offerIndex, txExtras);
      } else {
        tx = await offerContract.cancelOffer(offer.hash, offer.offerIndex, txExtras);
      }
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setExecutingCancelOffer(false);
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
      setExecutingCancelOffer(false);
    }
  }

  return (
    <DialogContainer onClose={onClose} open={isOpen} maxWidth="md">
      <DialogContent>
        <DialogTitleContainer className="fs-5 fs-md-3">
          {isCollectionOffer ? <>Cancel Collection Offer</> : <>Cancel Offer</>}
        </DialogTitleContainer>
        {!isLoading ? (
          <>
            <div className="text-center mb-2" style={{fontSize: '14px'}}>
              Cancelling this offer will return the offer amount back to your wallet
            </div>
            <div className="nftSaleForm row gx-3">
              <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                {isCollectionOffer ? (
                  <div className="profile_avatar d-flex justify-content-center mb-2">
                    <div className="d_profile_img">
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
                ) : (
                  <ImageContainer>
                    <img src={specialImageTransform(nft.address ?? nft.nftAddress, nft.image)} alt={nft.name} />
                  </ImageContainer>
                )}
              </div>
              <div className="col-12 col-sm-6">
                <div>
                  <div className="text-muted">Collection</div>
                  <div className="fw-bold">{collection.name}</div>
                </div>
                {!isCollectionOffer && (
                  <div className="mt-2">
                    <div className="text-muted">NFT</div>
                    <div className="fw-bold">{nft.name ?? nft.id}</div>
                  </div>
                )}
                <div className="mt-2">
                  <div className="text-muted">Amount</div>
                  <div className="fw-bold">{offer.price} CRO</div>
                </div>
              </div>

              <div className="mt-3 mx-auto">
                {executingCancelOffer && (
                  <div className="mb-2 text-center fst-italic">
                    <small>Please check your wallet for confirmation</small>
                  </div>
                )}
                <div className="d-flex">
                  <Button type="legacy"
                          onClick={handleCancelOffer}
                          isLoading={executingCancelOffer}
                          disabled={executingCancelOffer}
                          className="flex-fill">
                    Confirm
                  </Button>
                </div>
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
  )
}