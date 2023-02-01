import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Spinner} from 'react-bootstrap';
import {Box, Center, Heading, Text} from "@chakra-ui/react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getStakedRyoshi} from "@src/core/subgraph/staking";
import {appConfig} from "@src/Config";
import InfiniteScroll from "react-infinite-scroll-component";
import RyoshiStakingNftCard from "@src/Components/components/RyoshiStakingNftCard";
import {getNftsForAddress2} from "@src/core/api";
import {addToCart, clearCart, removeFromCart, setCartContext} from "@src/GlobalState/ryoshiStakingCartSlice";
import {sortAndFetchCollectionDetails} from "@src/core/api/endpoints/fullcollections";
import {FullCollectionsQuery} from "@src/core/api/queries/fullcollections";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {CollectionSortOption} from "@src/Components/Models/collection-sort-option.model";
import Link from "next/link";

const ryoshiCollectionAddress = appConfig('collections').find((c) => c.slug === 'ryoshi-tales-vip').address;
const displayTypes = {
  staked: 'staked',
  unstaked: 'unstaked'
};

const RyoshiStaking = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [displayType, setDisplayType] = useState(displayTypes.staked)
  const { data, status, refetch } = useQuery(['RyoshiStaking', user.address], () =>
    getStakedRyoshi(user.address), !!user.address
  )

  const handleDisplayTypeClick = (value) => {
    setDisplayType(value);
  }

  const connectWalletPressed = () => {
    if (user.needsOnboard) {
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    } else if (!user.address) {
      dispatch(connectAccount());
    } else if (!user.correctChain) {
      dispatch(chainConnect());
    }
  };

  useEffect(() => {
    dispatch(clearCart());
    const context = displayType === displayTypes.staked ? 'unstake' : 'stake';
    dispatch(setCartContext(context))
  }, [displayType])

  return (
    <Box>
      <Heading>Ryoshi Tales VIP Staking</Heading>
      <Text>Stake any of your Ryoshi Tales VIP NFTs below and enjoy rewards generated through platform sales. </Text>

      {user.address ? (
        <>
          <Box mt={4}>
            <ul className="activity-filter">
              <li id="sale" className={displayType === displayTypes.staked ? 'active' : ''} onClick={() => handleDisplayTypeClick(displayTypes.staked)}>
                Staked
              </li>
              <li id="sale" className={displayType === displayTypes.unstaked ? 'active' : ''} onClick={() => handleDisplayTypeClick(displayTypes.unstaked)}>
                Unstaked
              </li>
            </ul>
          </Box>
          {displayType === displayTypes.unstaked && (
            <UnstakedRyoshiNftList />
          )}
          {displayType === displayTypes.staked && (
            <StakedRyoshiList />
          )}
          <Box mt={4} align="center">
            Looking for more Ryoshi VIPs to stake? Swap a Legacy VIP on the&nbsp;
            <Link href="/drops/ryoshi-tales-vip">
              <span className="color cursor-pointer fw-bold">drop page</span>
            </Link>, or pick some up on the&nbsp;
            <Link href="/collection/ryoshi-tales-vip">
              <span className="color cursor-pointer fw-bold">secondary market</span>
            </Link>
          </Box>
        </>
      ) : (
        <div className="row mt-4">
          <div className="col-lg-12 text-center">
            <span>Connect wallet below to start staking</span>

            <button
              className="btn-main lead mx-auto"
              onClick={connectWalletPressed}
              style={{ width: 'auto' }}
            >
              Connect
            </button>
          </div>
        </div>
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
        return pages[pages.length - 1].hasNextPage ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    })


  const loadMore = () => {
    fetchNextPage();
  };

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
                {data.pages[0]?.length > 0 ? (
                  <>
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
                                onAddToCartButtonPressed={() => dispatch(addToCart(nft))}
                                onRemoveFromCartButtonPressed={() => dispatch(removeFromCart(nft))}
                              />
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <Center>
                    No unstaked Ryoshi VIPs found.
                  </Center>
                )}
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
    const ids = stakedRyoshis.data?.ryoshiStaked ?? [];
    if (ids.length === 0) return [];

    const query = FullCollectionsQuery.createApiQuery({address: ryoshiCollectionAddress, token: ids});
    const sort = CollectionSortOption.fromJson({
      key: 'rank',
      direction: 'asc',
      label: 'Rare to Common',
    });
    const data = await sortAndFetchCollectionDetails(pageParam, sort, query);
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
        return pages[pages.length - 1].nfts?.length > 0 ? pages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false
    })

  const loadMore = () => {
    fetchNextPage();
  };

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
                {data.pages[0]?.nfts?.length > 0 ? (
                  <>
                    {data.pages.map((items, index) => (
                      <React.Fragment key={index}>
                        {items.nfts?.map((nft, index) => {
                          return (
                            <div
                              className={`d-item col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4`}
                              key={`${nft.address}-${nft.id}-${index}`}
                            >
                              <RyoshiStakingNftCard
                                nft={nft}
                                canStake={true}
                                isStaked={true}
                                onAddToCartButtonPressed={() => dispatch(addToCart(nft))}
                                onRemoveFromCartButtonPressed={() => dispatch(removeFromCart(nft))}
                              />
                            </div>
                          )
                        })}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <Center>
                    No staked Ryoshi VIPs found.
                  </Center>
                )}
              </div>
            </>
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}
