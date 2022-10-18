import React, {useState} from "react";
import {Box, Drawer, DrawerContent, DrawerOverlay, Flex, HStack, Slide, Text, VStack} from "@chakra-ui/react";
import {
  closeBatchListingCart,
  openBatchListingCart
} from "@src/GlobalState/batchListingSlice";
import {BatchListingDrawer} from "@src/Components/Account/Profile/Inventory/BatchListingDrawer";
import {useDispatch, useSelector} from "react-redux";
import Button from "@src/Components/components/Button";
import {pluralize} from "@src/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";

export const MobileBatchListing = () => {
  const dispatch = useDispatch();
  const [showBatchListingDrawer, setShowBatchListingDrawer] = useState(false);
  const batchListingCart = useSelector((state) => state.batchListing);
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
    if (!(batchListingCart.nfts.length > 0)) {
      dispatch(closeBatchListingCart());
    }
  }

  return (
    <>
      <Slide direction='bottom' in={batchListingCart.isDrawerOpen} style={{ zIndex: 10 }}>
        <Box p={3} backgroundColor={sliderBackground}>
          <Flex justify="space-between">
            <Text fontSize="14px" my="auto" fontWeight="bold">
              {batchListingCart.nfts.length} {pluralize(batchListingCart.nfts.length, 'item')} selected
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
          <BatchListingDrawer
            maxH="100vh"
            onClose={handleClose}
          />
        </DrawerContent>
      </Drawer>
    </>
  )
}