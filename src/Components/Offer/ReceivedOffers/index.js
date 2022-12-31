import React, {useState} from 'react';
import { Spinner } from 'react-bootstrap';

import TableHeader from '../ReceivedOffers/ReceivedOffersHeader';
import TableRow from '../ReceivedOffers/ReceivedOffersRow';
import InfiniteScroll from "react-infinite-scroll-component";
import {getAllCollectionOffers, getAllOffers} from "@src/core/subgraph";
import {useQuery} from "@tanstack/react-query";
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

export default function ReceivedOffers({ address, collectionAddresses, nfts, stats, type }) {
  const [showAll, setShowAll] = useState(false);
  const [offerType, setOfferType] = useState(offerState.ACTIVE.toString());

  const fetchProjects = async ({ pageParam = 0 }) => {
    const {data: allOffers} = await getAllOffers(collectionAddresses, offerType, pageParam);

    if (type === 'received-direct') {
      return allOffers.filter((offer) => {
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
        .sort((a, b) => parseInt(b.price) - parseInt(a.price));
    } else if (type === 'received-public') {
      return allOffers.filter((offer) => {
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
        .sort((a, b) => parseInt(b.price) - parseInt(a.price));
    } else if (type === 'received-collection') {
      const {data: allCollectionOffers} = await getAllCollectionOffers(collectionAddresses, offerType, pageParam);
      return allCollectionOffers.filter((offer) => {
        const nft = nfts.filter((nft) => {
          const matchesAddress = caseInsensitiveCompare(nft.nftAddress, offer.nftAddress);
          const isBlacklisted = isNftBlacklisted(offer.nftAddress, nft.nftId);
          return matchesAddress && !isBlacklisted;
        });
        if (!nft.length > 0) return false;

        const knownContract = findCollectionByAddress(offer.nftAddress, offer.nftId);
        if (!knownContract) return false;

        const floorPrice = findCollectionFloor(knownContract, stats);
        const offerPrice = parseInt(offer.price);
        const isAboveOfferThreshold = floorPrice && !showAll ? offerPrice >= floorPrice / 2 : true;
        const canShowCompletedOffers = !knownContract.multiToken || parseInt(offer.state) === offerState.ACTIVE;

        return isAboveOfferThreshold && canShowCompletedOffers;
      })
        .sort((a, b) => parseInt(b.price) - parseInt(a.price));
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
  } = useQuery(
    ['ReceivedOffers', type, offerType, showAll],
    fetchProjects,
    {enabled: collectionAddresses.length > 0 && nfts.length > 0, refetchOnWindowFocus: false}
  )

  const loadMore = () => {
    fetchNextPage();
  };

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
        <FormControl display='flex' alignItems='center' mb={2}>
          <FormLabel htmlFor='show-all-offers' mb='0'>
            Show low offers
          </FormLabel>
          <Switch id='show-all-offers' isChecked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
        </FormControl>
      </Stack>
      <TableHeader />
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
            {data.map((offer, index) => (
              <TableRow key={index} data={offer} type={type}/>
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
}
