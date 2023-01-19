import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Center,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Spacer,
  Switch,
  Text
} from "@chakra-ui/react";
import Button from "@src/Components/components/Button";
import {Spinner} from "react-bootstrap";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {applyPriceToAll, cascadePrices, clearBatchListingCart} from "@src/GlobalState/batchListingSlice";
import {Contract, ethers} from "ethers";
import {toast} from "react-toastify";
import {
  caseInsensitiveCompare,
  createSuccessfulTransactionToastContent,
  isBundle,
  isGaslessListing,
  pluralize
} from "@src/utils";
import * as Sentry from "@sentry/react";
import {appConfig, isTestnet} from "@src/Config";
import {ListingDrawerItem} from "@src/Components/Account/Profile/Inventory/components/ListingDrawerItem";
import ListingBundleDrawerForm from "@src/Components/Account/Profile/Inventory/components/ListingBundleDrawerForm";
import Bundle from "@src/Contracts/Bundle.json";
import useCreateGaslessListing from "@src/Components/Account/Settings/hooks/useCreateGaslessListing";
import useUpdateGaslessListing from "@src/Components/Account/Settings/hooks/useUpdateGaslessListing";

const config = appConfig();
const MAX_NFTS_IN_CART = 40;
const MIN_NFTS_IN_BUNDLE = 2;
const floorThreshold = 5;
const numberRegexValidation = /^[1-9]+[0-9]*$/;

