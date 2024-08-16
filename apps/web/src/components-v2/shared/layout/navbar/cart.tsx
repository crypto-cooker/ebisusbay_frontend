import React, {forwardRef, memo, useCallback, useEffect, useState} from 'react';
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
import {commify} from "ethers/lib/utils";
import {ethers} from "ethers";
import {toast} from "react-toastify";
import {ciEquals, isBundle, knownErc20Token, round} from "@market/helpers/utils";
import Button from "@src/Components/components/common/Button";
import {listingState} from "@src/core/api/enums";
import {AnyMedia, MultimediaImage} from "@src/components-v2/shared/media/any-media";
import Link from "next/link";
import useBuyGaslessListings from '@market/hooks/useBuyGaslessListings';
import ImageService from "@src/core/services/image";
import {specialImageTransform} from "@market/helpers/hacks";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";
import {getPrices} from "@src/core/api/endpoints/prices";
import {parseErrorMessage} from "@src/helpers/validator";
import {useUser} from "@src/components-v2/useUser";
import useAuthedFunctionWithChainID from '@market/hooks/useAuthedFunctionWithChainID';
import useCart from "@market/hooks/use-cart";
import {SupportedChainId} from "@src/config/chains";
import {chains, isChainSupported} from "@src/wagmi";
import {ChainLogo} from "@dex/components/logo";
import {Tab, Tabs} from "@src/components-v2/foundation/tabs";
import {Chain} from "wagmi/chains";
import {CartItem} from "@market/state/jotai/atoms/cart";

