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
import {AnyMedia} from "@src/Components/components/AnyMedia";

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

export const RejectOfferDialog = ({onClose, isOpen, collection, isCollectionOffer, nft, offer}) => {
  const [isLoading, setIsLoading] = useState(false);
  const offerContract = useSelector((state) => state.user.offerContract);
  const [executingRejectOffer, setExecutingRejectOffer] = useState(false);

  const handleRejectOffer = async (e) => {
    e.preventDefault();

    try {
      setExecutingRejectOffer(true);
      Sentry.captureEvent({message: 'handleRejectOffer', extra: {address: collection.address}});
      if (isCollectionOffer) {
        throw new Error('Cannot reject a collection offer');
      } else if (collection.multiToken) {
        throw new Error('Cannot reject a public offer');
      } else {
        const tx = await offerContract.rejectOffer(offer.hash, offer.offerIndex, txExtras);
        let receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        setExecutingRejectOffer(false);
        onClose();
      }
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
    } finally {
      setExecutingRejectOffer(false);
    }
  }

  return (
    <DialogContainer onClose={onClose} open={isOpen} maxWidth="md">
      <DialogContent>
        <DialogTitleContainer className="fs-5 fs-md-3">
          Reject Offer
        </DialogTitleContainer>
        {!isLoading ? (
          <>
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
                {executingRejectOffer && (
                  <div className="mb-2 text-center fst-italic">
                    <small>Please check your wallet for confirmation</small>
                  </div>
                )}
                <div className="d-flex">
                  <Button type="legacy"
                          onClick={handleRejectOffer}
                          isLoading={executingRejectOffer}
                          disabled={executingRejectOffer}
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