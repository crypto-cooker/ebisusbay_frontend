import {useDispatch} from "react-redux";
import {
  Badge,
  Box,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import React, {useCallback, useEffect, useState} from "react";
import {
  removeFromBatchListingCart,
  setApproval,
  setExtras,
  update1155Quantity,
  updateExpiration,
  updatePrice,
  UserBatchExtras,
  UserBatchItem
} from "@src/GlobalState/user-batch";
import {Contract} from "ethers";
import {ERC721} from "@src/Contracts/Abis";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent, isBundle} from "@src/utils";
import {getCollectionMetadata} from "@src/core/api";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {Button as ChakraButton} from "@chakra-ui/button";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH, faTrash} from "@fortawesome/free-solid-svg-icons";
import {appConfig} from "@src/Config";
import {MultimediaImage} from "@src/components-v2/shared/media/any-media";
import {specialImageTransform} from "@src/hacks";
import {useAppSelector} from "@src/Store/hooks";
import ImageService from "@src/core/services/image";

const config = appConfig();
const numberRegexValidation = /^[1-9]+[0-9]*$/;
const expirationDatesValues = [
  {
    value: 3600000,
    label: '1 hour'
  },
  {
    value: 10800000,
    label: '3 hours'
  },
  {
    value: 21600000,
    label: '6 hours'
  },
  {
    value: 86400000,
    label: '1 day'
  },
  {
    value: 259200000,
    label: '3 days'
  },
  {
    value: 604800000,
    label: '1 week'
  },
  {
    value: 1296000000,
    label: '2 weeks'
  },
  {
    value: 2592000000,
    label: '1 month'
  },
  {
    value: 7776000000,
    label: '3 month'
  },
  {
    value: 15552000000,
    label: '6 months'
  },
];

const defaultExpiry = 2592000000;

interface ListingDrawerItemProps {
  item: UserBatchItem;
  onCascadePriceSelected: (startingItem: UserBatchItem, startingPrice: number) => void;
  onApplyAllSelected: (price: number, expirationDate: number) => void;
  onAddCollection: (address: string) => void;
  disabled: boolean;
  isBundling?: boolean;
}

