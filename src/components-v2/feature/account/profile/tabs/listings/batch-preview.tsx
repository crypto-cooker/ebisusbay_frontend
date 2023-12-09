import {useCallback, useContext, useState} from "react";
import {Box, Button, Flex, HStack, Slide, Text} from "@chakra-ui/react";
import {createSuccessfulTransactionToastContent, isGaslessListing, pluralize} from "@src/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {useAppSelector} from "@src/Store/hooks";
import {cancelListing} from "@src/core/cms/endpoints/gaslessListing";
import {toast} from "react-toastify";
import {useQueryClient} from "@tanstack/react-query";
import {
  MultiSelectContext,
  MultiSelectContextProps
} from "@src/components-v2/feature/account/profile/tabs/listings/context";
import useCancelGaslessListing from "@src/Components/Account/Settings/hooks/useCancelGaslessListing";
import {useContractService, useUser} from "@src/components-v2/useUser";

interface BatchPreviewProps {
  mutationKey: any;
}

const BatchPreview = ({mutationKey}: BatchPreviewProps) => {
  const sliderBackground = useColorModeValue('gray.50', 'gray.700')
  const [executingCancel, setIsExecutingCancel] = useState(false);
  const user = useUser();
  const contractService = useContractService();
  const queryClient = useQueryClient();
  const { selected: listings, setSelected } = useContext(MultiSelectContext) as MultiSelectContextProps;
  const [cancelGaslessListing, response] = useCancelGaslessListing();

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
        await cancelGaslessListing(cancelIds.gasless);
      }

      if (cancelIds.legacy.length > 0 && !!contractService) {
        const port = contractService.market;
        await port.cancelListings(cancelIds.legacy)
      }

      toast.success('Listings have been cancelled');
      await queryClient.invalidateQueries({queryKey: mutationKey})
    } catch (error: any) {
      console.log(error);
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
    } finally {
      setIsExecutingCancel(false);
    }
  }, [listings]);

  const handleClearAll = useCallback(() => {
    setIsExecutingCancel(false);
    setSelected([]);
  }, []);

  return (
    <>
      <Slide direction='bottom' in={listings.length > 0} style={{ zIndex: 10 }}>
        <Box p={3} backgroundColor={sliderBackground} borderTop='1px solid white'>
          <Flex justify="space-between">
            <Text fontSize="14px" my="auto" fontWeight="bold">
              {listings.length} {pluralize(listings.length, 'listing')} selected
            </Text>
            <Box my="auto">
              <HStack>
                <Button variant='ghost' onClick={handleClearAll}>
                  Clear all
                </Button>
                <PrimaryButton
                  onClick={handleCancel}
                  isLoading={executingCancel}
                >
                  Cancel
                </PrimaryButton>
              </HStack>
            </Box>
          </Flex>
        </Box>
      </Slide>
    </>
  )
}

export default BatchPreview;