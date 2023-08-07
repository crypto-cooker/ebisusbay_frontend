import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {specialImageTransform} from "@src/hacks";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Badge, Form, Spinner} from "react-bootstrap";
import {Contract} from "ethers";
import Button from "@src/Components/components/common/Button";
import {getCollectionMetadata} from "@src/core/api";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {ERC721} from "@src/Contracts/Abis";
import {createSuccessfulTransactionToastContent, isBundle, isLandDeedsCollection, round} from "@src/utils";
import {appConfig} from "@src/Config";
import {useWindowSize} from "@src/hooks/useWindowSize";
import {collectionRoyaltyPercent} from "@src/core/chain";
import {
  Box,
  Button as ChakraButton,
  ButtonGroup,
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
  Stack,
  useNumberInput
} from "@chakra-ui/react";
import {getTheme} from "@src/Theme/theme";
import ImagesContainer from "@src/Components/Bundle/ImagesContainer";

import moment from 'moment';
import useUpsertGaslessListings from "@src/Components/Account/Settings/hooks/useUpsertGaslessListings";
import {parseErrorMessage} from "@src/helpers/validator";
import {useAppSelector} from "@src/Store/hooks";
import Select from "react-select";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";

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
  { label: 'CRO', symbol: 'cro', image: <CronosIconBlue boxSize={6}/> },
  { label: 'FRTN', symbol: 'frtn', image: <FortuneIcon boxSize={6}/> }
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
  const [allowedCurrencies, setAllowedCurrencies] = useState<string[]>(['cro']);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(currencyOptions.find((option) => option.symbol === allowedCurrencies[0]));

  const windowSize = useWindowSize();

  const user = useAppSelector((state) => state.user);
  const [upsertGaslessListings, responseUpsert] = useUpsertGaslessListings();

  const isBelowFloorPrice = (price: number) => {
    return (floorPrice !== 0 && ((floorPrice - Number(price)) / floorPrice) * 100 > floorThreshold);
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
    setSalePrice(newSalePrice);

    if (isBelowFloorPrice(perUnitPrice)) {
      setShowConfirmButton(false);
    }
  }, [executingCreateListing, showConfirmButton, floorPrice, setSalePrice, isBelowFloorPrice, perUnitPrice]);

  const getYouReceiveViewValue = () => {
    return round(totalPrice * (1 + (royalty / 100)));
  };

  useEffect(() => {
    async function asyncFunc() {
      await getInitialProps();
    }
    if (nft && user.provider) {
      asyncFunc();
    }
  }, [nft, user.provider]);

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

      if (isLandDeedsCollection(nftAddress)) {
        setAllowedCurrencies(['frtn']);
        setSelectedCurrency(currencyOptions.find((option) => option.symbol === 'frtn'));
      }

      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  };

  const handleApproval = async (e: ChangeEvent<HTMLButtonElement>) => {
    e.preventDefault();
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

  const handleCreateListing = async (e: ChangeEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateInput()) return;

    try {
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

  const processCreateListingRequest = async (e: ChangeEvent<HTMLButtonElement>) => {
    if (!validateInput()) return;

    if (isBelowFloorPrice(perUnitPrice)) {
      setShowConfirmButton(true);
    } else {
      await handleCreateListing(e)
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

  const userTheme = useAppSelector((state) => state.user.theme);
  const customStyles = {
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
          {listing || nft.listed ? 'Update' : 'Sell'} {nft.name}
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
                    <AnyMedia
                      image={specialImageTransform(nft.address ?? nft.nftAddress, nft.image)}
                      video={nft.video ?? nft.animation_url}
                      videoProps={{ height: 'auto', autoPlay: true }}
                      title={nft.name}
                      usePlaceholder={false}
                      className="img-fluid img-rounded"
                    />
                  )}
                </div>
                <div className="col-12 col-sm-6">
                  <Flex h="full" direction="column" justify="space-between">
                    <Box>
                      {nft.balance > 1 && (
                        <Form.Group className="mb-3">
                          <Form.Label className="formLabel">
                            Quantity (up to {nft.balance})
                          </Form.Label>
                          <HStack minW="150px">
                            <ChakraButton {...dec}>-</ChakraButton>
                            <Input {...input} />
                            <ChakraButton {...inc}>+</ChakraButton>
                          </HStack>
                          <Form.Text className="field-description textError">
                            {quantityError}
                          </Form.Text>
                        </Form.Group>
                      )}

                      <FormControl isInvalid={!!priceError}>
                        <FormLabel className='formLabel' me={0} mb={1}>
                          <Flex justify='space-between' alignItems='center'>
                            {nft.balance > 1 ? (
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
                            <Select
                              styles={customStyles}
                              options={currencyOptions.filter((option) => allowedCurrencies?.includes(option.symbol))}
                              formatOptionLabel={({ label, image }) => (
                                <HStack>
                                  {image}
                                  <span>{label}</span>
                                </HStack>
                              )}
                              value={selectedCurrency}
                              defaultValue={currencyOptions.find((option) => option.symbol === allowedCurrencies[0])}
                              onChange={handleCurrencyChange}
                              isDisabled={showConfirmButton || executingCreateListing}
                            />
                          </Stack>
                        </InputGroup>
                        <FormErrorMessage fontSize='xs' mt={1}>{priceError}</FormErrorMessage>
                      </FormControl>

                      <div className="d-flex flex-wrap justify-content-between mb-3">
                        {windowSize.width && windowSize.width > 377 && (
                          <Badge bg="danger" text="light" className="cursor-pointer my-1 d-sm-none d-md-block" onClick={() => onQuickCost(-0.25)}>
                            -25%
                          </Badge>
                        )}
                        <Badge bg="danger" text="light" className="cursor-pointer my-1" onClick={() => onQuickCost(-0.1)}>
                          -10%
                        </Badge>
                        <Badge
                          bg={user.theme === 'dark' ? 'light' : 'secondary'}
                          text={user.theme === 'dark' ? 'dark' : 'light'}
                          className="cursor-pointer my-1" onClick={() => onQuickCost(0)}
                        >
                          Floor
                        </Badge>
                        <Badge bg="success" text="light" className="cursor-pointer my-1" onClick={() => onQuickCost(0.1)}>
                          +10%
                        </Badge>

                        {windowSize.width && windowSize.width > 377 && (
                          <Badge bg="success" text="light" className="cursor-pointer my-1 d-sm-none d-md-block" onClick={() => onQuickCost(0.25)}>
                            +25%
                          </Badge>
                        )}
                      </div>

                      <Form.Group className="form-field mb-3">
                        <Form.Label className="formLabel w-100">
                          <div className="d-flex">
                            <div className="flex-grow-1">Expiration Date</div>
                          </div>
                        </Form.Label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {expirationDate.type === 'dropdown' ? (
                            <>
                              <Form.Select
                                defaultValue={2592000000}
                                onChange={handleExpirationDateChange}
                              >
                                {expirationDatesValues.map((time) => (
                                  <option value={time.value}>{time.label}</option>
                                ))}
                              </Form.Select>
                            </>
                          ) : (
                            <>
                              <Form.Control
                                className="input"
                                type="text"
                                value={moment(new Date(expirationDate.value)).format('DD/MM/YYYY HH:mm:ss a')}
                                disabled
                              />
                              <Button type='outlined' style={{ maxWidth: '38px', height: '40px' }} className="simple-button" onClick={() => { setExpirationDate({ value: new Date().getTime() + 2592000000, type: 'dropdown' }) }}>
                                <FontAwesomeIcon className='icon-fa' icon={faTimes} />
                              </Button>
                            </>
                          )}
                          <Form.Control
                            style={{
                              maxWidth: '38px',
                              visibility: expirationDate.type === 'dropdown' ? 'visible' : 'hidden',
                              position: expirationDate.type === 'dropdown' ? 'relative' : 'absolute'
                            }}
                            className="input"
                            type="datetime-local"
                            onChange={handleExpirationDateChange}
                          />

                        </div>
                      </Form.Group>
                    </Box>
                    <Box>
                      <Flex justify='space-between'>
                        <span>Total Listing Price: </span>
                        <span>{totalPrice} {selectedCurrency.label}</span>
                      </Flex>
                      <Flex justify='space-between'>
                        <span>Floor: </span>
                        <span>{floorPrice} CRO</span>
                      </Flex>
                      <Flex justify='space-between'>
                        <span>Royalty Fee: </span>
                        <span>{royalty} %</span>
                      </Flex>
                      <Flex justify='space-between' style={{marginBottom:0}}>
                        <span className='label'>You receive: </span>
                        <span>{getYouReceiveViewValue()} {selectedCurrency.label}</span>
                      </Flex>
                    </Box>
                  </Flex>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-0">
              <div className="w-100">
                {isTransferApproved ? (
                  <>
                    {showConfirmButton ? (
                      <>
                        <div className="alert alert-danger my-auto mb-2 fw-bold text-center">
                          The desired price is {(100 - ((salePrice ?? 0) * 100 / floorPrice)).toFixed(1)}% below the current floor price of {floorPrice} CRO. Are you sure?
                        </div>
                        {executingCreateListing && (
                          <div className="mb-2 text-center fst-italic">Please check your wallet for confirmation</div>
                        )}
                        <div className="d-flex">
                          <Button type="legacy"
                                  onClick={() => setShowConfirmButton(false)}
                                  disabled={executingCreateListing}
                                  className="me-2 flex-fill">
                            Go Back
                          </Button>
                          <Button type="legacy-outlined"
                                  onClick={handleCreateListing}
                                  isLoading={executingCreateListing}
                                  disabled={executingCreateListing}
                                  className="flex-fill">
                            I understand, continue
                          </Button>
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
                          <Button type="legacy"
                                  onClick={processCreateListingRequest}
                                  isLoading={executingCreateListing}
                                  disabled={executingCreateListing}
                                  className="flex-fill">
                            {listing || nft.listed? 'Update Listing' : 'Confirm Listing'}
                          </Button>
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
                      <Button type="legacy"
                              onClick={handleApproval}
                              isLoading={executingApproval}
                              disabled={executingApproval}
                              className="flex-fill">
                        Approve
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </ModalFooter>
          </>
        ) : (
          <EmptyData>
            <Spinner animation="border" role="status" size="sm" className="ms-1">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </EmptyData>
        )}
      </ModalContent>
    </Modal>
  );
}
