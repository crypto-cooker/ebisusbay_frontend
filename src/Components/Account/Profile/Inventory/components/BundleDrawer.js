import {
  Box,
  Center,
  Flex,
  GridItem,
  Spacer,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Button from "@src/Components/components/Button";
import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  applyPriceToAll,
  cascadePrices,
  clearBatchListingCart,
  setRefetchNfts,
} from "@src/GlobalState/batchListingSlice";


import useCreateBundle from '@src/Components/Account/Settings/hooks/useCreateBundle';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormControl as FormControlCK } from '@src/Components/components/chakra-components'
import BundleDrawerItem from "./BundleDrawerItem";
import {isBundle} from "@src/utils";

const MAX_NFTS_IN_BUNDLE = 40;

export const BundleDrawer = ({ onClose, ...gridProps }) => {
  const dispatch = useDispatch();
  const batchListingCart = useSelector((state) => state.batchListing);
  const user = useSelector((state) => state.user);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [executingCreateBundle, setExecutingCreateBundle] = useState(false);

  const [createBundle, responseBundle] = useCreateBundle();


  const handleClearCart = () => {
    setShowConfirmButton(false);
    dispatch(clearBatchListingCart());
  };
  const handleCascadePrices = (startingItem, startingPrice) => {
    if (!startingPrice) return;

    dispatch(cascadePrices({ startingItem, startingPrice }));
  }
  const handleApplyAll = (price) => {
    if (!price) return;

    dispatch(applyPriceToAll(price));
  }

  const validationForm = async () => {
    const errors = await validateForm(values);
    if (errors) {
      const keysErrorsGroup = Object.keys(errors);
      if (keysErrorsGroup.length > 0) {
        setFieldTouched(`title`, true)
        setFieldTouched(`description`, true)
        return true;
      }
      else {
        return false;
      }
    }
    return false
  }

  const onSubmitBundle = async (e) => {
    const anyErrors = await validationForm()
    if (MAX_NFTS_IN_BUNDLE < batchListingCart.nfts.length || 1 >= batchListingCart.nfts.length) {
      if (MAX_NFTS_IN_BUNDLE < batchListingCart.nfts.length) {
        toast.error(`Max ${MAX_NFTS_IN_BUNDLE} nfts`);
      }else{
        toast.error(`Min 2 nfts`);
      }
    }
    else {
      if (anyErrors) {
        toast.error(`Error`);
      }
      else {
        try {
          setExecutingCreateBundle(true);
          const res = await createBundle({ values, nfts: batchListingCart.nfts })
          toast.success('The bundle was created successfully');
          dispatch(setRefetchNfts(true))
          dispatch(clearBatchListingCart())
          resetForm();
        } catch (error) {
          toast.error(`Error`);
        } finally {
          setExecutingCreateBundle(false);
        }
      }
    }
  };

  const initialValuesBundle = {
    title: '',
    description: '',
  }

  const bundleValidation = Yup.object().shape({
    title: Yup.string().required('Required'),
    description: Yup.string()

  });

  const formikProps = useFormik({
    onSubmit: onSubmitBundle,
    validationSchema: bundleValidation,
    initialValues: initialValuesBundle,
    enableReinitialize: true,
  });
  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    handleSubmit,
    validateForm,
    resetForm
  } = formikProps;

  const canSubmit = () => {
    return !executingCreateBundle &&
      batchListingCart.nfts.length > 0 &&
      !Object.values(batchListingCart.extras).some((o) => !o.approval) &&
      !batchListingCart.nfts.some((o) => o.nft.isStaked || isBundle(o.nft.address));
  }

  return (
    <>
      <GridItem px={6} py={4}>
        <Flex flexDirection="column">
          <FormControlCK
            name={'title'}
            label={'Title'}
            value={values?.title}
            error={errors?.title}
            touched={touched?.title}
            onChange={handleChange}
            onBlur={handleBlur}
            type={'text'}
          />
          <Text mb='8px'>Description</Text>
          <Textarea
            onChange={handleChange}
            size='sm'
            type='text'
            resize='none'
            name='description'
            value={values.description}
            onBlur={handleBlur}
          />
        </Flex>
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
                onCascadePriceSelected={handleCascadePrices}
                onApplyAllSelected={handleApplyAll}
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
          disabled={!canSubmit() || errors.length > 0}
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