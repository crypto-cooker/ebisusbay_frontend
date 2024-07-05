import React, {useState} from "react";
import {Box, Drawer, DrawerContent, DrawerOverlay, Flex, HStack, Slide, Text, useColorModeValue} from "@chakra-ui/react";
import {closeBatchListingCart, openBatchListingCart} from "@market/state/redux/slices/user-batch";
import BatchDrawer from "@src/components-v2/feature/account/profile/tabs/inventory/batch/batch-drawer";
import {useDispatch} from "react-redux";
import Button from "@src/Components/components/Button";
import {pluralize} from "@market/helpers/utils";
import {useAppSelector} from "@market/state/redux/store/hooks";

export const MobileBatchPreview = () => {
  const dispatch = useDispatch();
  const [showBatchListingDrawer, setShowBatchListingDrawer] = useState(false);
  const batchListingCart = useAppSelector((state) => state.batchListing);
  const sliderBackground = useColorModeValue('gray.50', 'gray.700')

  const handleOpen = () => {
    dispatch(openBatchListingCart());
    setShowBatchListingDrawer(true);
  };

  const handleCancel = () => {
    dispatch(closeBatchListingCart());
    setShowBatchListingDrawer(false);
  };

  const handleClose = () => {
    setShowBatchListingDrawer(false);
    if (!(batchListingCart.items.length > 0)) {
      dispatch(closeBatchListingCart());
    }
  }

  return (
    <>
      <Slide direction='bottom' in={batchListingCart.isDrawerOpen} style={{ zIndex: 10 }}>
        <Box p={3} backgroundColor={sliderBackground}>
          <Flex justify="space-between">
            <Text fontSize="14px" my="auto" fontWeight="bold">
              {batchListingCart.items.length} {pluralize(batchListingCart.items.length, 'item')} selected
            </Text>
            <Box my="auto">
              <HStack>
                <Button type="legacy-outlined" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="legacy" onClick={handleOpen}>
                  Continue
                </Button>
              </HStack>
            </Box>
          </Flex>
        </Box>
      </Slide>
      <Drawer
        isOpen={batchListingCart.isDrawerOpen && showBatchListingDrawer}
        placement="bottom"
        onClose={handleClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <BatchDrawer
            maxH="100vh"
            onClose={handleClose}
          />
        </DrawerContent>
      </Drawer>
    </>
  )
}