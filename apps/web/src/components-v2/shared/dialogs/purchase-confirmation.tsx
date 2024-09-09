import React, {useEffect, useState} from 'react';
import {specialImageTransform} from "@market/helpers/hacks";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {ContractReceipt, ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {
  ciEquals,
  isBundle,
  isEbVipCollection,
  isErc20Token,
  isGaslessListing,
  knownErc20Token,
  round, urlify
} from '@market/helpers/utils';
import {getTheme} from "@src/global/theme/theme";
import {
  Box,
  Button as ChakraButton,
  Flex,
  HStack,
  Icon,
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
  Stack,
  Text,
  VStack
} from "@chakra-ui/react";
import {commify} from "ethers/lib/utils";
import ImagesContainer from "@src/Components/Bundle/ImagesContainer";
import {useQuery} from "@tanstack/react-query";
import useBuyGaslessListings from "@market/hooks/useBuyGaslessListings";
import DotIcon from "@src/Components/components/DotIcon";
import {faCheck, faCreditCardAlt} from "@fortawesome/free-solid-svg-icons";
import PurchaseSuccessDialog from './purchase-success';
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import {parseErrorMessage} from "@src/helpers/validator";
import {getPrices} from "@src/core/api/endpoints/prices";
import {DynamicNftImage} from "@src/components-v2/shared/media/dynamic-nft-image";
import Link from "next/link";
import {useContractService, useUser} from "@src/components-v2/useUser";
import * as Sentry from "@sentry/nextjs";
import {Listing} from "@src/core/models/listing";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useTransak from "@market/hooks/use-transak";
import {useAppConfig} from "@src/config/hooks";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {ApiService} from "@src/core/services/api-service";
import {CurrencyLogoByAddress} from "@dex/components/logo";

enum PaymentType {
  CRYPTO = 'CRYPTO',
  CARD = 'CARD'
}

type PurchaseConfirmationDialogProps = {
  onClose: () => void;
  isOpen: boolean;
  listingId: string;
};

export default function PurchaseConfirmationDialog({ onClose, isOpen, listingId}: PurchaseConfirmationDialogProps) {
  const [executingPurchase, setExecutingPurchase] = useState(false);
  const [buyGaslessListings, response] = useBuyGaslessListings();
  const { config } = useAppConfig();
  const { chainId } = useActiveChainId()
  const { switchNetworkAsync } = useSwitchNetwork();

  const user = useUser();

  const [isComplete, setIsComplete] = useState(false);
  const [tx, setTx] = useState<ContractReceipt>();
  const [finalCostValues, setFinalCostValues] = useState<[{ value: string, currency: string }, { value: string }]>();
  const [paymentType, setPaymentType] = useState(PaymentType.CRYPTO);

  const [showTransakButton, setShowTransakButton] = useState(false);
  const {isEligible} = useTransak();

  const getInitialProps = async () => {
    const listingsResponse = await ApiService.withoutKey().getListings({listingId: [listingId]});
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
    if (!config.vendors?.transak) return;

    const url = new URL(config.vendors.transak.url);
    if (user.address) {
      url.searchParams.append('cryptoCurrencyCode', 'CRO');
      url.searchParams.append('walletAddress', user.address);
    }

    window.open(url, '_blank');
  }

  const handleBuyErc20 = (address: string) => {
    const url = new URL(urlify(config.urls.app, '/dex/swap'));
    if (user.address) {
      url.searchParams.append('outputCurrency', address);
      url.searchParams.append('inputCurrency', '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59');
    }
    window.open(url, '_blank');
  }

  const handleExecutePurchase = async () => {
    try {
      setExecutingPurchase(true);
      await buyGaslessListings([{
        listingId: listing!.listingId,
        price: parseInt(listing!.price),
        currency: listing!.currency,
        chainId: listing!.chain
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
      const numericPrice = parseInt(listing!.price);
      let amt = numericPrice;

      let fee =  numericPrice * (user.fee / 100);
      const erc20UsdRate = exchangeRates.find((rate) => ciEquals(rate.currency, listing!.currency));
      if (!!erc20UsdRate && erc20UsdRate.currency !== ethers.constants.AddressZero) {
        const croUsdRate = exchangeRates.find((rate) => ciEquals(rate.currency, ethers.constants.AddressZero) && rate.chain.toString() === listing!.chain.toString());
        fee = (numericPrice * Number(erc20UsdRate.usdPrice)) / Number(croUsdRate?.usdPrice) * (user.fee / 100);
      }
      amt += listing!.currency === ethers.constants.AddressZero ? fee : 0;

      setFinalCostValues([
        {
          value: ethers.utils.commify(amt),
          currency: listing!.currency,
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

  useEffect(() => {
    async function checkEligibility() {
      // const isTransakEnabled = searchParams?.get('transak') === 'true';
      const canUseTransak = await isEligible(listing!);
      setShowTransakButton(canUseTransak)
    }
    if (listing) checkEligibility();
  }, [listing]);

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
                          <CurrencyLogoByAddress address={listing.currency} chainId={listing.chain} size='24px' />
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
                    <SimpleGrid columns={{base: 1, sm: 2}}  spacing={2}>
                      <Box
                        className={`card form_icon_button shadow ${paymentType === PaymentType.CRYPTO ? 'active' : ''}`}
                        alignItems="start !important"
                        p={2}
                        onClick={() => setPaymentType(PaymentType.CRYPTO)}
                        style={{marginBottom:0}}
                      >
                        {paymentType === PaymentType.CRYPTO && (
                          <DotIcon icon={faCheck} />
                        )}

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
                      {showTransakButton && (
                        <Box
                          className={`card form_icon_button shadow ${paymentType === PaymentType.CARD ? 'active' : ''}`}
                          alignItems="start !important"
                          p={2}
                          onClick={() => setPaymentType(PaymentType.CARD)}
                        >
                          {paymentType === PaymentType.CARD && (
                            <DotIcon icon={faCheck} />
                          )}
                          <VStack w='full'>
                            <Icon as={FontAwesomeIcon} icon={faCreditCardAlt} boxSize={6}/>
                            <Box fontWeight='bold' fontSize='xs' textAlign='center'>CREDIT / DEBIT CARD</Box>
                          </VStack>
                        </Box>
                      )}
                    </SimpleGrid>
                    <Spacer />

                    <Flex justify="space-between" fontSize={18}>
                      <Text>Total:</Text>
                      <Box>
                        {!!finalCostValues && (
                          <>
                            <Flex justify="end" align="center">
                              <CurrencyLogoByAddress address={listing.currency} chainId={listing.chain} size='24px' />
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
                <Stack direction='row'>
                  {showTransakButton && paymentType === PaymentType.CARD ? (
                    <TransakOption
                      listing={listing}
                    />
                  ) : listing.chain === chainId ? (
                    <PrimaryButton
                      onClick={handleExecutePurchase}
                      isLoading={executingPurchase}
                      disabled={executingPurchase}
                      className="flex-fill"
                    >
                      Confirm purchase
                    </PrimaryButton>
                  ) : (
                    <VStack align='stretch' gap={0} w='full'>
                      <Box textAlign='center' as='i'>
                        <small>Please switch chains to continue</small>
                      </Box>
                      <PrimaryButton
                        onClick={() => switchNetworkAsync(listing.chain)}
                        isLoading={executingPurchase}
                        isDisabled={executingPurchase}
                        loadingText='Switching'
                      >
                        Switch Network
                      </PrimaryButton>
                    </VStack>
                  )}
                </Stack>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

const CurrencyOption = ({currency}: {currency: {address: string, symbol: string, name: string, decimals: number, chainId: number}}) => {
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
        <CurrencyLogoByAddress address={currency.address} chainId={currency.chainId} size='24px' />
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
  const {purchase, isLoading} = useTransak();

  const handlePurchase = async () => {
    await purchase([{
      listingId: listing.listingId,
      price: parseInt(listing.price),
      amount: listing.amount,
      currency: listing.currency,
      nftAddress: listing.nftAddress,
      nftId: listing.nftId,
      name: listing.nft.name,
      image: listing.nft.image
    }]);
  };

  return (
    <PrimaryButton
      onClick={handlePurchase}
      className="flex-fill"
      isLoading={isLoading}
      isDisabled={isLoading}
    >
      Confirm purchase
    </PrimaryButton>
  )
}