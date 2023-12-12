import React, {useCallback, useEffect, useState} from 'react';
import {specialImageTransform} from "@src/hacks";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {Contract, ethers} from "ethers";
import {getCollectionMetadata} from "@src/core/api";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {ERC721} from "@src/Contracts/Abis";
import {ciEquals, createSuccessfulTransactionToastContent, isBundle, round, usdFormat} from "@src/utils";
import {appConfig} from "@src/Config";
import {useWindowSize} from "@src/hooks/useWindowSize";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {
  Box,
  Button as ChakraButton,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Tag,
  Text,
  useNumberInput
} from "@chakra-ui/react";
import {getTheme} from "@src/Theme/theme";
import ImagesContainer from "@src/Components/Bundle/ImagesContainer";
import useUpsertGaslessListings from "@src/Components/Account/Settings/hooks/useUpsertGaslessListings";
import {parseErrorMessage} from "@src/helpers/validator";
import {useExchangeRate, useTokenExchangeRate} from "@src/hooks/useGlobalPrices";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";
import ReactSelect from "react-select";
import {DynamicNftImage} from "@src/components-v2/shared/media/dynamic-nft-image";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();
const numberRegexValidation = /^[1-9]+[0-9]*$/;
const floorThreshold = 5;
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
]

const currencyOptions = [
  {
    name: 'CRO',
    symbol: 'cro',
    image: <DynamicCurrencyIcon address={ethers.constants.AddressZero} boxSize={6} />
  },
  ...config.listings.currencies.available
    .filter((symbol: string) => !!config.tokens[symbol.toLowerCase()])
    .map((symbol: string) => {
      const token = config.tokens[symbol.toLowerCase()];
      return {
        ...token,
        image: <DynamicCurrencyIcon address={token.address} boxSize={6} />
      }
    }),
];

interface MakeGaslessListingDialogProps {
  isOpen: boolean;
  nft: any;
  onClose: () => void;
  listing?: any;
}

