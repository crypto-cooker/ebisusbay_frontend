import React, {useState} from "react";
import {hostedImage} from "@src/helpers/image";
import Blockies from "react-blockies";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import {specialImageTransform} from "@market/helpers/hacks";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, isBundle} from "@market/helpers/utils";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {Box, BoxProps, Center, Flex, Spinner, Stack, Text} from "@chakra-ui/react";
import ImagesContainer from "@src/Components/Bundle/ImagesContainer";
import {getNft} from "@src/core/api/endpoints/nft";
import {useQuery} from "@tanstack/react-query";
import {useContractService, useUser} from "@src/components-v2/useUser";
import {ResponsiveDialogComponents, useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import {parseErrorMessage} from "@src/helpers/validator";
import {PrimaryButton} from "@src/components-v2/foundation/button";

type RejectOfferDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  collection: any;
  isCollectionOffer: boolean;
  offer: any;
}

export const ResponsiveRejectOfferDialog = ({ isOpen, collection, isCollectionOffer, offer, onClose, ...props }: RejectOfferDialogProps & BoxProps) => {
  const { DialogComponent, DialogHeader, DialogBody, DialogFooter } = useResponsiveDialog();

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} title='Reject Offer' {...props}>
      <DialogContent
        isOpen={isOpen}
        onClose={onClose}
        collection={collection}
        isCollectionOffer={isCollectionOffer}
        offer={offer}
        DialogHeader={DialogHeader}
        DialogBody={DialogBody}
        DialogFooter={DialogFooter}
        {...props}
      />
    </DialogComponent>
  );
};

const DialogContent = ({isOpen, onClose, collection, isCollectionOffer, offer, DialogBody, DialogFooter}: Pick<ResponsiveDialogComponents, 'DialogHeader' | 'DialogBody' | 'DialogFooter'> & RejectOfferDialogProps) => {
  const contractService = useContractService();
  const [executingRejectOffer, setExecutingRejectOffer] = useState(false);
  const user = useUser();

  const fetchNft = async () => {
    if (isCollectionOffer) return null;

    const tmpNft = await getNft(offer.nftAddress, offer.nftId);
    return tmpNft.nft;
  }

  const { error, data: nft, status } = useQuery({
    queryKey: ['RejectOffer', user.address, offer.nftAddress, offer.nftId],
    queryFn: fetchNft,
    enabled: user.wallet.isConnected && !!offer.nftAddress && (isCollectionOffer || !!offer.nftId),
    refetchOnWindowFocus: false
  });

  const handleRejectOffer = async () => {
    try {
      setExecutingRejectOffer(true);
      // Sentry.captureEvent({message: 'handleRejectOffer', extra: {address: collection.address}});
      if (isCollectionOffer) {
        throw new Error('Cannot reject a collection offer');
      } else if (collection.is_1155) {
        throw new Error('Cannot reject a public offer');
      } else {
        const tx = await contractService!.offer.rejectOffer(offer.hash, offer.offerIndex);
        let receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
        setExecutingRejectOffer(false);
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setExecutingRejectOffer(false);
    }
  }

  return (
    <>
      {status === 'pending' ? (
        <Flex h='200px' justify='center'>
          <Center>
            <Spinner />
          </Center>
        </Flex>
      ) : status === "error" ? (
        <Box textAlign='center'>Error: {error.message}</Box>
      ) : (
        <>
          <DialogBody>
            <Stack direction='row' spacing={4}>
              <Box w={{base: '30%', sm: 'full'}}>
                {isCollectionOffer ? (
                  <Box className="profile_avatar d-flex justify-content-center mb-2">
                    <Box className="d_profile_img">
                      {collection.metadata.avatar ? (
                        <img src={hostedImage(collection.metadata.avatar)} alt={collection.name} />
                      ) : (
                        <Blockies seed={collection.address.toLowerCase()} size={15} scale={10} />
                      )}
                      {collection.verification.verified && (
                        <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={8} stackClass="eb-avatar_badge" />
                      )}
                    </Box>
                  </Box>
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
              </Box>
              <Box w={{base: '70%', sm: 'full'}}>
                <Box>
                  <Box className="text-muted">Collection</Box>
                  <Box fontWeight='bold'>{collection.name}</Box>
                </Box>
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
            <Box w='full'>
              {executingRejectOffer && (
                <Box mb={2} textAlign='center'>
                  <Text as='i' fontSize='sm'>Please check your wallet for confirmation</Text>
                </Box>
              )}
              <Flex>
                <PrimaryButton
                  onClick={handleRejectOffer}
                  isLoading={executingRejectOffer}
                  isDisabled={executingRejectOffer}
                  className="flex-fill"
                  loadingText="Confirm"
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