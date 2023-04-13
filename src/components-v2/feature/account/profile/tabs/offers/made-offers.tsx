import React, {useCallback, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {OFFER_TYPE} from '@src/Components/Offer/MadeOffers/MadeOffersRow';
import {useInfiniteQuery} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import {Box, Radio, RadioGroup, Stack, Text, Wrap, WrapItem} from "@chakra-ui/react";
import NextApiService from "@src/core/services/api-service/next";
import {OfferState, OfferType} from "@src/core/services/api-service/types";
import ResponsiveOffersTable from "@src/components-v2/shared/responsive-table/responsive-offers-table";
import MakeOfferDialog from "@src/Components/Offer/Dialogs/MakeOfferDialog";
import MakeCollectionOfferDialog from "@src/Components/Offer/Dialogs/MakeCollectionOfferDialog";
import {CancelOfferDialog} from "@src/Components/Offer/Dialogs/CancelOfferDialog";
import {Offer} from "@src/core/models/offer";

interface MadeOffersProps {
  address: string;
  type: OfferType;
  filterVisible: boolean;
}

export default function MadeOffers({ address, type, filterVisible}: MadeOffersProps) {
  const [offerType, setOfferType] = useState(OfferState.ACTIVE.toString());

  const [offerAction, setOfferAction] = useState(OFFER_TYPE.none);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [sort, setSort] = useState({
    sortBy: 'price',
    direction: 'desc'
  });

  const fetchProjects = async ({ pageParam = 0 }) => {
    // @ts-ignore
    return await NextApiService.getMadeOffersByUser(address, type, {
      state: Number(offerType),
      page: pageParam + 1,
      sortBy: sort.sortBy as 'listingId' | 'listingTime' | 'saleTime' | 'price' | 'rank',
      direction: sort.direction as 'asc' | 'desc'
    });
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ['MadeOffers', address, type, offerType, sort],
    fetchProjects,
    {
      getNextPageParam: (lastPage, pages) => lastPage.hasNextPage,
    }
  )

  const loadMore = () => {
    fetchNextPage();
  };

  const onCloseDialog = useCallback(() => {
    setOfferAction(OFFER_TYPE.none);
    setSelectedOffer(null);
  }, [setOfferAction, setSelectedOffer]);

  const handleSort = useCallback((field: string) => {
    let newSort = {
      sortBy: field,
      direction: 'desc'
    }
    if (sort.sortBy === newSort.sortBy) {
      newSort.direction = sort.direction === 'asc' ? 'desc' : 'asc'
    }
    setSort(newSort)
  }, [sort]);

  return (
    <div>
      <Wrap spacing={2}>
        <WrapItem>
          <Text fontWeight='bold'>Filter: </Text>
        </WrapItem>
        <WrapItem>
          <RadioGroup onChange={setOfferType} value={offerType}>
            <Stack direction='row'>
              <Radio value={OfferState.ACTIVE.toString()}>Active</Radio>
              <Radio value={OfferState.ACCEPTED.toString()}>Accepted</Radio>
              <Radio value={OfferState.REJECTED.toString()}>Rejected</Radio>
            </Stack>
          </RadioGroup>
        </WrapItem>
      </Wrap>
      {status === "loading" ? (
        <div className="col-lg-12 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : status === "error" ? (
        <p>Error: {(error as any).message}</p>
      ) : (
        <Box mt={filterVisible ? {base: 4, xl: 0} : {base: 4, lg: 0}}>
          <InfiniteScroll
            dataLength={data?.pages ? data.pages.flat().length : 0}
            next={loadMore}
            hasMore={hasNextPage ?? false}
            style={{ overflow: 'hidden' }}
            loader={
              <div className="row">
                <div className="col-lg-12 text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </div>
            }
          >
            <ResponsiveOffersTable
              data={data}
              onUpdate={(offer) => {
                setSelectedOffer(offer);
                setOfferAction(OFFER_TYPE.update);
              }}
              onCancel={(offer) => {
                setSelectedOffer(offer);
                setOfferAction(OFFER_TYPE.cancel);
              }}
              onSort={handleSort}
              breakpointValue={filterVisible ? 'xl' : 'lg'}
            />
          </InfiniteScroll>
        </Box>
      )}

      {!!offerAction && offerAction === OFFER_TYPE.update && !!selectedOffer?.nftId && (
        <MakeOfferDialog
          isOpen={!!offerAction}
          onClose={onCloseDialog}
          nftId={selectedOffer.nftId}
          nftAddress={selectedOffer.nftAddress}
          initialNft={null}
        />
      )}
      {!!offerAction && offerAction === OFFER_TYPE.update && !selectedOffer?.nftId && (
        <MakeCollectionOfferDialog
          isOpen={!!offerAction}
          onClose={onCloseDialog}
          collection={selectedOffer?.collection}
        />
      )}
      {!!offerAction && offerAction === OFFER_TYPE.cancel && selectedOffer && (
        <CancelOfferDialog
          isOpen={!!offerAction}
          onClose={onCloseDialog}
          collection={selectedOffer.collection}
          isCollectionOffer={!selectedOffer?.nftId}
          offer={selectedOffer}
        />
      )}
    </div>
  );
}