export const ListingDrawerItem = ({ item, onCascadePriceSelected, onApplyAllSelected, onAddCollection, disabled, isBundling = false }: ListingDrawerItemProps) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form values
  const [price, setPrice] = useState('');
  const [expirationDate, setExpirationDate] = useState(defaultExpiry.toString());
  const [invalid, setInvalid] = useState<string | boolean>(false);
  const [quantity, setQuantity] = useState('1');

  // Approvals
  const extras = useAppSelector((state) => state.batchListing.extras[item.nft.nftAddress.toLowerCase()] ?? {});
  const { approval: approvalStatus, canList } = extras;
  const [executingApproval, setExecutingApproval] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const handleRemoveItem = () => {
    dispatch(removeFromBatchListingCart(item.nft));
  };

  const handleQuantityChange = useCallback((newQuantity: string) => {
    if (!numberRegexValidation.test(newQuantity)) {
      setInvalid('quantity');
      return;
    } else if (item.nft.balance && Number(newQuantity) > Number(item.nft.balance)) {
      setInvalid('quantity');
      return;
    }
    setInvalid(false);
    dispatch(update1155Quantity({ nft: item.nft, quantity: newQuantity }));
  }, [dispatch, item.nft, quantity]);

  const handlePriceChange = useCallback((e: any) => {
    const newSalePrice = e.target.value;
    if (numberRegexValidation.test(newSalePrice) || newSalePrice === '') {
      setInvalid(false);
      dispatch(updatePrice({ nft: item.nft, price: newSalePrice }));
    } else {
      setInvalid('price');
    }
  }, [dispatch, item.nft, price]);

  const handleExpirationDateChange = useCallback((e: any) => {
    const expirationLength = parseInt(e.target.value);
    if (isNaN(expirationLength) || Number(expirationLength) < 1) {
      setInvalid('expiration');
    }

    setInvalid(false);
    setExpirationDate(e.target.value);
    dispatch(updateExpiration({ nft: item.nft, expiration: expirationLength }));
  }, [dispatch, item.nft, expirationDate]);

  useEffect(() => {
    setPrice(item.price?.toString() ?? '');
  }, [item.price]);

  useEffect(() => {
    if (item.expiration) {
      setExpirationDate(item.expiration?.toString());
    }
  }, [item.expiration]);

  useEffect(() => {
    setQuantity(item.quantity?.toString() ?? '');
  }, [item.quantity]);

  const checkApproval = async () => {
    const contract = new Contract(item.nft.nftAddress, ERC721, user.provider.getSigner());
    return await contract.isApprovedForAll(user.address, config.contracts.market);
  };

  const approveContract = useCallback(async () => {
    try {
      setExecutingApproval(true);
      const contract = new Contract(item.nft.nftAddress, ERC721, user.provider.getSigner());
      const tx = await contract.setApprovalForAll(config.contracts.market, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      dispatch(setApproval({ address: item.nft.nftAddress, status: true }));

    } catch (error: any) {
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
      try {
        setInitializing(true);
        const newExtras: UserBatchExtras = { address: item.nft.nftAddress, approval: false };

        newExtras.approval = await checkApproval();

        const metadata = await getCollectionMetadata(item.nft.nftAddress);
        if (metadata.collections.length > 0) {
          newExtras.floorPrice = metadata.collections[0].stats.total.floorPrice;
        }

        newExtras.royalty = await collectionRoyaltyPercent(item.nft.nftAddress, item.nft.nftId);
        newExtras.canList = item.nft.listable && !item.nft.isStaked;

        dispatch(setExtras(newExtras));
      } finally {
        setInitializing(false);
      }
    }
    func();
  }, []);

  return (
    <Box
      _hover={{ background: hoverBackground }}
      p={2}
      rounded="lg"
    >
      <Flex>
        <Box
          width={50}
          height={50}
          style={{ borderRadius: '20px' }}
        > 
        {isBundle(item.nft.nftAddress) ? (
          <Image
            src={ImageService.translate('/img/logos/bundle.webp').avatar()}
            alt={item.nft.name}
            rounded="md"
          />
        ) : (
          <MultimediaImage
            source={ImageService.translate(specialImageTransform(item.nft.nftAddress, item.nft.image)).fixedWidth(100, 100)}
            fallbackSource={ImageService.translate(ImageService.translate(item.nft.image).thumbnail()).fixedWidth(100, 100)}
            title={item.nft.name}
            className="img-fluid img-rounded-5"
          />
        )}
        </Box>
        <Box flex='1' ms={2} fontSize="14px">
          <VStack align="left" spacing={0}>
            {/*<Link href={`/collection/${item.nft.nftAddress}/${item.nft.nftId}`}>*/}
              <Text fontWeight="bold" noOfLines={1} cursor="pointer">{item.nft.name}</Text>
            {/*</Link>*/}
            <Skeleton isLoaded={!initializing}>
              {approvalStatus ? (
                <>
                  {isBundling && isBundle(item.nft.nftAddress) ? (
                    <Box>
                      <Badge variant='outline' colorScheme='red'>
                        Can't Nest Bundles
                      </Badge>
                    </Box>
                  ) : (!canList) ? (
                    <Box>
                      <Badge variant='outline' colorScheme='red'>
                        Not Listable
                      </Badge>
                    </Box>
                  ) : !isBundling && (
                    <>
                      <FormControl isInvalid={invalid === 'expiration'} mt={1}>
                        <Stack direction="row" mt={1}>
                          <Box fontSize='xs'>
                            <Box>Qty</Box>
                            <NumberInput
                              placeholder="Qty"
                              size="xs"
                              value={quantity}
                              min={1}
                              max={item.nft.balance ?? 1}
                              step={1}
                              maxW='100px'
                              onChange={(valueString) => handleQuantityChange(valueString)}

                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Box>
                          <Box fontSize='xs' w='full'>
                            <Box>Expiry</Box>
                            <Select
                              placeholder='Select expiration'
                              size="xs"
                              bg="transparent !important"
                              onChange={handleExpirationDateChange}
                              disabled={disabled}
                              defaultValue={defaultExpiry.toString()}
                              value={expirationDate}
                            >
                              {expirationDatesValues.map((time) => (
                                <option key={time.value.toString()} value={time.value.toString()}>{time.label}</option>
                              ))}
                            </Select>
                          </Box>
                        </Stack>
                        <FormErrorMessage fontSize='xs' mt={1}>Select a valid expiration.</FormErrorMessage>
                      </FormControl>
                      <Box fontSize='xs' mt={1}>
                        Price (each)
                      </Box>
                      <FormControl isInvalid={invalid === 'price'}>
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
                              <FontAwesomeIcon icon={faEllipsisH} />
                            </MenuButton>
                            <MenuList textAlign="right">
                              <MenuItem onClick={() => onApplyAllSelected(Number(price), Number(expirationDate))}>Apply values to all</MenuItem>
                              <MenuItem onClick={() => onCascadePriceSelected(item, Number(price))}>Cascade price</MenuItem>
                              <MenuItem onClick={() => onAddCollection(item.nft.nftAddress)}>Add entire collection</MenuItem>
                              <MenuItem onClick={handleRemoveItem}>Remove</MenuItem>
                            </MenuList>
                          </Menu>
                        </Stack>
                        <FormErrorMessage fontSize='xs' mt={1}>Enter a valid number.</FormErrorMessage>
                      </FormControl>
                    </>
                  )}
                </>
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
                    <Spacer />
                    <Text fontWeight="bold">{item.nft.rank}</Text>
                  </Flex>
                )}
                <Flex w="100%">
                  <>
                    <Text>Floor</Text>
                    <Spacer />
                    <Text fontWeight="bold">{extras.floorPrice ?? 0} CRO</Text>
                  </>
                </Flex>
                <Flex w="100%">
                  <>
                    <Text>Royalty</Text>
                    <Spacer />
                    <Text fontWeight="bold">{extras.royalty ?? 'N/A'} %</Text>
                  </>
                </Flex>
              </VStack>
            </Collapse>
          </VStack>
        </Box>
        <Box ms={2} cursor="pointer" onClick={handleRemoveItem}>
          <FontAwesomeIcon icon={faTrash} />
        </Box>
      </Flex>
    </Box>
  )
}