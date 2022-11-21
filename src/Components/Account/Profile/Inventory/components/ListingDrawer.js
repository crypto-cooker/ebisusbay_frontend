import {Alert, AlertDescription, AlertIcon, Box, Center, Flex, GridItem, Spacer, Text} from "@chakra-ui/react";
import Button from "@src/Components/components/Button";
import {Spinner} from "react-bootstrap";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {applyPriceToAll, cascadePrices, clearBatchListingCart} from "@src/GlobalState/batchListingSlice";
import {ethers} from "ethers";
import {toast} from "react-toastify";
import {caseInsensitiveCompare, createSuccessfulTransactionToastContent, pluralize} from "@src/utils";
import * as Sentry from "@sentry/react";
import {appConfig} from "@src/Config";
import {
  BatchListingDrawerItem,
  ListingDrawerItem
} from "@src/Components/Account/Profile/Inventory/components/ListingDrawerItem";

const config = appConfig();
const MAX_NFTS_IN_CART = 40;
const floorThreshold = 5;

export const ListingDrawer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const batchListingCart = useSelector((state) => state.batchListing);
  const [executingCreateListing, setExecutingCreateListing] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

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

  const executeCreateListing = async () => {
    try {
      setShowConfirmButton(false);
      setExecutingCreateListing(true);
      const filteredCartNfts = batchListingCart.nfts.filter((o) => {
        return batchListingCart.extras[o.nft.address.toLowerCase()]?.approval;
      });
      const nftAddresses = filteredCartNfts.map((o) => o.nft.address);
      const nftIds = filteredCartNfts.map((o) => o.nft.id);
      const nftPrices = filteredCartNfts.map((o) => ethers.utils.parseEther(o.price.toString()));

      if (nftPrices.some((o) => !o.gt(0))) {
        toast.error('0 priced item detected!');
        return;
      }

      Sentry.captureEvent({ message: 'handleBatchListing', extra: { nftAddresses, nftIds, nftPrices } });
      let tx = await user.contractService.market.makeListings(nftAddresses, nftIds, nftPrices);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      handleClearCart();
    } finally {
      setExecutingCreateListing(false);
    }
  }

  const prepareListing = async () => {
    try {
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
    return !executingCreateListing &&
      batchListingCart.nfts.length > 0 &&
      !Object.values(batchListingCart.extras).some((o) => !o.approval) &&
      !batchListingCart.nfts.some((o) => !o.price || !parseInt(o.price) > 0) &&
      !batchListingCart.nfts.some((o) => !o.nft.listable || o.nft.isStaked);
  }

  return (
    <>
      <GridItem px={6} py={4} overflowY="auto">
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
                item={item}
                onCascadePriceSelected={handleCascadePrices}
                onApplyAllSelected={handleApplyAll}
                disabled={showConfirmButton || executingCreateListing}
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