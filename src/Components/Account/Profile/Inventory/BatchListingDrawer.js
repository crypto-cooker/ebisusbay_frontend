import {
  Alert, AlertDescription, AlertIcon,
  Box,
  Button as ChakraButton,
  Center,
  CloseButton,
  Collapse,
  Flex, FormControl, FormErrorMessage,
  Grid,
  GridItem,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import Button from "@src/Components/components/Button";
import {Spinner} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {ImageKitService} from "@src/helpers/image";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {
  applyPriceToAll,
  cascadePrices,
  clearBatchListingCart,
  removeFromBatchListingCart,
  setApproval,
  setExtras,
  updatePrice
} from "@src/GlobalState/batchListingSlice";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {Contract, ethers} from "ethers";
import {ERC721} from "@src/Contracts/Abis";
import {appConfig} from "@src/Config";
import {caseInsensitiveCompare, createSuccessfulTransactionToastContent} from "@src/utils";
import * as Sentry from "@sentry/react";
import {getCollectionMetadata} from "@src/core/api";
import {collectionRoyaltyPercent} from "@src/core/chain";

const config = appConfig();
const floorThreshold = 5;

export const BatchListingDrawer = ({onClose, ...gridProps}) => {
  const dispatch = useDispatch();
  const batchListingCart = useSelector((state) => state.batchListing);
  const user = useSelector((state) => state.user);
  const [executingCreateListing, setExecutingCreateListing] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const handleClose = () => {
    setShowConfirmButton(false);
    onClose();
  };
  const handleClearCart = () => {
    setShowConfirmButton(false);
    dispatch(clearBatchListingCart());
  };
  const handleCascadePrices = (startingItem, startingPrice) => {
    if (!startingPrice) return;

    dispatch(cascadePrices({startingItem, startingPrice}));
  }
  const handleApplyAll = (price) => {
    if (!price) return;

    dispatch(applyPriceToAll(price));
  }

  const executeCreateListing = async () => {
    try {
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

      Sentry.captureEvent({message: 'handleBatchListing', extra: {nftAddresses, nftIds, nftPrices}});
      let tx = await user.marketContract.makeListings(nftAddresses, nftIds, nftPrices);
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
        return {address: k, floorPrice: v.floorPrice}
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
      !batchListingCart.nfts.some((o) => !o.price || !parseInt(o.price) > 0);
  }

  return (
    <Grid templateRows="80px 1fr auto" {...gridProps}>
      <GridItem px={6} py={4}>
        <Flex align="center">
          <Text fontSize="xl" fontWeight="semibold">
            List for sale
          </Text>
          <Spacer />
          <CloseButton onClick={handleClose}/>
        </Flex>
      </GridItem>
      <GridItem px={6} py={4} overflowY="auto">
        <Flex mb={2}>
          <Text fontWeight="bold">{batchListingCart.nfts.length} {batchListingCart.nfts.length === 1 ? 'Item' : 'Items'}</Text>
          <Spacer />
          <Text fontWeight="bold" onClick={handleClearCart} cursor="pointer">Clear all</Text>
        </Flex>
        {batchListingCart.nfts.length > 0 ? (
          <>
            {batchListingCart.nfts.map((item, key) => (
              <BatchListingDrawerItem
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
        {showConfirmButton ? (
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
          <Button
            type="legacy"
            className="w-100"
            onClick={prepareListing}
            disabled={!canSubmit()}
          >
            {executingCreateListing ? (
              <>
                Creating {batchListingCart.nfts.length === 1 ? 'Listing' : 'Listings'}...
                <Spinner animation="border" role="status" size="sm" className="ms-1">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </>
            ) : (
              <>Create {batchListingCart.nfts.length === 1 ? 'Listing' : 'Listings'}</>
            )}
          </Button>
        )}
      </GridItem>
    </Grid>
  )
}

const numberRegexValidation = /^[1-9]+[0-9]*$/;
const BatchListingDrawerItem = ({item, onCascadePriceSelected, onApplyAllSelected, disabled}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [invalid, setInvalid] = useState(false);

  // Approvals
  const extras = useSelector((state) => state.batchListing.extras[item.nft.address.toLowerCase()] ?? {});
  const approvalStatus = extras.approval;
  const [executingApproval, setExecutingApproval] = useState(false);

  const handleRemoveItem = () => {
    dispatch(removeFromBatchListingCart(item.nft));
  };

  const handlePriceChange = useCallback((e) => {
    const newSalePrice = e.target.value;
    if (numberRegexValidation.test(newSalePrice) || newSalePrice === '') {
      setInvalid(false);
      dispatch(updatePrice({nft: item.nft, price: newSalePrice}));
    } else {
      setInvalid(true);
    }
  }, [dispatch, item.nft, price]);

  useEffect(() => {
    setPrice(item.price);
  }, [item.price]);

  const checkApproval = async () => {
    const contract = new Contract(item.nft.address, ERC721, user.provider.getSigner());
    return await contract.isApprovedForAll(user.address, config.contracts.market);
  };

  const approveContract = useCallback(async () => {
    try {
      setExecutingApproval(true);
      const contract = new Contract(item.nft.address, ERC721, user.provider.getSigner());
      const tx = await contract.setApprovalForAll(config.contracts.market, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      dispatch(setApproval({address: item.nft.address, status: true}));

    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
      console.log(error);
    } finally {
      setExecutingApproval(false);
    }
  }, [item.nft, user]);

  useEffect(() => {
    async function func() {
      if (!extras[item.nft.address.toLowerCase()]) {
        const extras = {address: item.nft.address};

        extras.approval = await checkApproval();

        const metadata = await getCollectionMetadata(item.nft.address);
        if (metadata.collections.length > 0) {
          extras.floorPrice = metadata.collections[0].floorPrice;
        }

        extras.royalty = await collectionRoyaltyPercent(item.nft.address, item.nft.id);

        dispatch(setExtras(extras));
      }
    }
    func();
  }, []);

  return (
    <Box
      key={`${item.nft.address}-${item.nft.id}`}
      _hover={{background: hoverBackground}}
      p={2}
      rounded="lg"
    >
      <Flex>
        <Box
          width={50}
          height={50}
          style={{borderRadius: '20px'}}
        >
          <AnyMedia
            image={ImageKitService.buildAvatarUrl(item.nft.image)}
            title={item.nft.name}
            usePlaceholder={false}
            className="img-rounded-8"
          />
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            <Link href={`/collection/${item.nft.address}/${item.nft.id}`}>
              <Text fontWeight="bold" noOfLines={1} cursor="pointer">{item.nft.name}</Text>
            </Link>
            <Skeleton isLoaded={typeof approvalStatus === 'boolean'}>
              {approvalStatus ? (
                <FormControl isInvalid={invalid}>
                  <Stack direction="row">
                    <Input
                      placeholder="Enter Price"
                      type="numeric"
                      size="xs"
                      value={price}
                      onChange={handlePriceChange}
                      disabled={disabled}
                    />
                    <ChakraButton
                      size='xs'
                      transition='all 0.2s'
                      borderRadius='md'
                      borderWidth='1px'
                      onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    >
                      {isDetailsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </ChakraButton>
                    <Menu>
                      <MenuButton
                        px={2}
                        transition='all 0.2s'
                        borderRadius='md'
                        borderWidth='1px'
                        height={6}
                      >
                        <FontAwesomeIcon icon={faEllipsisH}/>
                      </MenuButton>
                      <MenuList textAlign="right">
                        <MenuItem onClick={() => onApplyAllSelected(price)}>Apply price to all</MenuItem>
                        <MenuItem onClick={() => onCascadePriceSelected(item, price)}>Cascade price</MenuItem>
                        <MenuItem onClick={handleRemoveItem}>Remove</MenuItem>
                      </MenuList>
                    </Menu>
                  </Stack>
                  <FormErrorMessage fontSize='xs' mt={1}>Enter a valid number.</FormErrorMessage>
                </FormControl>
              ) : (
                <ChakraButton
                  size='xs'
                  colorScheme='blue'
                  onClick={approveContract}
                  isLoading={executingApproval}
                  loadingText="Approving..."
                >
                  Approve Contract
                </ChakraButton>
              )}
            </Skeleton>
            <Collapse in={isDetailsOpen} animateOpacity>
              <VStack spacing={0} mt={1}>
                {item.nft.rank && (
                  <Flex w="100%">
                    <Text>Rank</Text>
                    <Spacer/>
                    <Text fontWeight="bold">{item.nft.rank}</Text>
                  </Flex>
                )}
                <Flex w="100%">
                  <>
                    <Text>Floor</Text>
                    <Spacer/>
                    <Text fontWeight="bold">{extras.floorPrice ?? 0} CRO</Text>
                  </>
                </Flex>
                <Flex w="100%">
                  <>
                    <Text>Royalty</Text>
                    <Spacer/>
                    <Text fontWeight="bold">{extras.royalty ?? 'N/A'} %</Text>
                  </>
                </Flex>
              </VStack>
            </Collapse>
          </VStack>
        </Box>
        <Box ms={2} cursor="pointer" onClick={handleRemoveItem}>
          <FontAwesomeIcon icon={faTrash}/>
        </Box>
      </Flex>
    </Box>
  )
}