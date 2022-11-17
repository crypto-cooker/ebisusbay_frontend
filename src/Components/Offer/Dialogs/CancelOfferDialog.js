import React, {useState} from "react";
import {hostedImage} from "@src/helpers/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import {Spinner} from "react-bootstrap";
import Button from "@src/Components/components/Button";
import EmptyData from "@src/Components/Offer/EmptyData";
import {specialImageTransform} from "@src/hacks";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import * as Sentry from "@sentry/react";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {AnyMedia} from "@src/Components/components/AnyMedia";
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

export const CancelOfferDialog = ({onClose, isOpen, collection, isCollectionOffer, nft, offer}) => {
  const [isLoading, setIsLoading] = useState(false);
  const offerContract = useSelector((state) => state.user.offerContract);
  const [executingCancelOffer, setExecutingCancelOffer] = useState(false);
  const user = useSelector((state) => state.user);

  const handleCancelOffer = async (e) => {
    e.preventDefault();

    try {
      setExecutingCancelOffer(true);
      Sentry.captureEvent({message: 'handleCancelOffer', extra: {address: collection.address}});
      let tx;
      if (isCollectionOffer) {
        tx = await offerContract.cancelCollectionOffer(offer.nftAddress, offer.offerIndex);
      } else {
        tx = await offerContract.cancelOffer(offer.hash, offer.offerIndex);
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
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          {isCollectionOffer ? <>Cancel Collection Offer</> : <>Cancel Offer</>}
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
        {!isLoading ? (
          <>
            <ModalBody>
              <div className="text-center mb-2" style={{fontSize: '14px'}}>
                Cancelling this offer will return the offer amount back to your wallet
              </div>
              <div className="nftSaleForm row gx-3">
                <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                  {isCollectionOffer ? (
                    <div className="profile_avatar d-flex justify-content-center mb-2">
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
              </div>
            </ModalBody>
            <ModalFooter className="border-0">
              <div className="w-100">
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
  )
}