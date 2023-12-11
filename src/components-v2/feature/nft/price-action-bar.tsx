import React, {useEffect, useState} from 'react';

import {ethers} from 'ethers';
import {toast} from 'react-toastify';
import {
  createSuccessfulTransactionToastContent,
  isGaslessListing,
  isNftBlacklisted,
  isUserBlacklisted,
  round,
  shortAddress,
  timeSince,
  usdFormat
} from '@src/utils';
import {listingState} from '@src/core/api/enums';
import {OFFER_TYPE} from "@src/Components/Offer/MadeOffers/MadeOffersRow";
import Button from "@src/Components/components/Button";
import CreateListingDialog from "@src/components-v2/shared/dialogs/create-listing";
import useFeatureFlag from "@src/hooks/useFeatureFlag";
import Constants from "@src/constants";
import useCancelGaslessListing from '@src/Components/Account/Settings/hooks/useCancelGaslessListing';

import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import PurchaseConfirmationDialog from "@src/components-v2/shared/dialogs/purchase-confirmation";
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {useAppSelector} from "@src/Store/hooks";
import {useTokenExchangeRate} from "@src/hooks/useGlobalPrices";
import {appConfig} from "@src/Config";
import DynamicCurrencyIcon from "@src/components-v2/shared/dynamic-currency-icon";
import {commify} from "ethers/lib/utils";
import {useContractService, useUser} from "@src/components-v2/useUser";

const config = appConfig();

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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [runAuthedFunction] = useAuthedFunction();

  const { Features } = Constants;
  const isWarningMessageEnabled = useFeatureFlag(Features.UNVERIFIED_WARNING);

  const user = useUser();
  const contractService = useContractService();

  const { currentListing: listing, nft } = useAppSelector((state) => state.nft);
  const [executingCancel, setExecutingCancel] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [cancelGaslessListing, responseCancelListing] = useCancelGaslessListing();
  const { tokenToUsdValue, tokenToCroValue } = useTokenExchangeRate(listing?.currency, config.chain.id);

  const executeBuy = async () => {
    await runAuthedFunction(() => setIsPurchaseDialogOpen(true));
  };

  const executeCancel = () => runAuthedFunction(async () => {
    try {
      setExecutingCancel(true);
      if(!isGaslessListing(listing.listingId)){
        const tx = await contractService!.market.cancelListing(listing.listingId);
        const receipt = await tx.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      }
      else{
        await cancelGaslessListing(listing.listingId)
      }
    } catch (error: any) {
      if (error.data) {
        toast.error(error.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        console.log(error);
        toast.error('Unknown Error');
      }
    } finally {
      setExecutingCancel(false);
    }
  });

  const onSellSelected = () => {
    setIsSellDialogOpen(true);
  };
  const onUpdateSelected = () => {
    setIsSellDialogOpen(true);
  };

  useEffect(() => {
    setCanBuy(
      listing &&
      !isUserBlacklisted(listing.seller) &&
      !isNftBlacklisted(listing.nftAddress, listing.nftId)
    );
  }, [listing]);


  const ModalBody = () => {
    return (
      <>
        This contract is not verified by Ebisu's Bay. Review this information to ensure it's what you want to buy.
        <TableContainer>
          <Table variant='simple'>
            <Tbody>
              {collectionStats ? (
                <>
                  <Tr>
                    <Td>Collections name</Td>
                    <Td>{collectionName}</Td>
                  </Tr>
                  <Tr>
                    <Td>Contract address</Td>
                    <Td>{shortAddress(collectionStats?.collection)}</Td>
                  </Tr>
                  <Tr>
                    <Td>Total Sales</Td>
                    <Td>{collectionStats?.numberOfSales}</Td>
                  </Tr>
                  <Tr>
                    <Td>Total Volume</Td>
                    <Td>{collectionStats?.totalVolume} CRO</Td>
                  </Tr>
                  <Tr>
                    <Td>Total Items</Td>
                    <Td>{collectionStats?.totalSupply}</Td>
                  </Tr>
                </>
              ) : (
                <Tr>
                  <Td className="text-center">
                    <Spinner size='sm' ms={1} />
                  </Td>
                </Tr>
              )
              }
            </Tbody>
          </Table>
        </TableContainer>
      </>
    )
  }

  const ModalFooter = () => {
    return (
      <div className="w-100">
        <div className="d-flex justify-content-center">
          <Button type="legacy-outlined" className="me-2" onClick={onClose}>
            Cancel
          </Button>
          <Button type="legacy" onClick={executeBuy}>
            Continue
          </Button>
        </div>
      </div>
    )
  }


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
                        <DynamicCurrencyIcon address={listing.currency} boxSize={6} />
                        <Text fontSize={28} ms={1} fontWeight='bold'>
                          <span className="ms-1">{ethers.utils.commify(listing.price)}</span>
                        </Text>
                        {!!listing.currency && (
                          <Box as='span' ms={1} fontSize='sm' className="text-muted">
                            (
                            {listing.currency !== ethers.constants.AddressZero && (
                              <Text as='span'>{commify(round(tokenToCroValue(listing.price)))} CRO / </Text>
                            )}
                            <Text as='span'>{usdFormat(tokenToUsdValue(listing.price))}</Text>
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

          <div className="d-flex">
            {isOwner ? (
              <>
                {listing && listing.state === listingState.ACTIVE ? (
                  <>
                    <div className="flex-fill mx-1">
                      <Button type="legacy-outlined" className="w-100" onClick={executeCancel()} disabled={executingCancel}>
                        {executingCancel ? (
                          <>
                            Cancelling...
                            <Spinner animation="border" role="status" size="sm" className="ms-1">
                              <span className="visually-hidden">Loading...</span>
                            </Spinner>
                          </>
                        ) : (
                          <>Cancel Listing</>
                        )}
                      </Button>
                    </div>

                    <div className="flex-fill mx-1">
                      <Button type="legacy" className="w-100" onClick={onUpdateSelected} disabled={executingCancel}>
                        Update Listing
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button type="legacy" className="w-100" onClick={onSellSelected}>
                    Sell this NFT
                  </Button>
                )}
              </>
            ) : (
              <>
                {canBuy && (
                  <div className="flex-fill mx-1">
                    {listing.state === listingState.ACTIVE && (
                      <Button type="legacy" className="w-100" onClick={executeBuy}>
                        Buy Now
                      </Button>
                    )}
                  </div>
                )}
                <div className="flex-fill mx-1">
                  <Button type="legacy-outlined" className="w-100" onClick={onOfferSelected}>
                    {offerType === OFFER_TYPE.update ? 'Update' : 'Make'} Offer
                  </Button>
                </div>
              </>
            )}
          </div>
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
      {/*<div className='nftSaleForm'>*/}
      {/*  <Modal isCentered title={'This is an unverified collection'} body={ModalBody()} dialogActions={ModalFooter()} isOpen={isOpen} onClose={onClose} />*/}
      {/*</div>*/}
    </Box>
  );
};
export default PriceActionBar;
