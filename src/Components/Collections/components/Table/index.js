import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import Blockies from 'react-blockies';
import InfiniteScroll from 'react-infinite-scroll-component';
import { QueryClientProvider, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Spinner } from 'react-bootstrap';

import { siPrefixedNumber } from '@src/utils';
import { CdnImage } from '@src/Components/components/CdnImage';
import { hostedImage } from '@src/helpers/image';
import useGetCollections from '../../hooks/useGetCollections';
import { filter } from 'lodash';
import styled from "styled-components";
import LayeredIcon from "@src/Components/components/LayeredIcon";
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";

const mobileListBreakpoint = 1000;
const PAGE_SIZE = 50;
const tableMobileView = typeof window !== 'undefined' && window.innerWidth > mobileListBreakpoint;

const VerifiedIcon = styled.span`
  font-size: 8px;
  color: #ffffff;
  background: $color;
  border-radius: 100%;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  position: absolute;
  bottom: 2px;
  right: 2px;
  z-index:1000;
`;

const Table = ({ timeFrame, searchTerms, onlyVerified }) => {

  const queryClient = useQueryClient();
  const [filters, getCollections, changeFilters] = useGetCollections();
  const [typeSort, setTypeSort] = useState({ sortBy: 'totalvolume', direction: 'desc' });

  const collectionVolume = (collection) => {
    if (timeFrame === null) return Math.round(collection.totalVolume);
    if (timeFrame === '1d') return Math.round(collection.volume1d);
    if (timeFrame === '7d') return Math.round(collection.volume7d);
    if (timeFrame === '30d') return Math.round(collection.volume30d);
  };

  const collectionSales = (collection) => {
    if (timeFrame === null) return Math.round(collection.numberOfSales);
    if (timeFrame === '1d') return Math.round(collection.sales1d);
    if (timeFrame === '7d') return Math.round(collection.sales7d);
    if (timeFrame === '30d') return Math.round(collection.sales30d);
  };

  const collectionAveragePrices = (collection) => {
    if (timeFrame === null) return ethers.utils.commify(Math.round(collection.averageSalePrice));
    if (timeFrame === '1d')
      return collection.sales1d > 0 ? ethers.utils.commify(Math.round(collection.volume1d / collection.sales1d)) : 0;
    if (timeFrame === '7d')
      return collection.sales7d > 0 ? ethers.utils.commify(Math.round(collection.volume7d / collection.sales7d)) : 0;
    if (timeFrame === '30d')
      return collection.sales30d > 0 ? ethers.utils.commify(Math.round(collection.volume30d / collection.sales30d)) : 0;
  };

  const collectionFloorPriceValue = ({ floorPrice }) => ethers.utils.commify(Math.round(floorPrice));
  const collectionNumberActiveValue = ({ numberActive }) => numberActive;

  const fetcher = async ({ pageParam = 1 }) => {
    return await getCollections(pageParam);
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(['Collections', filters], fetcher, {
    getNextPageParam: (lastPage, pages) => {
      return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
    },
  })

  const loadMore = () => {
    fetchNextPage();
  };

  const sortCollections = (sortBy) => {

    let params = { ...typeSort, sortBy }

    if (filters.sortBy.includes(sortBy)) {
      if (filters.direction == 'desc') {
        params.direction = 'asc';
      } else {
        params.direction = 'desc';
      }
    }
    else {
      params.direction = 'desc';
    }
    setTypeSort({ ...params });

  }

  useEffect(() => {
    let param = { ...typeSort };
    if ((typeSort.sortBy == 'totalvolume' || typeSort.sortBy == 'totalsales') && timeFrame) {
      param.sortBy = `${param.sortBy}${timeFrame}`
    }

    changeFilters({
      ...filters,
      ...param
    })

  }, [timeFrame, typeSort])

  useEffect(() => {
    changeFilters({ ...filter, search: searchTerms })
  }, [searchTerms])

  useEffect(() => {
    changeFilters({ ...filter, verified: onlyVerified ? 1 : null })
  }, [onlyVerified])

  onlyVerified

  const historyContent = useMemo(() => {
    return status === "loading" ? (
      <div className='container position-absolute'>
        <div className="row mt-4">
          <div className="col-lg-12 text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </div>
      </div>
    ) : status === "error" ? (
      <div className='container position-absolute'>
        <div className="row mt-4">
          <div className="col-lg-12 text-center">
            <p>Error: {error.message}</p>
          </div>
        </div>
      </div>
    ) : (
      <>
        {data.pages.map((items, indexPages) => (
          <React.Fragment key={indexPages}>
            {items.map((collection, index) => {
              return (
                <tr key={index}>
                  {tableMobileView && <td>{(index + 1) + (indexPages * PAGE_SIZE)}</td>}
                 { console.log(index, indexPages, items.length, (index + 1) + (indexPages * items.length))}
                  <th scope="row" className="row gap-4 border-bottom-0" style={{ paddingLeft: 0 }}>
                    <div className="col-12" style={{ paddingLeft: '75px' }}>
                      <div className="coll_list_pp" style={{ cursor: 'pointer' }}>
                        <Link href={`/collection/${collection.slug}`}>
                          <a>
                            {collection.metadata?.avatar ? (
                              <CdnImage
                                src={hostedImage(collection.metadata.avatar, true)}
                                alt={collection?.name}
                                width="50"
                                height="50"
                              />
                            ) : (
                              <Blockies seed={collection.collection.toLowerCase()} size={10} scale={5} />
                            )}
                            {collection.verification?.verified && (
                              <VerifiedIcon>
                                <LayeredIcon icon={faCheck} bgIcon={faCircle} shrink={7} />
                              </VerifiedIcon>
                            )}
                          </a>
                        </Link>
                      </div>
                      <span>
                        <Link href={`/collection/${collection.slug}`}>
                          <a>{collection?.name ?? 'Unknown'}</a>
                        </Link>
                      </span>
                    </div>

                    {!tableMobileView && (
                      <div className="col-12 row gap-1">
                        <div className="col-12 mobile-view-list-item">
                          <span>#</span>
                          <span className="text-end">{index + 1}</span>
                        </div>
                        <div className="col-12 mobile-view-list-item" onClick={() => sortCollections('totalvolume')}>
                          <span>
                            Volume {timeFrame !== null && <span className="badge bg-secondary">{timeFrame}</span>}
                          </span>
                          <span className="text-end">{siPrefixedNumber(collectionVolume(collection))} CRO</span>
                        </div>
                        <div className="col-12 mobile-view-list-item" onClick={() => sortCollections('totalsales')}>
                          <span>
                            Sales {timeFrame !== null && <span className="badge bg-secondary">{timeFrame}</span>}
                          </span>
                          <span className="text-end">{siPrefixedNumber(collectionSales(collection))}</span>
                        </div>
                        <div
                          className="col-12 mobile-view-list-item"
                          onClick={() => sortCollections('totalfloorPrice')}
                        >
                          <span>Floor Price</span>
                          <span className="text-end">
                            {collection.numberActive > 0 ? `${collectionFloorPriceValue(collection)} CRO` : 'N/A'}
                          </span>
                        </div>
                        <div className="col-12 mobile-view-list-item" onClick={() => sortCollections('totalaveragesaleprice')}>
                          <span>
                            Avg Price{' '}
                            {timeFrame !== null && <span className="badge bg-secondary">{timeFrame}</span>}
                          </span>
                          <span className="text-end">{collectionAveragePrices(collection)} CRO</span>
                        </div>
                        <div
                          className="col-12 mobile-view-list-item"
                          onClick={() => sortCollections('totalactive')}
                        >
                          <span>Active</span>
                          <span className="text-end">
                            {siPrefixedNumber(collectionNumberActiveValue(collection))}
                          </span>
                        </div>
                      </div>
                    )}
                  </th>
                  {tableMobileView && <td>{siPrefixedNumber(collectionVolume(collection))} CRO</td>}
                  {tableMobileView && <td>{siPrefixedNumber(collectionSales(collection))}</td>}
                  {tableMobileView && (
                    <td>{collection.numberActive > 0 ? `${collectionFloorPriceValue(collection)} CRO` : '-'}</td>
                  )}
                  {tableMobileView && <td>{collectionAveragePrices(collection)} CRO</td>}
                  {tableMobileView && <td>{siPrefixedNumber(collectionNumberActiveValue(collection))}</td>}
                </tr>
              );
            })}
          </React.Fragment>
        ))}
      </>
    );
  }, [data, error, status]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="row">
        <div className="col-lg-12">
          <InfiniteScroll
            dataLength={data?.pages ? data.pages.flat().length : 0}
            next={loadMore}
            hasMore={hasNextPage}
            style={{ overflow: 'none' }}
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
            <table className="table de-table table-rank" data-mobile-responsive="true">
              <thead>
                <tr>
                  {tableMobileView && <th scope="col">#</th>}
                  <th scope="col" style={{ cursor: 'pointer' }} onClick={() => sortCollections('name')}>
                    Collection
                  </th>
                  {tableMobileView && (
                    <th scope="col" style={{ cursor: 'pointer' }} onClick={() => sortCollections('totalvolume')}>
                      Volume {timeFrame !== null && <span className="badge bg-secondary">{timeFrame}</span>}
                    </th>
                  )}
                  {tableMobileView && (
                    <th scope="col" style={{ cursor: 'pointer' }} onClick={() => sortCollections('totalsales')}>
                      Sales {timeFrame !== null && <span className="badge bg-secondary">{timeFrame}</span>}
                    </th>
                  )}
                  {tableMobileView && (
                    <th scope="col" style={{ cursor: 'pointer' }} onClick={() => sortCollections('totalfloorprice')}>
                      Floor Price
                    </th>
                  )}
                  {tableMobileView && (
                    <th scope="col" style={{ cursor: 'pointer' }} onClick={() => sortCollections('totalaveragesaleprice')}>
                      Avg Price {timeFrame !== null && <span className="badge bg-secondary">{timeFrame}</span>}
                    </th>
                  )}
                  {tableMobileView && (
                    <th scope="col" style={{ cursor: 'pointer' }} onClick={() => sortCollections('totalactive')}>
                      Active
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {historyContent}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default Table; 