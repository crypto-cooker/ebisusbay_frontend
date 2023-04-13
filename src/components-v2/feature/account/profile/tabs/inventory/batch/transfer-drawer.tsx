import {Alert, AlertDescription, AlertIcon, Box, Center, Flex, GridItem, Spacer, Text} from "@chakra-ui/react";
import Button from "@src/Components/components/Button";
import {Spinner} from "react-bootstrap";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {addToBatchListingCart, clearBatchListingCart, setRefetchNfts} from "@src/GlobalState/user-batch";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, pluralize, shortAddress} from "@src/utils";
import * as Sentry from "@sentry/react";
import TransferDrawerItem from "@src/components-v2/feature/account/profile/tabs/inventory/batch/transfer-drawer-item";
import {FormControl as FormControlCK} from "@src/Components/components/chakra-components";
import * as Yup from "yup";
import {useFormik} from "formik";
import {getCnsAddress, isCnsName} from "@src/helpers/cns";
import {useAppSelector} from "@src/Store/hooks";
import nextApiService from "@src/core/services/api-service/next";

const MAX_NFTS_IN_CART = 100;

const TransferDrawer = () => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const batchListingCart = useAppSelector((state) => state.batchListing);
  const [executingTransfer, setExecutingTransfer] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [mappedCnsAddress, setMappedCnsAddress] = useState<string | null>(null);

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

  const resetDrawer = () => {
    handleClearCart();
    handleReset(null);
    setRecipient(null);
    setMappedCnsAddress(null);
  }

  const executeTransfer = async () => {
    if (!recipient) return;

    try {
      setShowConfirmButton(false);
      setExecutingTransfer(true);
      const filteredCartNfts = batchListingCart.items.filter((o) => {
        return batchListingCart.extras[o.nft.nftAddress.toLowerCase()]?.approval ?? false;
      });
      const nftAddresses = filteredCartNfts.map((o) => o.nft.nftAddress);
      const nftIds = filteredCartNfts.map((o) => o.nft.nftId);

      Sentry.captureEvent({ message: 'handleBatchTransfer', extra: { nftAddresses, nftIds } });
      let tx = await user.contractService!.market.bulkTransfer(nftAddresses, nftIds, recipient);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      resetDrawer();
      dispatch(setRefetchNfts(true))
    } catch (error: any) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error('Unknown Error');
      }
    } finally {
      setExecutingTransfer(false);
    }
  }

  const prepareListing = async () => {
    try {
      const anyErrors = await validationForm();
      if (anyErrors) return;

      setRecipient(values.recipient);
      if (isCnsName(values.recipient)) {
        const cnsAddress = await getCnsAddress(values.recipient);
        if (cnsAddress) {
          setMappedCnsAddress(`Found ${shortAddress(cnsAddress)}`)
          setRecipient(cnsAddress);
        } else {
          setFieldError('recipient', 'Invalid CNS name');
          return;
        }
      }

      setShowConfirmButton(true);
    } catch (error: any) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error('Unknown Error');
      }
    }
  }

  const canSubmit = () => {
    return !executingTransfer &&
      batchListingCart.items.length > 0 &&
      !Object.values(batchListingCart.extras).some((o) => !o.approval) &&
      !batchListingCart.items.some((o) => o.nft.isStaked);
  }

  const validationForm = async () => {
    const errors = await validateForm(values);
    if (errors) {
      const keysErrorsGroup = Object.keys(errors);
      if (keysErrorsGroup.length > 0) {
        await setFieldTouched(`recipient`, true)
        return true;
      }
      else {
        return false;
      }
    }
    return false
  }

  const initialFormValues = {
    recipient: ''
  }

  const formValidation = Yup.object().shape({
    recipient: Yup.string().required('Required')
  });

  const formikProps = useFormik({
    onSubmit: prepareListing,
    validationSchema: formValidation,
    initialValues: initialFormValues,
    enableReinitialize: true,
  });
  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    handleBlur,
    handleReset,
    handleSubmit,
    validateForm,
  } = formikProps;

  return (
    <>
      <GridItem p={4}>
        <Flex flexDirection="column">
          <FormControlCK
            name={'recipient'}
            label={'Recipient'}
            helperText={mappedCnsAddress ?? 'Address or CNS name'}
            value={values?.recipient}
            error={errors?.recipient}
            touched={touched?.recipient}
            onChange={handleChange}
            onBlur={handleBlur}
            type={'text'}
            disabled={showConfirmButton || executingTransfer}
          />
        </Flex>
      </GridItem>
      <GridItem p={4} overflowY="auto">
        <Flex mb={2}>
          <Text fontWeight="bold" color={batchListingCart.items.length > MAX_NFTS_IN_CART ? 'red' : 'auto'}>
            {batchListingCart.items.length} / {MAX_NFTS_IN_CART} Items
          </Text>
          <Spacer />
          <Text fontWeight="bold" onClick={handleClearCart} cursor="pointer">Clear all</Text>
        </Flex>
        {batchListingCart.items.length > 0 ? (
          <>
            {batchListingCart.items.map((item) => (
              <TransferDrawerItem
                key={`${item.nft.nftAddress}-${item.nft.nftId}`}
                item={item}
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
        {/*TODO update*/}
        { showConfirmButton ? (
          <>
            {!executingTransfer && (
              <Alert status="error" mb={2}>
                <AlertIcon />
                <AlertDescription>Transferring {batchListingCart.items.length} {pluralize(batchListingCart.items.length, 'item')}. Please double check the receiving address before continuing</AlertDescription>
              </Alert>
            )}
            {executingTransfer && (
              <Text mb={2} fontStyle="italic" fontSize="sm" align="center">
                Please check your wallet for confirmation
              </Text>
            )}
            <Flex>
              <Button type="legacy"
                      onClick={() => setShowConfirmButton(false)}
                      disabled={executingTransfer}
                      className="me-2 flex-fill">
                Go Back
              </Button>
              <Button type="legacy-outlined"
                      onClick={executeTransfer}
                      isLoading={executingTransfer}
                      disabled={executingTransfer}
                      className="flex-fill">
                Continue
              </Button>
            </Flex>
          </>
        ) : (
          <>
            {executingTransfer && (
              <Text mb={2} fontStyle="italic" fontSize="sm" align="center">
                Please check your wallet for confirmation
              </Text>
            )}
            <Button
              type="legacy"
              className="w-100"
              onClick={handleSubmit}
              disabled={!canSubmit()}
            >
              {executingTransfer ? (
                <>
                  Transferring {pluralize(batchListingCart.items.length, 'Item')}...
                  <Spinner animation="border" role="status" size="sm" className="ms-1">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </>
              ) : (
                <>Transfer {pluralize(batchListingCart.items.length, 'Item')}</>
              )}
            </Button>
          </>
        )
        }
      </GridItem>
    </>
  )
}

export default TransferDrawer;