export const ListingDrawer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const batchListingCart = useSelector((state) => state.batchListing);
  const [executingCreateListing, setExecutingCreateListing] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [isBundling, setIsBundling] = useState(false);
  const formRef = useRef(null);
  const [debugLegacy, setDebugLegacy] = useState(false);

  const [createGaslessListing, responseCreate] = useCreateGaslessListing();
  const [updateGaslessListing, responseUpdate] = useUpdateGaslessListing();

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
  const resetDrawer = () => {
    handleClearCart();
    setIsBundling(false);
  }

  const executeCreateListing = async () => {
    try {
      setShowConfirmButton(false);
      setExecutingCreateListing(true);
      const filteredCartNfts = batchListingCart.nfts.filter((o) => {
        return batchListingCart.extras[o.nft.address.toLowerCase()]?.approval;
      });

      const nftPrices = filteredCartNfts.map((o) => ethers.utils.parseEther(o.price.toString()));
      if (nftPrices.some((o) => !o.gt(0))) {
        toast.error('0 priced item detected!');
        return;
      }

      if (isTestnet() && debugLegacy) {
        await executeUpdateLegacyListings(filteredCartNfts);
      } else {
        const splitItems = splitExistingLegacyFromGasless(filteredCartNfts);
        await executeUpdateLegacyListings(splitItems.legacy);
        await executeGaslessListings(splitItems.gasless);
      }

      resetDrawer();
    } finally {
      setExecutingCreateListing(false);
    }
  }

  const executeGaslessListings = async (nfts) => {
    if (nfts.length < 1) return;

    const nftAddresses = nfts.map((o) => o.nft.address);
    const nftIds = nfts.map((o) => o.nft.id);
    const nftPrices = nfts.map((o) => ethers.utils.parseEther(o.price.toString()));

    Sentry.captureEvent({ message: 'handleBatchListing', extra: { nftAddresses, nftIds, nftPrices } });

    for (const item of nfts) {
      const address = item.nft.address ?? item.nft.nftAddress;
      const id = item.nft.id ?? item.nft.nftId;
      const price = item.price.toString();
      const expiration = item.expiration;

      if (item.nft.listed) {
        const res = await updateGaslessListing(item.nft.listingId, { collectionAddress: address, tokenId: id, price: price, expirationDate: expiration });
      } else {
        const res = await createGaslessListing({ collectionAddress: address, tokenId: id, price: price, expirationDate: expiration, is1155: item.nft.multiToken });
      }
    }
    toast.success(createSuccessfulTransactionToastContent(''));
  }

  const executeUpdateLegacyListings = async (existingLegacyListingNfts) => {
    if (existingLegacyListingNfts.length < 1) return;

    const nftAddresses = existingLegacyListingNfts.map((o) => o.nft.address);
    const nftIds = existingLegacyListingNfts.map((o) => o.nft.id);
    const nftPrices = existingLegacyListingNfts.map((o) => ethers.utils.parseEther(o.price.toString()));

    if (nftPrices.some((o) => !o.gt(0))) {
      toast.error('0 priced item detected!');
      return;
    }

    Sentry.captureEvent({ message: 'handleBatchListing', extra: { nftAddresses, nftIds, nftPrices } });

    let tx = await user.contractService.market.makeListings(nftAddresses, nftIds, nftPrices);
    let receipt = await tx.wait();

    toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
  }

  const splitExistingLegacyFromGasless = (nfts) => {
    const legacy = [];
    const gasless = [];
    for (const nft of nfts) {
      if (nft.listed && !isGaslessListing(nft.listingId)) {
        legacy.push(nft);
      } else {
        gasless.push(nft);
      }
    }

    return {legacy, gasless};
  }

  const prepareListing = async () => {
    try {
      if (isBundling) {
        formRef.current.submitForm();
        return;
      }

      const nftFloorPrices = Object.entries(batchListingCart.extras).map(([k, v]) => {
        return { address: k, floorPrice: v.floorPrice }
      });
      let floorWarning = false;
      const nftPrices = batchListingCart.nfts.map((o) => {
        const floorPriceObj = nftFloorPrices.find((fp) => caseInsensitiveCompare(fp.address, o.nft.address));
        const isBelowFloor = (floorPriceObj.floorPrice !== 0 && ((floorPriceObj.floorPrice - Number(o.price)) / floorPriceObj.floorPrice) * 100 > floorThreshold);;
        if (isBelowFloor) {
          floorWarning = true;
        }
        return {
          address: o.nft.address,
          price: o.price,
          ...floorPriceObj
        }
      });

      if (floorWarning) {
        setShowConfirmButton(true);
      } else {
        await executeCreateListing();
      }

    } catch (error) {
      console.log(error);
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
    }
  }

  const canSubmit = () => {
    return !executingCreateListing &&
      batchListingCart.nfts.length > 0 &&
      !Object.values(batchListingCart.extras).some((o) => !o.approval) &&
      (isBundling || !batchListingCart.nfts.some((o) => !o.price || !(parseInt(o.price) > 0))) &&
      (isBundling || !batchListingCart.nfts.some((o) => !o.expiration || !(parseInt(o.expiration) > 0))) &&
      !batchListingCart.nfts.some((o) => !o.nft.listable || o.nft.isStaked || (isBundling && isBundle(o.nft.address)));
  }

  const onBundleToggled = useCallback((e) => {
    setIsBundling(e.target.checked);
  }, [setIsBundling, isBundling]);

  const onSubmitListingBundle = async (values) => {
    if (batchListingCart.nfts.length < MIN_NFTS_IN_BUNDLE) {
      toast.error(`Need at least ${MIN_NFTS_IN_BUNDLE} NFTs to bundle`);
      return;
    }

    try {
      setShowConfirmButton(false);
      setExecutingCreateListing(true);
      const filteredCartNfts = batchListingCart.nfts.filter((o) => {
        return batchListingCart.extras[o.nft.address.toLowerCase()]?.approval;
      });
      const nftAddresses = filteredCartNfts.map((o) => o.nft.address);
      const nftIds = filteredCartNfts.map((o) => o.nft.id);

      Sentry.captureEvent({ message: 'handleBatchBundleListing', extra: {
          nftAddresses,
          nftIds,
          title: values.title,
          description: values.description,
          price: values.price
      }});
      const price = ethers.utils.parseEther(values.price.toString());

      const bundleContract = new Contract(config.contracts.bundle, Bundle.abi, user.provider.getSigner());
      const tx = await bundleContract.wrapAndList(nftAddresses, nftIds, values.title, values.description, price)
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      resetDrawer();
    } finally {
      setExecutingCreateListing(false);
    }
  };

  return (
    <>
      <GridItem px={6} py={4} overflowY="auto">
        {isTestnet() && (
          <FormControl display='flex' alignItems='center' mb={2}>
            <FormLabel htmlFor='debug-legacy-toggle' mb='0'>
              Debug: enable legacy
            </FormLabel>
            <Switch id='debug-legacy-toggle' isChecked={debugLegacy} onChange={() => setDebugLegacy(!debugLegacy)}/>
          </FormControl>
        )}
        <FormControl display='flex' alignItems='center' mb={2}>
          <FormLabel htmlFor='list-bundle-toggle' mb='0'>
            List as bundle
          </FormLabel>
          <Switch id='list-bundle-toggle' isChecked={isBundling} onChange={onBundleToggled}/>
        </FormControl>
        {isBundling && (
          <Box mb={4}>
            <ListingBundleDrawerForm ref={formRef} onSubmit={onSubmitListingBundle} />
          </Box>
        )}
        <Flex mb={2}>
          <Text fontWeight="bold" color={batchListingCart.nfts.length > 40 && 'red'}>
            {batchListingCart.nfts.length} / {MAX_NFTS_IN_CART} Items
          </Text>
          <Spacer />
          <Text fontWeight="bold" onClick={handleClearCart} cursor="pointer">Clear all</Text>
        </Flex>
        {batchListingCart.nfts.length > 0 ? (
          <>
            {batchListingCart.nfts.map((item, key) => (
              <ListingDrawerItem
                key={item.nft.name}
                item={item}
                onCascadePriceSelected={handleCascadePrices}
                onApplyAllSelected={handleApplyAll}
                disabled={showConfirmButton || executingCreateListing}
                isBundling={isBundling}
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
        {/*TODO update*/}
        { showConfirmButton ? (
          <>
            {!executingCreateListing && (
              <Alert status="error" mb={2}>
                <AlertIcon />
                <AlertDescription>Some items above are below their current floor price. Are you sure?</AlertDescription>
              </Alert>
            )}
            {executingCreateListing && (
              <Text mb={2} fontStyle="italic" fontSize="sm" align="center">
                Please check your wallet for confirmation
              </Text>
            )}
            <Flex>
              <Button type="legacy"
                      onClick={() => setShowConfirmButton(false)}
                      disabled={executingCreateListing}
                      className="me-2 flex-fill">
                Go Back
              </Button>
              <Button type="legacy-outlined"
                      onClick={executeCreateListing}
                      isLoading={executingCreateListing}
                      disabled={executingCreateListing}
                      className="flex-fill">
                I understand, continue
              </Button>
            </Flex>
          </>
        ) : (
          <>
            {executingCreateListing && (
              <Text mb={2} fontStyle="italic" fontSize="sm" align="center">
                Please check your wallet for confirmation
              </Text>
            )}
            <Button
              type="legacy"
              className="w-100"
              onClick={prepareListing}
              disabled={!canSubmit()}
            >
              {executingCreateListing ? (
                <>
                  Creating {pluralize(batchListingCart.nfts.length, 'Listing')}...
                  <Spinner animation="border" role="status" size="sm" className="ms-1">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </>
              ) : (
                <>Create {pluralize(batchListingCart.nfts.length, 'Listing')}</>
              )}
            </Button>
          </>
        )
        }
      </GridItem>
    </>
  )
}