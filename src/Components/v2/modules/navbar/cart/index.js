import React, {forwardRef, memo, useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faShoppingBag, faSync, faTrash} from '@fortawesome/free-solid-svg-icons';
import {
  Badge,
  Box, Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay, Flex, Spacer, Text, useColorModeValue, VStack
} from "@chakra-ui/react";
import {getListingsByIds} from "@src/core/api/next/listings";
import {acknowledgePrompt, clearCart, removeFromCart, syncStorage} from "@src/GlobalState/cartSlice";
import {ImageKitService} from "@src/helpers/image";
import {commify} from "ethers/lib/utils";
import {ethers} from "ethers";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import Button from "@src/Components/components/common/Button";
import {listingState} from "@src/core/api/enums";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import Link from "next/link";
import {LOCAL_STORAGE_ITEMS} from "@src/helpers/storage";

const Cart = function () {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const [showMenu, setShowMenu] = useState(false);
  const [executingBuy, setExecutingBuy] = useState(false);
  const [invalidItems, setInvalidItems] = useState([]);
  const hoverBackground = useColorModeValue('gray.100', '#424242');

  useEffect(() => {
    if (cart.shouldPrompt) {
      setShowMenu(true);
      dispatch(acknowledgePrompt());
    }
  }, [cart]);

  const handleClose = () => {
    setShowMenu(false);
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  const handleRemoveItem = (nft) => {
    dispatch(removeFromCart(nft.listingId));
  };

  const openMenu = useCallback(async () => {
    setShowMenu(true);
  }, [showMenu]);

  const calculateTotalPrice = () => {
    return cart.nfts.reduce((p, n) => p + parseInt(n.price), 0);
  }

  const executeBuy = async () => {
    const listingIds = cart.nfts.map((o) => o.listingId);
    const totalPrice = calculateTotalPrice();
    let price = ethers.utils.parseUnits(totalPrice.toString());
    let tx = await user.marketContract.makePurchases(listingIds, {
      value: price,
    });
    let receipt = await tx.wait();
    toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
    handleClose();
    handleClearCart();
  };

  const preparePurchase = async () => {
    if (user.address) {
      try {
        setExecutingBuy(true);
        const listingIds = cart.nfts.map((o) => o.listingId);
        const listings = await getListingsByIds(listingIds);
        const validListings = listings.data.listings
          .filter((o) => o.state === listingState.ACTIVE)
          .map((o) => o.listingId);

        if (validListings.length < cart.nfts.length) {
          const invalidItems = cart.nfts
            .filter((o) => o.listingId !== o)
            .map((o) => o.listingId);
          setInvalidItems(invalidItems);
          return;
        }
        setInvalidItems([]);

        await executeBuy();
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

  const NftLink = forwardRef(({ onClick, href, name }, ref) => {
    const closeAndGo = (e) => {
      setShowMenu(false);
      onClick(e);
    };

    return (
      <a href={href} onClick={closeAndGo} ref={ref}>
        <Text fontWeight="bold" noOfLines={2}>{name}</Text>
      </a>
    )
  })

  useEffect(() => {
    const onReceiveMessage = (e) => {
      const { key } = e;
      if (key === LOCAL_STORAGE_ITEMS.cart) {
        dispatch(syncStorage());
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener("storage", onReceiveMessage);
      return () => {
        window.removeEventListener("storage", onReceiveMessage);
      };
    }
  }, []);

  return (
    <div>
      <div className="de-menu-notification" onClick={openMenu}>
        {cart.nfts.length > 0 && (
          <div className="d-count">{cart.nfts.length > 99 ? '+' : cart.nfts.length}</div>
        )}
        <span>
          <FontAwesomeIcon icon={faShoppingBag} color={user.theme === 'dark' ? '#000' : '#000'} />
        </span>
      </div>
      <Drawer
        isOpen={showMenu}
        onClose={handleClose}
        size="sm"
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
                        <AnyMedia
                          image={ImageKitService.buildFixedWidthUrl(nft.image, 100, 100)}
                          title={nft.name}
                          usePlaceholder={false}
                          className="img-rounded-8"
                        />
                      </Box>
                      <Box flex='1' ms={2}>
                        <VStack align="left" spacing={0}>
                          <Link href={`/collection/${nft.address}/${nft.id}`} passHref>
                            <NftLink name={nft.name} />
                          </Link>
                          {nft.rank && (
                            <Box>
                              <Badge variant='solid' colorScheme='blue'>
                                Rank: {nft.rank}
                              </Badge>
                            </Box>
                          )}
                          <Text>{commify(nft.price)} CRO</Text>
                          {invalidItems.includes(nft.listingId) && (
                            <Badge variant='outline' colorScheme='red'>
                              Listing has been sold
                            </Badge>
                          )}
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
              <Box my={4}>
                <Flex>
                  <Box flex='1'>
                    <Text fontWeight="bold">Total Price</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">{commify(calculateTotalPrice())} CRO</Text>
                  </Box>
                </Flex>
              </Box>
              <Button
                className="w-100"
                title="Refresh Metadata"
                onClick={preparePurchase}
                disabled={!cart.nfts.length > 0 || executingBuy}
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
