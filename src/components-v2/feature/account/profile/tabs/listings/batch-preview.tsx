import {useCallback, useContext, useState} from "react";
import {Alert, AlertIcon, Box, Button, Flex, HStack, Slide, Stack, Text} from "@chakra-ui/react";
import {isGaslessListing, pluralize} from "@src/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {toast} from "react-toastify";
import {useQueryClient} from "@tanstack/react-query";
import {
  MultiSelectContext,
  MultiSelectContextProps
} from "@src/components-v2/feature/account/profile/tabs/listings/context";
import useCancelGaslessListing from "@src/Components/Account/Settings/hooks/useCancelGaslessListing";
import {useContractService} from "@src/components-v2/useUser";
import {parseErrorMessage} from "@src/helpers/validator";

interface BatchPreviewProps {
  mutationKey: any;
}

const BatchPreview = ({mutationKey}: BatchPreviewProps) => {
  const sliderBackground = useColorModeValue('gray.50', 'gray.700')
  const [executingCancel, setIsExecutingCancel] = useState(false);
  const [executingSecureCancel, setIsExecutingSecureCancel] = useState(false);

  const contractService = useContractService();
  const queryClient = useQueryClient();
  const { selected: listings, setSelected } = useContext(MultiSelectContext) as MultiSelectContextProps;
  const [cancelGaslessListing, response] = useCancelGaslessListing();
  const [showSecureCancelConfirmation, setShowSecureCancelConfirmation] = useState(false);

  const handleSecureCancel = useCallback(async () => {
    try {
      setIsExecutingSecureCancel(true);
      const cancelIds = {
        legacy: listings
          .filter((listing: any) => !isGaslessListing(listing.listingId))
          .map((listing: any) => listing.listingId),
        gasless: listings
          .filter((listing: any) => isGaslessListing(listing.listingId))
          .map((listing: any) => listing.listingId),
      }

      if (cancelIds.gasless.length > 0){
        await cancelGaslessListing(cancelIds.gasless, false);
      }

      if (cancelIds.legacy.length > 0 && !!contractService) {
        const port = contractService.market;
        await port.cancelListings(cancelIds.legacy)
      }

      toast.success('Listings have been cancelled');
      await queryClient.invalidateQueries({queryKey: mutationKey});
      handleClearAll();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecutingSecureCancel(false);
    }
  }, [listings]);

  const handleCancel = async () => {
    try {
      setIsExecutingCancel(true);

      const gaslessListingIds = listings
          .filter((listing: any) => isGaslessListing(listing.listingId))
          .map((listing: any) => listing.listingId);

      if (gaslessListingIds.length < 1) {
        toast.error('No gasless listings to cancel');
        return;
      }

      await cancelGaslessListing(gaslessListingIds, true);

      toast.success('Listings have been cancelled');
      handleClearAll();
      await queryClient.invalidateQueries({queryKey: mutationKey});
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecutingCancel(false);
    }
  }

  const handleClearAll = () => {
    setIsExecutingCancel(false);
    setSelected([]);
    setIsExecutingSecureCancel(false);
    setShowSecureCancelConfirmation(false);
  }

  return (
    <>
      <Slide direction='bottom' in={listings.length > 0} style={{ zIndex: 10 }}>
        <Box p={3} backgroundColor={sliderBackground} borderTop='1px solid white'>
          <Flex direction={{base:'column', sm: showSecureCancelConfirmation ? 'column' : 'row', md: 'row'}} justify="space-between" align={{base: 'start', sm: showSecureCancelConfirmation ? 'start' : 'center', md: 'center'}}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              mb={{base: 2, sm: showSecureCancelConfirmation ? 2 : 0, md: 0}}
              w='140px'
            >
              {listings.length} {pluralize(listings.length, 'listing')} selected
            </Text>
            <Box w='full'>
              {showSecureCancelConfirmation ? (
                <Stack direction={{base: 'column', md: 'row'}}>
                  <Alert status='warning'>
                    <AlertIcon />
                    <Box textAlign={{base: 'start', lg: 'end'}} w='full'>
                      Secure cancel will guarantee on chain that the listing is cancelled immediately. However, this will cost gas fees. Confirm?
                    </Box>
                  </Alert>

                  <HStack justify='end'>
                    {!executingSecureCancel && (
                      <Button variant='ghost' onClick={() => setShowSecureCancelConfirmation(false)}>
                        Go Back
                      </Button>
                    )}
                    <PrimaryButton
                      onClick={handleSecureCancel}
                      isLoading={executingSecureCancel}
                      isDisabled={executingSecureCancel}
                      loadingText='Secure Cancel'
                    >
                      Confirm
                    </PrimaryButton>
                  </HStack>
                </Stack>
              ) : (
                <HStack justify='end'>
                  {!executingSecureCancel && !executingCancel && (
                    <Button variant='ghost' onClick={handleClearAll}>
                      Clear all
                    </Button>
                  )}
                  {!executingCancel && (
                    <PrimaryButton
                      onClick={handleCancel}
                      isLoading={executingCancel || executingSecureCancel}
                      isDisabled={executingCancel || executingSecureCancel}
                      loadingText='Cancel'
                    >
                      Cancel
                    </PrimaryButton>
                  )}
                  {!executingSecureCancel && (
                    <PrimaryButton
                      onClick={() => setShowSecureCancelConfirmation(true)}
                      isLoading={executingSecureCancel || executingCancel}
                      isDisabled={executingSecureCancel || executingCancel}
                      loadingText='Express Cancel'
                    >
                      Secure Cancel
                    </PrimaryButton>
                  )}
                </HStack>
              )}
            </Box>
          </Flex>
        </Box>
      </Slide>
    </>
  )
}

export default BatchPreview;