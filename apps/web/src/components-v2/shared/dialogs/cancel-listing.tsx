import {
  Box,
  BoxProps,
  Center,
  Flex,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Switch,
  Text
} from "@chakra-ui/react";
import {ResponsiveDialogComponents, useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import {useContractService, useUser} from "@src/components-v2/useUser";
import useCancelGaslessListing from "@src/Components/Account/Settings/hooks/useCancelGaslessListing";
import React, {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {createSuccessfulTransactionToastContent, isGaslessListing} from "@market/helpers/utils";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {specialImageTransform} from "@market/helpers/hacks";
import {ethers} from "ethers";
import {QuestionOutlineIcon} from "@chakra-ui/icons";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {CurrencyLogoByAddress} from "@dex/components/logo";
import { useActiveChainId } from "@dex/swap/imported/pancakeswap/web/hooks/useActiveChainId";

type CancelListingDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  listing?: any;
  listingId?: string;
}

export const ResponsiveCancelListingDialog = ({ isOpen, listing, listingId, onClose, ...props }: CancelListingDialogProps & BoxProps) => {
  const { DialogComponent, DialogHeader, DialogBody, DialogFooter } = useResponsiveDialog();

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} title='Cancel Listing' {...props}>
      <DialogContent
        isOpen={isOpen}
        onClose={onClose}
        listing={listing}
        listingId={listingId}
        DialogHeader={DialogHeader}
        DialogBody={DialogBody}
        DialogFooter={DialogFooter}
        {...props}
      />
    </DialogComponent>
  );
};

const DialogContent = ({isOpen, onClose, listing, listingId, DialogBody, DialogFooter}: Pick<ResponsiveDialogComponents, 'DialogHeader' | 'DialogBody' | 'DialogFooter'> & CancelListingDialogProps) => {
  const contractService = useContractService();
  const [cancelGaslessListing, response] = useCancelGaslessListing();
  const user = useUser();
  const [isExecutingCancel, setIsExecutingCancel] = useState(false);
  const [isExecutingLegacyCancel, setIsExecutingLegacyCancel] = useState(false);
  const [secureCancel, setSecureCancel] = useState(false);
  const [targetListing, setTargetListing] = useState<any>();
  const {chainId} = useActiveChainId();

  const { error, data: nft, isError, isLoading } = useQuery({
    queryKey: ['CancelListing', user.address, (listing ? listing.listingId : listingId)],
    queryFn: async () => {
      const response = await ApiService.withoutKey().getUserUnfilteredListings(user.address!, {
        listingId: listing ? listing.listingId : listingId
      });
      return response.data[0];
    },
    enabled: user.wallet.isConnected && !listing && !!listingId,
    refetchOnWindowFocus: false
  });

  const cancel = async () => {
    try {
      await cancelGaslessListing(targetListing.listingId, !secureCancel);
      toast.success('Canceled successfully');
      onClose();
    } catch(error) {
      console.log(error)
      toast.error(parseErrorMessage(error))
    }
  }

  const cancelLegacy = async () => {
    try {
      let tx = await contractService!.market.cancelListing(targetListing.listingId);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash, chainId));
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  }

  const handleCancelListing = async () => {
    try {
      if (isOpen && targetListing && contractService) {
        if(isLegacy) {
          setIsExecutingLegacyCancel(true);
          await cancelLegacy();
        } else {
          setIsExecutingCancel(true);
          await cancel();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecutingCancel(false);
      setIsExecutingLegacyCancel(false);
    }
  }

  useEffect(() => {
    if (listing) {
      setTargetListing(listing);
    } else {
      setTargetListing(nft);
    }
  }, [listing, nft]);

  const isLegacy = !targetListing || !isGaslessListing(targetListing.listingId);

  return (
    <>
      {isLoading ? (
        <Flex h='200px' justify='center'>
          <Center>
            <Spinner />
          </Center>
        </Flex>
      ) : isError ? (
        <Box textAlign='center'>Error: {error.message}</Box>
      ) : !!targetListing && (
        <>
          <DialogBody>
            <Stack direction='row' spacing={4}>
              <Box w={{base: '30%', sm: 'full'}}>
                <AnyMedia
                  image={specialImageTransform(targetListing.nftAddress, targetListing.nft.image)}
                  video={targetListing.nft.video ?? targetListing.nft.animation_url}
                  videoProps={{ height: 'auto', autoPlay: true }}
                  title={targetListing.nft.name}
                  usePlaceholder={false}
                  className="img-fluid img-rounded"
                />
              </Box>
              <Box w={{base: '70%', sm: 'full'}}>
                <Box>
                  <Box className="text-muted">NFT</Box>
                  <Box fontWeight='bold'>{targetListing.nft.name ?? targetListing.nftId}</Box>
                </Box>
                <Box mt={2}>
                  <Box className="text-muted">Price</Box>
                  <Box fontWeight='bold'>
                    <Stack direction='row' alignItems='center'>
                      <CurrencyLogoByAddress address={targetListing.currency} chainId={targetListing.chain} size='20px' />
                      <Text fontSize='md' fontWeight='bold'>
                        <span className="ms-1">{ethers.utils.commify(targetListing.price)}</span>
                      </Text>
                    </Stack>
                  </Box>
                </Box>
                {!isLegacy && (
                  <Box mt={2}>
                    <Box>
                      <HStack align='center' spacing={0}>
                        <Box pt={1} className='text-muted'>Secure Cancel</Box>
                        <Popover>
                          <PopoverTrigger>
                            <IconButton aria-label='Secure Cancel Help' icon={<QuestionOutlineIcon />} variant='unstyled'/>
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverBody>
                              Secure cancel will guarantee on chain that the listing is cancelled immediately. However, this will cost gas fees
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </HStack>
                    </Box>
                    <Box fontWeight='bold'>
                      <Switch isChecked={secureCancel} onChange={() => setSecureCancel(!secureCancel)} />
                    </Box>
                  </Box>
                )}
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter className="border-0">
            <Box w='full'>
              {isExecutingLegacyCancel && (
                <Box mb={2} textAlign='center'>
                  <Text as='i' fontSize='sm'>Please check your wallet for confirmation</Text>
                </Box>
              )}
              <Flex>
                <PrimaryButton
                  onClick={handleCancelListing}
                  isLoading={isExecutingCancel || isExecutingLegacyCancel}
                  isDisabled={isExecutingCancel || isExecutingLegacyCancel}
                  className="flex-fill"
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