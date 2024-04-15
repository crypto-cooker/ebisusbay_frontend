import React, {useState} from "react";
import {hostedImage} from "@src/helpers/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import EmptyData from "@src/Components/Offer/EmptyData";
import {specialImageTransform} from "@market/helpers/hacks";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, isBundle} from "@market/helpers/utils";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {Box, BoxProps, Flex, ModalFooter, Spinner, Stack, Text} from "@chakra-ui/react";
import ImagesContainer from "../../../Components/Bundle/ImagesContainer";
import {getNft} from "@src/core/api/endpoints/nft";
import {useQuery} from "@tanstack/react-query";
import {useContractService, useUser} from "@src/components-v2/useUser";
import {parseErrorMessage} from "@src/helpers/validator";
import {ResponsiveDialogComponents, useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import {PrimaryButton} from "@src/components-v2/foundation/button";

type CancelOfferDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  collection: any;
  isCollectionOffer: boolean;
  offer: any;
}

export const ResponsiveCancelOfferDialog = ({ isOpen, collection, isCollectionOffer, offer, onClose, ...props }: CancelOfferDialogProps & BoxProps) => {
  const { DialogComponent, DialogBody, DialogFooter } = useResponsiveDialog();

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} title='Cancel Offer' {...props}>
      <DialogContent
        isOpen={isOpen}
        onClose={onClose}
        collection={collection}
        isCollectionOffer={isCollectionOffer}
        offer={offer}
        DialogBody={DialogBody}
        DialogFooter={DialogFooter}
        {...props}
      />
    </DialogComponent>
  );
};

const DialogContent = ({isOpen, onClose, collection, isCollectionOffer, offer, DialogBody, DialogFooter}: ResponsiveDialogComponents & CancelOfferDialogProps) => {
  const contractService = useContractService();
  const [executingCancelOffer, setExecutingCancelOffer] = useState(false);
  const user = useUser();

  const fetchNft = async () => {
    if (isCollectionOffer) return null;

    const tmpNft = await getNft(offer.nftAddress, offer.nftId);
    return tmpNft.nft;
  }

  const { isPending, error, data: nft, status } = useQuery({
    queryKey: ['CancelOffer', user.address, offer.nftAddress, offer.nftId],
    queryFn: fetchNft,
    enabled: user.wallet.isConnected && !!offer.nftAddress && (isCollectionOffer || !!offer.nftId),
    refetchOnWindowFocus: false
  });

  const handleCancelOffer = async () => {
    try {
      setExecutingCancelOffer(true);
      // Sentry.captureEvent({message: 'handleCancelOffer', extra: {address: offer.nftAddress}});
      let tx;
      if (isCollectionOffer) {
        tx = await contractService!.offer.cancelCollectionOffer(offer.nftAddress, offer.offerIndex);
      } else {
        tx = await contractService!.offer.cancelOffer(offer.hash, offer.offerIndex);
      }
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setExecutingCancelOffer(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setExecutingCancelOffer(false);
    }
  }

  return (
    <>
      {status === 'pending' ? (
        <EmptyData>
          <Spinner size='sm' ms={1} />
        </EmptyData>
      ) : status === "error" ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <DialogBody>
            <Box mb={2} textAlign='center' fontSize='sm'>
              Cancelling this offer will return the offer amount back to your wallet
            </Box>
            <Stack direction='row' spacing={4}>
              <Box w={{base: '30%', sm: 'full'}}>
                {isCollectionOffer ? (
                  <Box className="profile_avatar d-flex justify-content-center mb-2">
                    <Box className="dialog_avatar position-relative">
                      {collection?.metadata?.avatar ? (
                        <img src={hostedImage(collection.metadata.avatar)} alt={collection.name} />
                      ) : (
                        <Blockies seed={(offer.nftAddress).toLowerCase()} size={15} scale={10} />
                      )}
                      {collection?.verification?.verified && (
                        <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass="eb-avatar_badge" />
                      )}
                    </Box>
                  </Box>
                ) : isBundle(offer.nftAddress) ? (
                  <ImagesContainer nft={nft} />
                ) : (
                  <AnyMedia
                    image={specialImageTransform(offer.nftAddress, nft.image)}
                    video={nft.video ?? nft.animation_url}
                    videoProps={{ height: 'auto', autoPlay: true }}
                    title={nft.name}
                    usePlaceholder={false}
                    className="img-fluid img-rounded"
                  />
                )}
              </Box>
              <Box w={{base: '70%', sm: 'full'}}>
                {!!collection && (
                  <Box>
                    <Box className="text-muted">Collection</Box>
                    <Box fontWeight='bold'>{collection.name}</Box>
                  </Box>
                )}
                {!isCollectionOffer && (
                  <Box mt={2}>
                    <Box className="text-muted">NFT</Box>
                    <Box fontWeight='bold'>{nft.name ?? nft.id}</Box>
                  </Box>
                )}
                <Box mt={2}>
                  <Box className="text-muted">Amount</Box>
                  <Box fontWeight='bold'>{offer.price} CRO</Box>
                </Box>
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter className="border-0">
            <Box className="w-100">
              {executingCancelOffer && (
                <Box mb={2} textAlign='center'>
                  <Text as='i' fontSize='sm'>Please check your wallet for confirmation</Text>
                </Box>
              )}
              <Flex>
                <PrimaryButton
                  onClick={handleCancelOffer}
                  isLoading={executingCancelOffer}
                  isDisabled={executingCancelOffer}
                  className='flex-fill'
                  loadingText='Confirm'
                >
                  Confirm
                </PrimaryButton>
              </Flex>
            </Box>
          </DialogFooter>
        </>
      )}
    </>
  )
}