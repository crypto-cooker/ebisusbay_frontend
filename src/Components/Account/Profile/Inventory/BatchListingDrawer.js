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
import {TransferDrawer} from "@src/Components/Account/Profile/Inventory/components/TransferDrawer";

const MAX_NFTS_IN_CART = 40;

const actions = {
  listing: 'listing',
  bundle: 'bundle',
  transfer: 'transfer'
};

export const BatchListingDrawer = ({ onClose, ...gridProps }) => {
  const { Features } = Constants;
  const useBundles = useFeatureFlag(Features.BUNDLES);

  const [actualForm, setActualForm] = useState(actions.listing);

  const gridTemplateRows = () => {
    if (actualForm === actions.bundle) return '60px 212px 1fr auto';
    if (actualForm === actions.transfer) return '60px auto 1fr auto';

    return '60px 1fr auto';
  }

  const handleClose = () => {
    // setShowConfirmButton(false);
    onClose();
  };

  return (
    <Grid templateRows={gridTemplateRows} {...gridProps}>
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
      {actualForm === actions.transfer && <TransferDrawer />}
    </Grid>
  )
}

