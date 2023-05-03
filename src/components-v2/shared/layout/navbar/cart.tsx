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
import {isBundle, round} from "@src/utils";
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
import {AnchorProps} from "react-bootstrap";
import ImageService from "@src/core/services/image";
import {specialImageTransform} from "@src/hacks";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const readMarket = new Contract(config.contracts.market, Market.abi, readProvider);

const Cart = function () {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const cart = useAppSelector((state) => state.cart);
  const [showMenu, setShowMenu] = useState(false);
  const [executingBuy, setExecutingBuy] = useState(false);
  const [soldItems, setSoldItems] = useState<string[]>([]);
  const [invalidItems, setInvalidItems] = useState<string[]>([]);
  const hoverBackground = useColorModeValue('gray.100', '#424242');
  const [buyGaslessListings, response] = useBuyGaslessListings();
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

  const calculateTotalPrice = () => {
    return cart.nfts.reduce((p, n) => {
      const price = parseInt(n.price);
      return p + (isNaN(price) ? 0 : price);
    }, 0);
  }

  const executeBuy = async () => {
    const listingIds = cart.nfts.map((o) => o.listingId);
    const totalPrice = calculateTotalPrice();
    const aux = await buyGaslessListings(listingIds, totalPrice);
    handleClose();
    handleClearCart();
  };

  const preparePurchase = async () => {
    if (user.address) {
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
        if (error.data) {
          toast.error(error.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('Unknown Error');
        }
      } finally {
        setExecutingBuy(false);
      }
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  }

  const NftLink = forwardRef<HTMLAnchorElement, AnchorProps & {name: string}>(({ onClick, href, name }, ref) => {
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

  const [totalPrice, setTotalPrice] = useState(0);
  const [serviceFees, setServiceFees] = useState(0);
  useEffect(() => {
    let fees = 0;
    const totalPrice = cart.nfts.reduce((total, nft) => {
      const numericPrice = parseInt(nft.price);
      let amt = numericPrice;

      const fee = numericPrice * (user.fee / 100);
      fees += fee;
      amt += fee;

      return total + amt;
    }, 0);
    setTotalPrice(totalPrice);
    setServiceFees(fees);
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
                            image={ImageService.translate('/img/logos/bundle.webp').avatar()}
                            title={nft.name}
                            usePlaceholder={false}
                            className="img-rounded-8"
                          />
                        ) : (
                          <MultimediaImage
                            source={ImageService.translate(specialImageTransform(nft.address, nft.image)).fixedWidth(100, 100)}
                            fallbackSource={ImageService.translate(nft.image).fixedWidth(100, 100)}
                            title={nft.name}
                            className="img-rounded-8"
                          />
                        )}
                      </Box>
                      <Box flex='1' ms={2}>
                        
                        <VStack align="left" spacing={0}>
                         {!nft.isBundle? (<Link href={`/collection/${nft.address}/${nft.id}`} passHref>
                            <NftLink name={nft.name} />
                          </Link>)
                          :
                          (
                            <Link href={`/collection/${nft.address}/${nft.id}`} passHref>
                              <NftLink name={nft.name} />
                            </Link>
                          )
                          }
                          {nft.rank && (
                            <Box>
                              <Badge variant='solid' colorScheme='blue'>
                                Rank: {nft.rank}
                              </Badge>
                            </Box>
                          )}
                          {nft.price && (
                            <Text>{commify(nft.price)} CRO</Text>
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
                    <Text>{commify(calculateTotalPrice())} CRO</Text>
                  </Box>
                </Flex>
              </Box>
              <Box fontSize="sm">
                <Flex>
                  <Box flex='1'>
                    <Text>Service Fees</Text>
                  </Box>
                  <Box>
                    <Text>{commify(serviceFees)} CRO</Text>
                  </Box>
                </Flex>
              </Box>
              <Box mb={4}>
                <Flex>
                  <Box flex='1'>
                    <Text fontWeight="bold">Total Price</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">{commify(round(totalPrice, 2))} CRO</Text>
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
