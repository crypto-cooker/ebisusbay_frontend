import React, {useCallback, useState} from 'react';
import { Spinner } from 'react-bootstrap';

import InfiniteScroll from "react-infinite-scroll-component";
import {getAllCollectionOffers, getAllOffers} from "@src/core/subgraph";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {caseInsensitiveCompare, findCollectionByAddress, findCollectionFloor, isNftBlacklisted} from "@src/utils";
import {offerState} from "@src/core/api/enums";
import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Text,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import {OFFER_TYPE} from "@src/Components/Offer/MadeOffers/MadeOffersRow";
import ResponsiveReceivedOffersTable from "@src/components-v2/shared/responsive-table/responsive-received-offers-table";
import AcceptOfferDialog from "@src/Components/Offer/Dialogs/AcceptOfferDialog";
import {RejectOfferDialog} from "@src/Components/Offer/Dialogs/RejectOfferDialog";
import {Offer} from "@src/core/models/offer";

interface ReceivedOffersProps {
  address: string;
  collectionAddresses: string[];
  nfts: any[];
  stats: any;
  type: string;
  filterVisible: boolean;
}

export default function ReceivedOffers({ address, collectionAddresses, nfts, stats, type, filterVisible }: ReceivedOffersProps) {
  const [showAll, setShowAll] = useState(false);
  const [offerType, setOfferType] = useState(offerState.ACTIVE.toString());
  const [offerAction, setOfferAction] = useState(OFFER_TYPE.none);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);

  const fetchProjects = async ({ pageParam = 0 }) => {
    const {data: allOffers} = await getAllOffers(collectionAddresses, offerType, pageParam);

    if (type === 'received-direct') {
      return allOffers.filter((offer: any) => {
        const nft = nfts.find(
          (c) => caseInsensitiveCompare(c.nftAddress, offer.nftAddress) && parseInt(c.nftId) === parseInt(offer.nftId)
        );

        if (!nft) return false;

        const knownContract = findCollectionByAddress(offer.nftAddress, offer.nftId);
        if (!knownContract) return false;

        const floorPrice = findCollectionFloor(knownContract, stats);
        const offerPrice = parseInt(offer.price);
        const isAboveOfferThreshold = floorPrice && !showAll ? offerPrice >= floorPrice / 2 : true;
        const canShowCompletedOffers = !knownContract.multiToken || parseInt(offer.state) === offerState.ACTIVE;
        const isBlacklisted = isNftBlacklisted(offer.nftAddress, offer.nftId);

        return isAboveOfferThreshold && canShowCompletedOffers && !nft.is1155 && !isBlacklisted;
      })
        .sort((a: any, b: any) => parseInt(b.price) - parseInt(a.price));
    } else if (type === 'received-public') {
      return allOffers.filter((offer: any) => {
          const nft = nfts.find(
            (c) => caseInsensitiveCompare(c.nftAddress, offer.nftAddress) && parseInt(c.nftId) === parseInt(offer.nftId)
          );
          if (!nft || (nft.balance !== undefined && parseInt(nft.balance) < 1))
            return false;

          const knownContract = findCollectionByAddress(offer.nftAddress, offer.nftId);
          if (!knownContract) return false;

          const floorPrice = findCollectionFloor(knownContract, stats);
          const offerPrice = parseInt(offer.price);
          const isAboveOfferThreshold = floorPrice && !showAll ? offerPrice >= floorPrice / 2 : true;
          const canShowCompletedOffers = !knownContract.multiToken || parseInt(offer.state) === offerState.ACTIVE;
          const isBlacklisted = isNftBlacklisted(offer.nftAddress, offer.nftId);

          return isAboveOfferThreshold && canShowCompletedOffers && nft.is1155 && !isBlacklisted;
        })
        .sort((a: any, b: any) => parseInt(b.price) - parseInt(a.price));
    } else if (type === 'received-collection') {
      const {data: allCollectionOffers} = await getAllCollectionOffers(collectionAddresses, offerType, pageParam);
      return allCollectionOffers.filter((offer: any) => {
        const nft = nfts.filter((nft) => {
          const matchesAddress = caseInsensitiveCompare(nft.nftAddress, offer.nftAddress);
          const isBlacklisted = isNftBlacklisted(offer.nftAddress, nft.nftId);
          return matchesAddress && !isBlacklisted;
        });
        if (!(nft.length > 0)) return false;

        const knownContract = findCollectionByAddress(offer.nftAddress, offer.nftId);
        if (!knownContract) return false;

        const floorPrice = findCollectionFloor(knownContract, stats);
        const offerPrice = parseInt(offer.price);
        const isAboveOfferThreshold = floorPrice && !showAll ? offerPrice >= floorPrice / 2 : true;
        const canShowCompletedOffers = !knownContract.multiToken || parseInt(offer.state) === offerState.ACTIVE;

        return isAboveOfferThreshold && canShowCompletedOffers;
      })
        .sort((a: any, b: any) => parseInt(b.price) - parseInt(a.price));
    }
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
    ['ReceivedOffers', address, type, offerType, showAll],
    fetchProjects,
    {
      getNextPageParam: (lastPage, pages) => false,
      enabled: collectionAddresses.length > 0 && nfts.length > 0, refetchOnWindowFocus: false
    }
  )

  const loadMore = () => {
    fetchNextPage();
  };

  const onCloseDialog = useCallback(() => {
    setOfferAction(OFFER_TYPE.none);
    setSelectedOffer(null);
  }, [setOfferAction, setSelectedOffer]);

  return (
    <div>
      <Stack>
        <Wrap spacing={2}>
          <WrapItem>
            <Text fontWeight='bold'>Filter: </Text>
          </WrapItem>
          <WrapItem>
            <RadioGroup onChange={setOfferType} value={offerType}>
              <Stack direction='row'>
                <Radio value={offerState.ACTIVE.toString()}>Active</Radio>
                <Radio value={offerState.ACCEPTED.toString()}>Accepted</Radio>
                <Radio value={offerState.REJECTED.toString()}>Rejected</Radio>
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

            <ResponsiveReceivedOffersTable
              data={data}
              onAccept={(offer) => {
                console.log('accepting offer', offer)
                setSelectedOffer(offer);
                setOfferAction(OFFER_TYPE.accept);
              }}
              onReject={(offer) => {
                setSelectedOffer(offer);
                setOfferAction(OFFER_TYPE.reject);
              }}
              canReject={type === 'received-direct'}
              onSort={() => console.log('TBD')}
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
