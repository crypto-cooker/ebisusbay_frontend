import React, {forwardRef, memo, useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShoppingBag, faTrash} from '@fortawesome/free-solid-svg-icons';
import {
  Badge,
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Spacer,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
  Wrap
} from "@chakra-ui/react";
import NextApiService from "@src/core/services/api-service/next";
import {acknowledgePrompt, clearCart, removeFromCart, syncCartStorage} from "@src/GlobalState/cartSlice";
import {commify} from "ethers/lib/utils";
import {Contract, ethers} from "ethers";
import {toast} from "react-toastify";
import {caseInsensitiveCompare, isBundle, knownErc20Token, round} from "@src/utils";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import Button from "@src/Components/components/common/Button";
import {listingState} from "@src/core/api/enums";
import {AnyMedia, MultimediaImage} from "@src/components-v2/shared/media/any-media";
import Link from "next/link";
import {LOCAL_STORAGE_ITEMS} from "@src/helpers/storage";
import useBuyGaslessListings from '@src/hooks/useBuyGaslessListings';
import Market from "@src/Contracts/Marketplace.json";
import {appConfig} from "@src/Config";
import {useAppSelector} from "@src/Store/hooks";
import ImageService from "@src/core/services/image";
import {specialImageTransform} from "@src/hacks";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";
import {getPrices} from "@src/core/api/endpoints/prices";
import {parseErrorMessage} from "@src/helpers/validator";
import {useUser} from "@src/components-v2/useUser";
import useAuthedFunction from "@src/hooks/useAuthedFunction";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const readMarket = new Contract(config.contracts.market, Market.abi, readProvider);

