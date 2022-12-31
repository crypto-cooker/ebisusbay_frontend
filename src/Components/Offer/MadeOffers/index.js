import React, {useState} from 'react';
import {Spinner} from 'react-bootstrap';

import TableHeader from './MadeOffersHeader';
import TableRow from './MadeOffersRow';
import {getMyCollectionOffers, getMyOffers} from "@src/core/subgraph";
import {useInfiniteQuery} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import {Radio, RadioGroup, Stack, Text, Wrap, WrapItem} from "@chakra-ui/react";
import {offerState} from "@src/core/api/enums";

export default function MadeOffers({ address, type}) {
  const [offerType, setOfferType] = useState(offerState.ACTIVE.toString());

  const fetchProjects = async ({ pageParam = 0 }) => {
    if (type === 'collection') {
      return await getMyCollectionOffers(address, offerType, pageParam);
    } else {
      return await getMyOffers(address, offerType, pageParam);
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
    ['MadeOffers', type, offerType],
    fetchProjects,
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    }
  )

  const loadMore = () => {
    fetchNextPage();
  };

  return (
    <div>
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
            {data.pages.map((page, index) => (
              <div key={index}>
                {page.data.map((offer, index) => (
                  <TableRow key={index} data={offer} />
                ))}
              </div>
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
}
