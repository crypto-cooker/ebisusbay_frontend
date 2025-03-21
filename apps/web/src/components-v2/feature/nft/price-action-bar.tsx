import React, {useEffect, useState} from 'react';

import {ethers} from 'ethers';
import {
  createSuccessfulAddCartContent,
  isNftBlacklisted,
  isUserBlacklisted,
  round,
  timeSince,
  usdFormat
} from '@market/helpers/utils';
import {listingState} from '@src/core/api/enums';
import {OFFER_TYPE} from "@src/Components/Offer/MadeOffers/MadeOffersRow";
import CreateListingDialog from "@src/components-v2/shared/dialogs/create-listing";

import {
  Box,
  ButtonGroup,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  IconButton,
  Stack,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import PurchaseConfirmationDialog from "@src/components-v2/shared/dialogs/purchase-confirmation";
import {useAppSelector} from "@market/state/redux/store/hooks";
import {useTokenExchangeRate} from "@market/hooks/useGlobalPrices";
import {commify} from "ethers/lib/utils";
import {ResponsiveCancelListingDialog} from "@src/components-v2/shared/dialogs/cancel-listing";
import {PrimaryButton, SecondaryButton} from "@src/components-v2/foundation/button";
import {toast} from "react-toastify";
import useCart from "@market/hooks/use-cart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBagShopping, faHand} from "@fortawesome/free-solid-svg-icons";
import useAuthedFunctionWithChainID from "@market/hooks/useAuthedFunctionWithChainID";
import {CurrencyLogoByAddress} from "@dex/components/logo";
import {isOffersEnabledForChain} from "@src/global/utils/app";
import PurchaseUnverifiedConfirmationDialog from '@src/components-v2/shared/dialogs/purchase-unverified-confirmation';
import { MapiCollectionBlacklist } from '@src/core/services/api-service/mapi/types';

interface PriceActionBarProps {
  offerType: string;
  onOfferSelected: () => void;
  label?: string;
  collectionName: string;
  isVerified: boolean;
  isOwner: boolean;
  collectionStats?: any;
}

const PriceActionBar = ({ offerType, onOfferSelected, label, collectionName, isVerified, isOwner, collectionStats }: PriceActionBarProps) => {
   const cart = useCart();

  const { currentListing: listing, nft, blacklisted, collection } = useAppSelector((state) => state.nft);
  const [canBuy, setCanBuy] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isPurchaseUnverifiedDialogOpen, setIsPurchaseUnverifiedDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const { calculateValuesFromToken } = useTokenExchangeRate(listing?.currency, listing?.chain);
  const showSmallOfferButton = useBreakpointValue(
    {base: true, sm: false},
    {fallback: 'sm'},
  );
  const [runAuthedFunction] = useAuthedFunctionWithChainID(nft.chain);
  const requiresUnverifiedConfirmation = blacklisted === MapiCollectionBlacklist.PENDING;

  const handlePurchaseSelected = async () => {
    if (requiresUnverifiedConfirmation) {
      setIsPurchaseUnverifiedDialogOpen(true);
      return;
    }
    await runAuthedFunction(() => setIsPurchaseDialogOpen(true), nft.chain);
  };

  const handleAcknowledgedUnverifiedCollection = async () => {
    setIsPurchaseUnverifiedDialogOpen(false);
    await runAuthedFunction(() => setIsPurchaseDialogOpen(true), nft.chain);
  }

  const handleSellSelected = () => {
    setIsSellDialogOpen(true);
  };

  const handleUpdateSelected = () => {
    setIsSellDialogOpen(true);
  };

  const handleCancelSelected = () => {
    setIsCancelDialogOpen(true);
  }

  const handleCartToggle = () => {
    if (!listing) {
      toast.error('No listing found for NFT');
      return;
    }

    if (cart.isItemInCart(listing.id)) {
      cart.removeItem(listing.id);
      toast.success('Removed from cart');
    } else {
      cart.addItem({
        listingId: listing.id,
        name: nft.name,
        image: nft.image,
        price: listing.price,
        address: nft.address,
        id: nft.id,
        rank: nft.rank,
        amount: listing.amount ?? 1,
        currency: listing.currency,
        chain: listing.chain
      });
      toast.success(createSuccessfulAddCartContent(cart.openCart));
    }
  };

  useEffect(() => {
    setCanBuy(
      listing &&
      !isUserBlacklisted(listing.seller) &&
      !isNftBlacklisted(listing.nftAddress, listing.nftId)
    );
  }, [listing?.nftAddress, listing?.nftId, listing?.seller]);

  const isActiveListing = listing && listing.state === listingState.ACTIVE;

  // const ModalBody = () => {
  //   return (
  //     <>
  //       This contract is not verified by Ebisu's Bay. Review this information to ensure it's what you want to buy.
  //       <TableContainer>
  //         <Table variant='simple'>
  //           <Tbody>
  //             {collectionStats ? (
  //               <>
  //                 <Tr>
  //                   <Td>Collections name</Td>
  //                   <Td>{collectionName}</Td>
  //                 </Tr>
  //                 <Tr>
  //                   <Td>Contract address</Td>
  //                   <Td>{shortAddress(collectionStats?.collection)}</Td>
  //                 </Tr>
  //                 <Tr>
  //                   <Td>Total Sales</Td>
  //                   <Td>{collectionStats?.numberOfSales}</Td>
  //                 </Tr>
  //                 <Tr>
  //                   <Td>Total Volume</Td>
  //                   <Td>{collectionStats?.totalVolume} CRO</Td>
  //                 </Tr>
  //                 <Tr>
  //                   <Td>Total Items</Td>
  //                   <Td>{collectionStats?.totalSupply}</Td>
  //                 </Tr>
  //               </>
  //             ) : (
  //               <Tr>
  //                 <Td className="text-center">
  //                   <Spinner size='sm' ms={1} />
  //                 </Td>
  //               </Tr>
  //             )
  //             }
  //           </Tbody>
  //         </Table>
  //       </TableContainer>
  //     </>
  //   )
  // }

  return (
    <Box className="price-action-bar">
      <Card mb={4} border='1px solid' shadow='lg' className=" pab-card">
        <CardBody>
          <Box id={`lid-${listing?.listingId}`}>
            <Flex direction="column" justify="space-between">
              <Box my='auto'>
                <>
                  <Flex justify="space-between">
                    <Heading size="sm">{label ?? 'Listing Price'}:</Heading>
                    {listing?.expirationDate && (
                      <Text fontSize="sm" className="text-muted">Ends in {timeSince(listing.expirationDate)}</Text>
                    )}
                  </Flex>
                  <span>
                    {listing ? (
                      <Stack direction='row' alignItems='center'>
                        <CurrencyLogoByAddress address={listing.currency} chainId={listing.chain} size='24px' />
                        <Text fontSize={28} ms={1} fontWeight='bold'>
                          <span className="ms-1">{ethers.utils.commify(listing.price)}</span>
                        </Text>
                        {!!listing.currency && (
                          <Box as='span' ms={1} fontSize='sm' className="text-muted">
                            (
                            {listing.currency !== ethers.constants.AddressZero && (
                              <Text as='span'>{commify(round(calculateValuesFromToken(listing.price).totalCRO))} CRO / </Text>
                            )}
                            <Text as='span'>{usdFormat(calculateValuesFromToken(listing.price).totalUSD)}</Text>
                            )
                          </Box>
                        )}
                      </Stack>
                    ) : (
                      <span>-</span>
                    )}
                  </span>
                </>
              </Box>
            </Flex>
          </Box>

          <Flex w='full'>
            {isOwner ? (
              <ButtonGroup w='full'>
                {isActiveListing ? (
                  <>
                    <SecondaryButton w='full' onClick={handleCancelSelected}>
                      Cancel
                    </SecondaryButton>

                    <PrimaryButton w='full' onClick={handleUpdateSelected}>
                      Update
                    </PrimaryButton>
                  </>
                ) : (
                  <PrimaryButton w='full' onClick={handleSellSelected}>
                    Sell this NFT
                  </PrimaryButton>
                )}
              </ButtonGroup>
            ) : (
              <ButtonGroup w='full'>
                {isOffersEnabledForChain(nft.chain) && (
                  <>
                    {showSmallOfferButton && isActiveListing && canBuy ? (
                      <IconButton
                        variant='outline'
                        aria-label={`${offerType === OFFER_TYPE.update ? 'Update' : 'Make'} Offer`}
                        icon={<Icon as={FontAwesomeIcon} icon={faHand} />}
                        onClick={onOfferSelected}
                      />
                    ) : (
                      <SecondaryButton w='full' onClick={onOfferSelected}>
                        {offerType === OFFER_TYPE.update ? 'Update' : 'Make'} Offer
                      </SecondaryButton>
                    )}
                  </>
                )}
                {isActiveListing && canBuy && (
                  <>
                    <PrimaryButton w='full' onClick={handlePurchaseSelected}>
                      Buy Now
                    </PrimaryButton>
                    <IconButton
                      variant='primary'
                      aria-label='Add to cart'
                      icon={<Icon as={FontAwesomeIcon} icon={faBagShopping} />}
                      onClick={handleCartToggle}
                    />
                  </>
                )}
              </ButtonGroup>
            )}
          </Flex>
        </CardBody>
      </Card>
      {isSellDialogOpen && (
        <CreateListingDialog
          isOpen={isSellDialogOpen}
          nft={nft}
          onClose={() => setIsSellDialogOpen(false)}
          listing={listing}
        />
      )}
      {isPurchaseDialogOpen && listing && (
        <PurchaseConfirmationDialog
          isOpen={isPurchaseDialogOpen}
          onClose={() => setIsPurchaseDialogOpen(false)}
          listingId={listing.listingId}
        />
      )}
      {isCancelDialogOpen && listing && (
        <ResponsiveCancelListingDialog
          isOpen={isCancelDialogOpen}
          listing={{...listing, nft: nft}}
          onClose={() => setIsCancelDialogOpen(false)}
        />
      )}
      <PurchaseUnverifiedConfirmationDialog
        isOpen={isPurchaseUnverifiedDialogOpen}
        onClose={() => setIsPurchaseUnverifiedDialogOpen(false)}
        collections={[collection]}
        onConfirm={handleAcknowledgedUnverifiedCollection}
      />
    </Box>
  );
};
export default PriceActionBar;