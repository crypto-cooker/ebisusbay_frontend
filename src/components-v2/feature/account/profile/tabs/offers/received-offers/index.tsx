import React, {useCallback, useEffect, useMemo, useState} from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {Box, Center, Spinner, Text, useBreakpointValue} from "@chakra-ui/react";
import NextApiService from "@src/core/services/api-service/next";
import {OfferState, ReceivedOfferType} from "@src/core/services/api-service/types";
import {OffersV2QueryParams} from "@src/core/services/api-service/mapi/queries/offersV2";
import ReceivedOffersFilterContainer
  from "@src/components-v2/feature/account/profile/tabs/offers/received-offers/received-offers-filter-container";
import ResponsiveReceivedOffersTable from "@src/components-v2/shared/responsive-table/responsive-received-offers-table";
import {OFFER_TYPE} from "@src/Components/Offer/MadeOffers/MadeOffersRow";
import {ResponsiveAcceptOfferDialog} from "@src/components-v2/shared/dialogs/accept-offer";
import {useUser} from "@src/components-v2/useUser";
import {ResponsiveRejectOfferDialog} from "@src/components-v2/shared/dialogs/reject-offer";

interface MadeOffersProps {
  address: string;
  filtersVisible: boolean;
  setFiltersVisible: (visible: boolean) => void;
  search?: string;
}

export default function MadeOffers({ address, filtersVisible, setFiltersVisible, search }: MadeOffersProps) {
  const user = useUser();
  const [offerAction, setOfferAction] = useState(OFFER_TYPE.none);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const useMobileMenu = useBreakpointValue(
    { base: true, lg: false },
    { fallback: 'lg' },
  );
  const [queryParams, setQueryParams] = useState<OffersV2QueryParams>({
    wallet: address,
    page: 1,
    state: OfferState.ACTIVE,
    sortBy: 'price',
    direction: 'desc'
  });

  const {data: offers, error, fetchNextPage, hasNextPage, status} = useInfiniteQuery({
    queryKey: ['ReceivedOffers', address, queryParams],
    queryFn: ({pageParam = 1}) => NextApiService.getReceivedOffersByUser(address, {...queryParams, page: pageParam}),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  });

  const {data: offersOverview} = useQuery({
    queryKey: ['OffersOverview', address],
    queryFn: () => NextApiService.getOffersOverview(address),
    enabled: !!address,
    refetchOnWindowFocus: false,
    initialData: [],
    select: data => data.collections.map((item: any) => ({
      avatar: item.collection.metadata.avatar,
      name: item.collection.name,
      address: item.collection.address,
      count: item.offerCount
    }))
  });

  const handleSort = useCallback((sortOption: any) => {
    let newSort = {
      sortBy: sortOption,
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

  const historyContent = useMemo(() => {
    return status === 'pending' ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === "error" ? (
      <Box textAlign='center'>
        Error: {(error as any).message}
      </Box>
    ) : offers?.pages.map((page) => page.data).flat().length > 0 ? (
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
        canReject={queryParams.type === ReceivedOfferType.ERC721 && queryParams.offertype === 'nft'}
        onSort={handleSort}
        breakpointValue={filtersVisible ? 'xl' : 'lg'}
      />
    ) : (
      <Box textAlign='center' mt={8}>
        <Text>No results found</Text>
      </Box>
    );
  }, [offers, error, status, address, user.address, filtersVisible]);

  const handleCloseDialog = useCallback(() => {
    setOfferAction(OFFER_TYPE.none);
    setSelectedOffer(null);
  }, [setOfferAction, setSelectedOffer]);

  useEffect(() => {
    setQueryParams({...queryParams, search});
  }, [search]);

  return (
    <>
      <ReceivedOffersFilterContainer
        queryParams={queryParams}
        collections={offersOverview ?? []}
        onFilter={(newParams) => setQueryParams(newParams)}
        filtersVisible={filtersVisible}
        useMobileMenu={!!useMobileMenu}
        onMobileMenuClose={() => setFiltersVisible(false)}
      >
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
          {historyContent}
        </InfiniteScroll>
      </ReceivedOffersFilterContainer>

      {offerAction === OFFER_TYPE.accept && !!selectedOffer && (
        <ResponsiveAcceptOfferDialog
          isOpen={!!offerAction}
          onClose={handleCloseDialog}
          collection={selectedOffer.collectionData || selectedOffer.collection}
          isCollectionOffer={!selectedOffer.nftId}
          offer={selectedOffer}
        />
      )}
      {offerAction === OFFER_TYPE.reject && !!selectedOffer && (
        <ResponsiveRejectOfferDialog
          isOpen={!!offerAction}
          onClose={handleCloseDialog}
          collection={selectedOffer.collectionData || selectedOffer.collection}
          isCollectionOffer={!selectedOffer.nftId}
          offer={selectedOffer}
        />
      )}
    </>
  )
}

