import {Box, Center, Flex, GridItem, Spacer, Text,} from "@chakra-ui/react";
import Button from "@src/Components/components/Button";
import React, {useRef, useState} from "react";

import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {clearBatchListingCart, setRefetchNfts,} from "@src/GlobalState/batchListingSlice";


import useCreateBundle from '@src/Components/Account/Settings/hooks/useCreateBundle';
import BundleDrawerItem from "./BundleDrawerItem";
import {isBundle} from "@src/utils";
import BundleDrawerForm from "@src/Components/Account/Profile/Inventory/components/BundleDrawerForm";

const MAX_NFTS_IN_BUNDLE = 40;
const MIN_NFTS_IN_BUNDLE = 2;

export const BundleDrawer = ({ onClose, ...gridProps }) => {
  const dispatch = useDispatch();
  const batchListingCart = useSelector((state) => state.batchListing);
  const user = useSelector((state) => state.user);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [executingCreateBundle, setExecutingCreateBundle] = useState(false);
  const formRef = useRef(null);
  const [createBundle, responseBundle] = useCreateBundle();

  const handleClearCart = () => {
    setShowConfirmButton(false);
    dispatch(clearBatchListingCart());
  };

  const onSubmitBundle = async (values) => {
    const validated = await formRef.current.validate();
    const arrays = batchListingCart.nfts.reduce((object, nft) => {
      const addresses = [nft.nft.address];
      const ids = [nft.nft.id];
      if (nft.nft.multiToken && nft.quantity > 1) {
        for (let qty = 1; qty < nft.quantity; qty++) {
          addresses.push(nft.nft.address);
          ids.push(nft.nft.id);
        }
      }

      return {
        tokens: [...object.tokens, ...addresses],
        ids: [...object.ids, ...ids]
      }
    }, {
      tokens: [],
      ids: []
    });

    if (MAX_NFTS_IN_BUNDLE < arrays.tokens.length || MIN_NFTS_IN_BUNDLE > arrays.tokens.length) {
      if (MAX_NFTS_IN_BUNDLE < arrays.tokens.length) {
        toast.error(`Max ${MAX_NFTS_IN_BUNDLE} NFTs`);
      }else{
        toast.error(`Need at least ${MIN_NFTS_IN_BUNDLE} NFTs to bundle`);
      }
    }
    else {
      if (!validated) {
        toast.error(`Error`);
      }
      else {
        try {
          setExecutingCreateBundle(true);
          await createBundle(arrays.tokens, arrays.ids, values.title, values.description)
          toast.success('The bundle was created successfully');
          dispatch(setRefetchNfts(true))
          dispatch(clearBatchListingCart())
          formRef.current.resetForm();
        } catch (error) {
          console.log(error);
          toast.error(`Error`);
        } finally {
          setExecutingCreateBundle(false);
        }
      }
    }
  };

  const canSubmit = () => {
    return !executingCreateBundle &&
      batchListingCart.nfts.length > 0 &&
      !Object.values(batchListingCart.extras).some((o) => !o.approval) &&
      !batchListingCart.nfts.some((o) => o.nft.isStaked || isBundle(o.nft.address));
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  }

  return (
    <>
      <GridItem px={6} py={4}>
        <BundleDrawerForm ref={formRef} onSubmit={onSubmitBundle} />
      </GridItem>
      <GridItem px={6} py={4} overflowY="auto">
        <Flex mb={2}>
          <Text fontWeight="bold" color={batchListingCart.nfts.length > 40 && 'red'}>
            {batchListingCart.nfts.length} / {MAX_NFTS_IN_BUNDLE} Items
          </Text>
          <Spacer />
          <Text fontWeight="bold" onClick={handleClearCart} cursor="pointer">Clear all</Text>
        </Flex>
        {batchListingCart.nfts.length > 0 ? (
          <>
            {batchListingCart.nfts.map((item, key) => (
              <BundleDrawerItem
                item={item}
                disabled={showConfirmButton || executingCreateBundle}
              />
            ))}
          </>
        ) : (
          <Box py={8}>
            <Center>
              <Text className="text-muted">Add items to get started</Text>
            </Center>
          </Box>
        )}
      </GridItem>
      <GridItem px={6} py={4}>
        <Button
          type="legacy"
          className="w-100"
          onClick={handleSubmit}
          disabled={!canSubmit() || (formRef.current && formRef.current.hasErrors())}
          isLoading={executingCreateBundle}
        >
          {!executingCreateBundle?
            'Create Bundle'  
            : 
            'Creating Bundle'
            }
        </Button>
      </GridItem>
    </>
  )
}

export default BundleDrawer;