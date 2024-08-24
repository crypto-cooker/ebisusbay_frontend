import {Box, Center, Flex, GridItem, Spacer, Text,} from "@chakra-ui/react";
import Button from "@src/Components/components/Button";
import React, {useRef, useState} from "react";

import {toast} from "react-toastify";
import {addToBatchListingCart, clearBatchListingCart, setRefetchNfts,} from "@market/state/redux/slices/user-batch";


import useCreateBundle from '@src/Components/Account/Settings/hooks/useCreateBundle';
import BundleDrawerItem from "./bundle-drawer-item";
import {isBundle} from "@market/helpers/utils";
import BundleDrawerForm, {
  BundleDrawerFormHandle
} from "@src/components-v2/feature/account/profile/tabs/inventory/batch/bundle-drawer-form";
import {useAppDispatch, useAppSelector} from "@market/state/redux/store/hooks";
import nextApiService from "@src/core/services/api-service/next";
import {useUser} from "@src/components-v2/useUser";

const MAX_NFTS_IN_BUNDLE = 40;
const MIN_NFTS_IN_BUNDLE = 2;

export const BundleDrawer = () => {
  const dispatch = useAppDispatch();
  const batchListingCart = useAppSelector((state) => state.batchListing);
  const user = useUser();
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [executingCreateBundle, setExecutingCreateBundle] = useState(false);
  const formRef = useRef<BundleDrawerFormHandle>(null);
  const [createBundle, responseBundle] = useCreateBundle();

  const handleClearCart = () => {
    setShowConfirmButton(false);
    dispatch(clearBatchListingCart());
  };

  const handleAddCollection = async (address: string) => {
    if (!address) return;
    const nfts = await nextApiService.getWallet(user.address!, {
      page: 1,
      collection: [address],
    });
    for (const nft of nfts.data) {
      dispatch(addToBatchListingCart(nft));
    }
  }

  const onSubmitBundle = async (values: any) => {
    const validated = await formRef.current?.validate();
    type ReducedItems = {
      tokens: string[];
      ids: string[];
    };
    const arrays: ReducedItems = batchListingCart.items.reduce<ReducedItems>((object, item) => {
      const addresses = [item.nft.nftAddress];
      const ids = [item.nft.nftId];
      if (item.nft.is_1155 && item.quantity > 1) {
        for (let qty = 1; qty < item.quantity; qty++) {
          addresses.push(item.nft.nftAddress);
          ids.push(item.nft.nftId);
        }
      }

      return {
        tokens: [...object.tokens, ...addresses],
        ids: [...object.ids, ...ids]
      }
    }, {tokens: [], ids: []});

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
          if (typeof formRef.current?.reset === 'function') {
            formRef.current?.reset();
          }
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
      batchListingCart.items.length > 0 &&
      !Object.values(batchListingCart.extras).some((o) => !o.approval || !o.canList) &&
      !batchListingCart.items.some((o) => o.nft.isStaked || isBundle(o.nft.nftAddress));
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  }

  return (
    <>
      <GridItem p={4}>
        <BundleDrawerForm ref={formRef} onSubmit={onSubmitBundle} />
      </GridItem>
      <GridItem p={4} overflowY="auto">
        <Flex mb={2}>
          <Text fontWeight="bold" color={batchListingCart.items.length > 40 ? 'red' : 'auto'}>
            {batchListingCart.items.length} / {MAX_NFTS_IN_BUNDLE} Items
          </Text>
          <Spacer />
          <Text fontWeight="bold" onClick={handleClearCart} cursor="pointer">Clear all</Text>
        </Flex>
        {batchListingCart.items.length > 0 ? (
          <>
            {batchListingCart.items.map((item) => (
              <BundleDrawerItem
                key={`${item.nft.nftAddress}-${item.nft.nftId}`}
                item={item}
                disabled={showConfirmButton || executingCreateBundle}
                onAddCollection={handleAddCollection}
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
      <GridItem p={4}>
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