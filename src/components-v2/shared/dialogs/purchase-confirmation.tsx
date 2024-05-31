import React, {useEffect, useMemo, useState} from 'react';
import {specialImageTransform} from "@market/helpers/hacks";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {Contract, ContractReceipt, ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {
  caseInsensitiveCompare, ciEquals,
  isBundle,
  isEbVipCollection,
  isErc20Token,
  isGaslessListing,
  knownErc20Token,
  round
} from '@market/helpers/utils';
import {getTheme} from "@src/global/theme/theme";
import {
  Box,
  Button as ChakraButton,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  VStack
} from "@chakra-ui/react";
import {commify} from "ethers/lib/utils";
import ImagesContainer from "@src/Components/Bundle/ImagesContainer";
import {useQuery} from "@tanstack/react-query";
import NextApiService from "@src/core/services/api-service/next";
import useBuyGaslessListings from "@market/hooks/useBuyGaslessListings";
import DotIcon from "@src/Components/components/DotIcon";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {appConfig} from "@src/Config";
import PurchaseSuccessDialog from './purchase-success';
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";
import {parseErrorMessage} from "@src/helpers/validator";
import {getPrices} from "@src/core/api/endpoints/prices";
import {DynamicNftImage} from "@src/components-v2/shared/media/dynamic-nft-image";
import Link from "next/link";
import {useContractService, useUser} from "@src/components-v2/useUser";
import * as Sentry from "@sentry/nextjs";
import {Transak, TransakConfig} from "@transak/transak-sdk";
import Pusher from "pusher-js";
import {Listing} from "@src/core/models/listing";
import {getServerSignature} from "@src/core/cms/endpoints/gaslessListing";
import {shipABI} from "@src/global/contracts/types";
import { is1155 } from '@market/helpers/chain';

let pusher = new Pusher("1d9ffac87de599c61283", { cluster: "ap2" });

export const DEFAULT_SLIPPAGE = 0.5;

export const ESTIMATED_GAS_FEE_OFFSET = 0.0001;

const config = appConfig();

type PurchaseConfirmationDialogProps = {
  onClose: () => void;
  isOpen: boolean;
  listingId: string;
};

export default function PurchaseConfirmationDialog({ onClose, isOpen, listingId}: PurchaseConfirmationDialogProps) {
  const [executingPurchase, setExecutingPurchase] = useState(false);
  const [buyGaslessListings, response] = useBuyGaslessListings();

  const user = useUser();

  const [isComplete, setIsComplete] = useState(false);
  const [tx, setTx] = useState<ContractReceipt>();
  const [finalCostValues, setFinalCostValues] = useState<[{ value: string, currency: string }, { value: string }]>();

  const getInitialProps = async () => {
    const listingsResponse = await NextApiService.getListingsByIds(listingId);
    const listing = listingsResponse.data[0];

    return listing;
  };

  const { error, data: listing, status } = useQuery({
    queryKey: ['PurchaseDialog', listingId],
    queryFn: getInitialProps,
    refetchOnWindowFocus: false
  });

  const token = knownErc20Token(listing?.currency);

  const handleBuyCro = () => {
    const url = new URL(config.vendors.transak.url);
    if (user.address) {
      url.searchParams.append('cryptoCurrencyCode', 'CRO');
      url.searchParams.append('walletAddress', user.address);
    }

    window.open(url, '_blank');
  }

  const handleBuyErc20 = (address: string) => {
    if (token?.symbol === 'TTT') {
      const url = new URL('https://app.cronaswap.org/swap');
      if (user.address) {
        url.searchParams.append('outputCurrency', address);
        url.searchParams.append('inputCurrency', '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59');
      }
      window.open(url, '_blank');
    } else {
      const url = new URL('https://swap.ebisusbay.com/#/swap');
      if (user.address) {
        url.searchParams.append('outputCurrency', address);
        url.searchParams.append('inputCurrency', '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59');
      }
      window.open(url, '_blank');
    }
  }

  const handleExecutePurchase = async () => {
    try {
      setExecutingPurchase(true);
      await buyGaslessListings([{
        listingId: listing.listingId,
        price: parseInt(listing.price),
        currency: listing.currency
      }]);
      setIsComplete(true);
    } catch (error: any) {
      Sentry.captureException(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setExecutingPurchase(false);
    }
  };

  useEffect(() => {
    if (response?.tx) {
      setTx(response.tx);
    }
  }, [response]);

  useEffect(() => {
    async function func() {
      const exchangeRates = await getPrices();
      const numericPrice = parseInt(listing.price);
      let amt = numericPrice;

      let fee =  numericPrice * (user.fee / 100);
      const erc20UsdRate = exchangeRates.find((rate) => ciEquals(rate.currency, listing.currency));
      if (!!erc20UsdRate && erc20UsdRate.currency !== ethers.constants.AddressZero) {
        const croUsdRate = exchangeRates.find((rate) => ciEquals(rate.currency, ethers.constants.AddressZero) && rate.chain.toString() === config.chain.id.toString());
        fee = (numericPrice * Number(erc20UsdRate.usdPrice)) / Number(croUsdRate?.usdPrice) * (user.fee / 100);
      }
      amt += listing.currency === ethers.constants.AddressZero ? fee : 0;

      setFinalCostValues([
        {
          value: ethers.utils.commify(amt),
          currency: listing.currency,
        },
        {
          value: ethers.utils.commify(round(fee, 2))
        }
      ]);
    }

    if (listing) {
      func();
    }
  }, [listing]);

  const [hasAcceptedVipCondition, setHasAcceptedVipCondition] = useState(false);

  return isComplete ? (
    <PurchaseSuccessDialog onClose={onClose} isOpen={isOpen} listing={listing} tx={tx} />
  ) : (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered trapFocus={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          Buy {listing?.nft?.name}
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme)!.colors.textColor4} />
        {status === 'pending' ? (
          <EmptyData>
            <Spinner />
          </EmptyData>
        ) : status === "error" ? (
          <VStack spacing={0} mb={2}>
            <Text>Unable to load listing information</Text>
            <Text fontSize="xs">Error: {error?.toString()}</Text>
          </VStack>
        ) : !hasAcceptedVipCondition && isEbVipCollection(listing.nft.address ?? listing.nft.nftAddress, listing.nft.id ?? listing.nft.nftId) ? (
          <>
            <ModalBody>
              <Text>The Legacy Ebisu's Bay VIP has recently migrated to the Ryoshi Tales VIP. As a result, this NFT does <strong>NOT</strong> hold any of its previous membership benefits anymore such as reduced market fees and staking benefits.</Text>
              <Text mt={2}>If you are wishing to gain membership benefits such as reduced market fees or staking benefits, please check out the new <Link href='/collection/ryoshi-tales-vip' className='color fw-bold'>Ryoshi Tales VIP</Link> collection.</Text>
              <Text mt={2}>If you still wish to purchase this NFT, please confirm that you understand these conditions and that the price accurately represents the current market value.</Text>
            </ModalBody>
            <ModalFooter className="border-0">
              <div className="d-flex">
                <Button type="legacy"
                  onClick={onClose}
                  className="me-2 flex-fill"
                >
                  Go Back
                </Button>
                <Button type="legacy-outlined"
                  onClick={() => {
                    setHasAcceptedVipCondition(true);
                  }}
                  className="flex-fill"
                >
                  I understand, continue
                </Button>
              </div>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalBody>
              <div className="nftSaleForm row gx-3">
                <div className="col-4 mb-2 mb-sm-0">
                  {isBundle(listing.nftAddress) ? (
                    <ImagesContainer nft={listing.nft} />
                  ) : (
                    <DynamicNftImage nft={listing.nft} address={listing.nft.address ?? listing.nft.nftAddress} id={listing.nft.id ?? listing.nft.nftId} showStats={false}>
                      <AnyMedia
                        image={specialImageTransform(listing.nft.nftAddress, listing.nft.image)}
                        video={listing.nft.video ?? listing.nft.animation_url}
                        videoProps={{ height: 'auto', autoPlay: true }}
                        title={listing.nft.name}
                        usePlaceholder={false}
                        className="img-fluid img-rounded"
                      />
                    </DynamicNftImage>
                  )}
                </div>
                <div className="col-8 mt-2 mt-sm-0">
                  <Flex direction='column' justify='space-between' h='full'>
                    <div className="mb-3 text-center">
                      <Flex justify="space-between" fontSize="lg">
                        <Text>Listing Price</Text>
                        <Flex justify="space-between" align="center">
                          <DynamicCurrencyIcon address={listing.currency} boxSize={6} />
                          <Text as="span" ms={1}>
                            {commify(listing.price)}
                          </Text>
                        </Flex>
                      </Flex>
                      {isGaslessListing(listingId) && (
                        <Flex justify="space-between" fontSize="sm" mt={1}>
                          <Text className="text-muted">Service Fee</Text>
                          <Flex justify="space-between" align="center">
                            <CronosIconBlue boxSize={4} me={1}/>
                            <Text className="text-muted">
                              {user.fee} %
                            </Text>
                          </Flex>
                        </Flex>
                      )}
                    </div>
                    <Text fontSize={18} fontWeight="bold">Pay with</Text>
                    <SimpleGrid columns={{base: 1, sm: 2}}>
                      <Box className="card form_icon_button shadow active" alignItems="start !important" p={2}>
                        <DotIcon icon={faCheck} />
                        {knownErc20Token(listing.currency) ? (
                          <CurrencyOption currency={knownErc20Token(listing.currency)!} />
                        ) : (
                          <>
                            <Flex align="center">
                              <CronosIconBlue boxSize={6} />
                              <Text as="span" ms={1}>CRO</Text>
                            </Flex>
                            <Flex mt={1}>
                              <Text as="span" className="text-muted">Balance: {commify(round(user.balances.cro, 3))}</Text>
                            </Flex>
                          </>
                        )}
                      </Box>
                    </SimpleGrid>
                    <Spacer />

                    <Flex justify="space-between" fontSize={18}>
                      <Text>Total:</Text>
                      <Box>
                        {!!finalCostValues && (
                          <>
                            <Flex justify="end" align="center">
                              <DynamicCurrencyIcon address={listing.currency} boxSize={6} />
                              <Text as="span" ms={1} fontWeight="bold">
                                {finalCostValues[0].value}
                              </Text>
                            </Flex>
                            {finalCostValues[0].currency !== ethers.constants.AddressZero && (
                              <Flex justify="space-between" align="center" fontSize='sm' className='text-muted'>
                                <Text as="span" ms={1}>
                                  + {finalCostValues[1].value} CRO
                                </Text>
                              </Flex>
                            )}
                          </>
                        )}
                      </Box>
                    </Flex>
                    {isErc20Token(listing.currency) && !!token ? (
                      <Box textAlign="end" fontSize="sm">
                        Low on {token.name}?&nbsp;
                        <ChakraButton
                          size="sm"
                          variant="link"
                          color={getTheme(user.theme)!.colors.textColor4}
                          onClick={() => handleBuyErc20(listing.currency)}
                        >
                          Buy {token.name}
                        </ChakraButton>
                      </Box>
                    ) : (
                      <Box textAlign="end" fontSize="sm">
                        Low on CRO?&nbsp;
                        <ChakraButton
                          size="sm"
                          variant="link"
                          color={getTheme(user.theme)!.colors.textColor4}
                          onClick={handleBuyCro}
                        >
                          Buy CRO
                        </ChakraButton>
                      </Box>
                    )}
                  </Flex>

                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-0">
              <div className="w-100">
                {executingPurchase && (
                  <div className="mb-2 text-center fst-italic">
                    <small>Please check your wallet for confirmation</small>
                  </div>
                )}
                <div className="d-flex">
                  <Button type="legacy"
                          onClick={handleExecutePurchase}
                          isLoading={executingPurchase}
                          disabled={executingPurchase}
                          className="flex-fill">
                    Confirm purchase
                  </Button>
                </div>
              </div>
              <TransakOption
                listing={listing}
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

const CurrencyOption = ({currency}: {currency: {address: string, symbol: string, name: string, decimals: number}}) => {
  const user = useUser();
  const contractService = useContractService();

  const { data: tokenBalance, isLoading } = useQuery({
    queryKey: ['UserTokenBalance', currency.address, user.address],
    queryFn: async () => {
      const tokenContract = contractService!.erc20(currency.address);
      const balance = await tokenContract.balanceOf(user.address);
      // const decimals = await tokenContract.decimals();
      return ethers.utils.formatEther(balance);  // assuming
    },
    enabled: !!currency && !!user.address,
  });

  return (
    <>
      <Flex align="center">
        <DynamicCurrencyIcon address={currency.address} boxSize={6} />
        <Text as="span" ms={1}>{currency.symbol}</Text>
      </Flex>
      <Flex mt={1}>
        <HStack as="span" className="text-muted">
          <Box>Balance: </Box>
          {isLoading ? <Spinner /> : <>{commify(round(tokenBalance ?? 0, 2))}</>}
        </HStack>
      </Flex>
    </>
  )
}

const TransakOption = ({listing}: {listing: Listing}) => {
  const user = useUser();
  const [transak, setTransak] = useState<Transak | null>(null);
  const [channel, setChannel] = useState<any>(null);

  const handleOrderCreated = (orderData: any) => {
    console.log('callback transak order created', orderData);
    const eventData = orderData;
    const orderId = eventData.status?.id;

    if (!orderId) {
      return;
    }

    subscribeToWebsockets(orderId);
  };

  const subscribeToWebsockets = (orderId: string) => {
    const newChannel = pusher.subscribe(orderId);
    setChannel(newChannel);

    // Receive updates of all events
    pusher.bind_global((eventId: any, orderData: any) => {
      console.log(`websocket Event: ${eventId} with order data:`, orderData);
    });

    // Receive updates of specific events
    newChannel.bind('ORDER_COMPLETED', (orderData: any) => {
      console.log('ORDER COMPLETED websocket event', orderData);
    });

    newChannel.bind('ORDER_FAILED', async (orderData: any) => {
      console.log('ORDER FAILED websocket event', orderData);
    });
  };

  const handlePurchase = async () => {
    // console.log('SERVER SIG REQUEST', rawCallData);
    const { data: serverSig } = await getServerSignature(
      user.address,
      [listing.listingId],
      '0xcb9bd5acd627e8fccf9eb8d4ba72aeb1cd8ff5ef'
    );
    const { signature, orderData, ...sigData } = serverSig;
    console.log('SERVER SIG RESPONSE', serverSig);

    let iface = new ethers.utils.Interface(shipABI);
    console.log('generate rawCallData', 'fillOrders', [
      orderData,
      sigData,
      signature
    ]);
    const rawCallData = iface.encodeFunctionData('fillOrders', [
      orderData,
      sigData,
      signature
    ]);
console.log('rawCallData', rawCallData);
    const is1155Type = await is1155(listing.nftAddress);

    const newTransak = new Transak({
      ...defaultTransakConfig,
      walletAddress: user.address,
      calldata: rawCallData,
      nftData: [
        {
          imageURL: listing.nft.image,
          nftName: listing.nft.name,
          collectionAddress: listing.nft.nftAddress,
          tokenID: [listing.nft.nftId],
          price: [Number(listing.price)],
          quantity: Number(listing.amount),
          nftType: is1155Type ? 'ERC1155' : 'ERC721',
        },
      ]
    });
    console.log('CONFIG', JSON.stringify({
      ...defaultTransakConfig,
      walletAddress: user.address,
      calldata: rawCallData,
      nftData: [
        {
          imageURL: listing.nft.image,
          nftName: listing.nft.name,
          collectionAddress: listing.nft.nftAddress,
          tokenID: [listing.nft.nftId],
          price: [Number(listing.price)],
          quantity: Number(listing.amount),
          nftType: is1155Type ? 'ERC1155' : 'ERC721',
        },
      ]
    }))
    setTransak(newTransak);
    newTransak.init();

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, handleOrderCreated);
    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, cleanup);
  };

  const cleanup = () => {
    if (transak) {
      transak.close();
      setTransak(null);
    }

    if (channel) {
      channel.unbind_all();
      pusher.unsubscribe(channel.name);
      setChannel(null);
    }

    // Transak.off(Transak.EVENTS.TRANSAK_ORDER_CREATED, handleOrderCreated);
    // Transak.off(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, cleanup);
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <Button onClick={handlePurchase}>
      Transak
    </Button>
  )
}

type TransakConfigEnv = typeof Transak['ENVIRONMENTS']['STAGING'] | typeof Transak['ENVIRONMENTS']['PRODUCTION'];

const defaultTransakConfig: TransakConfig = {
  apiKey: config.vendors.transak.apiKey,
  environment: config.vendors.transak.env as TransakConfigEnv,
  themeColor: '000000',
  defaultPaymentMethod: 'credit_debit_card',
  exchangeScreenTitle: 'Buy NFT',
  disableWalletAddressForm: true,
  estimatedGasLimit: 70_000,
  network: 'cronos',
  cryptoCurrencyCode: 'CRO',
  isNFT: true,
  contractId: config.vendors.transak.contractId,
};