const Cart = function () {
  const user = useUser();
  const cart = useCart();
  const [executingBuy, setExecutingBuy] = useState(false);
  const [soldItems, setSoldItems] = useState<string[]>([]);
  const [invalidItems, setInvalidItems] = useState<string[]>([]);
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [buyGaslessListings, response] = useBuyGaslessListings();

  const handleTabsChange = (index: number) => {
    setSelectedChain(cartChains[index]);
  }

  const [runAuthedFunction] = useAuthedFunctionWithChainID();

  const mappedItemsByChain = cart.items.reduce<Record<SupportedChainId, typeof cart.items>>((acc, nft) => {
    if (nft.chain && isChainSupported(nft.chain)) {
      const id = nft.chain as SupportedChainId;
      if (!acc[id]) {
        acc[id] = [];
      }
      acc[id].push(nft);
    }
    return acc;
  }, {} as Record<SupportedChainId, typeof cart.items>);

  const cartChains = chains.filter((chain) => !!mappedItemsByChain[chain.id as SupportedChainId]);
  const [selectedChain, setSelectedChain] = useState<Chain>()

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
    validateItems();
  }, [cart.items]);

  const validateItems = () => {
    setInvalidItems([]);
    const invalid = [];
    for (let item of cart.items) {
      if (isNaN(parseInt(item.price.toString()))) {
        invalid.push(item.listingId);
      }
    }
    setInvalidItems(invalid);
  };

  const handleClose = () => {
    cart.closeCart();
  };
  const handleClearCart = (newItems?: CartItem[]) => {
    cart.clearCart(newItems)
  };
  const handleRemoveItem = (nft: any) => {
    cart.removeItem(nft.listingId);
    setSoldItems(soldItems.filter((listingId) => listingId !== nft.listingId))
  };

  const openMenu = useCallback(async () => {
   cart.openCart();
  }, [cart]);

  const executeBuy = async (listings: any) => {
    await buyGaslessListings(listings);
    if (listings.length >= cart.items.length) {
      handleClose();
    }
    handleClearCart(cart.items.filter((item) => !listings.some((nft) => nft.listingId === item.listingId)));
  };

  const preparePurchase = async () => {
    if (!selectedChain) return;

    if(cart.items.length === 0) return;

    await runAuthedFunction(async () => {
      try {
        setExecutingBuy(true);
        const chainListingIds = cart.items.filter((item) => item.chain === selectedChain.id);
        const listingIds = chainListingIds.map((item) => item.listingId);
        const listings = await NextApiService.getListingsByIds(listingIds);
        const validListings = listings.data
          .filter((o) => o.state === listingState.ACTIVE)
          .map((o) => o.listingId);

        if (validListings.length < chainListingIds.length) {
          const invalidItems = chainListingIds
            .filter((o) => !validListings.includes(o.listingId))
            .map((o) => o.listingId);
          setSoldItems(invalidItems);
          return;
        }
        setSoldItems([]);

        await executeBuy(chainListingIds.map((nft) => ({
          listingId: nft.listingId,
          price: parseInt(nft.price.toString()),
          currency: nft.currency ?? ethers.constants.AddressZero,
          chainId: nft.chain
        })));
      } catch (error: any) {
        console.log('ERROR:: ', error)
        toast.error(parseErrorMessage(error));
      } finally {
        setExecutingBuy(false);
      }
    }, selectedChain.id);
  }

  const NftLink = forwardRef<HTMLAnchorElement, any & {name: string}>(({ onClick, href, name }, ref) => {
    const closeAndGo = (event: any) => {
      cart.closeCart();
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

  const [totals, setTotals] = useState<any[]>([]);
  const [serviceFees, setServiceFees] = useState(0);
  useEffect(() => {
    async function func() {
      if (!selectedChain) return;

      let fees = 0;
      const exchangeRates = await getPrices();

      const totals = cart.items
        .filter((item) => item.chain === selectedChain.id)
        .reduce((acc, nft) => {
        if (!nft.price) return acc;

        const currencyToken = knownErc20Token(nft.currency);

        const numericPrice = parseInt(nft.price.toString());
        let amt = numericPrice;

        let fee =  numericPrice * (user.fee / 100);
        const erc20UsdRate = exchangeRates.find((rate) => ciEquals(rate.currency, nft.currency));
        if (!!erc20UsdRate && erc20UsdRate.currency !== ethers.constants.AddressZero) {
          const croUsdRate = exchangeRates.find((rate) => ciEquals(rate.currency, ethers.constants.AddressZero) && rate.chain === selectedChain.id);
          const newFee = (numericPrice * Number(erc20UsdRate.usdPrice)) / Number(croUsdRate?.usdPrice) * (user.fee / 100);

          if (croUsdRate && !isNaN(newFee)) {
            fee = newFee;
          }
        }
        fees += fee;
        amt += nft.currency === ethers.constants.AddressZero ? fee : 0;

        const existing = acc.find((o: any) => o.currency === (currencyToken?.address ?? ethers.constants.AddressZero));
        if (existing) {
          existing.subtotal += parseInt(nft.price.toString());
          // existing.serviceFees += fee;
          existing.finalTotal += amt;
        } else {
          acc.push({
            currency: currencyToken ? currencyToken.address : ethers.constants.AddressZero,
            symbol: currencyToken ? currencyToken.symbol : 'CRO',
            subtotal: parseInt(nft.price.toString()),
            // serviceFees: fee,
            finalTotal: amt,
          })
        }
        return acc;
      }, [] as Array<{currency: string, symbol: string, subtotal: number, finalTotal: number}>);

      setTotals(totals);
      setServiceFees(fees);
    }
    func();
  }, [cart.items, user.fee, selectedChain]);

  useEffect(() => {
    if (!selectedChain && Object.values(mappedItemsByChain).length > 0) {
      setSelectedChain(cartChains[0]);
    }
  }, [mappedItemsByChain]);

  return (
    <div>
      <div className="de-menu-notification" onClick={openMenu}>
        {cart.items && cart.items.length > 0 && (
          <div className="d-count">{cart.items.length > 9 ? '+' : cart.items.length}</div>
        )}
        <span>
          <FontAwesomeIcon icon={faShoppingBag} color={user.theme === 'dark' ? '#000' : '#000'} />
        </span>
      </div>
      <Drawer
        isOpen={cart.isOpen}
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
              <Text fontWeight="bold">{cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}</Text>
              <Spacer />
              <Text fontWeight="bold" onClick={() => handleClearCart()} cursor="pointer">Clear all</Text>
            </Flex>
            {cart.items.length > 0 ? (
              <Tabs defaultIndex={0} onChange={handleTabsChange}>
                {Object.entries(mappedItemsByChain).map(([chainId, items]) => (
                  <Tab key={chainId} label={cartChains.find((chain) => chain.id.toString() === chainId)?.name ?? 'Cronos'}>
                    {items.map((nft, key) => (
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
                                <Link href={`/collection/${nft.address}/${nft.id}`} passHref legacyBehavior>
                                  <NftLink name={nft.name} />
                                </Link>
                              ) : (
                                <Link href={`/collection/${nft.address}/${nft.id}`} passHref legacyBehavior>
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
                  </Tab>
                ))}
              </Tabs>
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
                    {totals.map((total, i) => (
                      <Text key={i} align='end'>{commify(total.subtotal)} {total.symbol}</Text>
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
                    {totals.map((total, i) => (
                      <Text key={i} fontWeight="bold" align='end'>{commify(round(total.finalTotal, 2))} {total.symbol}</Text>
                    ))}
                  </Box>
                </Flex>
              </Box>

              <Button
                className="w-100"
                title="Refresh Metadata"
                onClick={preparePurchase}
                disabled={!(cart.items.length > 0) || executingBuy || invalidItems.length > 0 || soldItems.length > 0}
                isLoading={executingBuy}
              >
                <HStack>
                  {!!selectedChain && <ChainLogo chainId={selectedChain.id} />}
                  <Box>Complete Checkout</Box>
                </HStack>
              </Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default memo(Cart);
