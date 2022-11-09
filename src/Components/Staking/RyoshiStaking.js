import React, { memo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {MyNftPageActions, setStakeCount, setVIPCount} from '../../GlobalState/User';
import { Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  caseInsensitiveCompare,
  createSuccessfulTransactionToastContent,
  round,
  siPrefixedNumber,
  useInterval
} from '../../utils';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryEmpty,
  faBatteryFull,
  faBatteryHalf,
  faBatteryQuarter,
  faBatteryThreeQuarters,
  faBolt,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { getTheme } from '../../Theme/theme';
import {hostedImage} from "../../helpers/image";
import {AnyMedia} from "../components/AnyMedia";
import {Box, Button, ButtonGroup, Heading, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getOwnerCollections} from "@src/core/api/next/collectioninfo";
import {getStakedRyoshi} from "@src/core/subgraph/staking";
import {getQuickWallet} from "@src/core/api/endpoints/wallets";
import {appConfig} from "@src/Config";
import InfiniteScroll from "react-infinite-scroll-component";
import NftCard from "@src/Components/components/NftCard";
import RyoshiStakingNftCard from "@src/Components/components/RyoshiStakingNftCard";
import {getNftsForAddress2} from "@src/core/api";
import MyNftCard from "@src/Components/components/MyNftCard";
import {addToBatchListingCart, removeFromBatchListingCart} from "@src/GlobalState/batchListingSlice";
import {addToBatch, removeFromBatch} from "@src/GlobalState/ryoshiStakingCartSlice";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {sortAndFetchCollectionDetails} from "@src/core/api/endpoints/fullcollections";
import {FullCollectionsQuery} from "@src/core/api/queries/fullcollections";

const txExtras = {
  gasPrice: ethers.utils.parseUnits('5000', 'gwei'),
};

const ryoshiCollectionAddress = appConfig('collections').find((c) => c.slug === 'ryoshi-tales-vip').address;
const knownContracts = appConfig('collections');
const displayTypes = {
  staked: 'staked',
  unstaked: 'unstaked'
};

const RyoshiStaking = () => {
  const user = useSelector((state) => state.user);
  const [displayType, setDisplayType] = useState(displayTypes.unstaked)
  const { data, status, refetch } = useQuery(['RyoshiStaking', user.address], () =>
    getStakedRyoshi(user.address), !!user.address
  )

  console.log('DATA', data);

  return (
    <Box>
      <Heading>Ryoshi Tales VIP Staking</Heading>
      <Text>Earn rewards generated through platform sales &#128640;</Text>
      <Box align="end">
        <ul className="activity-filter">
          <li id="sale" className={displayType === displayTypes.unstaked ? 'active' : ''} onClick={() => setDisplayType(displayTypes.unstaked)}>
            Unstaked
          </li>
          <li id="sale" className={displayType === displayTypes.staked ? 'active' : ''} onClick={() => setDisplayType(displayTypes.staked)}>
            Staked
          </li>
        </ul>
      </Box>
      {displayType === displayTypes.unstaked && (
        <UnstakedRyoshiNftList />
      )}
      {displayType === displayTypes.staked && (
        <StakedRyoshiList />
      )}
    </Box>
  );
};

export default memo(RyoshiStaking);

const UnstakedRyoshiNftList = ({onSelect}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const fetcher = async ({ pageParam = 1 }) => {
    return await getNftsForAddress2(user.address, user.provider, pageParam, [ryoshiCollectionAddress]);
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery(
    ['UserUnstakedRyoshiNfts', user.address],
    fetcher,
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    })


  const loadMore = () => {
    fetchNextPage();
  };

  // console.log('DATA2', data);

  return (
    <div className="d-flex">
      <div className="flex-fill">
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
              <div className="card-group row g-3">

                {data.pages.map((items, index) => (
                  <React.Fragment key={index}>
                    {items.map((nft, index) => {
                      return (
                        <div
                          className={`d-item col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4`}
                          key={`${nft.address}-${nft.id}-${index}`}
                        >
                          <RyoshiStakingNftCard
                            nft={nft}
                            canStake={true}
                            isStaked={false}
                            onAddToBatchButtonPressed={() => dispatch(addToBatch(nft))}
                            onRemoveBatchButtonPressed={() => dispatch(removeFromBatch(nft))}
                          />
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}

const StakedRyoshiList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const fetcher = async ({ pageParam = 1 }) => {
    const stakedRyoshis = await getStakedRyoshi(user.address);
    const ids = stakedRyoshis.data.ryoshiStaked;
    console.log('IDS', ids);
    if (ids.length === 0) return [];

    const query = FullCollectionsQuery.createApiQuery({address: ryoshiCollectionAddress, token: ids});
    const data = await sortAndFetchCollectionDetails(1, null, query);
    return data.response;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery(
    ['UserStakedRyoshiNfts', user.address],
    fetcher,
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].length > 0 ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    })


  const loadMore = () => {
    fetchNextPage();
  };

  console.log('DATA2', data);

  return (
    <div className="d-flex">
      <div className="flex-fill">
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
              <div className="card-group row g-3">

                {data.pages.map((items, index) => (
                  <React.Fragment key={index}>
                    {items.nfts.map((nft, index) => {
                      return (
                        <div
                          className={`d-item col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4`}
                          key={`${nft.address}-${nft.id}-${index}`}
                        >
                          <RyoshiStakingNftCard
                            nft={nft}
                            canStake={true}
                            isStaked={false}
                            onAddToBatchButtonPressed={() => dispatch(addToBatch(nft))}
                            onRemoveBatchButtonPressed={() => dispatch(removeFromBatch(nft))}
                          />
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}
