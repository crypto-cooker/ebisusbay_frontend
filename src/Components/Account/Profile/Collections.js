import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { Form, Spinner } from 'react-bootstrap';

import useGetCollection from '@src/hooks/useGetCollectionOwners.js';
import useFeatureFlag from '@src/hooks/useFeatureFlag';
import { CdnImage } from "@src/Components/components/CdnImage";
import { hostedImage } from "@src/helpers/image";

import Constants from '@src/constants';
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

  const [collections, setCollections] = useState([])

  const [response, getCollections] = useGetCollection();

  const getCollection = async () => {
    await getCollections(address)
  }

  useEffect(() => {
    getCollection()
  }, [])

  useEffect(() => {
    if (response && response.response?.collections) setCollections(response.response.collections)
  }, [response])

  return (
    isCollectionEnabled ? (!response.isLoading ? (response?.response?.collections?.length > 0 ? (
      <div>
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

                {collections &&
                  collections.map((collection, index) => {
                    return (
                      <tr key={index}>
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
                                    null
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
                              <div className="col-12 mobile-view-list-item" >
                                <span>
                                  Status
                                </span>
                                <span className="text-end">{collection.metadata.verified ? 'Verified' : 'Unverified'}</span>
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
                                  {/* <button className='btn-main' style={{ maxWidth: 172 }}>
                                    Action 1
                                  </button> */}
                                </span>
                              </div>
                            </div>
                          )}
                        </th>
                        {tableMobileView && <td>{collection.metadata.verified ? 'Verified' : 'Unverified'}</td>}
                        {tableMobileView && <td>{collection.metadata.lastUpdated}</td>}
                        {tableMobileView && (
                          <td>
                            <div style={{ display: 'flex', }}>
                              {/* <button className='btn-main' style={{ maxWidth: 172 }}>
                                Action 1
                              </button> */}
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
      </div>)
      :
      <div className="row mt-4">
        <div className="col-lg-12 text-center">
          <span>Nothing to see here...</span>
        </div>
      </div>
    )
      :
      (<div className="row mt-4">
        <div className="col-lg-12 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>))
      
      :
      (<>Coming Soon...</>)
  )
}