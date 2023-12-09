import React, {useCallback, useEffect, useMemo, useState} from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import {useInfiniteQuery} from "@tanstack/react-query";
import {Box, Center, Spinner, Text, useBreakpointValue} from "@chakra-ui/react";
import NextApiService from "@src/core/services/api-service/next";
import ResponsiveOffersTable from "@src/components-v2/shared/responsive-table/responsive-offers-table";
import {OffersQueryParams} from "@src/core/services/api-service/mapi/queries/offers";
import MadeOffersFilterContainer
  from "@src/components-v2/feature/account/profile/tabs/offers/made-offers/made-offers-filter-container";
import {OfferType} from "@src/core/services/api-service/types";
import {OFFER_TYPE} from "@src/Components/Offer/MadeOffers/MadeOffersRow";
import MakeOfferDialog from "@src/components-v2/shared/dialogs/make-offer";
import MakeCollectionOfferDialog from "@src/components-v2/shared/dialogs/make-collection-offer";
import {CancelOfferDialog} from "@src/Components/Offer/Dialogs/CancelOfferDialog";
import {useUser} from "@src/components-v2/useUser";

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
  const [queryParams, setQueryParams] = useState<OffersQueryParams>({
    sortBy: 'listingTime',
    direction: 'desc'
  });

  const fetcher = async ({ pageParam = 1 }) => {
    return await NextApiService.getMadeOffersByUser(address, queryParams.type ?? OfferType.DIRECT, {
      ...queryParams,
      page: pageParam,
    });
  };

  const {data, error, fetchNextPage, hasNextPage, status, refetch} = useInfiniteQuery({
    queryKey: ['MadeOffers', address, queryParams],
    queryFn: fetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false
  });

  const loadMore = () => {
    fetchNextPage();
  };

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
    ) : data?.pages.map((page) => page.data).flat().length > 0 ? (
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
        breakpointValue={filtersVisible ? 'xl' : 'lg'}
      />
    ) : (
      <Box textAlign='center' mt={8}>
        <Text>No results found</Text>
      </Box>
    );
  }, [data, error, status, address, user.address, filtersVisible]);




  const handleCloseDialog = useCallback(() => {
    setOfferAction(OFFER_TYPE.none);
    setSelectedOffer(null);
  }, [setOfferAction, setSelectedOffer]);

  useEffect(() => {
    setQueryParams({...queryParams, search});
  }, [search]);

  return (
    <>
      <MadeOffersFilterContainer
        queryParams={queryParams}
        onFilter={(newParams) => setQueryParams(newParams)}
        filtersVisible={filtersVisible}
        useMobileMenu={!!useMobileMenu}
        onMobileMenuClose={() => setFiltersVisible(false)}
      >
        <InfiniteScroll
          dataLength={data?.pages ? data.pages.flat().length : 0}
          next={loadMore}
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
      </MadeOffersFilterContainer>

      {!!offerAction && offerAction === OFFER_TYPE.update && !!selectedOffer?.nftId && (
        <MakeOfferDialog
          isOpen={!!offerAction}
          onClose={handleCloseDialog}
          nftId={selectedOffer.nftId}
          nftAddress={selectedOffer.nftAddress}
          initialNft={null}
        />
      )}
      {!!offerAction && offerAction === OFFER_TYPE.update && !selectedOffer?.nftId && (
        <MakeCollectionOfferDialog
          isOpen={!!offerAction}
          onClose={handleCloseDialog}
          collection={selectedOffer?.collection}
        />
      )}
      {!!offerAction && offerAction === OFFER_TYPE.cancel && selectedOffer && (
        <CancelOfferDialog
          isOpen={!!offerAction}
          onClose={handleCloseDialog}
          collection={selectedOffer.collection}
          isCollectionOffer={!selectedOffer?.nftId}
          offer={selectedOffer}
        />
      )}
    </>
  )
}