export default function MakeGaslessListingDialog({ isOpen, nft, onClose, listing }: MakeGaslessListingDialogProps) {

  // Input states
  const [salePrice, setSalePrice] = useState<number>();
  const [expirationDate, setExpirationDate] = useState({ type: 'dropdown', value: new Date().getTime() + 2592000000 });
  const [priceError, setPriceError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState<string>('1');
  const [priceType, setPriceType] = useState<'each' | 'total'>('each');

  // Derived values
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [perUnitPrice, setPerUnitPrice] = useState<number>(0);
  const [floorPrice, setFloorPrice] = useState(0);
  const [royalty, setRoyalty] = useState(0);

  const [isTransferApproved, setIsTransferApproved] = useState(false);
  const [executingApproval, setExecutingApproval] = useState(false);
  const [executingCreateListing, setExecutingCreateListing] = useState(false);

  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [allowedCurrencies, setAllowedCurrencies] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<any>();

  const windowSize = useWindowSize();

  const user = useUser();
  const [upsertGaslessListings, responseUpsert] = useUpsertGaslessListings();
  const { tokenToUsdValue, tokenToCroValue, croToTokenValue } = useTokenExchangeRate(selectedCurrency?.address);
  const { usdValueForToken, croValueForToken } = useExchangeRate();

  const isBelowFloorPrice = (price: number) => {
    const croPrice = tokenToCroValue(price);
    return (floorPrice !== 0 && ((floorPrice - croPrice) / floorPrice) * 100 > floorThreshold);
  };

  const costOnChange = useCallback((e: any) => {
    const newSalePrice = e.target.value.toString();
    if (numberRegexValidation.test(newSalePrice) || newSalePrice === '') {
      setSalePrice(Number(newSalePrice))
    }
  }, [setSalePrice, floorPrice, salePrice]);

  const handleExpirationDateChange = useCallback((e: any) => {

    if (!e.target.value.includes('T')) {
      setExpirationDate({ type: 'dropdown', value: new Date().getTime() + parseInt(e.target.value) });
    }
    else {
      setExpirationDate({ type: 'select', value: new Date(e.target.value).getTime() });
    }

  }, [setExpirationDate])

  const onQuickCost = useCallback((percentage: number) => {
    if (executingCreateListing || showConfirmButton) return;

    const newSalePrice = Math.round(floorPrice * (1 + percentage));
    setSalePrice(round(croToTokenValue(newSalePrice)));

    if (isBelowFloorPrice(perUnitPrice)) {
      setShowConfirmButton(false);
    }
  }, [executingCreateListing, showConfirmButton, floorPrice, setSalePrice, isBelowFloorPrice, perUnitPrice]);

  const getYouReceiveViewValue = () => {
    return round(totalPrice * (1 - (royalty / 100)));
  };

  useEffect(() => {
    async function asyncFunc() {
      await getInitialProps();
    }
    if (nft && user.wallet.address) {
      asyncFunc();
    }
  }, [nft, user.wallet.address]);

  const getInitialProps = async () => {
    try {
      setIsLoading(true);
      setPriceError(null);
      const nftAddress = nft.address ?? nft.nftAddress;
      const nftId = nft.id ?? nft.nftId;
      const marketContractAddress = config.contracts.market;
      setSalePrice(listing ? Math.round(listing.price) : undefined)

      const collectionInfo = await getCollectionMetadata(nftAddress);
      if (collectionInfo.collections.length > 0) {
        const stats = collectionInfo.collections[0].stats;
        let floor = stats.total.floorPrice;
        setFloorPrice(floor ? round(floor) : 0);
      }

      const royalties = await collectionRoyaltyPercent(nftAddress, nftId);
      setRoyalty(royalties);

      const contract = new Contract(nftAddress, ERC721, user.provider.getSigner());
      const transferEnabled = await contract.isApprovedForAll(user.address, marketContractAddress);

      if (transferEnabled) {
        setIsTransferApproved(true);
      } else {
        setIsTransferApproved(false);
      }


      type CurrencyEntry = {
        [key: string]: string[];
      }

      const availableCurrencySymbols: CurrencyEntry | undefined = Object.entries(config.listings.currencies.nft)
        .find(([key]) => ciEquals(key, nftAddress)) as CurrencyEntry | undefined;

      const allowed = currencyOptions.filter(({symbol}: { symbol: string }) => {
        if (availableCurrencySymbols) {
          return availableCurrencySymbols[1].includes(symbol.toLowerCase());
        } else {
          return config.listings.currencies.global.includes(symbol.toLowerCase())
        }
      });
      setAllowedCurrencies(allowed);
      setSelectedCurrency(allowed[0]);

      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  };

  const handleApproval = async () => {
    try {
      const nftAddress = nft.address ?? nft.nftAddress;
      const marketContractAddress = config.contracts.market;
      const contract = new Contract(nftAddress, ERC721, user.provider.getSigner());
      setExecutingApproval(true);

      const tx = await contract.setApprovalForAll(marketContractAddress, true);
      let receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      setIsTransferApproved(true);

    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setExecutingApproval(false);
    }
  };

  const handleCreateListing = async () => {
    if (!validateInput()) return;

    try {
      setShowConfirmButton(false);
      const nftAddress = nft.address ?? nft.nftAddress;
      const nftId = nft.id ?? nft.nftId;
      setExecutingCreateListing(true);

      const res = await upsertGaslessListings({
        collectionAddress: nftAddress,
        tokenId: nftId,
        price: totalPrice,
        amount: Number(quantity),
        expirationDate: expirationDate.value,
        is1155: nft.multiToken,
        currencySymbol: selectedCurrency.symbol,
        listingId: listing?.listingId,
      });
      toast.success("Listing Successful");

      setExecutingCreateListing(false);
      onClose();
    } catch (error: any) {
      toast.error(parseErrorMessage(error));
    } finally {
      setExecutingCreateListing(false);
    }
  };

  const processCreateListingRequest = async () => {
    if (!validateInput()) return;

    if (isBelowFloorPrice(perUnitPrice)) {
      setShowConfirmButton(true);
    } else {
      await handleCreateListing()
    }
  }

  const validateInput = () => {
    if (nft.balance > 1 && (Number(quantity) < 1 || Number(quantity) > nft.balance)) {
      setQuantityError('Quantity out of range');
      return false;
    }

    if (!salePrice || salePrice < 1) {
      setPriceError('Value must be greater than zero');
      return false;
    }
    if (salePrice.toString().length > 18) {
      setPriceError('Value must not exceed 18 digits');
      return false;
    }

    setQuantityError(null);
    setPriceError(null);
    return true;
  }

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: nft.balance,
      precision: 0,
      onChange(valueAsString, valueAsNumber) {
        setQuantity(valueAsString);
      }
    })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  const userTheme = user.theme;
  const customStyles = {
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    option: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      borderRadius: state.isFocused ? '0' : 0,
      '&:hover': {
        background: '#eee',
        color: '#000',
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
    }),
    singleValue: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3
    }),
    control: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      padding: 1,
      minWidth: '132px',
      borderColor: 'none'
    }),
  };

  const handleCurrencyChange = useCallback((currency: { symbol: string }) => {
    setSelectedCurrency(currency);
  }, [selectedCurrency]);

  useEffect(() => {
    const safeSalePrice = Number(salePrice ?? 0);
    const safeQuantity = quantity ? Number(quantity) : 1;
    if (priceType === 'each') {
      setTotalPrice(safeSalePrice * safeQuantity);
      setPerUnitPrice(safeSalePrice);
    } else {
      setTotalPrice(safeSalePrice);
      setPerUnitPrice(safeSalePrice / safeQuantity);
    }
  }, [salePrice, quantity, priceType]);

  if (!nft) return <></>;

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          {(listing || nft.listed) && !nft.multiToken ? 'Update' : 'Sell'} {nft.name}
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
        {!isLoading ? (
          <>
            <ModalBody>
              <div className="nftSaleForm row gx-3">
                <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                  {isBundle(nft.address ?? nft.nftAddress) ? (
                    <ImagesContainer nft={nft} />
                  ) : (
                    <DynamicNftImage nft={nft} address={nft.address ?? nft.nftAddress} id={nft.id ?? nft.nftId}>
                      <AnyMedia
                        image={specialImageTransform(nft.address ?? nft.nftAddress, nft.image)}
                        video={nft.video ?? nft.animation_url}
                        videoProps={{ height: 'auto', autoPlay: true }}
                        title={nft.name}
                        usePlaceholder={false}
                        className="img-fluid img-rounded"
                      />
                    </DynamicNftImage>
                  )}
                </div>
                <div className="col-12 col-sm-6">
                  <Flex h="full" direction="column" justify="space-between">
                    <Box>
                      {(nft.balance > 1 || (listing && nft.multiToken)) && (
                        <FormControl className="mb-3" isInvalid={!!quantityError}>
                          <FormLabel className="formLabel">
                            Quantity (up to {nft.balance})
                          </FormLabel>
                          <HStack minW="150px">
                            <ChakraButton {...dec}>-</ChakraButton>
                            <Input {...input} />
                            <ChakraButton {...inc}>+</ChakraButton>
                          </HStack>
                          <FormErrorMessage className="field-description textError">
                            {quantityError}
                          </FormErrorMessage>
                        </FormControl>
                      )}

                      <FormControl isInvalid={!!priceError}>
                        <FormLabel className='formLabel' me={0} mb={1}>
                          <Flex justify='space-between' alignItems='center'>
                            {(nft.balance > 1 || (listing && nft.multiToken)) ? (
                              <>
                                <Box>
                                  Listing Price ({priceType})
                                </Box>
                                <ButtonGroup size='xs' isAttached variant='outline'>
                                  <ChakraButton
                                    isActive={priceType === 'each'}
                                    onClick={() => setPriceType('each')}
                                    _active={{
                                      bg: getTheme(userTheme).colors.textColor4,
                                      color: 'light'
                                    }}
                                  >
                                    Each
                                  </ChakraButton>
                                  <ChakraButton
                                    isActive={priceType === 'total'}
                                    onClick={() => setPriceType('total')}
                                    _active={{
                                      bg: getTheme(userTheme).colors.textColor4,
                                      color: 'light'
                                    }}
                                  >
                                    Total
                                  </ChakraButton>
                                </ButtonGroup>
                              </>
                            ) : (
                              <Box>Listing Price</Box>
                            )}
                          </Flex>
                        </FormLabel>
                        <InputGroup>
                          <Stack direction='row' w='full'>
                            <Input
                              placeholder="Enter Amount"
                              type="numeric"
                              value={salePrice}
                              onChange={costOnChange}
                              disabled={showConfirmButton || executingCreateListing}
                            />
                            <ReactSelect
                              isSearchable={false}
                              menuPortalTarget={document.body} menuPosition={'fixed'}
                              styles={customStyles}
                              options={allowedCurrencies}
                              formatOptionLabel={({ name, image }) => (
                                <HStack>
                                  {image}
                                  <span>{name}</span>
                                </HStack>
                              )}
                              value={selectedCurrency}
                              defaultValue={allowedCurrencies[0]}
                              onChange={handleCurrencyChange}
                              isDisabled={showConfirmButton || executingCreateListing}
                            />
                          </Stack>
                        </InputGroup>
                        <FormErrorMessage fontSize='xs' mt={1}>{priceError}</FormErrorMessage>
                      </FormControl>
                      <Box fontSize='sm' fontWeight='bold' className='text-muted'>
                        {selectedCurrency.symbol !== 'cro' && (
                          <Text as='span'>{round(tokenToCroValue(salePrice ?? 0), 2)} CRO / </Text>
                        )}
                        <Text as='span'>{usdFormat(tokenToUsdValue(salePrice ?? 0))} USD</Text>
                      </Box>
                      <Flex justify='space-between' mb={3}>
                        {windowSize.width && windowSize.width > 377 && (
                          <Tag size='sm' colorScheme='red' variant='solid' cursor='pointer' onClick={() => onQuickCost(-0.25)}>
                            -25%
                          </Tag>
                        )}
                        <Tag size='sm' colorScheme='red' variant='solid' cursor='pointer' onClick={() => onQuickCost(-0.1)}>
                          -10%
                        </Tag>
                        <Tag size='sm' colorScheme='gray' variant='solid' cursor='pointer' onClick={() => onQuickCost(0)}>
                          Floor
                        </Tag>
                        <Tag size='sm' colorScheme='green' variant='solid' cursor='pointer' onClick={() => onQuickCost(0.1)}>
                          +10%
                        </Tag>
                        {windowSize.width && windowSize.width > 377 && (
                          <Tag size='sm' colorScheme='green' variant='solid' cursor='pointer' onClick={() => onQuickCost(0.25)}>
                            +25%
                          </Tag>
                        )}
                      </Flex>

                      <FormControl
                        maxW='188px'
                        className="form-field mb-3"
                      >
                        <FormLabel w='full' className="formLabel">Expiration Date</FormLabel>
                        <Box style={{ display: 'flex', gap: '8px' }}>
                          <Select
                            defaultValue={2592000000}
                            onChange={handleExpirationDateChange}
                          >
                            {expirationDatesValues.map((time) => (
                              <option value={time.value}>{time.label}</option>
                            ))}
                          </Select>
                        </Box>
                      </FormControl>
                    </Box>
                    <Box>
                      <Flex justify='space-between'>
                        <Box as='span'>Total Listing Price: </Box>
                        <Box as='span'>
                          <Box fontWeight='bold'>{totalPrice} {selectedCurrency.name}</Box>
                        </Box>
                      </Flex>
                      <Flex justify='end' style={{marginBottom:0}}>
                        <Box fontSize='sm' className='text-muted'>
                          {selectedCurrency.symbol !== 'cro' && (
                            <Text as='span' fontSize='sm' className='text-muted'>{round(tokenToCroValue(totalPrice))} CRO / </Text>
                          )}
                          <Text as='span' fontSize='sm' className='text-muted'>{usdFormat(tokenToUsdValue(totalPrice))} USD</Text>
                        </Box>
                      </Flex>
                      <Flex justify='space-between'>
                        <Box as='span'>Floor: </Box>
                        <Box as='span'>
                          <Box fontWeight='bold'>{floorPrice} CRO</Box>
                        </Box>
                      </Flex>
                      <Flex justify='end' style={{marginBottom:0}}>
                        <Box fontSize='sm' className='text-muted'>
                          {selectedCurrency.symbol !== 'cro' && (
                            <Text as='span' fontSize='sm' className='text-muted'>{round(croValueForToken(floorPrice, selectedCurrency?.address))} {selectedCurrency?.name} / </Text>
                          )}
                          <Text as='span' fontSize='sm' className='text-muted'>{usdFormat(usdValueForToken(floorPrice))} USD</Text>
                        </Box>
                      </Flex>
                      <Flex justify='space-between'>
                        <Box as='span'>Royalty Fee: </Box>
                        <Box as='span'>{royalty} %</Box>
                      </Flex>
                      <Flex justify='space-between' style={{marginBottom:0}}>
                        <Box as='span' className='label' fontWeight='bold'>You receive: </Box>
                        <Box as='span'>
                          <Box fontWeight='bold'>{getYouReceiveViewValue()} {selectedCurrency.name}</Box>
                        </Box>
                      </Flex>
                      <Flex justify='end' style={{marginBottom:0}}>
                        <Box fontSize='sm' className='text-muted'>
                          {selectedCurrency.symbol !== 'cro' && (
                            <Text as='span' fontWeight='bold' fontSize='sm' className='text-muted'>{round(tokenToCroValue(getYouReceiveViewValue()))} CRO / </Text>
                          )}
                          <Text as='span' fontWeight='bold' fontSize='sm' className='text-muted'>{usdFormat(tokenToUsdValue(getYouReceiveViewValue()))} USD</Text>
                        </Box>
                      </Flex>
                    </Box>
                  </Flex>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-0">
              <Box w='full'>
                {isTransferApproved ? (
                  <>
                    {showConfirmButton ? (
                      <>
                        <div className="alert alert-danger my-auto mb-2 fw-bold text-center">
                          The desired price is {(100 - ((tokenToCroValue(salePrice ?? 0)) * 100 / floorPrice)).toFixed(1)}% below the current floor price of {floorPrice} CRO. Are you sure?
                        </div>
                        {executingCreateListing && (
                          <div className="mb-2 text-center fst-italic">Please check your wallet for confirmation</div>
                        )}
                        <div className="d-flex">
                          <PrimaryButton
                            onClick={() => setShowConfirmButton(false)}
                            className="me-2 flex-fill"
                          >
                            Go Back
                          </PrimaryButton>
                          <SecondaryButton
                            onClick={handleCreateListing}
                            className="flex-fill"
                          >
                            I understand, continue
                          </SecondaryButton>
                        </div>
                      </>
                    ) : (
                      <>
                        {executingCreateListing && (
                          <div className="mb-2 text-center fst-italic">
                            <small>Please check your wallet for confirmation</small>
                          </div>
                        )}
                        <div className="d-flex">
                          <PrimaryButton
                            onClick={processCreateListingRequest}
                            isLoading={executingCreateListing}
                            isDisabled={executingCreateListing}
                            loadingText='Confirming'
                            className="flex-fill"
                          >
                            {(listing || nft.listed) && !nft.multiToken ? 'Update Listing' : 'Confirm Listing'}
                          </PrimaryButton>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-2 text-center fst-italic">
                      <small>Ebisu's Bay needs approval to transfer this NFT on your behalf once sold</small>
                    </div>
                    <div className="d-flex justify-content-end">
                      <PrimaryButton
                        onClick={handleApproval}
                        isLoading={executingApproval}
                        isDisabled={executingApproval}
                        loadingText='Approving'
                        className="flex-fill"
                      >
                        Approve
                      </PrimaryButton>
                    </div>
                  </>
                )}
              </Box>
            </ModalFooter>
          </>
        ) : (
          <EmptyData>
            <Center>
              <Spinner />
            </Center>
          </EmptyData>
        )}
      </ModalContent>
    </Modal>
  );
}
