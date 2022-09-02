import React from 'react';
import { Spinner } from 'react-bootstrap';

import EmptyData from '../EmptyData';
import TableHeader from '../MadeOffersHeader';
import TableRow from '../MadeOffersRow';
import {getMyOffers} from "@src/core/subgraph";
import {useInfiniteQuery} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

export default function MadeOffers({ address }) {
  const fetchProjects = async ({ pageParam = 0 }) =>
    await getMyOffers(address, '0', pageParam)

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(['projects'], fetchProjects, {
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  })
console.log('data', data);
  const loadMore = () => {
    fetchNextPage();
  };

  return (
    <div>
      <TableHeader type="Made" />
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
                  <TableRow key={index} data={offer} type="Made" />
                ))}
              </div>
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
}
