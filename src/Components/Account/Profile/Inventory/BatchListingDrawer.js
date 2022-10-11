import {
  Badge,
  Box,
  Button as ChakraButton,
  Center,
  CloseButton, Collapse,
  Flex, Grid, GridItem, Input, Menu, MenuButton, MenuItem, MenuList,
  Skeleton,
  Spacer, Stack,
  Text,
  useColorModeValue,
  VStack, Wrap
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
  closeBatchListingCart,
  removeFromBatchListingCart, setApproval, updatePrice
} from "@src/GlobalState/batchListingSlice";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {Contract, ethers} from "ethers";
import {ERC721} from "@src/Contracts/Abis";
import {appConfig} from "@src/Config";
import {caseInsensitiveCompare, createSuccessfulTransactionToastContent} from "@src/utils";
import * as Sentry from "@sentry/react";
import {txExtras} from "@src/core/constants";

const config = appConfig();

export const BatchListingDrawer = ({onClose}) => {
  const dispatch = useDispatch();
  const batchListingCart = useSelector((state) => state.batchListing);
  const user = useSelector((state) => state.user);
  const [executingListing, setExecutingListing] = useState(false);

  const handleClose = () => {
    dispatch(closeBatchListingCart());
  };
  const handleClearCart = () => {
    dispatch(clearBatchListingCart());
  };
  const handleCascadePrices = (startingPrice) => {
    dispatch(cascadePrices(startingPrice));
  }
  const handleApplyAll = (price) => {
    dispatch(applyPriceToAll(price));
  }

  const executeListing = async () => {
    const nftAddresses = batchListingCart.nfts.map((o) => o.nft.address);
    const nftIds = batchListingCart.nfts.map((o) => o.nft.id);
    const nftPrices = batchListingCart.nfts.map((o) => ethers.utils.parseEther(o.price));

    Sentry.captureEvent({message: 'handleBatchListing', extra: {nftAddresses, nftIds, nftPrices}});
    let tx = await user.marketContract.makeListings(nftAddresses, nftIds, nftPrices, txExtras);
    let receipt = await tx.wait();
    toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
  }

  const prepareListing = async () => {
    try {
      setExecutingListing(true);
      await executeListing();
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error('Unknown Error');
      }
    } finally {
      setExecutingListing(false);
    }
  }

  return (
    <Grid position="fixed" w="358px" h="calc(100vh - 74px)" templateRows="80px 1fr 69px">
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
            onClick={prepareListing}
            disabled={executingListing || batchListingCart.nfts.length < 1 || Object.values(batchListingCart.approvals).some((o) => !o)}
          >
            {executingListing ? (
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
      </GridItem>
    </Grid>
  )
}

const numberRegexValidation = /^[1-9]+[0-9]*$/;
const BatchListingDrawerItem = ({item, onCascadePriceSelected, onApplyAllSelected}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [price, setPrice] = useState('');

  // Approvals
  const { approvals } = useSelector((state) => state.batchListing);
  const approvalStatus = Object.entries(approvals).find(([key, value]) => caseInsensitiveCompare(key, item.nft.address))?.[1];
  const [executingApproval, setExecutingApproval] = useState(false);

  const handleRemoveItem = () => {
    dispatch(removeFromBatchListingCart(item.nft));
  };

  const handlePriceChange = useCallback((e) => {
    const newSalePrice = e.target.value;
    if (numberRegexValidation.test(newSalePrice) || newSalePrice === '') {
      dispatch(updatePrice({nft: item.nft, price: newSalePrice}));
    }
  }, [dispatch, item.nft, price]);

  useEffect(() => {
    setPrice(item.price);
  }, [item.price]);

  const checkApproval = async () => {
    const contract = new Contract(item.nft.address, ERC721, user.provider.getSigner());
    const transferEnabled = await contract.isApprovedForAll(user.address, config.contracts.market);
    return transferEnabled;
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
      if (!Object.keys(approvals).includes(item.nft.address.toLowerCase())) {
        const isApproved = await checkApproval();
        dispatch(setApproval({address: item.nft.address, status: isApproved}));
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
            image={ImageKitService.buildFixedWidthUrl(item.nft.image, 50, 50)}
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
              <Stack direction="row">
                {approvalStatus ? (
                  <>
                    <Input
                      placeholder="Enter Price"
                      type="numeric"
                      size="xs"
                      value={price}
                      onChange={handlePriceChange}
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
                      >
                        <FontAwesomeIcon icon={faEllipsisH}/>
                      </MenuButton>
                      <MenuList textAlign="right">
                        <MenuItem onClick={() => onApplyAllSelected(price)}>Apply price to all</MenuItem>
                        <MenuItem onClick={() => onCascadePriceSelected(price)}>Cascade price</MenuItem>
                        <MenuItem onClick={handleRemoveItem}>Remove</MenuItem>
                      </MenuList>
                    </Menu>
                  </>
                ) : (

                  <ChakraButton
                    size='xs'
                    colorScheme='blue'
                    onClick={approveContract}
                    disabled={executingApproval}
                  >
                    {executingApproval ? (
                      <>
                        Approving...
                        <Spinner animation="border" role="status" size="sm" className="ms-1">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </>
                    ) : (
                      <>Approve Contract</>
                    )}

                  </ChakraButton>
                )}
              </Stack>
            </Skeleton>
            <Collapse in={isDetailsOpen} animateOpacity>
              <Wrap>
                {item.nft.rank && (
                  <Box>
                    <Badge variant='solid' colorScheme='blue'>
                      Rank: {item.nft.rank}
                    </Badge>
                  </Box>
                )}
              </Wrap>
            </Collapse>
          </VStack>
        </Box>
        <Box ms={2} cursor="pointer" my="auto" onClick={handleRemoveItem}>
          <FontAwesomeIcon icon={faTrash}/>
        </Box>
      </Flex>
    </Box>
  )
}