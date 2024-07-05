import React, {useState} from "react";
import {Box, Drawer, DrawerContent, DrawerOverlay, Flex, HStack, Slide, Text, useColorModeValue} from "@chakra-ui/react";
import {closeCart, openCart} from "@market/state/redux/slices/ryoshi-staking-cart-slice";
import {useDispatch} from "react-redux";
import {pluralize} from "@market/helpers/utils";
import {BatchStakingDrawer} from "@src/components-v2/feature/staking/batch-staking-drawer";
import {useAppSelector} from "@market/state/redux/store/hooks";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";

export const MobileBatchStaking = () => {
  const dispatch = useDispatch();
  const [showBatchStakingDrawer, setShowBatchStakingDrawer] = useState(false);
  const ryoshiStakingCart = useAppSelector((state) => state.ryoshiStakingCart);
  const sliderBackground = useColorModeValue('gray.50', 'gray.700')

  const handleOpen = () => {
    dispatch(openCart());
    setShowBatchStakingDrawer(true);
  };

  const handleCancel = () => {
    dispatch(closeCart());
    setShowBatchStakingDrawer(false);
  };

  const handleClose = () => {
    setShowBatchStakingDrawer(false);
    if (!(ryoshiStakingCart.nfts.length > 0)) {
      dispatch(closeCart());
    }
  }

  return (
    <>
      <Slide direction='bottom' in={ryoshiStakingCart.isDrawerOpen} style={{ zIndex: 10 }}>
        <Box p={3} backgroundColor={sliderBackground}>
          <Flex justify="space-between">
            <Text fontSize="14px" my="auto" fontWeight="bold">
              {ryoshiStakingCart.nfts.length} {pluralize(ryoshiStakingCart.nfts.length, 'item')} selected
            </Text>
            <Box my="auto">
              <HStack>

                <SecondaryButton
                  onClick={handleCancel}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onClick={handleOpen}
                >
                  Continue
                </PrimaryButton>
              </HStack>
            </Box>
          </Flex>
        </Box>
      </Slide>
      <Drawer
        isOpen={ryoshiStakingCart.isDrawerOpen && showBatchStakingDrawer}
        placement="bottom"
        onClose={handleClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <BatchStakingDrawer
            maxH="100vh"
            onClose={handleClose}
          />
        </DrawerContent>
      </Drawer>
    </>
  )
}