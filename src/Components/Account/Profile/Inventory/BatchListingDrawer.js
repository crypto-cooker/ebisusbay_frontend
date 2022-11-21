import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Center,
  CloseButton,
  Flex,
  Grid,
  GridItem,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Button from "@src/Components/components/Button";
import {Spinner} from "react-bootstrap";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import BundleDrawer from "./components/BundleDrawer";
import useFeatureFlag from "@src/hooks/useFeatureFlag";
import Constants from "@src/constants";
import {ListingDrawer} from "@src/Components/Account/Profile/Inventory/components/ListingDrawer";

const MAX_NFTS_IN_CART = 40;

const actions = {
  listing: 'listing',
  bundle: 'bundle',
  transfer: 'transfer'
};

export const BatchListingDrawer = ({ onClose, ...gridProps }) => {
  const batchListingCart = useSelector((state) => state.batchListing);

  const { Features } = Constants;
  const useBundles = useFeatureFlag(Features.BUNDLES);

  const [actualForm, setActualForm] = useState(actions.listing);

  const handleClose = () => {
    // setShowConfirmButton(false);
    onClose();
  };

  return (
    <Grid templateRows={actualForm === actions.listing ? "60px 1fr auto" : "60px 212px 1fr auto"} {...gridProps}>
      <GridItem px={6} py={4}>
        <Flex align="center">
          {/*TODO update*/}
          <Select me={2} defaultValue={actualForm} onChange={(e) => { setActualForm(e.target.value) }}>
            <option value={actions.listing}>List for sale</option>
            {useBundles && (
              <option value={actions.bundle}>Create a Bundle</option>
            )}
            <option value={actions.transfer}>Transfer</option>
          </Select>
          <Spacer />
          <CloseButton onClick={handleClose} />
        </Flex>
      </GridItem>
      {actualForm === actions.listing && <ListingDrawer />}
      {actualForm === actions.bundle && <BundleDrawer />}
    </Grid>
  )
}

