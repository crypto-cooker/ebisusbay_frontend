import React, {useState} from "react";
import {Box, Drawer, DrawerContent, DrawerOverlay, Flex, HStack, Slide, Text} from "@chakra-ui/react";
import {closeCart, openCart} from "@src/GlobalState/ryoshi-staking-cart-slice";
import {useDispatch} from "react-redux";
import Button from "@src/Components/components/Button";
import {pluralize} from "@src/utils";
import {useColorModeValue} from "@chakra-ui/color-mode";
import {BatchStakingDrawer} from "@src/components-v2/feature/staking/batch-staking-drawer";
import {useAppSelector} from "@src/Store/hooks";

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