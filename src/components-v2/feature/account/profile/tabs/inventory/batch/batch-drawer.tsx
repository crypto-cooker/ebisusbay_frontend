import {
  CloseButton,
  Flex,
  Grid,
  GridItem,
  GridProps,
  Select,
  Spacer,
  useBreakpointValue,
  useColorModeValue
} from "@chakra-ui/react";
import React, {ChangeEvent} from "react";
import {useDispatch} from "react-redux";
import {ListingDrawer} from "@src/components-v2/feature/account/profile/tabs/inventory/batch/listing-drawer";
import TransferDrawer from "@src/components-v2/feature/account/profile/tabs/inventory/batch/transfer-drawer";
import BundleDrawer from "@src/components-v2/feature/account/profile/tabs/inventory/batch/bundle-drawer";
import {setBatchType} from "@src/GlobalState/user-batch";
import {useAppSelector} from "@src/Store/hooks";
import {getTheme} from "@src/Theme/theme";
import {useUser} from "@src/components-v2/useUser";

const MAX_NFTS_IN_CART = 40;

const actions = {
  listing: 'listing',
  bundle: 'bundle',
  transfer: 'transfer'
};

interface BatchDrawerProps {
  onClose: () => void;
}

const BatchDrawer = ({ onClose, ...gridProps }: BatchDrawerProps & GridProps) => {
  const dispatch = useDispatch();
  const batchListingCart = useAppSelector((state) => state.batchListing);
  const {theme: userTheme} = useUser();
  const batchListingBorderColor = useColorModeValue('#000', '#FFF');
  const useMobileCartView = useBreakpointValue(
    {base: true, lg: false},
    {fallback: 'lg'},
  );

  const gridTemplateRows = {
    [actions.listing]: '60px 1fr auto',
    [actions.bundle]: '60px 212px 1fr auto',
    [actions.transfer]: '60px auto 1fr auto'
  }

  const handleClose = () => {
    // setShowConfirmButton(false);
    onClose();
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setBatchType(e.target.value));
  };

  return (
    <Grid
      templateRows={gridTemplateRows[batchListingCart.type]}
      bgColor={getTheme(userTheme).colors.bgColor1}
      borderLeftWidth={useMobileCartView ? 'none' : '1px'}
      borderLeftStyle='solid'
      borderLeftColor={batchListingBorderColor}
      zIndex={1}
      {...gridProps}
    >
      <GridItem p={4}>
        <Flex align="center">
          {/*TODO update*/}
          <Select me={2} value={batchListingCart.type} onChange={handleTypeChange}>
            <option value={actions.listing}>List for sale</option>
            <option value={actions.bundle}>Create a Bundle</option>
            <option value={actions.transfer}>Transfer</option>
          </Select>
          <Spacer />
          <CloseButton onClick={handleClose} />
        </Flex>
      </GridItem>
      {batchListingCart.type === actions.listing && <ListingDrawer />}
      {batchListingCart.type === actions.bundle && <BundleDrawer />}
      {batchListingCart.type === actions.transfer && <TransferDrawer />}
    </Grid>
  )
}

export default BatchDrawer;