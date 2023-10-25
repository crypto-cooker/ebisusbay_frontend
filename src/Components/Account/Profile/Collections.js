import Link from 'next/link';
import React from 'react';
import {createGlobalStyle} from 'styled-components';
import {useRouter} from "next/router";

import useFeatureFlag from '@src/hooks/useFeatureFlag';
import {CdnImage} from "@src/components-v2/shared/media/cdn-image";

import Constants from '@src/constants';
import {useQuery} from "@tanstack/react-query";
import {getOwnerCollections} from "@src/core/cms/next/collections";
import {Center, Text, Spinner, VStack} from "@chakra-ui/react";
import {shortAddress} from "@src/utils";
import ImageService from "@src/core/services/image";

const { Features } = Constants;

const mobileListBreakpoint = 1000;

const GlobalStyles = createGlobalStyle`
  .mobile-view-list-item {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    
    & > span:nth-child(2) {
      font-weight: 300;
    }
  }
  .jumbotron.tint{
    background-color: rgba(0,0,0,0.6);
    background-blend-mode: multiply;
  }
`;

export default function Collections({ address }) {
  const tableMobileView = typeof window !== 'undefined' && window.innerWidth > mobileListBreakpoint;
  const isCollectionEnabled = useFeatureFlag(Features.CMS_COLLECTIONS)

  const router = useRouter();

  const { error, data, status } = useQuery({
    queryKey: ['Collections', address],
    queryFn: () => getOwnerCollections(address), isCollectionEnabled
  });

  if (!isCollectionEnabled) {
    return <>Coming Soon...</>
  }

  return status === 'pending' ? (
    <Center>
      <Spinner />
    </Center>
    ) : status === "error" ? (
      <p className="text-center">Error: {error.message}</p>
    ) : data.data.data.length < 1 ? (
      <p className="text-center">Nothing to see here...</p>
    ) : (
      <div className="row">
        <div className="col-lg-12">
          <table className="table de-table table-rank textColor1" data-mobile-responsive="true">
            <thead>
              <tr>
                <th scope="col">
                  Collection
                </th>
                {tableMobileView && (
                  <th scope="col">
                    Status
                  </th>
                )}
                {tableMobileView && (
                  <th scope="col">
                    Last Updated
                  </th>
                )}
                {tableMobileView && (
                  <th scope="col" style={{ textAlign: 'center', width: 100 }}>
                    Actions
                  </th>
                )}
              </tr>
              <tr />
            </thead>
            <tbody>
              <GlobalStyles />
              {data.data.data &&
                data.data.data.map((collection, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row" className="row gap-4 border-bottom-0" style={{ paddingLeft: 0 }}>
                        <div className="col-12" style={{ paddingLeft: '75px' }}>
                          <div className="coll_list_pp" style={{ cursor: 'pointer' }}>
                            <Link href={`/collection/${collection.slug}`}>
                              {collection.metadata?.avatar ? (
                                <CdnImage
                                  src={ImageService.translate(collection.metadata.avatar).avatar()}
                                  alt={collection?.name}
                                  width="50"
                                  height="50"
                                />
                              ) : (
                                null
                              )}
                            </Link>
                          </div>
                          <VStack align="start">
                            <Link href={`/collection/${collection.slug}`}>
                              {collection?.name ?? 'Unknown'}
                            </Link>
                            <Text>{shortAddress(collection.address)}</Text>
                          </VStack>
                        </div>

                        {!tableMobileView && (
                          <div className="col-12 row gap-1">
                            <div className="col-12 mobile-view-list-item" >
                              <span>
                                Status
                              </span>
                              <span className="text-end">{collection.verification.verified ? 'Verified' : 'Unverified'}</span>
                            </div>
                            <div className="col-12 mobile-view-list-item">
                              <span>
                                Last Updated
                              </span>
                              <span className="text-end">{collection.metadata.lastUpdate}</span>
                            </div>
                            <div
                              className="col-12 mobile-view-list-item"
                            >
                              <span>Actions</span>
                              <span className="text-end">
                                <button className='btn-main' onClick={()=>(router.push(`/edit-collection/${collection.address}`))}>
                                  Edit Collection
                                </button>
                              </span>
                            </div>
                          </div>
                        )}
                      </th>
                      {tableMobileView && <td>{collection.verification.verified ? 'Verified' : 'Unverified'}</td>}
                      {tableMobileView && <td>{collection.metadata.lastUpdated}</td>}
                      {tableMobileView && (
                        <td>
                          <div style={{ display: 'flex', }}>
                            <button className='btn-main' onClick={()=>(router.push(`/edit-collection/${collection.address}`))}>
                              Edit Collection
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
}