const Cart = function () {
  const dispatch = useDispatch();
  const user = useUser();
  const cart = useAppSelector((state) => state.cart);
  const [showMenu, setShowMenu] = useState(false);
  const [executingBuy, setExecutingBuy] = useState(false);
  const [soldItems, setSoldItems] = useState<string[]>([]);
  const [invalidItems, setInvalidItems] = useState<string[]>([]);
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [buyGaslessListings, response] = useBuyGaslessListings();
  const [runAuthedFunction] = useAuthedFunction();
  const slideDirection = useBreakpointValue<'bottom' | 'right'>(
    {
      base: 'bottom',
      md: 'right',
    },
    {
      fallback: 'md',
    },
  )

  useEffect(() => {
    if (cart.shouldPrompt) {
      setShowMenu(true);
      dispatch(acknowledgePrompt());
    }
  }, [cart]);

  useEffect(() => {
    validateItems();
  }, [cart]);

  const validateItems = () => {
    setInvalidItems([]);
    const invalid = [];
    for (let item of cart.nfts) {
      if (isNaN(parseInt(item.price))) {
        invalid.push(item.listingId);
      }
    }
    setInvalidItems(invalid);
  };

  const handleClose = () => {
    setShowMenu(false);
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  const handleRemoveItem = (nft: any) => {
    dispatch(removeFromCart(nft.listingId));
  };

  const openMenu = useCallback(async () => {
    setShowMenu(true);
  }, [showMenu]);

  const executeBuy = async () => {
    await buyGaslessListings(cart.nfts.map((nft) => ({
      listingId: nft.listingId,
      price: isNaN(nft.price) ? 0 : nft.price,
      currency: nft.currency ?? ethers.constants.AddressZero
    })));
    handleClose();
    handleClearCart();
  };


  const preparePurchase = async () => {
    await runAuthedFunction(async () => {
      try {
        setExecutingBuy(true);
        const listingIds = cart.nfts.map((o) => o.listingId);
        const listings = await NextApiService.getListingsByIds(listingIds);
        const validListings = listings.data
          .filter((o) => o.state === listingState.ACTIVE)
          .map((o) => o.listingId);

        if (validListings.length < cart.nfts.length) {
          const invalidItems = cart.nfts
            .filter((o) => o.listingId !== o)
            .map((o) => o.listingId);
          setSoldItems(invalidItems);
          return;
        }
        setSoldItems([]);

        await executeBuy();
      } catch (error: any) {
        console.log('ERROR:: ', error)
        toast.error(parseErrorMessage(error));
      } finally {
        setExecutingBuy(false);
      }
    });
  }

  const NftLink = forwardRef<HTMLAnchorElement, any & {name: string}>(({ onClick, href, name }, ref) => {
    const closeAndGo = (event: any) => {
      setShowMenu(false);
      if (!!onClick) {
        onClick(event);
      }
    };

    return (
      <a href={href} onClick={closeAndGo} ref={ref}>
        <Text fontWeight="bold" noOfLines={2}>{name}</Text>
      </a>
    )
  });

  useEffect(() => {
    const onReceiveMessage = (e: any) => {
      const { key } = e;
      if (key === LOCAL_STORAGE_ITEMS.cart) {
        dispatch(syncCartStorage());
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener("storage", onReceiveMessage);
      return () => {
        window.removeEventListener("storage", onReceiveMessage);
      };
    }
  }, []);

  const [totals, setTotals] = useState<any[]>([]);
  const [serviceFees, setServiceFees] = useState(0);
  useEffect(() => {
    async function func() {
      let fees = 0;
      const exchangeRates = await getPrices();

      const totals = cart.nfts.reduce((acc, nft) => {
        if (!nft.price) return acc;

        const currencyToken = knownErc20Token(nft.currency);

        const numericPrice = parseInt(nft.price);
        let amt = numericPrice;

        let fee =  numericPrice * (user.fee / 100);
        const erc20UsdRate = exchangeRates.find((rate) => caseInsensitiveCompare(rate.currency, nft.currency));
        if (!!erc20UsdRate && erc20UsdRate.currency !== ethers.constants.AddressZero) {
          const croUsdRate = exchangeRates.find((rate) => caseInsensitiveCompare(rate.currency, ethers.constants.AddressZero) && rate.chain === 25);
          fee = (numericPrice * Number(erc20UsdRate.usdPrice)) / Number(croUsdRate?.usdPrice) * (user.fee / 100);
        }
        fees += fee;
        amt += nft.currency === ethers.constants.AddressZero ? fee : 0;

        const existing = acc.find((o: any) => o.currency === (currencyToken?.address ?? ethers.constants.AddressZero));
        if (existing) {
          existing.subtotal += parseInt(nft.price);
          // existing.serviceFees += fee;
          existing.finalTotal += amt;
        } else {
          acc.push({
            currency: currencyToken ? currencyToken.address : ethers.constants.AddressZero,
            symbol: currencyToken ? currencyToken.symbol : 'CRO',
            subtotal: parseInt(nft.price),
            // serviceFees: fee,
            finalTotal: amt,
          })
        }
        return acc;
      }, []);

      setTotals(totals);
      setServiceFees(fees);
    }
    func();
  }, [cart.nfts, user.fee]);

  return (
    <div>
      <div className="de-menu-notification" onClick={openMenu}>
        {cart.nfts.length > 0 && (
          <div className="d-count">{cart.nfts.length > 9 ? '+' : cart.nfts.length}</div>
        )}
        <span>
          <FontAwesomeIcon icon={faShoppingBag} color={user.theme === 'dark' ? '#000' : '#000'} />
        </span>
      </div>
      <Drawer
        isOpen={showMenu}
        onClose={handleClose}
        size="sm"
        placement={slideDirection}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Your Cart</DrawerHeader>

          <DrawerBody>
            <Flex mb={2}>
              <Text fontWeight="bold">{cart.nfts.length} {cart.nfts.length === 1 ? 'Item' : 'Items'}</Text>
              <Spacer />
              <Text fontWeight="bold" onClick={handleClearCart} cursor="pointer">Clear all</Text>
            </Flex>
            {cart.nfts.length > 0 ? (
              <>
                {cart.nfts.map((nft, key) => (
                  <Box
                    key={nft.listingId}
                    _hover={{background: hoverBackground}}
                    p={2}
                    rounded="lg"
                  >
                    <Flex>
                      <Box
                        width={100}
                        height={100}
                        style={{borderRadius: '20px'}}
                      >
                        {isBundle(nft.address) ? (
                          <AnyMedia
                            image={ImageService.translate('/img/logos/bundle.webp').fixedWidth(100, 100)}
                            title={nft.name}
                            usePlaceholder={false}
                            className="img-rounded-8"
                          />
                        ) : (
                          <MultimediaImage
                            source={ImageService.translate(specialImageTransform(nft.address, nft.image)).fixedWidth(100, 100)}
                            fallbackSource={ImageService.bunnykit(ImageService.bunnykit(nft.image).thumbnail()).fixedWidth(100, 100)}
                            title={nft.name}
                            className="img-rounded-8"
                          />
                        )}
                      </Box>
                      <Box flex='1' ms={2}>
                        
                        <VStack align="left" spacing={0}>
                          {!nft.isBundle? (
                            <Link href={`/collection/${nft.address}/${nft.id}`} passHref>
                              <NftLink name={nft.name} />
                            </Link>
                          ) : (
                            <Link href={`/collection/${nft.address}/${nft.id}`} passHref>
                              <NftLink name={nft.name} />
                            </Link>
                          )}
                          {nft.amount && nft.amount > 1 && (
                            <Text fontSize='sm'>Pack of {nft.amount}</Text>
                          )}
                          {nft.rank && (
                            <Box>
                              <Badge variant='solid' colorScheme='blue'>
                                Rank: {nft.rank}
                              </Badge>
                            </Box>
                          )}
                          {nft.price && (
                            <HStack>
                              <DynamicCurrencyIcon address={nft.currency} boxSize={4} />
                              <Box>{commify(round(nft.price, 2))}</Box>
                            </HStack>
                          )}
                          <Wrap>
                            {soldItems.includes(nft.listingId) && (
                              <Box>
                                <Badge variant='outline' colorScheme='red'>
                                  Listing sold
                                </Badge>
                              </Box>
                            )}
                            {invalidItems.includes(nft.listingId) && (
                              <Box>
                                <Badge variant='outline' colorScheme='red'>
                                  Listing invalid
                                </Badge>
                              </Box>
                            )}
                          </Wrap>
                        </VStack>
                      </Box>
                      <Box ms={2} cursor="pointer" my="auto" onClick={() => handleRemoveItem(nft)}>
                        <FontAwesomeIcon icon={faTrash}/>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </>
            ) : (
              <Box py={8}>
                <Center>
                  <Text className="text-muted">Add items to get started</Text>
                </Center>
              </Box>
            )}
          </DrawerBody>

          <DrawerFooter>
            <Flex direction="column" w="100%">
              <Box mt={4} fontSize="sm">
                <Flex>
                  <Box flex='1'>
                    <Text>Subtotal</Text>
                  </Box>
                  <Box>
                    {totals.map((total) => (
                      <Text align='end'>{commify(total.subtotal)} {total.symbol}</Text>
                    ))}
                  </Box>
                </Flex>
              </Box>
              <Box fontSize="sm">
                <Flex>
                  <Box flex='1'>
                    <Text>Service Fees</Text>
                  </Box>
                  <Box>
                    <Text>{commify(round(serviceFees, 2))} CRO</Text>
                  </Box>
                </Flex>
              </Box>
              <Box mb={4}>
                <Flex>
                  <Box flex='1'>
                    <Text fontWeight="bold">Total Price</Text>
                  </Box>
                  <Box>
                    {totals.map((total) => (
                      <Text fontWeight="bold" align='end'>{commify(round(total.finalTotal, 2))} {total.symbol}</Text>
                    ))}
                  </Box>
                </Flex>
              </Box>
              <Button
                className="w-100"
                title="Refresh Metadata"
                onClick={preparePurchase}
                disabled={!(cart.nfts.length > 0) || executingBuy || invalidItems.length > 0 || soldItems.length > 0}
                isLoading={executingBuy}
              >
                Complete Purchase
              </Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default memo(Cart);
