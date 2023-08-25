import React, {useCallback, useState} from 'react';
import {Spinner} from 'react-bootstrap';

import InfiniteScroll from "react-infinite-scroll-component";
import {useInfiniteQuery} from "@tanstack/react-query";
import {Center, FormControl, FormLabel, Radio, RadioGroup, Stack, Switch, Text, Wrap, WrapItem} from "@chakra-ui/react";
import {OFFER_TYPE} from "@src/Components/Offer/MadeOffers/MadeOffersRow";
import ResponsiveReceivedOffersTable from "@src/components-v2/shared/responsive-table/responsive-received-offers-table";
import AcceptOfferDialog from "@src/Components/Offer/Dialogs/AcceptOfferDialog";
import {RejectOfferDialog} from "@src/Components/Offer/Dialogs/RejectOfferDialog";
import {OffersV2QueryParams} from "@src/core/services/api-service/mapi/queries/offersV2";
import {OfferState, ReceivedOfferType} from "@src/core/services/api-service/types";
import NextApiService from "@src/core/services/api-service/next";


interface ReceivedOffersProps {
  address: string;
  type: string;
  filterVisible: boolean;
}

export default function ReceivedOffers({ address, type, filterVisible }: ReceivedOffersProps) {
  const [queryParams, setQueryParams] = useState<OffersV2QueryParams>({
    wallet: address,
    type: type === 'received-direct' ? ReceivedOfferType.ERC721 : ReceivedOfferType.ERC721,
    page: 1,
    state: OfferState.ACTIVE,
    sortBy: 'price',
    direction: 'desc'
  });

  const [showAll, setShowAll] = useState(false);
  const [offerAction, setOfferAction] = useState(OFFER_TYPE.none);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);

  const fetchProjects = async ({ pageParam = 1 }) => {
    return await NextApiService.getReceivedOffersByUser(address, {...queryParams, page: pageParam});
  }

  const {data: offers, error, fetchNextPage, hasNextPage, status} = useInfiniteQuery(
    ['ReceivedOffers', address, queryParams],
    fetchProjects,
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    }
  )

  const onCloseDialog = useCallback(() => {
    setOfferAction(OFFER_TYPE.none);
    setSelectedOffer(null);
  }, [setOfferAction, setSelectedOffer]);

  const handleOfferTypeChange = useCallback((value: string) => {
    setQueryParams({
      ...queryParams,
      state: Number(value) as OfferState
    });

  }, [queryParams]);

  const handleSort = useCallback((field: string) => {
    let newSort = {
      sortBy: field,
      direction: 'desc'
    }
    if (queryParams.sortBy === newSort.sortBy) {
      newSort.direction = queryParams.direction === 'asc' ? 'desc' : 'asc'
    }
    setQueryParams({
      ...queryParams,
      sortBy: newSort.sortBy as any,
      direction: newSort.direction as any
    });
  }, [queryParams]);

  return (
    <div>
      <Stack>
        <Wrap spacing={2}>
          <WrapItem>
            <Text fontWeight='bold'>Filter: </Text>
          </WrapItem>
          <WrapItem>
            <RadioGroup onChange={handleOfferTypeChange} value={queryParams.state!.toString()}>
              <Stack direction='row'>
                <Radio value={OfferState.ACTIVE.toString()}>Active</Radio>
                <Radio value={OfferState.ACCEPTED.toString()}>Accepted</Radio>
                <Radio value={OfferState.REJECTED.toString()}>Rejected</Radio>
              </Stack>
            </RadioGroup>
          </WrapItem>
        </Wrap>
        <FormControl display='flex' alignItems='center' pb={2}>
          <FormLabel htmlFor='show-all-offers' mb='0'>
            Show low offers
          </FormLabel>
          <Switch id='show-all-offers' isChecked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
        </FormControl>
      </Stack>
      {status === "loading" ? (
        <div className="col-lg-12 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : status === "error" ? (
        <p>Error: {(error as any).message}</p>
      ) : (
        <>
          <InfiniteScroll
            dataLength={offers?.pages ? offers.pages.flat().length : 0}
            next={fetchNextPage}
            hasMore={hasNextPage ?? false}
            style={{ overflow: 'hidden' }}
            loader={
              <Center>
                <Spinner />
              </Center>
            }
          >
            <ResponsiveReceivedOffersTable
              data={offers}
              onAccept={(offer) => {
                setSelectedOffer(offer);
                setOfferAction(OFFER_TYPE.accept);
              }}
              onReject={(offer) => {
                setSelectedOffer(offer);
                setOfferAction(OFFER_TYPE.reject);
              }}
              canReject={type === 'received-direct'}
              onSort={handleSort}
              breakpointValue={filterVisible ? 'xl' : 'lg'}
            />

          </InfiniteScroll>
        </>
      )}

      {!!offerAction && offerAction === OFFER_TYPE.accept && !!selectedOffer && (
        <AcceptOfferDialog
          isOpen={!!offerAction}
          onClose={onCloseDialog}
          collection={selectedOffer.collectionData}
          isCollectionOffer={!selectedOffer.nftId}
          offer={selectedOffer}
        />
      )}
      {!!offerAction && offerAction === OFFER_TYPE.reject && !!selectedOffer && (
        <RejectOfferDialog
          isOpen={!!offerAction}
          onClose={onCloseDialog}
          collection={selectedOffer.collectionData}
          isCollectionOffer={!selectedOffer.nftId}
          offer={selectedOffer}
        />
      )}
    </div>
  );
}
