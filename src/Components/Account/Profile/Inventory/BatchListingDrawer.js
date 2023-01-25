import {CloseButton, Flex, Grid, GridItem, Select, Spacer} from "@chakra-ui/react";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import BundleDrawer from "./components/BundleDrawer";
import {ListingDrawer} from "@src/Components/Account/Profile/Inventory/components/ListingDrawer";
import {TransferDrawer} from "@src/Components/Account/Profile/Inventory/components/TransferDrawer";
import {setBatchType} from "@src/GlobalState/batchListingSlice";

const MAX_NFTS_IN_CART = 40;

const actions = {
  listing: 'listing',
  bundle: 'bundle',
  transfer: 'transfer'
};

export const BatchListingDrawer = ({ onClose, ...gridProps }) => {
  const dispatch = useDispatch();
  const batchListingCart = useSelector((state) => state.batchListing);

  const gridTemplateRows = () => {
    if (batchListingCart.type === actions.bundle) return '60px 212px 1fr auto';
    if (batchListingCart.type === actions.transfer) return '60px auto 1fr auto';

    return '60px 1fr auto';
  }

  const handleClose = () => {
    // setShowConfirmButton(false);
    onClose();
  };

  const handleTypeChange = (e) => {
    dispatch(setBatchType(e.target.value));
  };

  return (
    <Grid templateRows={gridTemplateRows} {...gridProps}>
      <GridItem px={6} py={4}>
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

