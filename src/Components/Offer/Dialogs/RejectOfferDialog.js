import React, {useState} from "react";
import {hostedImage} from "@src/helpers/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import Button from "@src/Components/components/Button";
import EmptyData from "@src/Components/Offer/EmptyData";
import {specialImageTransform} from "@src/hacks";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, isBundle} from "@src/utils";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner
} from "@chakra-ui/react";
import {getTheme} from "@src/Theme/theme";
import ImagesContainer from "@src/Components/Bundle/ImagesContainer";
import {getNft} from "@src/core/api/endpoints/nft";
import {useQuery} from "@tanstack/react-query";
import {useContractService} from "@src/components-v2/useUser";

export const RejectOfferDialog = ({onClose, isOpen, collection, isCollectionOffer, offer}) => {
  const contractService = useContractService();
  const [executingRejectOffer, setExecutingRejectOffer] = useState(false);
  const user = useSelector((state) => state.user);

  const fetchNft = async () => {
    if (isCollectionOffer) return null;

    const tmpNft = await getNft(offer.nftAddress, offer.nftId);
    return tmpNft.nft;
  }

  const { error, data: nft, status } = useQuery({
    queryKey: ['RejectOffer', user.address, offer.nftAddress, offer.nftId],
    queryFn: fetchNft,
    enabled: !!user.provider && !!offer.nftAddress && (isCollectionOffer || !!offer.nftId),
    refetchOnWindowFocus: false
  });

  const handleRejectOffer = async (e) => {
    e.preventDefault();

    try {
      setExecutingRejectOffer(true);
      // Sentry.captureEvent({message: 'handleRejectOffer', extra: {address: collection.address}});
      if (isCollectionOffer) {
        throw new Error('Cannot reject a collection offer');
      } else if (collection.multiToken) {
        throw new Error('Cannot reject a public offer');
      } else {
        const tx = await contractService.offer.rejectOffer(offer.hash, offer.offerIndex);
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
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          Reject Offer
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
        {status === 'pending' ? (
          <EmptyData>
            <Spinner size='sm' ms={1} />
          </EmptyData>
        ) : status === "error" ? (
          <p>Error: {error.message}</p>
        ) : (
          <>
            <ModalBody>
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
                      {collection.verification.verified && (
                        <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass="eb-avatar_badge" />
                      )}
                      </div>
                    </div>
                  ) : isBundle(nft.address ?? nft.nftAddress) ? (
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
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}