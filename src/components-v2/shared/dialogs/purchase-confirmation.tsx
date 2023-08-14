import React, {useEffect, useState} from 'react';
import {specialImageTransform} from "@src/hacks";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {Contract, ContractReceipt, ethers} from "ethers";
import Button from "@src/Components/components/Button";
import {toast} from "react-toastify";
import EmptyData from "@src/Components/Offer/EmptyData";
import {isBundle, isErc20Token, isGaslessListing, knownErc20Token, round} from "@src/utils";
import {getTheme} from "@src/Theme/theme";
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
import useBuyGaslessListings from "@src/hooks/useBuyGaslessListings";
import DotIcon from "@src/Components/components/DotIcon";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {appConfig} from "@src/Config";
import Market from "@src/Contracts/Marketplace.json";
import {useAppSelector} from "@src/Store/hooks";
import PurchaseSuccessDialog from './purchase-success';
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const readMarket = new Contract(config.contracts.market, Market.abi, readProvider);

type PurchaseConfirmationDialogProps = {
  onClose: () => void;
  isOpen: boolean;
  listingId: string;
};

export default function PurchaseConfirmationDialog({ onClose, isOpen, listingId}: PurchaseConfirmationDialogProps) {
  const [fee, setFee] = useState(0);
  const [executingPurchase, setExecutingPurchase] = useState(false);
  const [buyGaslessListings, response] = useBuyGaslessListings();

  const user = useAppSelector((state) => state.user);

  const [isComplete, setIsComplete] = useState(false);
  const [tx, setTx] = useState<ContractReceipt>();

  const getInitialProps = async () => {
    const listingsResponse = await NextApiService.getListingsByIds(listingId);
    const listing = listingsResponse.data[0];

    const fees = await readMarket.fee(user.address);
    setFee((fees / 10000) * 100);

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
    const url = new URL('https://vvs.finance/swap');
    if (user.address) {
      url.searchParams.append('outputCurrency', address);
      url.searchParams.append('inputCurrency', '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59');
    }
    window.open(url, '_blank');
  }

  const getYouReceiveViewValue = () => {
    if (!listing) return;

    if (isGaslessListing(listingId)) {
      const youReceive = parseInt(listing.price) + (listing.price * (fee / 100));
      try {
        return ethers.utils.commify(youReceive.toFixed(2));
      } catch (e) {
        return youReceive
      }
    } else {
      return parseInt(listing.price);
    }
  };





  const handleExecutePurchase = async () => {
    try {
      // setIsComplete(true);
      // return;

      setExecutingPurchase(true);
      await buyGaslessListings([{
        listingId: listing.listingId,
        price: parseInt(listing.price),
        currency: listing.currency
      }]);
      setIsComplete(true);
    } catch (error: any) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Unknown Error');
      }
    } finally {
      setExecutingPurchase(false);
    }
  };

  useEffect(() => {
    if (response?.tx) {
      setTx(response.tx);
    }
  }, [response]);

  return isComplete ? (
    <PurchaseSuccessDialog onClose={onClose} isOpen={isOpen} listing={listing} tx={tx} />
  ) : (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          Buy {listing?.nft?.name}
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme)!.colors.textColor4} />
        {status === "loading" ? (
          <EmptyData>
            <Spinner />
          </EmptyData>
        ) : status === "error" ? (
          <VStack spacing={0} mb={2}>
            <Text>Unable to load listing information</Text>
            <Text fontSize="xs">Error: {error?.toString()}</Text>
          </VStack>
        ) : (
          <>
            <ModalBody>
              <div className="nftSaleForm row gx-3">
                <div className="col-4 mb-2 mb-sm-0">
                  {isBundle(listing.nftAddress) ? (
                    <ImagesContainer nft={listing.nft} />
                  ) : (
                    <AnyMedia
                      image={specialImageTransform(listing.nft.nftAddress, listing.nft.image)}
                      video={listing.nft.video ?? listing.nft.animation_url}
                      videoProps={{ height: 'auto', autoPlay: true }}
                      title={listing.nft.name}
                      usePlaceholder={false}
                      className="img-fluid img-rounded"
                    />
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
                          <Text className="text-muted">
                            {fee} %
                          </Text>
                        </Flex>
                      )}
                    </div>
                    <Text fontSize={18} fontWeight="bold">Pay with</Text>
                    <SimpleGrid columns={{base: 1, sm: 2}}>
                      <Box className="card form_icon_button shadow active" alignItems="start !important" p={2}>
                        <DotIcon icon={faCheck} />
                        {knownErc20Token(listing.currency) ? (
                          <CurrencyOption currency={knownErc20Token(listing.currency)} />
                        ) : (
                          <>
                            <Flex align="center">
                              <CronosIconBlue boxSize={6} />
                              <Text as="span" ms={1}>CRO</Text>
                            </Flex>
                            <Flex mt={1}>
                              <Text as="span" className="text-muted">Balance: {commify(round(user.balance, 3))}</Text>
                            </Flex>
                          </>
                        )}
                      </Box>
                    </SimpleGrid>
                    <Spacer />

                    <Flex justify="space-between" fontSize={18}>
                      <Text>Total:</Text>
                      <Box>
                        <Flex justify="space-between" align="center">
                          <DynamicCurrencyIcon address={listing.currency} boxSize={6} />
                          <Text as="span" ms={1} fontWeight="bold">
                            {getYouReceiveViewValue()} CRO
                          </Text>
                        </Flex>
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
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

const CurrencyOption = ({currency}: {currency: {address: string, symbol: string, name: string}}) => {
  const user = useAppSelector((state) => state.user);

  const { data: tokenBalance, isLoading } = useQuery({
    queryKey: ['UserTokenBalance', currency.address, user.address],
    queryFn: async () => {
      const tokenContract = user.contractService!.erc20(currency.address);
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
          {isLoading ? <Spinner /> : <>{commify(round(tokenBalance, 2))}</>}
        </HStack>
      </Flex>
    </>
  )
}