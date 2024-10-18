import {
  Badge,
  Box,
  Button as ChakraButton,
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
  updateCurrency,
  updateExpiration,
  updatePrice,
  updatePriceType,
  UserBatchExtras,
  UserBatchItem
} from "@market/state/redux/slices/user-batch";
import {Contract, ethers} from "ethers";
import {ERC721} from "@src/global/contracts/Abis";
import {toast} from "react-toastify";
import {ciEquals, createSuccessfulTransactionToastContent, isBundle, isCollectionListable, isKoban, round} from "@market/helpers/utils";
import {getCollectionMetadata} from "@src/core/api";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH, faTrash} from "@fortawesome/free-solid-svg-icons";
import {appConfig} from "@src/config";
import {MultimediaImage} from "@src/components-v2/shared/media/any-media";
import {specialImageTransform} from "@market/helpers/hacks";
import {useAppDispatch, useAppSelector} from "@market/state/redux/store/hooks";
import ImageService from "@src/core/services/image";
import {useUser} from "@src/components-v2/useUser";
import useCurrencyBroker from "@market/hooks/use-currency-broker";

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
  onApplyAllSelected: (price: number, currencySymbol: string, expirationDate: number) => void;
  onAddCollection: (address: string, unlistedOnly: boolean) => void;
  disabled: boolean;
  isBundling?: boolean;
}

export const ListingDrawerItem = ({ item, onCascadePriceSelected, onApplyAllSelected, onAddCollection, disabled, isBundling = false }: ListingDrawerItemProps) => {
  const dispatch = useAppDispatch();
  const user = useUser();
  const {getByCollection:  currenciesByCollection} = useCurrencyBroker();
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form values
  const [price, setPrice] = useState('');
  const [expirationDate, setExpirationDate] = useState(defaultExpiry.toString());
  const [invalid, setInvalid] = useState<string | boolean>(false);
  const [quantity, setQuantity] = useState('1');
  const [currency, setCurrency] = useState('cro');
  const [priceType, setPriceType] = useState<'each' | 'total'>('each');

  // Derived values
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [perUnitPrice, setPerUnitPrice] = useState<number>(0);

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

  const handleCurrencyChange = useCallback((e: any) => {
    const value = e.target.value;
    if (!!value && (!extras.availableCurrencies || extras.availableCurrencies.some((c) => ciEquals(c.symbol, value)))) {
      setInvalid(false);
      setCurrency(value);
      dispatch(updateCurrency({ nft: item.nft, currency: value }));
    } else {
      setInvalid('currency');
    }
  }, [dispatch, item.nft, currency, extras]);

  const handlePriceTypeChange = useCallback((newPriceType: 'total' | 'each') => {
    dispatch(updatePriceType({ nft: item.nft, priceType: newPriceType }));
  }, [dispatch, item.nft, priceType]);

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

  useEffect(() => {
    if (item.currency) {
      setCurrency(item.currency);
    }
  }, [item.currency]);

  useEffect(() => {
    setPriceType(item.priceType);
  }, [item.priceType]);

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
  }, [item.nft, user.address]);

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

        newExtras.royalty = await collectionRoyaltyPercent(item.nft.nftAddress, item.nft.nftId, item.nft.chain);
        newExtras.canList = isCollectionListable(item.nft.collection) && !item.nft.isStaked && (!isBundling || !isKoban(item.nft.nftAddress, item.nft.nftId));
        newExtras.availableCurrencies = currenciesByCollection(item.nft.nftAddress);

        setCurrency(newExtras.availableCurrencies[0].symbol);
        dispatch(setExtras(newExtras));
      } finally {
        setInitializing(false);
      }
    }
    func();
  }, [isBundling]);

  useEffect(() => {
    const safePrice = Number(price ?? 0);
    const safeQuantity = quantity ? Number(quantity) : 1;
    if (priceType === 'each') {
      setTotalPrice(safePrice * safeQuantity);
      setPerUnitPrice(safePrice);
    } else {
      setTotalPrice(safePrice);
      setPerUnitPrice(safePrice / safeQuantity);
    }
  }, [price, quantity, priceType]);

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
                          {item.nft.balance && item.nft.balance > 1 && (
                            <Box fontSize='xs'>
                              <Box>Qty</Box>
                              <NumberInput
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
                          )}
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
                        Price {item.nft.balance && item.nft.balance > 1 && <>({priceType})</>}
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
                          {!!extras.availableCurrencies ? (
                            <Select
                              value={currency}
                              size='xs'
                              isDisabled={extras.availableCurrencies.length < 2}
                              onChange={handleCurrencyChange}
                            >
                              {extras.availableCurrencies?.map((c: any) => (
                                <option key={c} value={c.symbol}>{c.name}</option>
                              ))}
                            </Select>
                          ) : (
                            <Select value='cro' size='xs'>
                              <option key='cro' value='cro'>CRO</option>
                            </Select>
                          )}
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
          </VStack>
        </Box>
        <Flex direction='column' ms={2} fontSize='sm'>
          <Box ms={2} cursor="pointer" onClick={handleRemoveItem}>
            <FontAwesomeIcon icon={faTrash} />
          </Box>
          <Spacer />
          <Menu>
            <MenuButton
              transition='all 0.2s'
              borderRadius='md'
              borderWidth='1px'
              height={6}
              w='28px'
            >
              <FontAwesomeIcon icon={faEllipsisH} />
            </MenuButton>
            <MenuList textAlign="right">
              <MenuItem onClick={() => onApplyAllSelected(Number(price), currency, Number(expirationDate))}>Apply values to all</MenuItem>
              <MenuItem onClick={() => onCascadePriceSelected(item, Number(price))}>Cascade price</MenuItem>
              <MenuItem onClick={() => onAddCollection(item.nft.nftAddress, false)}>Add entire collection</MenuItem>
              <MenuItem onClick={() => onAddCollection(item.nft.nftAddress, true)}>Add entire collection (unlisted only)</MenuItem>
              {item.nft.balance && item.nft.balance > 1 && (
                <MenuItem onClick={() => handlePriceTypeChange(priceType === 'each' ? 'total' : 'each')}>Toggle price type</MenuItem>
              )}
              <MenuItem onClick={handleRemoveItem}>Remove</MenuItem>
            </MenuList>
          </Menu>
          <ChakraButton
            size='xs'
            transition='all 0.2s'
            borderRadius='md'
            borderWidth='1px'
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            mt={1}
            w='28px'
          >
            {isDetailsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </ChakraButton>
        </Flex>
      </Flex>

      <Collapse in={isDetailsOpen} animateOpacity>
        <VStack spacing={0} mt={1} fontSize='sm'>
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
              <Text fontWeight="bold">{round(extras.floorPrice ?? 0)} CRO</Text>
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
    </Box>
  )
}