import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Contract, ethers} from 'ethers';
import {toast} from 'react-toastify';
import {
  createSuccessfulTransactionToastContent, croToUsd,
  isGaslessListing,
  isNftBlacklisted,
  isUserBlacklisted,
  shortAddress, timeSince
} from '@src/utils';
import {Card, Spinner} from 'react-bootstrap';
import MetaMaskOnboarding from '@metamask/onboarding';
import {chainConnect, connectAccount} from '@src/GlobalState/User';
import {listingUpdated} from '@src/GlobalState/listingSlice';
import {listingState} from '@src/core/api/enums';
import {OFFER_TYPE} from "@src/Components/Offer/MadeOffers/MadeOffersRow";
import Button from "@src/Components/components/Button";
import {useRouter} from "next/router";
import CreateListingDialog from "@src/components-v2/shared/dialogs/create-listing";
import Image from "next/image";
import useFeatureFlag from "@src/hooks/useFeatureFlag";
import Constants from "@src/constants";
import useCancelGaslessListing from '@src/Components/Account/Settings/hooks/useCancelGaslessListing';

import {Box, Flex, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Tr, useDisclosure,} from '@chakra-ui/react';
import PurchaseConfirmationDialog from "@src/components-v2/shared/dialogs/purchase-confirmation";
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {TransactionReceipt} from "@ethersproject/abstract-provider";
import {useAppSelector} from "@src/Store/hooks";
import ContractService from "@src/core/contractService";
import {useGlobalPrice} from "@src/hooks/useGlobalPrices";
import {appConfig} from "@src/Config";

const config = appConfig();

interface PriceActionBarProps {
  offerType: string;
  onOfferSelected: () => void;
  label?: string;
  collectionName: string;
  isVerified: boolean;
  isOwner: boolean;
  collectionStats: any;
}

const PriceActionBar = ({ offerType, onOfferSelected, label, collectionName, isVerified, isOwner, collectionStats }: PriceActionBarProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [runAuthedFunction] = useAuthedFunction();
  const globalPrice = useGlobalPrice(config.chain.id);

  const { Features } = Constants;
  const isWarningMessageEnabled = useFeatureFlag(Features.UNVERIFIED_WARNING);

  const user = useAppSelector((state) => state.user);
  const { currentListing: listing, nft } = useAppSelector((state) => state.nft);
  const [executingCancel, setExecutingCancel] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [cancelGaslessListing, responseCancelListing] = useCancelGaslessListing();

  const executeBuy = async () => {
    await runAuthedFunction(() => setIsPurchaseDialogOpen(true));
  };

  const executeCancel = () => async () => {
    try {
      setExecutingCancel(true);
      if(!isGaslessListing(listing.listingId)){
        await runFunction(async (writeContract) => {
          return (
            await writeContract.cancelListing(listing.listingId)
          ).wait();
        });
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
  };

  const runFunction = async (fn: (c: Contract) => Promise<TransactionReceipt>) => {
    if (user.address) {
      try {
        const receipt = await fn((user.contractService! as ContractService).market);
        dispatch(
          listingUpdated({
            listing: {
              ...listing,
              state: 1,
              purchaser: user.address,
            },
          })
        );
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      } catch (error: any) {
        if (error.data) {
          toast.error(error.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          console.log(error);
          toast.error('Unknown Error');
        }
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
  };

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
                    <Spinner animation="border" role="status" size="sm" className="ms-1">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
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
    <div className="price-action-bar">
      <Card className="mb-4 border-1 shadow pab-card">
        <Card.Body>
          <div id={`lid-${listing?.listingId}`}>
            <Flex direction="column" justify="space-between">
              <div className={`my-auto`}>
                <>
                  <Flex justify="space-between">
                    <Heading size="sm">{label ?? 'Listing Price'}:</Heading>
                    {listing?.expirationDate && (
                      <Text fontSize="sm" className="text-muted">Ends in {timeSince(listing.expirationDate)}</Text>
                    )}
                  </Flex>
                  <span>
                    {listing ? (
                      <Stack direction='row' align='baseline'>
                        <Image src="/img/logos/cdc_icon.svg" width={25} height={25} className="my-auto" alt='Cronos Logo' />

                        <Text fontSize={28} ms={1} fontWeight='bold'>
                          <span className="ms-1">{ethers.utils.commify(listing.price)}</span>
                        </Text>
                        {!!globalPrice.data && (
                          <Box as='span' ms={1} fontSize='sm' className="text-muted">({croToUsd(listing.price, globalPrice.data.usdPrice)})</Box>
                        )}
                      </Stack>
                    ) : (
                      <span>-</span>
                    )}
                  </span>
                </>
              </div>
            </Flex>
          </div>

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
        </Card.Body>
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
    </div>
  );
};
export default PriceActionBar;
