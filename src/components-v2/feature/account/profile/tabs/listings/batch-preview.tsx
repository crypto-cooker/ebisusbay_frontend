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
  const [executingExpressCancel, setIsExecutingExpressCancel] = useState(false);

  const contractService = useContractService();
  const queryClient = useQueryClient();
  const { selected: listings, setSelected } = useContext(MultiSelectContext) as MultiSelectContextProps;
  const [cancelGaslessListing, response] = useCancelGaslessListing();
  const [showExpressCancelConfirmation, setShowExpressCancelConfirmation] = useState(false);

  const handleCancel = useCallback(async () => {
    try {
      setIsExecutingCancel(true);
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
      setIsExecutingCancel(false);
    }
  }, [listings]);

  const handleExpressCancel = async () => {
    try {
      setIsExecutingExpressCancel(true);

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
      setIsExecutingExpressCancel(false);
    }
  }

  const handleClearAll = () => {
    setIsExecutingCancel(false);
    setSelected([]);
    setIsExecutingExpressCancel(false);
    setShowExpressCancelConfirmation(false);
  }

  return (
    <>
      <Slide direction='bottom' in={listings.length > 0} style={{ zIndex: 10 }}>
        <Box p={3} backgroundColor={sliderBackground} borderTop='1px solid white'>
          <Flex direction={{base:'column', sm: showExpressCancelConfirmation ? 'column' : 'row', md: 'row'}} justify="space-between" align={{base: 'start', sm: showExpressCancelConfirmation ? 'start' : 'center', md: 'center'}}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              mb={{base: 2, sm: showExpressCancelConfirmation ? 2 : 0, md: 0}}
              w='140px'
            >
              {listings.length} {pluralize(listings.length, 'listing')} selected
            </Text>
            <Box w='full'>
              {showExpressCancelConfirmation ? (
                <Stack direction={{base: 'column', md: 'row'}}>
                  <Alert status='warning'>
                    <AlertIcon />
                    <Box textAlign={{base: 'start', lg: 'end'}} w='full'>
                      Express cancel is gasless for all non-legacy listings. However, there is small risk of sales still completing while gasless cancel is in progress. Confirm?
                    </Box>
                  </Alert>

                  <HStack justify='end'>
                    {!executingExpressCancel && (
                      <Button variant='ghost' onClick={() => setShowExpressCancelConfirmation(false)}>
                        Go Back
                      </Button>
                    )}
                    <PrimaryButton
                      onClick={handleExpressCancel}
                      isLoading={executingExpressCancel}
                      isDisabled={executingExpressCancel}
                      loadingText='Express Cancel'
                    >
                      Confirm
                    </PrimaryButton>
                  </HStack>
                </Stack>
              ) : (
                <HStack justify='end'>
                  <Button variant='ghost' onClick={handleClearAll}>
                    Clear all
                  </Button>
                  {!executingExpressCancel && (
                    <PrimaryButton
                      onClick={handleCancel}
                      isLoading={executingCancel || executingExpressCancel}
                      isDisabled={executingCancel || executingExpressCancel}
                      loadingText='Cancel'
                    >
                      Cancel
                    </PrimaryButton>
                  )}
                  {!executingCancel && (
                    <PrimaryButton
                      onClick={() => setShowExpressCancelConfirmation(true)}
                      isLoading={executingExpressCancel || executingCancel}
                      isDisabled={executingExpressCancel || executingCancel}
                      loadingText='Express Cancel'
                    >
                      Express Cancel
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