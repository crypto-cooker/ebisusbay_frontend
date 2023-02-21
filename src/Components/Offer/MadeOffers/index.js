import React, {useCallback, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import {OFFER_TYPE} from './MadeOffersRow';
import {useInfiniteQuery} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import {Radio, RadioGroup, Stack, Text, Wrap, WrapItem} from "@chakra-ui/react";
import NextApiService from "@src/core/services/api-service/next";
import {OfferState} from "@src/core/services/api-service/types";
import ResponsiveOffersTable from "@src/components-v2/shared/responsive-table/responsive-offers-table";
import MakeOfferDialog from "@src/Components/Offer/Dialogs/MakeOfferDialog";
import MakeCollectionOfferDialog from "@src/Components/Offer/Dialogs/MakeCollectionOfferDialog";
import {CancelOfferDialog} from "@src/Components/Offer/Dialogs/CancelOfferDialog";

export default function MadeOffers({ address, type, filterVisible}) {
  const [offerType, setOfferType] = useState(OfferState.ACTIVE.toString());

  const [offerAction, setOfferAction] = useState(OFFER_TYPE.none);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [sort, setSort] = useState({
    sortBy: 'price',
    direction: 'desc'
  });

  const fetchProjects = async ({ pageParam = 0 }) => {
    return await NextApiService.getMadeOffersByUser(address, type, {
      state: offerType,
      page: pageParam + 1,
      sortBy: sort.sortBy,
      direction: sort.direction
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

  const handleSort = useCallback((field) => {
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
        <p>Error: {error.message}</p>
      ) : (
        <>
          <InfiniteScroll
            dataLength={data?.pages ? data.pages.flat().length : 0}
            next={loadMore}
            hasMore={hasNextPage}
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
        </>
      )}

      {!!offerAction && offerAction === OFFER_TYPE.update && !!selectedOffer?.nftId && (
        <MakeOfferDialog
          isOpen={!!offerAction}
          onClose={onCloseDialog}
          nftId={selectedOffer.nftId}
          nftAddress={selectedOffer.nftAddress}
        />
      )}
      {!!offerAction && offerAction === OFFER_TYPE.update && !selectedOffer?.nftId && (
        <MakeCollectionOfferDialog
          isOpen={!!offerAction}
          onClose={onCloseDialog}
          collection={selectedOffer.collection}
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
